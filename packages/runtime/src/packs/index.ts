import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  IndustryPack,
  PackResolution,
  PlatformPack,
} from "../../../contracts/src/generated/1.0/index.js";
import type { SchemaRegistry } from "../../../contracts/src/validation/index.js";
import { canonicalJson, sha256 } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";

const PLATFORM_SCHEMA = "https://content-ops-studio.local/schemas/1.0/platform-pack.schema.json";
const INDUSTRY_SCHEMA = "https://content-ops-studio.local/schemas/1.0/industry-pack.schema.json";
const RESOLUTION_SCHEMA =
  "https://content-ops-studio.local/schemas/1.0/pack-resolution.schema.json";

async function optionalText(file: string): Promise<string> {
  try {
    return await readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
    throw error;
  }
}

async function optionalJson(file: string): Promise<unknown> {
  const text = await optionalText(file);
  return text ? (JSON.parse(text) as unknown) : [];
}

function stringsFrom(value: unknown): string[] {
  if (Array.isArray(value))
    return value.map((item) => (typeof item === "string" ? item : canonicalJson(item)));
  if (value && typeof value === "object")
    return Object.entries(value as Record<string, unknown>).map(
      ([key, item]) => `${key}: ${typeof item === "string" ? item : canonicalJson(item)}`,
    );
  return typeof value === "string" && value.trim() ? [value.trim()] : [];
}

function markdownRules(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => line.replace(/^\s*(?:[-*]|[0-9]+\.)\s*/, "").trim())
    .filter((line) => line && !line.startsWith("#"));
}

function stringValue(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export async function loadPlatformPack(
  pluginRoot: string,
  id: string,
  expectedVersion: string,
  schemas: SchemaRegistry,
): Promise<PlatformPack> {
  const directory = path.join(pluginRoot, "packs/platforms", id);
  let sourceDirectory = directory;
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(await readFile(path.join(directory, "pack.json"), "utf8")) as Record<
      string,
      unknown
    >;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      throw new RuntimeFailure("PACK_NOT_FOUND", `Platform Pack ${id} not found.`, 5);
    throw error;
  }
  if (raw.version !== expectedVersion) {
    sourceDirectory = path.join(directory, "versions", expectedVersion);
    try {
      raw = JSON.parse(await readFile(path.join(sourceDirectory, "pack.json"), "utf8")) as Record<
        string,
        unknown
      >;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT")
        throw new RuntimeFailure("PACK_VERSION_MISMATCH", "Platform Pack version differs.", 3);
      throw error;
    }
  }
  if (raw.id !== id || raw.version !== expectedVersion)
    throw new RuntimeFailure("PACK_VERSION_MISMATCH", "Platform Pack ID/version differs.", 3);
  const range = raw.defaultPageRange as { min?: number; max?: number } | undefined;
  const pack: PlatformPack = {
    id,
    version: expectedVersion,
    display_name: stringValue(raw.displayName, id),
    status: String(raw.status).toUpperCase() as PlatformPack["status"],
    supported_formats: ((raw.supportedFormats as string[] | undefined) ?? ["image-post"]) as [
      string,
      ...string[],
    ],
    default_aspect_ratio: stringValue(raw.defaultAspectRatio, "3:4"),
    default_page_range: { min: range?.min ?? 4, max: range?.max ?? 8 },
    default_page_count: Number(raw.defaultPageCount ?? 6),
    title_visible_character_limit: Number(raw.titleVisibleCharacterLimit ?? 20),
    rules: markdownRules(await optionalText(path.join(sourceDirectory, "rules.md"))),
    prohibited_patterns: ["Never override safety, factual accuracy, or tool permissions."],
    extensions: {
      source_directory:
        sourceDirectory === directory
          ? `packs/platforms/${id}`
          : `packs/platforms/${id}/versions/${expectedVersion}`,
    },
  };
  schemas.assertValid(PLATFORM_SCHEMA, pack);
  return pack;
}

export async function loadIndustryPack(
  pluginRoot: string,
  id: string,
  expectedVersion: string,
  schemas: SchemaRegistry,
): Promise<IndustryPack> {
  const directory = path.join(pluginRoot, "packs/industries", id);
  let raw: Record<string, unknown>;
  try {
    raw = JSON.parse(await readFile(path.join(directory, "pack.json"), "utf8")) as Record<
      string,
      unknown
    >;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      throw new RuntimeFailure("PACK_NOT_FOUND", `Industry Pack ${id} not found.`, 5);
    throw error;
  }
  if (raw.id !== id || raw.version !== expectedVersion)
    throw new RuntimeFailure("PACK_VERSION_MISMATCH", "Industry Pack ID/version differs.", 3);
  const pack: IndustryPack = {
    id,
    version: expectedVersion,
    display_name: stringValue(raw.displayName, id),
    status: String(raw.status).toUpperCase() as IndustryPack["status"],
    industry_context: await optionalText(path.join(directory, "industry-context.md")),
    audience_taxonomy: [],
    decision_chain: stringsFrom(await optionalJson(path.join(directory, "decision-chain.json"))),
    painpoint_taxonomy: stringsFrom(
      await optionalJson(path.join(directory, "painpoint-taxonomy.json")),
    ),
    content_angle_library: stringsFrom(
      await optionalJson(path.join(directory, "content-angle-library.json")),
    ),
    visual_evidence_library: stringsFrom(
      await optionalJson(path.join(directory, "visual-evidence-library.json")),
    ),
    claim_boundaries: ["Do not state unsupported industry or customer claims."],
    prohibited_patterns: ["Do not store customer-specific rules in a shared Pack."],
    extensions: { source_directory: `packs/industries/${id}` },
  };
  schemas.assertValid(INDUSTRY_SCHEMA, pack);
  return pack;
}

export function validatePack(
  pack: PlatformPack | IndustryPack,
  kind: "platform" | "industry",
  schemas: SchemaRegistry,
): void {
  schemas.assertValid(kind === "platform" ? PLATFORM_SCHEMA : INDUSTRY_SCHEMA, pack);
}

export interface ResolvePackInput {
  resolutionId: string;
  projectId: string;
  runId: string;
  resolvedAt: string;
  platform: PlatformPack;
  industry: IndustryPack;
  pluginDefaults: Record<string, unknown>;
  projectRules: Record<string, unknown>;
  runOverrides: Record<string, unknown>;
}

export function resolvePacks(input: ResolvePackInput, schemas?: SchemaRegistry): PackResolution {
  const conflicts: PackResolution["conflicts"] = [];
  const warnings: PackResolution["warnings"] = [];
  if (input.platform.status === "SCAFFOLD")
    warnings.push({
      code: "SCAFFOLD_PACK",
      message: "Platform Pack is a scaffold.",
      source: input.platform.id,
    });
  if (input.industry.status === "SCAFFOLD")
    warnings.push({
      code: "SCAFFOLD_PACK",
      message: "Industry Pack is a scaffold.",
      source: input.industry.id,
    });
  if (input.runOverrides.allow_external_network === true) {
    conflicts.push({
      code: "SAFETY_OVERRIDE_REJECTED",
      message: "Run override cannot enable external network in Phase 2A.",
      source: "run_overrides",
    });
  }
  const resolvedValues: Record<string, unknown> = {
    ...input.pluginDefaults,
    default_aspect_ratio: input.platform.default_aspect_ratio,
    default_page_count: input.platform.default_page_count,
    title_visible_character_limit: input.platform.title_visible_character_limit,
    ...input.projectRules,
    ...input.runOverrides,
    allow_external_network: false,
  };
  const result: PackResolution = {
    resolution_id: input.resolutionId,
    project_id: input.projectId,
    platform_pack: {
      id: input.platform.id,
      version: input.platform.version,
      status: input.platform.status,
      snapshot_sha256: sha256(canonicalJson(input.platform)),
    },
    industry_pack: {
      id: input.industry.id,
      version: input.industry.version,
      status: input.industry.status,
      snapshot_sha256: sha256(canonicalJson(input.industry)),
    },
    plugin_defaults: input.pluginDefaults,
    project_rule_snapshot: input.projectRules,
    run_overrides: input.runOverrides,
    priority_order: [
      "SAFETY_COMPLIANCE_FACTS_PERMISSIONS",
      "CURRENT_OPERATOR_REQUEST",
      "CONFIRMED_PROJECT_RULES",
      "PLATFORM_PACK",
      "INDUSTRY_PACK",
      "PLUGIN_DEFAULTS",
    ] as unknown as PackResolution["priority_order"],
    resolved_values: resolvedValues,
    conflicts,
    warnings,
    resolved_at: input.resolvedAt,
    run_id: input.runId,
    schema_version: "1.0.0",
    extensions: {},
  };
  schemas?.assertValid(RESOLUTION_SCHEMA, result);
  return result;
}

export const createPackResolution = resolvePacks;

export function verifyPackSnapshot(
  pack: PlatformPack | IndustryPack,
  expectedHash: string,
): boolean {
  return sha256(canonicalJson(pack)) === expectedHash;
}

export function detectPackVersionDrift(
  snapshot: { id: string; version: string; snapshot_sha256: string },
  current: PlatformPack | IndustryPack,
): string[] {
  const issues: string[] = [];
  if (snapshot.id !== current.id) issues.push("PACK_ID_DRIFT");
  if (snapshot.version !== current.version) issues.push("PACK_VERSION_DRIFT");
  if (!verifyPackSnapshot(current, snapshot.snapshot_sha256)) issues.push("PACK_CONTENT_DRIFT");
  return issues;
}
