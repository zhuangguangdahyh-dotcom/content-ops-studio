import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry, type SchemaRegistry } from "@content-ops/contracts";

function safeSegment(value: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u.test(value))
    throw new Error("IMAGE_PRODUCTION_ARTIFACT_KEY_INVALID");
}

export class ImageProductionRuntime {
  readonly root: string;
  readonly schemaRoot: string | undefined;
  private registryPromise?: Promise<SchemaRegistry>;

  constructor(options: {
    projectHome: string;
    projectId: string;
    runId: string;
    schemaRoot?: string;
  }) {
    safeSegment(options.projectId);
    safeSegment(options.runId);
    this.root = path.resolve(
      options.projectHome,
      "projects",
      options.projectId,
      "runs",
      options.runId,
      "image-production",
    );
    this.schemaRoot = options.schemaRoot ? path.resolve(options.schemaRoot) : undefined;
  }

  private registry(): Promise<SchemaRegistry> {
    const registry =
      this.registryPromise ??
      (this.schemaRoot ? loadSchemaRegistry(this.schemaRoot) : loadSchemaRegistry());
    this.registryPromise = registry;
    return registry;
  }

  async write(logicalName: string, filename: string, value: unknown): Promise<string> {
    safeSegment(logicalName);
    safeSegment(filename.replace(/\.json$/u, ""));
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
    const file = path.resolve(this.root, filename);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new Error("IMAGE_PRODUCTION_ARTIFACT_PATH_ESCAPE");
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const temporary = `${file}.tmp-${process.pid}`;
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("IMAGE_PRODUCTION_ARTIFACT_READ_VERIFY_FAILED");
    return file;
  }

  async writeOnceOrReuse(
    logicalName: string,
    filename: string,
    value: unknown,
  ): Promise<{ path: string; sha256: string; reused: boolean }> {
    safeSegment(logicalName);
    safeSegment(filename.replace(/\.json$/u, ""));
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
    const file = path.resolve(this.root, filename);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new Error("IMAGE_PRODUCTION_ARTIFACT_PATH_ESCAPE");
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    const digest = createHash("sha256").update(encoded).digest("hex");
    try {
      await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if ((await readFile(file, "utf8")) !== encoded)
        throw Object.assign(new Error("Image-production immutable artifact conflict."), {
          code: "IMAGE_PRODUCTION_ARTIFACT_VERSION_CONFLICT",
        });
      return { path: file, sha256: digest, reused: true };
    }
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("IMAGE_PRODUCTION_ARTIFACT_READ_VERIFY_FAILED");
    return { path: file, sha256: digest, reused: false };
  }

  async read(filename: string): Promise<unknown> {
    safeSegment(filename.replace(/\.json$/u, ""));
    try {
      return JSON.parse(await readFile(path.resolve(this.root, filename), "utf8")) as unknown;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
}

export class ProjectVisualLearningRuntime {
  readonly root: string;
  readonly schemaRoot: string | undefined;
  private registryPromise?: Promise<SchemaRegistry>;

  constructor(options: { projectHome: string; projectId: string; schemaRoot?: string }) {
    safeSegment(options.projectId);
    this.root = path.resolve(
      options.projectHome,
      "projects",
      options.projectId,
      "project-visual-learning",
    );
    this.schemaRoot = options.schemaRoot ? path.resolve(options.schemaRoot) : undefined;
  }

  private registry(): Promise<SchemaRegistry> {
    const registry =
      this.registryPromise ??
      (this.schemaRoot ? loadSchemaRegistry(this.schemaRoot) : loadSchemaRegistry());
    this.registryPromise = registry;
    return registry;
  }

  private resolve(relativePath: string): string {
    const file = path.resolve(this.root, relativePath);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new Error("PROJECT_VISUAL_LEARNING_PATH_ESCAPE");
    return file;
  }

  async writeVersion(
    logicalName:
      "project-visual-profile" | "visual-feedback-event" | "visual-rule-candidate" | "visual-rule",
    artifactKey: string,
    value: unknown,
  ): Promise<string> {
    safeSegment(artifactKey);
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
    const directory = logicalName === "project-visual-profile" ? "profiles" : `${logicalName}s`;
    const file = this.resolve(path.join(directory, `${artifactKey}.json`));
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    try {
      await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if ((await readFile(file, "utf8")) !== encoded)
        throw new Error("PROJECT_VISUAL_LEARNING_VERSION_CONFLICT", { cause: error });
      return file;
    }
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("PROJECT_VISUAL_LEARNING_READ_VERIFY_FAILED");
    return file;
  }

  async activateProfile(artifactKey: string, value: unknown): Promise<string> {
    safeSegment(artifactKey);
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/project-visual-profile.schema.json",
      value,
    );
    const file = this.resolve("active-profile.json");
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify({ artifact_key: artifactKey, profile: value }, null, 2)}\n`;
    const temporary = `${file}.tmp-${process.pid}`;
    await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("PROJECT_VISUAL_LEARNING_ACTIVE_READ_VERIFY_FAILED");
    return file;
  }

  async readActiveProfile(): Promise<{ artifact_key: string; profile: unknown } | null> {
    try {
      return JSON.parse(await readFile(this.resolve("active-profile.json"), "utf8")) as {
        artifact_key: string;
        profile: unknown;
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
}

export class GlobalVisualPreferenceRuntime {
  readonly root: string;
  readonly schemaRoot: string | undefined;
  private registryPromise?: Promise<SchemaRegistry>;

  constructor(options: { dataHome: string; schemaRoot?: string }) {
    this.root = path.resolve(options.dataHome, "global-user-visual-learning");
    this.schemaRoot = options.schemaRoot ? path.resolve(options.schemaRoot) : undefined;
  }

  private registry(): Promise<SchemaRegistry> {
    const registry =
      this.registryPromise ??
      (this.schemaRoot ? loadSchemaRegistry(this.schemaRoot) : loadSchemaRegistry());
    this.registryPromise = registry;
    return registry;
  }

  private resolve(relativePath: string): string {
    const file = path.resolve(this.root, relativePath);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new Error("GLOBAL_VISUAL_PREFERENCE_PATH_ESCAPE");
    return file;
  }

  async writeVersion(
    logicalName: "visual-feedback-event" | "visual-rule" | "global-user-visual-preference",
    artifactKey: string,
    value: unknown,
  ): Promise<string> {
    safeSegment(artifactKey);
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
    const directory =
      logicalName === "global-user-visual-preference" ? "preferences" : `${logicalName}s`;
    const file = this.resolve(path.join(directory, `${artifactKey}.json`));
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    try {
      await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if ((await readFile(file, "utf8")) !== encoded)
        throw new Error("GLOBAL_VISUAL_PREFERENCE_VERSION_CONFLICT", { cause: error });
      return file;
    }
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("GLOBAL_VISUAL_PREFERENCE_READ_VERIFY_FAILED");
    return file;
  }

  async activate(artifactKey: string, value: unknown): Promise<string> {
    safeSegment(artifactKey);
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/global-user-visual-preference.schema.json",
      value,
    );
    const file = this.resolve("active-preference.json");
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify({ artifact_key: artifactKey, preference: value }, null, 2)}\n`;
    const temporary = `${file}.tmp-${process.pid}`;
    await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("GLOBAL_VISUAL_PREFERENCE_ACTIVE_READ_VERIFY_FAILED");
    return file;
  }

  async readActive(): Promise<{ artifact_key: string; preference: unknown } | null> {
    try {
      return JSON.parse(await readFile(this.resolve("active-preference.json"), "utf8")) as {
        artifact_key: string;
        preference: unknown;
      };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }
}
