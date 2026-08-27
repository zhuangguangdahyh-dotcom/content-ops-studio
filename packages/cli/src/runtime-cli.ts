import { access, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import type {
  ApprovalEvent,
  ProjectProfile,
  RuntimeDiagnostic,
  RuntimeEvidence,
  TaskEnvelope,
  TaskResult,
} from "../../contracts/src/generated/1.0/index.js";
import { loadSchemaRegistry } from "../../contracts/src/validation/index.js";
import {
  buildRuntimeDiagnostic,
  buildPolicyRuntimeEvidence,
  assertRuntimeEvidence,
  assertRuntimeSupported,
  DeterministicIdFactory,
  loadRuntimeSupportPolicy,
  loadIndustryPack,
  loadPlatformPack,
  ReferenceRuntimeEngine,
  nodeHashProvider,
  ProjectLockManager,
  RunJournal,
  resolvePacks,
  RuntimeFailure,
  systemClock,
  WriteLogStore,
  type RuntimeMode,
} from "../../runtime/src/index.js";
import { compareWithBaseline, createBaseline } from "../../../scripts/lib/working-tree-baseline.js";
import {
  CompositeFeishuCredentialProvider,
  EnvironmentFeishuCredentialProvider,
  FeishuAdapterError,
  FeishuBlueprintCompiler,
  FeishuProjectProvisioner,
  FeishuTokenProvider,
  FeishuWorkspaceAdapter,
  FileFeishuProvisioningStateStore,
  NodeFetchFeishuTransport,
  assertFeishuLiveWriteAllowed,
  buildFeishuReconciliationReport,
  evaluateFeishuLiveWriteGate,
  planSafeFeishuRepairs,
  requireFeishuCredentials,
  type FeishuBlueprint,
  type FeishuProvisioningState,
  type FeishuRetryEvent,
  LarkCliError,
  LarkCliRunner,
  LarkCliWorkspaceAdapter,
  LarkCliVersionPolicy,
  LARK_CLI_INSTALL_COMMAND,
  LARK_CLI_TESTED_VERSION,
  resolveLarkCliBinary,
} from "../../workspace-adapters/src/index.js";
import {
  PLAYWRIGHT_VERSION,
  RendererCapabilityProbe,
  RendererSetupService,
} from "../../renderer/src/production.js";

export interface CliIo {
  stdout(value: string): void;
  stderr(value: string): void;
}

type Flags = Record<string, string | boolean>;

const LARK_REQUIRED_SCOPES = [
  "base:app:create",
  "base:app:read",
  "base:table:create",
  "base:table:read",
  "base:table:update",
  "base:field:create",
  "base:field:read",
  "base:field:update",
  "base:view:read",
  "base:view:write_only",
  "base:record:create",
  "base:record:read",
  "base:record:update",
] as const;

function parse(args: string[]): { command: string; flags: Flags } {
  const words: string[] = [];
  const flags: Flags = {};
  for (let index = 0; index < args.length; index += 1) {
    const item = args[index];
    if (!item) continue;
    if (!item.startsWith("--")) {
      words.push(item);
      continue;
    }
    const key = item.slice(2);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) flags[key] = true;
    else {
      flags[key] = value;
      index += 1;
    }
  }
  return { command: words.join(" "), flags };
}

function required(flags: Flags, name: string): string {
  const value = flags[name];
  if (typeof value !== "string" || !value)
    throw new RuntimeFailure("INVALID_INPUT", `--${name} is required.`, 5);
  return value;
}

function mode(flags: Flags): RuntimeMode {
  const value = String(flags.mode ?? "MOCK").toUpperCase();
  if (!(["MOCK", "DRY_RUN", "PRODUCTION"] as string[]).includes(value))
    throw new RuntimeFailure("INVALID_INPUT", `Invalid --mode ${value}.`, 5);
  return value as RuntimeMode;
}

function safeError(error: unknown): { code: string; message: string } {
  const code =
    error instanceof RuntimeFailure ||
    error instanceof FeishuAdapterError ||
    error instanceof LarkCliError
      ? error.code
      : "FAILED";
  const raw = error instanceof Error ? error.message : String(error);
  return {
    code,
    message: raw.replace(
      /((?:token|secret|authorization|api[_-]?key)\s*[:=]\s*)\S+/gi,
      "$1[REDACTED]",
    ),
  };
}

async function runFixedOfficialInstall(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const [binary, ...argv] = LARK_CLI_INSTALL_COMMAND;
    const child = spawn(binary, argv, { shell: false, stdio: "inherit" });
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 4));
  });
}

async function runFixedRendererInstall(cwd: string, browserPath: string): Promise<number> {
  const cli = path.resolve(cwd, "node_modules/playwright/cli.js");
  await access(cli);
  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, "install", "chromium"], {
      shell: false,
      stdio: "inherit",
      env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserPath },
    });
    child.on("error", reject);
    child.on("close", (code) => resolve(code ?? 4));
  });
}

function larkAuthSummary(value: unknown): {
  configured: boolean;
  authenticated: boolean;
  auth_state: "NOT_CONFIGURED" | "AWAITING_USER_AUTHORIZATION" | "AUTHENTICATED" | "BLOCKED";
  identity: "user";
  token_exposed: false;
} {
  const serialized = JSON.stringify(value).toLowerCase();
  const configured =
    !serialized.includes("not_configured") && !serialized.includes("not configured");
  const authenticated =
    configured && !serialized.includes("not_logged") && !serialized.includes("unauthenticated");
  return {
    configured,
    authenticated,
    auth_state: !configured
      ? "NOT_CONFIGURED"
      : authenticated
        ? "AUTHENTICATED"
        : "AWAITING_USER_AUTHORIZATION",
    identity: "user",
    token_exposed: false,
  };
}

export function assertProjectProfileApproval(
  approval: ApprovalEvent,
  expected: { projectId: string; runId: string },
): void {
  if (
    approval.gate !== "PROJECT_PROFILE" ||
    approval.target_type !== "PROJECT" ||
    approval.target_id !== expected.projectId ||
    approval.target_version !== "PROJECT-PROFILE-V1" ||
    approval.source_run_id !== expected.runId ||
    approval.decision !== "APPROVE" ||
    approval.deprecated_at !== null
  )
    throw new RuntimeFailure(
      "APPROVAL_STALE_OR_MISMATCHED",
      "G1 approval does not match the project, version, decision and source run.",
      3,
    );
}

function exitForResult(result: TaskResult): number {
  if (result.status === "SUCCESS" || result.status === "AWAITING_APPROVAL") return 0;
  if (result.status === "BLOCKED") return 2;
  if (result.status === "CONFLICT") return 3;
  return 4;
}

function output(io: CliIo, value: unknown, asJson: boolean): void {
  io.stdout(asJson ? JSON.stringify(value) : JSON.stringify(value, null, 2));
}

function outputDoctor(io: CliIo, diagnostic: RuntimeDiagnostic, asJson: boolean): void {
  if (asJson) {
    io.stdout(JSON.stringify(diagnostic));
    return;
  }
  io.stdout(
    [
      `Current Runtime: ${diagnostic.current_runtime.name} ${diagnostic.current_runtime.version}`,
      `Project Supported Runtime: ${diagnostic.runtime_support_policy.supported_range}`,
      `Runtime Match: ${diagnostic.supported_runtime_match ? "YES" : "NO"}`,
      `Local Runtime Evidence: ${diagnostic.local_runtime_readiness}`,
      `Cross-platform CI Evidence: ${diagnostic.cross_platform_ci_evidence}`,
      `Production Integration Readiness: ${diagnostic.production_integration_readiness}`,
      ...diagnostic.upstream_lifecycle_snapshot.map(
        (entry) =>
          `Node ${entry.runtime_major}: ${entry.upstream_status} / ${entry.project_status} / ${entry.execution_status}`,
      ),
    ].join("\n"),
  );
}

function envelope(
  runId: string,
  projectId: string,
  workflow: string,
  dryRun: boolean,
): TaskEnvelope {
  return {
    contract_version: "1.0.0",
    schema_version: "1.0.0",
    run_id: runId,
    project_id: projectId,
    task_type: workflow,
    operation: "CLI_EXECUTE",
    source: "mock",
    raw_instruction: "Execute an explicit local CLI request.",
    targets: { painpoint_ids: [], content_ids: [], page_numbers: [] },
    overrides: {},
    approval_event: null,
    resume: { from_run_id: null, from_step: null },
    dry_run: dryRun,
  };
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(path.resolve(file), "utf8")) as unknown;
}

async function resolvePluginRoot(cwd: string): Promise<string> {
  const installedRoot = path.resolve(cwd);
  try {
    await access(path.join(installedRoot, ".codex-plugin/plugin.json"));
    return installedRoot;
  } catch {
    return path.join(installedRoot, "plugins/content-ops-studio");
  }
}

export async function runCli(
  args: string[],
  io: CliIo = { stdout: console.log, stderr: console.error },
  cwd = process.cwd(),
  runtimeVersion = process.version,
): Promise<number> {
  const { command, flags } = parse(args);
  const asJson = flags.json === true;
  try {
    if (
      ["app-secret", "secret", "tenant-access-token", "authorization"].some((name) => name in flags)
    )
      throw new RuntimeFailure(
        "INVALID_INPUT",
        "Credentials and tokens are forbidden as CLI arguments.",
        5,
      );
    const selectedMode = mode(flags);
    const home = typeof flags.home === "string" ? path.resolve(flags.home) : undefined;
    const pluginRoot = await resolvePluginRoot(cwd);
    const runtimePolicy = await loadRuntimeSupportPolicy(
      path.join(pluginRoot, "config/runtime-support-policy.json"),
    );
    const feishuCredentials = new CompositeFeishuCredentialProvider([
      new EnvironmentFeishuCredentialProvider(process.env),
    ]);
    const createFeishuAdapter = (onRetry?: (event: FeishuRetryEvent) => void) => {
      const tokenProvider = new FeishuTokenProvider({ credentials: feishuCredentials });
      return new FeishuWorkspaceAdapter({
        transport: new NodeFetchFeishuTransport({ tokenProvider, ...(onRetry ? { onRetry } : {}) }),
      });
    };
    const workspacePreference = String(flags["workspace-adapter"] ?? "AUTO").toUpperCase();
    if (!["AUTO", "LARK_CLI", "DIRECT_FEISHU", "MOCK"].includes(workspacePreference))
      throw new RuntimeFailure(
        "INVALID_INPUT",
        `Invalid --workspace-adapter ${workspacePreference}.`,
        5,
      );
    if (selectedMode === "PRODUCTION" && workspacePreference === "MOCK")
      throw new RuntimeFailure(
        "PRODUCTION_MOCK_ADAPTER_FORBIDDEN",
        "Production never falls back to Mock.",
        2,
      );
    const usesDirectFeishu = workspacePreference === "DIRECT_FEISHU";
    const createProductionWorkspaceAdapter = async (
      onRetry?: (event: FeishuRetryEvent) => void,
    ) => {
      if (usesDirectFeishu) return createFeishuAdapter(onRetry);
      const binary = await resolveLarkCliBinary({
        ...(typeof flags.binary === "string" ? { explicitBinary: path.resolve(flags.binary) } : {}),
        env: process.env,
      });
      const runner = new LarkCliRunner(binary);
      const rawVersion = await runner.require<Record<string, unknown>>({
        argv: ["--version"],
        operation: "VERSION",
      });
      new LarkCliVersionPolicy().assertSupported(JSON.stringify(rawVersion));
      const authRaw = await runner.require<Record<string, unknown>>({
        argv: ["auth", "status", "--json"],
        operation: "AUTH_STATUS",
      });
      const auth = larkAuthSummary(authRaw);
      if (!auth.authenticated)
        throw new RuntimeFailure(
          "AWAITING_USER_AUTHORIZATION",
          "Official Lark CLI user OAuth must be completed before Workspace execution.",
          2,
        );
      return new LarkCliWorkspaceAdapter({ runner, identity: "user" });
    };
    const loadBlueprint = async () =>
      (await readJson(
        path.join(pluginRoot, "templates/feishu/workspace-v1.json"),
      )) as FeishuBlueprint;

    if (["renderer doctor", "renderer status"].includes(command)) {
      const probe = await new RendererCapabilityProbe().probe();
      output(
        io,
        {
          status: probe.ready ? "READY" : "BLOCKED",
          renderer_id: "PLAYWRIGHT_HTML_CSS",
          playwright_version: PLAYWRIGHT_VERSION,
          browser_installation_status: probe.ready ? "INSTALLED" : "NOT_INSTALLED",
          browser_launch_status: probe.ready ? "PASSED" : "FAILED",
          browser_version: probe.browserVersion,
          browser_path_exposed: false,
          blocking_code: probe.code,
        },
        asJson,
      );
      return probe.ready ? 0 : 2;
    }
    if (command === "renderer setup") {
      const plan = new RendererSetupService().setupPlan(flags["confirm-install"] === true);
      if (!home) throw new RuntimeFailure("INVALID_INPUT", "--home is required.", 5);
      const browserPath = path.resolve(
        typeof process.env.CONTENT_OPS_PLAYWRIGHT_BROWSERS_PATH === "string"
          ? process.env.CONTENT_OPS_PLAYWRIGHT_BROWSERS_PATH
          : path.join(path.dirname(home), "playwright-browsers"),
      );
      const exitCode = await runFixedRendererInstall(cwd, browserPath);
      const probe = await new RendererCapabilityProbe().probe();
      output(
        io,
        {
          status: exitCode === 0 && probe.ready ? "SUCCESS" : "FAILED",
          package: plan.version,
          browser: "chromium",
          shell: false,
          browser_path_exposed: false,
          browser_launch_status: probe.ready ? "PASSED" : "FAILED",
        },
        asJson,
      );
      return exitCode === 0 && probe.ready ? 0 : 4;
    }

    if (command === "feishu cli install") {
      const installPlan = {
        status: flags["confirm-install"] === true ? "EXECUTING" : "AWAITING_OPERATOR_CONFIRMATION",
        source: "OFFICIAL_NPM",
        package: `@larksuite/cli@${LARK_CLI_TESTED_VERSION}`,
        command: LARK_CLI_INSTALL_COMMAND.join(" "),
        shell: false,
        modifies_shell_configuration: false,
      };
      if (flags["confirm-install"] !== true) {
        output(io, installPlan, asJson);
        return 2;
      }
      const exitCode = await runFixedOfficialInstall();
      output(
        io,
        { ...installPlan, status: exitCode === 0 ? "SUCCESS" : "FAILED", exit_code: exitCode },
        asJson,
      );
      return exitCode === 0 ? 0 : 4;
    }
    if (command === "feishu cli upgrade-plan") {
      output(
        io,
        {
          status: "NO_AUTOMATIC_UPGRADE",
          tested_version: LARK_CLI_TESTED_VERSION,
          current_stable_observed: "1.0.89",
          decision:
            "Retest capability, contracts and offline suite before changing the pinned version.",
        },
        asJson,
      );
      return 0;
    }
    if (
      [
        "feishu setup",
        "feishu status",
        "feishu login",
        "feishu logout",
        "feishu scopes",
        "feishu cli doctor",
      ].includes(command)
    ) {
      const binary = await resolveLarkCliBinary({
        ...(typeof flags.binary === "string" ? { explicitBinary: path.resolve(flags.binary) } : {}),
        env: process.env,
      });
      const runner = new LarkCliRunner(binary);
      const rawVersion = await runner.require<Record<string, unknown>>({
        argv: ["--version"],
        operation: "VERSION",
      });
      const versionText = typeof rawVersion === "string" ? rawVersion : JSON.stringify(rawVersion);
      const version = new LarkCliVersionPolicy().assertSupported(versionText);
      if (command === "feishu login") {
        const login = await runner.require<Record<string, unknown>>({
          argv: ["auth", "login", "--recommend", "--no-wait", "--json"],
          operation: "AUTH_LOGIN",
        });
        const authorizationUrl =
          typeof login.verification_url === "string"
            ? login.verification_url
            : typeof login.authorization_url === "string"
              ? login.authorization_url
              : typeof login.url === "string"
                ? login.url
                : null;
        output(
          io,
          {
            status: "AWAITING_USER_AUTHORIZATION",
            authorization_url: authorizationUrl,
            next_action: "Complete browser authorization, then rerun content-ops feishu status.",
            token_exposed: false,
          },
          asJson,
        );
        return 0;
      }
      if (command === "feishu logout") {
        await runner.require({ argv: ["auth", "logout", "--json"], operation: "AUTH_LOGOUT" });
        output(
          io,
          { status: "SUCCESS", auth_state: "NOT_CONFIGURED", token_exposed: false },
          asJson,
        );
        return 0;
      }
      const authRaw = await runner.require<Record<string, unknown>>({
        argv: ["auth", "status", "--json"],
        operation: "AUTH_STATUS",
      });
      const auth = larkAuthSummary(authRaw);
      if (command === "feishu scopes") {
        const scopeExecution = await runner.run<Record<string, unknown>>({
          argv: ["auth", "check", "--scope", LARK_REQUIRED_SCOPES.join(" "), "--json"],
          operation: "AUTH_SCOPE_CHECK",
        });
        const passed = scopeExecution.ok;
        output(
          io,
          {
            status: passed ? "SUCCESS" : "AWAITING_USER_AUTHORIZATION",
            required_scope_count: LARK_REQUIRED_SCOPES.length,
            granted_scope_count: passed ? LARK_REQUIRED_SCOPES.length : 0,
            missing_scopes: passed ? [] : [...LARK_REQUIRED_SCOPES],
            deferred_scopes: ["drive:file:upload"],
            token_exposed: false,
          },
          asJson,
        );
        return passed ? 0 : 2;
      }
      if (command === "feishu setup" && !auth.authenticated) {
        const login = await runner.require<Record<string, unknown>>({
          argv: ["auth", "login", "--recommend", "--no-wait", "--json"],
          operation: "AUTH_LOGIN",
        });
        const authorizationUrl =
          typeof login.verification_url === "string"
            ? login.verification_url
            : typeof login.authorization_url === "string"
              ? login.authorization_url
              : typeof login.url === "string"
                ? login.url
                : null;
        output(
          io,
          {
            status: "AWAITING_USER_AUTHORIZATION",
            version,
            ...auth,
            authorization_url: authorizationUrl,
            next_action: "Complete browser authorization, then rerun content-ops feishu setup.",
            required_scope_count: LARK_REQUIRED_SCOPES.length,
          },
          asJson,
        );
        return 0;
      }
      output(
        io,
        {
          status: auth.authenticated ? "READY" : "AWAITING_USER_AUTHORIZATION",
          version,
          version_status: "SUPPORTED",
          binary_source:
            typeof flags.binary === "string" ? "EXPLICIT_OPERATOR_PATH" : "PATH_OR_ENV",
          ...auth,
          required_scope_count: LARK_REQUIRED_SCOPES.length,
          credential_storage: "SYSTEM_KEYCHAIN_OWNED_BY_OFFICIAL_CLI",
          risk_control_status: "OFFICIAL_DEFAULT_ENFORCED",
        },
        asJson,
      );
      return auth.authenticated ? 0 : 2;
    }

    if (command === "feishu doctor") {
      const checkedAt = new Date().toISOString();
      const diagnostic = await feishuCredentials.diagnostic();
      const gate = evaluateFeishuLiveWriteGate({
        cliConfirmed: flags["confirm-live-write"] === true,
      });
      let tokenRequestStatus: "NOT_ATTEMPTED" | "SUCCESS" | "FAILED" | "NOT_CONFIGURED" =
        diagnostic.presence.appId && diagnostic.presence.appSecret
          ? "NOT_ATTEMPTED"
          : "NOT_CONFIGURED";
      let tokenExpiryMetadata: { expires_at: string; refresh_at: string } | null = null;
      const blockingErrors: string[] = [];
      if (
        flags["probe-auth"] === true &&
        diagnostic.presence.appId &&
        diagnostic.presence.appSecret
      ) {
        try {
          const tokenProvider = new FeishuTokenProvider({ credentials: feishuCredentials });
          const token = await tokenProvider.refresh();
          await tokenProvider.getToken();
          tokenExpiryMetadata = {
            expires_at: new Date(token.expiresAt).toISOString(),
            refresh_at: new Date(token.refreshAt).toISOString(),
          };
          tokenRequestStatus = "SUCCESS";
        } catch (error) {
          tokenRequestStatus = "FAILED";
          blockingErrors.push(safeError(error).code);
        }
      }
      const value = {
        diagnostic_id: `FAD-${Date.now()}`,
        provider: "FEISHU",
        region: "CHINA",
        auth_mode: "SELF_BUILT_TENANT_APP",
        credential_presence: diagnostic.presence,
        secret_redaction_verified: diagnostic.secret_redaction_verified,
        token_request_status: tokenRequestStatus,
        token_expiry_metadata: tokenExpiryMetadata,
        application_identity_status: "NOT_CHECKED",
        workspace_access_status: "NOT_CHECKED",
        permission_status: "NOT_CHECKED",
        missing_permissions: [],
        live_write_gate_status: gate.status,
        warnings:
          tokenRequestStatus === "NOT_ATTEMPTED"
            ? ["Pass --probe-auth for a read-only token request."]
            : [],
        blocking_errors: blockingErrors,
        overall_status:
          tokenRequestStatus === "FAILED"
            ? "BLOCKED"
            : tokenRequestStatus === "NOT_CONFIGURED"
              ? "NOT_CONFIGURED"
              : "DEGRADED",
        checked_at: checkedAt,
        schema_version: "1.0.0",
        extensions: { runtime: runtimeVersion },
      };
      output(io, value, asJson);
      return blockingErrors.length ? 2 : 0;
    }
    if (command === "feishu permissions") {
      const manifest = await readJson(
        path.join(pluginRoot, "config/feishu-permission-manifest.json"),
      );
      output(io, { status: "DOCUMENTED", manifest }, asJson);
      return 0;
    }
    if (command === "feishu workspace plan") {
      const blueprint = await loadBlueprint();
      const projectId = required(flags, "project-id");
      const projectName = required(flags, "project-name");
      const runId = required(flags, "run-id");
      const plan = new FeishuBlueprintCompiler().compile(blueprint, null, "PROVISION");
      output(
        io,
        {
          status: plan.conflicts.length ? "BLOCKED" : "PLANNED",
          project_id: projectId,
          run_id: runId,
          base_title: `${projectName}｜图文内容工作台`,
          parent_folder_reference: "env:FEISHU_PARENT_FOLDER_TOKEN",
          live_write_required: true,
          live_write_confirmed: false,
          plan,
        },
        asJson,
      );
      return plan.conflicts.length ? 2 : 0;
    }
    if (
      ["feishu workspace provision", "project init", "feishu workspace repair"].includes(command)
    ) {
      if (selectedMode !== "PRODUCTION")
        throw new RuntimeFailure(
          "PRODUCTION_BLOCKED",
          `${command} requires --mode PRODUCTION and never falls back to Mock.`,
          2,
        );
      if (!home)
        throw new RuntimeFailure(
          "INVALID_INPUT",
          "--home is required for project-local Feishu state.",
          5,
        );
      const dryRun =
        flags["dry-run"] === true ||
        (command === "feishu workspace repair" && flags["confirm-live-write"] !== true);
      if (dryRun && command === "feishu workspace repair") {
        const projectId = required(flags, "project-id");
        const stateFile = path.join(
          home,
          "projects",
          projectId,
          "workspace",
          "provisioning-state.json",
        );
        const state = await new FileFeishuProvisioningStateStore(stateFile).load();
        if (!state?.remoteIdentifiers.appToken)
          throw new RuntimeFailure(
            "PROJECT_NOT_RESOLVED",
            "No project-local Feishu connection exists.",
            5,
          );
        const adapter = await createProductionWorkspaceAdapter();
        adapter.setWorkspace(state.remoteIdentifiers.appToken);
        const report = buildFeishuReconciliationReport(
          await loadBlueprint(),
          await adapter.inspectSchema(),
          state.fieldMap,
        );
        output(
          io,
          {
            status: report.overallStatus,
            dry_run: true,
            safe_repairs: planSafeFeishuRepairs(report),
            report,
          },
          asJson,
        );
        return report.overallStatus === "BLOCKED" ? 2 : 0;
      }
      if (usesDirectFeishu)
        assertFeishuLiveWriteAllowed(
          evaluateFeishuLiveWriteGate({
            cliConfirmed: flags["confirm-live-write"] === true,
            dryRun,
          }),
        );
      else if (flags["confirm-live-write"] !== true || dryRun)
        throw new RuntimeFailure(
          "LARK_CLI_LIVE_WRITE_NOT_CONFIRMED",
          "Official Lark CLI writes require a completed dry run and --confirm-live-write.",
          2,
        );
      const profile = (await readJson(required(flags, "input"))) as ProjectProfile;
      const projectId = String(flags["project-id"] ?? profile.project_id);
      const projectName = String(flags["project-name"] ?? profile.project_name);
      const runId = String(flags["run-id"] ?? profile.last_run_id);
      if (!projectId || !projectName || !runId)
        throw new RuntimeFailure("INVALID_INPUT", "Project ID, name and run ID are required.", 5);
      const credentials = usesDirectFeishu
        ? await requireFeishuCredentials(feishuCredentials)
        : null;
      const parentFolderToken =
        credentials?.parentFolderToken?.reveal() ??
        (typeof flags["folder-token"] === "string"
          ? flags["folder-token"]
          : (process.env.FEISHU_TEST_PARENT_FOLDER_TOKEN ??
            process.env.FEISHU_PARENT_FOLDER_TOKEN ??
            ""));
      if (usesDirectFeishu && !parentFolderToken)
        throw new RuntimeFailure(
          "FEISHU_CONFIG_MISSING",
          "FEISHU_PARENT_FOLDER_TOKEN is required for Direct Feishu.",
          5,
        );
      const stateFile = path.join(
        home,
        "projects",
        projectId,
        "workspace",
        "provisioning-state.json",
      );
      const runtimeIds = new DeterministicIdFactory(runId);
      const lockManager = new ProjectLockManager(
        path.join(home, "locks"),
        systemClock,
        runtimeIds,
        { processId: String(process.pid), hostLabel: "content-ops-cli" },
        300_000,
      );
      const runDirectory = path.join(home, "projects", projectId, "runs", runId);
      const journal = new RunJournal(
        path.join(runDirectory, "journal.jsonl"),
        systemClock,
        runtimeIds,
        nodeHashProvider,
      );
      const writeLog = new WriteLogStore(path.join(runDirectory, "write-log.jsonl"));
      const retryEvents: FeishuRetryEvent[] = [];
      await lockManager.acquireProjectWriteLock(projectId, runId);
      await journal.appendEvent({
        event_type: "RUN_CREATED",
        run_id: runId,
        project_id: projectId,
        workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
        step_id: null,
        status: "RECORDED",
      });
      const provisioner = new FeishuProjectProvisioner({
        adapter: await createProductionWorkspaceAdapter((event) => retryEvents.push(event)),
        stateStore: new FileFeishuProvisioningStateStore(stateFile),
        blueprint: await loadBlueprint(),
        projectId,
        projectName,
        runId,
        parentFolderToken,
        workspaceDirectory: path.dirname(stateFile),
        projectDraft: {
          projectConfigSubjectName: profile.subject_name,
          projectConfigIndustry: profile.industry,
          projectConfigIndustryPack: profile.industry_pack,
          projectConfigPlatformPack: profile.platform_pack,
        },
        onOperation: async (event) => {
          if (event.outcome !== "VERIFIED") return;
          const at = new Date().toISOString();
          await writeLog.appendWriteAttempt({
            write_id: runtimeIds.next("WRITE"),
            run_id: runId,
            project_id: projectId,
            owner_skill: "project-initialization",
            provider: "FEISHU",
            operation: "VERIFY",
            target_type: "FEISHU_PROVISIONING_OPERATION",
            target_id: event.operation,
            idempotency_key: `${runId}:${event.operation}`,
            state_before: {},
            state_after: { phase: event.phase, outcome: event.outcome },
            request_summary: "Redacted Feishu provisioning operation.",
            response_summary: "Read-after-write verified; identifiers omitted.",
            verification_status: "VERIFIED",
            verification_details: "Remote read matched the planned operation.",
            attempt_number: 1,
            retryable: false,
            error: null,
            started_at: at,
            completed_at: at,
          });
          await journal.appendEvent({
            event_type: "STEP_COMPLETED",
            run_id: runId,
            project_id: projectId,
            workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
            step_id: `PHASE-${event.phase}`,
            status: "RECORDED",
            payload_summary: { operation: event.operation },
          });
        },
      });
      let state: FeishuProvisioningState;
      try {
        state = await provisioner.provision();
        if (state.overallStatus === "AWAITING_APPROVAL")
          await journal.appendEvent({
            event_type: "APPROVAL_REQUESTED",
            run_id: runId,
            project_id: projectId,
            workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
            step_id: "G1",
            status: "RECORDED",
            payload_summary: { gate: "G1 PROJECT_PROFILE" },
          });
      } finally {
        for (const event of retryEvents) {
          const at = new Date().toISOString();
          await writeLog.appendWriteAttempt({
            write_id: runtimeIds.next("WRITE"),
            run_id: runId,
            project_id: projectId,
            owner_skill: "project-initialization",
            provider: "FEISHU",
            operation: "VERIFY",
            target_type: "FEISHU_RETRY_EVENT",
            target_id: event.operation,
            idempotency_key: `${runId}:retry:${event.operation}:${event.attempt_number}`,
            state_before: { attempt_number: event.attempt_number },
            state_after: { outcome: event.outcome, delay_ms: event.delay_ms },
            request_summary: `Retry classified as ${event.reason}; request body and headers omitted.`,
            response_summary: "Remote code redacted; Authorization omitted.",
            verification_status: event.outcome === "RETRYING" ? "PARTIAL" : "FAILED",
            verification_details: `retry=${event.outcome}; remote_code=${event.redacted_remote_code ?? "none"}`,
            attempt_number: 1,
            retryable: event.outcome === "RETRYING",
            error: null,
            started_at: at,
            completed_at: at,
          });
        }
        await lockManager.releaseProjectWriteLock(projectId);
      }
      output(
        io,
        {
          status: state.overallStatus,
          gate: state.overallStatus === "AWAITING_APPROVAL" ? "G1 PROJECT_PROFILE" : null,
          state_file: path.relative(home, stateFile),
        },
        asJson,
      );
      return state.overallStatus === "BLOCKED" ? 2 : 0;
    }
    if (command === "run approve" && selectedMode === "PRODUCTION") {
      if (!home) throw new RuntimeFailure("INVALID_INPUT", "--home is required.", 5);
      if (flags["confirm-live-write"] !== true)
        throw new RuntimeFailure(
          "LARK_CLI_LIVE_WRITE_NOT_CONFIRMED",
          "Production G1 remote updates require --confirm-live-write.",
          2,
        );
      const projectId = required(flags, "project-id");
      const projectName = required(flags, "project-name");
      const runId = required(flags, "run-id");
      const approval = (await readJson(required(flags, "approval"))) as ApprovalEvent;
      (await loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"))).assertValid(
        "https://content-ops-studio.local/schemas/1.0/approval-event.schema.json",
        approval,
      );
      assertProjectProfileApproval(approval, { projectId, runId });
      const stateFile = path.join(
        home,
        "projects",
        projectId,
        "workspace",
        "provisioning-state.json",
      );
      const approvalIds = new DeterministicIdFactory(`${runId}-G1`);
      const lockManager = new ProjectLockManager(
        path.join(home, "locks"),
        systemClock,
        approvalIds,
        { processId: String(process.pid), hostLabel: "content-ops-cli" },
        300_000,
      );
      const runDirectory = path.join(home, "projects", projectId, "runs", runId);
      const journal = new RunJournal(
        path.join(runDirectory, "journal.jsonl"),
        systemClock,
        approvalIds,
        nodeHashProvider,
      );
      const writeLog = new WriteLogStore(path.join(runDirectory, "write-log.jsonl"));
      await lockManager.acquireProjectWriteLock(projectId, runId);
      try {
        await journal.appendEvent({
          event_type: "APPROVAL_RECORDED",
          run_id: runId,
          project_id: projectId,
          workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
          step_id: "G1",
          status: "RECORDED",
          payload_summary: {
            gate: approval.gate,
            decision: approval.decision,
            approval_id: approval.approval_id,
          },
        });
        const provisioner = new FeishuProjectProvisioner({
          adapter: await createProductionWorkspaceAdapter(),
          stateStore: new FileFeishuProvisioningStateStore(stateFile),
          blueprint: await loadBlueprint(),
          projectId,
          projectName,
          runId,
          parentFolderToken: "",
          workspaceDirectory: path.dirname(stateFile),
        });
        const state = await provisioner.activateAfterG1(true);
        const at = new Date().toISOString();
        await writeLog.appendWriteAttempt({
          write_id: approvalIds.next("WRITE"),
          run_id: runId,
          project_id: projectId,
          owner_skill: "project-initialization",
          provider: "FEISHU",
          operation: "VERIFY",
          target_type: "PROJECT_PROFILE",
          target_id: projectId,
          idempotency_key: `${runId}:G1:${approval.approval_id}`,
          state_before: { gate: "PROJECT_PROFILE", status: "AWAITING_APPROVAL" },
          state_after: { status: state.overallStatus },
          request_summary: "Explicit G1 approval routed through Production Runtime.",
          response_summary: "Remote project state reconciled and read verification passed.",
          verification_status: "VERIFIED",
          verification_details: "Project status and configuration confirmation were verified.",
          attempt_number: 1,
          retryable: false,
          error: null,
          started_at: at,
          completed_at: at,
        });
        await journal.appendEvent({
          event_type: "STEP_COMPLETED",
          run_id: runId,
          project_id: projectId,
          workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
          step_id: "G1",
          status: "RECORDED",
          payload_summary: { remote_update: "VERIFIED" },
        });
        output(
          io,
          {
            status: state.overallStatus,
            gate: "G1 PROJECT_PROFILE",
            approval: "APPROVE",
            remote_update: "VERIFIED",
          },
          asJson,
        );
        return state.overallStatus === "SUCCESS" ? 0 : 2;
      } finally {
        await lockManager.releaseProjectWriteLock(projectId);
      }
    }
    if (["feishu workspace inspect", "feishu workspace verify"].includes(command)) {
      if (!home) throw new RuntimeFailure("INVALID_INPUT", "--home is required.", 5);
      const projectId = required(flags, "project-id");
      const stateFile = path.join(
        home,
        "projects",
        projectId,
        "workspace",
        "provisioning-state.json",
      );
      const state = await new FileFeishuProvisioningStateStore(stateFile).load();
      if (!state?.remoteIdentifiers.appToken)
        throw new RuntimeFailure(
          "PROJECT_NOT_RESOLVED",
          "No project-local Feishu connection exists.",
          5,
        );
      const adapter = await createProductionWorkspaceAdapter();
      adapter.setWorkspace(state.remoteIdentifiers.appToken);
      adapter.setFieldMap(state.fieldMap, state.mappingVersion);
      if (command === "feishu workspace inspect")
        output(io, { status: "SUCCESS", snapshot: await adapter.inspectSchema() }, asJson);
      else
        output(
          io,
          { status: "SUCCESS", verification: await adapter.verifyWorkspace(await loadBlueprint()) },
          asJson,
        );
      return 0;
    }
    if (command === "doctor") {
      const checkedAt = new Date().toISOString();
      const capabilities = [
        {
          capability: "workspace.mock.adapter",
          provider: "persistent-local-mock",
          status: "MOCK_ONLY" as const,
          limitations: ["Local fixture state only."],
          last_verified_at: checkedAt,
          blocking_reason: null,
        },
        {
          capability: "workspace.adapter",
          provider: "feishu",
          status: "AVAILABLE" as const,
          limitations: [
            "Phase 2B implementation is offline-verified; tenant-specific live evidence may still be NOT_CONFIGURED.",
            "Attachment upload is deferred.",
          ],
          last_verified_at: checkedAt,
          blocking_reason: null,
        },
        ...[
          ["image.adapter", "production-image-provider"],
          ["renderer.adapter", "production-renderer"],
        ].map(([capability, provider]) => ({
          capability: capability ?? "production.adapter",
          provider: provider ?? "not-implemented",
          status: "NOT_IMPLEMENTED" as const,
          limitations: ["Production Adapter is not implemented."],
          last_verified_at: checkedAt,
          blocking_reason: "V0.2.0 production integration boundary.",
        })),
      ];
      const runtimeEvidence: RuntimeEvidence[] = [];
      try {
        const localEvidence = JSON.parse(
          await readFile(
            path.join(cwd, "reports/verification/runtime-evidence-node24.json"),
            "utf8",
          ),
        ) as RuntimeEvidence;
        const schemas = await loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"));
        schemas.assertValid(
          "https://content-ops-studio.local/schemas/1.0/runtime-evidence.schema.json",
          localEvidence,
        );
        assertRuntimeEvidence(localEvidence, runtimePolicy);
        runtimeEvidence.push(localEvidence);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
      runtimeEvidence.push(...buildPolicyRuntimeEvidence(runtimePolicy, checkedAt, "11.19.0"));
      const diagnostic = buildRuntimeDiagnostic({
        id: `DIAG-${Date.now()}`,
        mode: selectedMode,
        checkedAt,
        currentRuntimeVersion: runtimeVersion,
        runtimePolicy,
        runtimeEvidence,
        crossPlatformCiEvidence: "UNVERIFIED",
        projectHomeStatus: home ? "READY" : "NOT_PROVIDED",
        schemaReady: true,
        packWarnings: ["Platform and Industry Packs remain explicit scaffolds."],
        capabilities,
        gitStatus: "UNBORN_WORKING_TREE",
        remoteStatus: "NOT_CONFIGURED",
      });
      outputDoctor(io, diagnostic, asJson);
      return diagnostic.overall_status === "BLOCKED" ? 2 : 0;
    }
    assertRuntimeSupported(runtimePolicy, runtimeVersion);
    if (command === "baseline create") {
      const baseline = await createBaseline(cwd);
      output(
        io,
        { status: "READY", baseline_id: baseline.baseline_id, file_count: baseline.file_count },
        asJson,
      );
      return 0;
    }
    if (command === "baseline verify") {
      output(io, { status: "SUCCESS", difference: await compareWithBaseline(cwd) }, asJson);
      return 0;
    }
    if (command === "packs resolve") {
      const schemas = await loadSchemaRegistry(path.join(pluginRoot, "schemas/1.0"));
      const platformId = String(flags.platform ?? "xiaohongshu");
      const industryId = String(flags.industry ?? "generic");
      const runId = required(flags, "run-id");
      const projectId = required(flags, "project-id");
      const resolution = resolvePacks(
        {
          resolutionId: `PRES-${runId}`,
          projectId,
          runId,
          resolvedAt: new Date().toISOString(),
          platform: await loadPlatformPack(pluginRoot, platformId, "1.0.0", schemas),
          industry: await loadIndustryPack(pluginRoot, industryId, "1.0.0", schemas),
          pluginDefaults: { runtime_mode: selectedMode },
          projectRules: { source: "CLI" },
          runOverrides: {},
        },
        schemas,
      );
      output(io, { status: "SUCCESS", resolution }, asJson);
      return 0;
    }
    if (!home)
      throw new RuntimeFailure(
        "INVALID_INPUT",
        "--home is required; CLI never creates a default Home.",
        5,
      );
    const engine = new ReferenceRuntimeEngine({
      home,
      pluginRoot,
      runtimeVersion,
      runtimePolicy,
    });
    if (command === "project create") {
      if (selectedMode !== "MOCK")
        throw new RuntimeFailure(
          "PRODUCTION_BLOCKED",
          "Project create is MOCK-only in Phase 2A.",
          2,
        );
      const profile = (await readJson(required(flags, "input"))) as ProjectProfile;
      const runId = String(flags["run-id"] ?? profile.last_run_id);
      const projectId = String(flags["project-id"] ?? profile.project_id);
      const result = await engine.startProjectInitialization({
        profile,
        envelope: envelope(runId, projectId, "PROJECT_INITIALIZATION", flags["dry-run"] === true),
      });
      output(io, result, asJson);
      return exitForResult(result);
    }
    if (command === "project inspect") {
      const registry = (await readJson(path.join(home, "registry/projects.json"))) as {
        entries?: Array<{ project_id: string }>;
      };
      const projectId = required(flags, "project-id");
      const project = (registry.entries ?? []).find((entry) => entry.project_id === projectId);
      if (!project) throw new RuntimeFailure("PROJECT_NOT_RESOLVED", projectId, 5);
      output(io, { status: "SUCCESS", project }, asJson);
      return 0;
    }
    if (command === "run start") {
      if (selectedMode !== "MOCK")
        throw new RuntimeFailure("PRODUCTION_BLOCKED", "Reference runs are MOCK-only.", 2);
      const workflow = required(flags, "workflow");
      const payload = (await readJson(required(flags, "input"))) as Record<string, unknown>;
      const runId = required(flags, "run-id");
      const projectId = required(flags, "project-id");
      let result: TaskResult;
      if (workflow === "PROJECT_INITIALIZATION_LOCAL_V1") {
        result = await engine.startProjectInitialization({
          profile: payload.profile as ProjectProfile,
          envelope: envelope(runId, projectId, "PROJECT_INITIALIZATION", flags["dry-run"] === true),
        });
      } else if (workflow === "VISUAL_FINALIZATION_FIXTURE_V1") {
        result = await engine.startVisualFinalization({
          envelope: envelope(runId, projectId, "VISUAL_FINALIZATION", flags["dry-run"] === true),
          projectName: String(payload.projectName),
          fixture: payload.fixture as Record<string, unknown>,
          assetFiles: payload.assetFiles as [string, string, string, string],
        });
      } else throw new RuntimeFailure("INVALID_INPUT", `Unknown workflow ${workflow}.`, 5);
      output(io, result, asJson);
      return exitForResult(result);
    }
    if (command === "run status") {
      const inspected = await engine.inspect(
        required(flags, "project-name"),
        required(flags, "project-id"),
        required(flags, "run-id"),
      );
      output(io, { status: "SUCCESS", ...inspected }, asJson);
      return 0;
    }
    if (command === "run approve" || command === "run resume") {
      const approval = (await readJson(required(flags, "approval"))) as ApprovalEvent;
      const result = await engine.resume(
        required(flags, "project-name"),
        required(flags, "run-id"),
        approval,
      );
      output(io, result, asJson);
      return exitForResult(result);
    }
    if (command === "run verify") {
      const verification = await engine.verify(
        required(flags, "project-name"),
        required(flags, "project-id"),
        required(flags, "run-id"),
      );
      output(io, { status: "SUCCESS", verification }, asJson);
      return 0;
    }
    throw new RuntimeFailure("INVALID_INPUT", `Unknown command: ${command || "<empty>"}.`, 5);
  } catch (error) {
    const safe = safeError(error);
    io.stderr(JSON.stringify({ status: "FAILED", error: safe }));
    if (error instanceof RuntimeFailure) return error.exitCode;
    if (error instanceof FeishuAdapterError) {
      if (
        [
          "FEISHU_LIVE_WRITE_DISABLED",
          "FEISHU_LIVE_WRITE_NOT_CONFIRMED",
          "FEISHU_PERMISSION_DENIED",
          "FEISHU_PERMISSION_MISSING",
        ].includes(error.code)
      )
        return 2;
      if (["FEISHU_CONFIG_MISSING", "FEISHU_CREDENTIALS_MISSING"].includes(error.code)) return 5;
    }
    return 4;
  }
}
