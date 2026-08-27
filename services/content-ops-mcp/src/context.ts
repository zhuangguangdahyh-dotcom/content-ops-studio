import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCli } from "../../../packages/cli/src/index.js";
import {
  loadSchemaRegistry,
  type SchemaRegistry,
} from "../../../packages/contracts/src/validation/index.js";
import { HostNativeResearchAdapter } from "../../../packages/research-adapters/src/index.js";
import { ResearchRuntime } from "../../../packages/runtime/src/research/index.js";
import { ContentRuntime } from "../../../packages/runtime/src/content/index.js";
import { VisualPlanningRuntime } from "../../../packages/runtime/src/visual-planning/index.js";
import { ImageProductionRuntime } from "../../../packages/runtime/src/image-production/index.js";
import { FinalizationRuntime } from "../../../packages/runtime/src/finalization/index.js";
import {
  LarkCliRunner,
  LarkCliVersionPolicy,
  LarkCliWorkspaceAdapter,
  resolveLarkCliBinary,
  type FeishuFieldMapEntry,
} from "../../../packages/workspace-adapters/src/index.js";

export interface McpContextOptions {
  env?: NodeJS.ProcessEnv;
  pluginRoot?: string;
  pluginData?: string;
  home?: string;
}

export interface CliResult {
  exitCode: number;
  value: Record<string, unknown>;
}

export interface ProjectSummary {
  project_id: string;
  run_id: string | null;
  status: string;
  phase: number | null;
  field_count: number;
}

export interface McpContext {
  pluginRoot: string;
  pluginData: string;
  home: string;
  runtimeMode: "PRODUCTION";
  workspaceAdapter: "LARK_CLI";
  liveWriteEnabled: boolean;
  invokeCli(command: string[], options?: { allowNonzero?: boolean }): Promise<CliResult>;
  validateProjectProfile(profile: unknown): Promise<void>;
  validateSchema(logicalName: string, value: unknown): Promise<void>;
  writeControlledJson(kind: string, key: string, value: unknown): Promise<string>;
  writeResearchJson(
    projectId: string,
    runId: string,
    filename: string,
    value: unknown,
  ): Promise<string>;
  readResearchJson(projectId: string, runId: string, filename: string): Promise<unknown>;
  writeContentJson(
    projectId: string,
    runId: string,
    filename: string,
    value: unknown,
  ): Promise<string>;
  readContentJson(projectId: string, runId: string, filename: string): Promise<unknown>;
  writeVisualJson(
    projectId: string,
    runId: string,
    filename: string,
    value: unknown,
  ): Promise<string>;
  readVisualJson(projectId: string, runId: string, filename: string): Promise<unknown>;
  writeFirstPageJson(
    projectId: string,
    runId: string,
    filename: string,
    value: unknown,
  ): Promise<string>;
  readFirstPageJson(projectId: string, runId: string, filename: string): Promise<unknown>;
  writeImageProductionJson(
    projectId: string,
    runId: string,
    filename: string,
    value: unknown,
  ): Promise<string>;
  readImageProductionJson(projectId: string, runId: string, filename: string): Promise<unknown>;
  readProjectProfile(projectId: string): Promise<Record<string, unknown> | null>;
  researchAdapter(projectId: string, runId: string): HostNativeResearchAdapter;
  researchRuntime(projectId: string, runId: string): Promise<ResearchRuntime>;
  contentRuntime(projectId: string, runId: string): Promise<ContentRuntime>;
  visualPlanningRuntime(projectId: string, runId: string): Promise<VisualPlanningRuntime>;
  imageProductionRuntime(projectId: string, runId: string): ImageProductionRuntime;
  finalizationRuntime(projectId: string, contentId: string, runId: string): FinalizationRuntime;
  painpointWorkspace(projectId: string): Promise<{
    adapter: LarkCliWorkspaceAdapter;
    tableId: string;
    fieldMap: FeishuFieldMapEntry[];
  }>;
  contentWorkspace(projectId: string): Promise<{
    adapter: LarkCliWorkspaceAdapter;
    contentTableId: string;
    painpointTableId: string;
    fieldMap: FeishuFieldMapEntry[];
  }>;
  listProjects(): Promise<ProjectSummary[]>;
  readProject(projectId: string): Promise<Record<string, unknown> | null>;
  hash(value: unknown): string;
}

function isWithin(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function defaultPluginRoot(): string {
  const moduleFile = fileURLToPath(import.meta.url);
  const installedCandidate = path.resolve(path.dirname(moduleFile), "../..");
  if (path.basename(installedCandidate) === "content-ops-studio") return installedCandidate;
  return path.resolve(process.cwd(), "plugins/content-ops-studio");
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw Object.assign(new Error("CLI returned an invalid JSON object."), {
      code: "LARK_CLI_RESPONSE_INVALID",
    });
  return value as Record<string, unknown>;
}

function safeSegment(value: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/.test(value))
    throw Object.assign(new Error("A controlled artifact key is invalid."), {
      code: "INVALID_INPUT",
    });
  return value;
}

export function createMcpContext(options: McpContextOptions = {}): McpContext {
  const env = options.env ?? process.env;
  const pluginRoot = path.resolve(options.pluginRoot ?? env.PLUGIN_ROOT ?? defaultPluginRoot());
  const pluginData = path.resolve(
    options.pluginData ??
      env.PLUGIN_DATA ??
      path.join(os.tmpdir(), "content-ops-studio-plugin-data"),
  );
  const home = path.resolve(
    options.home ?? env.CONTENT_OPS_HOME ?? path.join(pluginData, "content-ops-home"),
  );
  if (isWithin(pluginRoot, home))
    throw Object.assign(new Error("CONTENT_OPS_HOME must be outside immutable Plugin Root."), {
      code: "CONTENT_OPS_HOME_INVALID",
    });
  if (!isWithin(pluginData, home) && !env.CONTENT_OPS_HOME && !options.home)
    throw Object.assign(new Error("Default CONTENT_OPS_HOME escaped Plugin Data."), {
      code: "CONTENT_OPS_HOME_INVALID",
    });
  let schemaRegistry: Promise<SchemaRegistry> | undefined;
  const schemas = () => {
    const registry = schemaRegistry ?? loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"));
    schemaRegistry = registry;
    return registry;
  };

  const atomicJson = async (file: string, value: unknown): Promise<string> => {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const temporary = `${file}.tmp-${process.pid}`;
    const contents = `${JSON.stringify(value, null, 2)}\n`;
    await writeFile(temporary, contents, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    if ((await readFile(file, "utf8")) !== contents)
      throw Object.assign(new Error("Controlled artifact read verification failed."), {
        code: "ARTIFACT_READ_VERIFY_FAILED",
      });
    return file;
  };

  const invokeCli = async (
    command: string[],
    invokeOptions: { allowNonzero?: boolean } = {},
  ): Promise<CliResult> => {
    const stdout: string[] = [];
    const stderr: string[] = [];
    const flags = [
      ...command,
      "--json",
      "--mode",
      "PRODUCTION",
      "--workspace-adapter",
      "LARK_CLI",
      "--home",
      home,
      ...(env.CONTENT_OPS_LARK_CLI_PATH
        ? ["--binary", path.resolve(env.CONTENT_OPS_LARK_CLI_PATH)]
        : []),
    ];
    const exitCode = await runCli(
      flags,
      { stdout: (line) => stdout.push(line), stderr: (line) => stderr.push(line) },
      pluginRoot,
    );
    const last = stdout.at(-1);
    if (!last)
      throw Object.assign(new Error("CLI produced no structured result."), {
        code: "LARK_CLI_RESPONSE_INVALID",
      });
    let value: Record<string, unknown>;
    try {
      value = asRecord(JSON.parse(last) as unknown);
    } catch (error) {
      throw Object.assign(new Error("CLI result was not valid structured JSON."), {
        code: "LARK_CLI_RESPONSE_INVALID",
        cause: error,
      });
    }
    if (exitCode !== 0 && !invokeOptions.allowNonzero) {
      const nested = value.error as Record<string, unknown> | undefined;
      throw Object.assign(
        new Error(
          typeof nested?.message === "string"
            ? nested.message
            : "The composed Runtime operation was blocked.",
        ),
        {
          code:
            typeof nested?.code === "string"
              ? nested.code
              : typeof value.code === "string"
                ? value.code
                : "RUNTIME_OPERATION_BLOCKED",
        },
      );
    }
    void stderr;
    return { exitCode, value };
  };

  const readProject = async (projectId: string): Promise<Record<string, unknown> | null> => {
    const file = path.join(home, "projects", projectId, "workspace", "provisioning-state.json");
    try {
      return asRecord(JSON.parse(await readFile(file, "utf8")) as unknown);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  };

  const projectResearchRoot = (projectId: string, runId: string): string => {
    safeSegment(projectId);
    safeSegment(runId);
    return path.join(home, "projects", projectId, "runs", runId, "research");
  };

  const projectContentRoot = (projectId: string, runId: string): string => {
    safeSegment(projectId);
    safeSegment(runId);
    return path.join(home, "projects", projectId, "runs", runId, "content");
  };

  const projectVisualRoot = (projectId: string, runId: string): string => {
    safeSegment(projectId);
    safeSegment(runId);
    return path.join(home, "projects", projectId, "runs", runId, "visual-planning");
  };

  const projectFirstPageRoot = (projectId: string, runId: string): string => {
    safeSegment(projectId);
    safeSegment(runId);
    return path.join(home, "projects", projectId, "runs", runId, "outputs", "first-page");
  };

  const projectImageProductionRoot = (projectId: string, runId: string): string => {
    safeSegment(projectId);
    safeSegment(runId);
    return path.join(home, "projects", projectId, "runs", runId, "image-production");
  };

  const readProjectProfile = async (projectId: string): Promise<Record<string, unknown> | null> => {
    const candidates = [
      path.join(home, "projects", projectId, "project-profile.json"),
      path.join(home, "project-profile.json"),
      path.join(home, "mcp", "profiles", `${projectId}.json`),
    ];
    for (const file of candidates) {
      try {
        const value = asRecord(JSON.parse(await readFile(file, "utf8")) as unknown);
        if (value.project_id === projectId) return value;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
    return null;
  };

  const painpointWorkspace = async (projectId: string) => {
    const state = await readProject(projectId);
    if (!state)
      throw Object.assign(new Error("The project has no local Workspace state."), {
        code: "PROJECT_NOT_RESOLVED",
      });
    const remote = asRecord(state.remote_identifiers);
    const baseToken = remote.appToken;
    const tableId = remote["table:painpoints"];
    const extensions = asRecord(state.extensions);
    const fieldMap = Array.isArray(extensions.field_map)
      ? (extensions.field_map as FeishuFieldMapEntry[])
      : [];
    if (typeof baseToken !== "string" || typeof tableId !== "string" || fieldMap.length === 0)
      throw Object.assign(new Error("Painpoint Workspace mapping is incomplete."), {
        code: "WORKSPACE_MAPPING_MISSING",
      });
    const binary = await resolveLarkCliBinary({ env });
    const runner = new LarkCliRunner(binary);
    const rawVersion = await runner.require<Record<string, unknown>>({
      argv: ["--version"],
      operation: "VERSION",
    });
    new LarkCliVersionPolicy().assertSupported(JSON.stringify(rawVersion));
    return {
      adapter: new LarkCliWorkspaceAdapter({
        runner,
        identity: "user",
        baseToken,
        fieldMap,
        mappingVersion: typeof state.mapping_version === "number" ? state.mapping_version : 1,
      }),
      tableId,
      fieldMap,
    };
  };

  const contentWorkspace = async (projectId: string) => {
    const state = await readProject(projectId);
    if (!state)
      throw Object.assign(new Error("The project has no local Workspace state."), {
        code: "PROJECT_NOT_RESOLVED",
      });
    const remote = asRecord(state.remote_identifiers);
    const baseToken = remote.appToken;
    const contentTableId = remote["table:contents"];
    const painpointTableId = remote["table:painpoints"];
    const extensions = asRecord(state.extensions);
    const fieldMap = Array.isArray(extensions.field_map)
      ? (extensions.field_map as FeishuFieldMapEntry[])
      : [];
    if (
      typeof baseToken !== "string" ||
      typeof contentTableId !== "string" ||
      typeof painpointTableId !== "string" ||
      fieldMap.length === 0
    )
      throw Object.assign(new Error("Content Workspace mapping is incomplete."), {
        code: "WORKSPACE_MAPPING_MISSING",
      });
    const binary = await resolveLarkCliBinary({ env });
    const runner = new LarkCliRunner(binary);
    const rawVersion = await runner.require<Record<string, unknown>>({
      argv: ["--version"],
      operation: "VERSION",
    });
    new LarkCliVersionPolicy().assertSupported(JSON.stringify(rawVersion));
    return {
      adapter: new LarkCliWorkspaceAdapter({
        runner,
        identity: "user",
        baseToken,
        fieldMap,
        mappingVersion: typeof state.mapping_version === "number" ? state.mapping_version : 1,
      }),
      contentTableId,
      painpointTableId,
      fieldMap,
    };
  };

  return {
    pluginRoot,
    pluginData,
    home,
    runtimeMode: "PRODUCTION",
    workspaceAdapter: "LARK_CLI",
    liveWriteEnabled: env.CONTENT_OPS_ENABLE_LIVE_FEISHU === "1",
    invokeCli,
    async validateProjectProfile(profile) {
      (await schemas()).assertValid(
        "https://content-ops-studio.local/schemas/1.0/project-profile.schema.json",
        profile,
      );
    },
    async validateSchema(logicalName, value) {
      safeSegment(logicalName);
      (await schemas()).assertValid(
        `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
        value,
      );
    },
    async writeControlledJson(kind, key, value) {
      const directory = path.join(home, "mcp", safeSegment(kind));
      const file = path.join(directory, `${safeSegment(key)}.json`);
      return atomicJson(file, value);
    },
    async writeResearchJson(projectId, runId, filename, value) {
      safeSegment(filename.replace(/\.json$/, ""));
      return atomicJson(path.join(projectResearchRoot(projectId, runId), filename), value);
    },
    async readResearchJson(projectId, runId, filename) {
      safeSegment(filename.replace(/\.json$/, ""));
      try {
        return JSON.parse(
          await readFile(path.join(projectResearchRoot(projectId, runId), filename), "utf8"),
        ) as unknown;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async writeContentJson(projectId, runId, filename, value) {
      safeSegment(filename.replace(/\.json$/, ""));
      return atomicJson(path.join(projectContentRoot(projectId, runId), filename), value);
    },
    async readContentJson(projectId, runId, filename) {
      safeSegment(filename.replace(/\.json$/, ""));
      try {
        return JSON.parse(
          await readFile(path.join(projectContentRoot(projectId, runId), filename), "utf8"),
        ) as unknown;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async writeVisualJson(projectId, runId, filename, value) {
      safeSegment(filename.replace(/\.json$/, ""));
      return atomicJson(path.join(projectVisualRoot(projectId, runId), filename), value);
    },
    async readVisualJson(projectId, runId, filename) {
      safeSegment(filename.replace(/\.json$/, ""));
      try {
        return JSON.parse(
          await readFile(path.join(projectVisualRoot(projectId, runId), filename), "utf8"),
        ) as unknown;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async writeFirstPageJson(projectId, runId, filename, value) {
      safeSegment(filename.replace(/\.json$/, ""));
      return atomicJson(path.join(projectFirstPageRoot(projectId, runId), filename), value);
    },
    async readFirstPageJson(projectId, runId, filename) {
      safeSegment(filename.replace(/\.json$/, ""));
      try {
        return JSON.parse(
          await readFile(path.join(projectFirstPageRoot(projectId, runId), filename), "utf8"),
        ) as unknown;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    async writeImageProductionJson(projectId, runId, filename, value) {
      safeSegment(filename.replace(/\.json$/, ""));
      return atomicJson(path.join(projectImageProductionRoot(projectId, runId), filename), value);
    },
    async readImageProductionJson(projectId, runId, filename) {
      safeSegment(filename.replace(/\.json$/, ""));
      try {
        return JSON.parse(
          await readFile(path.join(projectImageProductionRoot(projectId, runId), filename), "utf8"),
        ) as unknown;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
        throw error;
      }
    },
    readProjectProfile,
    researchAdapter(projectId, runId) {
      return new HostNativeResearchAdapter({
        sessionsRoot: projectResearchRoot(projectId, runId),
        schemaRoot: path.join(pluginRoot, "schemas", "1.0"),
      });
    },
    async researchRuntime(projectId, runId) {
      const workspace = await painpointWorkspace(projectId);
      return new ResearchRuntime({
        adapter: new HostNativeResearchAdapter({
          sessionsRoot: projectResearchRoot(projectId, runId),
          schemaRoot: path.join(pluginRoot, "schemas", "1.0"),
        }),
        workspace: workspace.adapter,
        auditRoot: projectResearchRoot(projectId, runId),
        tableId: workspace.tableId,
        runId,
      });
    },
    async contentRuntime(projectId, runId) {
      const workspace = await contentWorkspace(projectId);
      return new ContentRuntime({
        workspace: workspace.adapter,
        auditRoot: projectContentRoot(projectId, runId),
        contentTableId: workspace.contentTableId,
        painpointTableId: workspace.painpointTableId,
        runId,
      });
    },
    async visualPlanningRuntime(projectId, runId) {
      const workspace = await contentWorkspace(projectId);
      return new VisualPlanningRuntime({
        workspace: workspace.adapter,
        auditRoot: projectVisualRoot(projectId, runId),
        contentTableId: workspace.contentTableId,
        runId,
      });
    },
    imageProductionRuntime(projectId, runId) {
      return new ImageProductionRuntime({
        projectHome: home,
        projectId,
        runId,
        schemaRoot: path.join(pluginRoot, "schemas", "1.0"),
      });
    },
    finalizationRuntime(projectId, contentId, runId) {
      return new FinalizationRuntime({
        projectHome: home,
        pluginRoot,
        projectId,
        contentId,
        runId,
      });
    },
    painpointWorkspace,
    contentWorkspace,
    async listProjects() {
      const projectsRoot = path.join(home, "projects");
      let names: string[];
      try {
        names = await readdir(projectsRoot);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
        throw error;
      }
      const projects: ProjectSummary[] = [];
      for (const projectId of names.sort()) {
        if (!/^PRJ-[A-Z0-9-]+$/.test(projectId)) continue;
        const state = await readProject(projectId);
        if (!state) continue;
        const fieldStates = state.field_states;
        projects.push({
          project_id: projectId,
          run_id: typeof state.run_id === "string" ? state.run_id : null,
          status: typeof state.overall_status === "string" ? state.overall_status : "UNKNOWN",
          phase: typeof state.current_phase === "number" ? state.current_phase : null,
          field_count:
            fieldStates && typeof fieldStates === "object" ? Object.keys(fieldStates).length : 0,
        });
      }
      return projects;
    },
    readProject,
    hash(value) {
      return createHash("sha256").update(JSON.stringify(value)).digest("hex");
    },
  };
}
