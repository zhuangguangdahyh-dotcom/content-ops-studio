export const CONTRACT_VERSION = "1.0.0" as const;
export const SCHEMA_VERSION = "1.0.0" as const;
export const PLUGIN_VERSION = "0.2.0" as const;

import type {
  Error as GeneratedError,
  TaskEnvelope as GeneratedTaskEnvelope,
  TaskResult as GeneratedTaskResult,
} from "./generated/1.0/index.js";

export * from "./generated/1.0/index.js";
export * from "./fingerprint.js";
export * from "./migrations/index.js";
export * from "./schema-catalog.js";
export * from "./validation/index.js";
export * from "./workspace-blueprint.js";

export type ResultStatus = GeneratedTaskResult["status"];
export type TaskTargets = GeneratedTaskEnvelope["targets"];
export type StructuredError = GeneratedError;

export class NotImplementedCapabilityError extends Error {
  readonly code = "TOOL_UNAVAILABLE";

  constructor(readonly capability: string) {
    super(`Capability is not implemented in bootstrap: ${capability}`);
    this.name = "NotImplementedCapabilityError";
  }
}

function dateParts(date: Date): { date: string; time: string } {
  const iso = date.toISOString();
  return {
    date: iso.slice(0, 10).replaceAll("-", ""),
    time: iso.slice(11, 19).replaceAll(":", ""),
  };
}

function validateSuffix(suffix: string): string {
  const normalized = suffix.toUpperCase();
  if (!/^[A-Z0-9]{4}$/.test(normalized)) {
    throw new Error("Identifier suffix must contain exactly four ASCII letters or digits.");
  }
  return normalized;
}

export function createProjectId(date: Date, suffix: string): string {
  return `PRJ-${dateParts(date).date}-${validateSuffix(suffix)}`;
}

export function createRunId(date: Date, suffix: string): string {
  const parts = dateParts(date);
  return `RUN-${parts.date}-${parts.time}-${validateSuffix(suffix)}`;
}

export function createApprovalId(date: Date, suffix: string): string {
  return `APR-${dateParts(date).date}-${validateSuffix(suffix)}`;
}

export type RecordKind = "painpoint" | "content" | "rule";

export function createRecordUniqueKey(
  projectId: string,
  kind: RecordKind,
  recordId: string,
): string {
  if (!/^PRJ-[0-9]{8}-[A-Z0-9]{4}$/.test(projectId)) throw new Error("Invalid project ID.");
  const patterns: Record<RecordKind, RegExp> = {
    painpoint: /^P-[0-9]{4}$/,
    content: /^C-[0-9]{4}$/,
    rule: /^R-[0-9]{4}$/,
  };
  if (!patterns[kind].test(recordId)) throw new Error(`Invalid ${kind} record ID.`);
  return `${projectId}::${kind}::${recordId}`;
}

export function countUnicodeCodePoints(value: string): number {
  return Array.from(value).length;
}

export function sanitizeFilename(value: string, fallback = "untitled"): string {
  const normalized = value
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F/\\:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim()
    .replace(/^[.\s-]+|[.\s-]+$/g, "");
  return normalized || fallback;
}

export interface SkillFrontmatter {
  name: string;
  description: string;
}

export function parseSkillFrontmatter(markdown: string): SkillFrontmatter {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match?.[1]) throw new Error("SKILL.md is missing YAML frontmatter.");
  const fields = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 1) continue;
    fields.set(
      line.slice(0, separator).trim(),
      line
        .slice(separator + 1)
        .trim()
        .replace(/^['"]|['"]$/g, ""),
    );
  }
  const name = fields.get("name");
  const description = fields.get("description");
  if (!name || !description) throw new Error("Skill frontmatter requires name and description.");
  return { name, description };
}
