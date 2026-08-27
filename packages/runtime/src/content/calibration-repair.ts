import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry, type SchemaRegistry } from "@content-ops/contracts";

const logicalNames = [
  "calibration-content-package",
  "calibration-content-quality-report",
  "calibration-g3-review-request",
  "calibration-g3-approval",
  "calibration-visual-plan",
  "calibration-rebound-first-page",
  "calibration-g4-review-request",
  "calibration-g4-approval-v2",
  "calibration-style-lock-v2",
  "calibration-remaining-page-production",
  "calibration-g5-review-request",
] as const;

type CalibrationArtifactName = (typeof logicalNames)[number];

function safeSegment(value: string): void {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u.test(value))
    throw new Error("CALIBRATION_CONTENT_ARTIFACT_KEY_INVALID");
}

export class CalibrationContentRepairRuntime {
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
    if (!/^CAL-[A-Z0-9-]+$/u.test(options.projectId))
      throw new Error("CALIBRATION_PROJECT_REFERENCE_INVALID");
    this.root = path.resolve(
      options.projectHome,
      "projects",
      options.projectId,
      "runs",
      options.runId,
      "content",
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

  async writeOnceOrReuse(
    logicalName: CalibrationArtifactName,
    filename: string,
    value: unknown,
  ): Promise<{ path: string; sha256: string; reused: boolean }> {
    if (!logicalNames.includes(logicalName))
      throw new Error("CALIBRATION_CONTENT_SCHEMA_NOT_ALLOWED");
    safeSegment(filename.replace(/\.json$/u, ""));
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
    const file = path.resolve(this.root, filename);
    if (!file.startsWith(`${this.root}${path.sep}`))
      throw new Error("CALIBRATION_CONTENT_ARTIFACT_PATH_ESCAPE");
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    const digest = createHash("sha256").update(encoded).digest("hex");
    try {
      await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      if ((await readFile(file, "utf8")) !== encoded)
        throw Object.assign(new Error("Calibration content immutable artifact conflict."), {
          code: "CALIBRATION_CONTENT_ARTIFACT_VERSION_CONFLICT",
        });
      return { path: file, sha256: digest, reused: true };
    }
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("CALIBRATION_CONTENT_ARTIFACT_READ_VERIFY_FAILED");
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
