import { createHash } from "node:crypto";

export interface FingerprintInput {
  painpoint_id: string;
  content_angle: string;
  core_viewpoint: string;
  cover_hook: string;
  content_structure_type: string;
  main_conclusion: string;
}

const FINGERPRINT_KEYS: Array<keyof FingerprintInput> = [
  "painpoint_id",
  "content_angle",
  "core_viewpoint",
  "cover_hook",
  "content_structure_type",
  "main_conclusion",
];

function normalizeValue(value: string, normalizePunctuation = true): string {
  const normalized = value
    .normalize("NFKC")
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .trim()
    .toLowerCase();
  return (normalizePunctuation ? normalized.replace(/[\p{P}\p{S}]+/gu, " ") : normalized)
    .replace(/\s+/gu, " ")
    .trim();
}

export function normalizeFingerprintInput(input: FingerprintInput): FingerprintInput {
  return Object.fromEntries(
    FINGERPRINT_KEYS.map((key) => [key, normalizeValue(input[key], key !== "painpoint_id")]),
  ) as unknown as FingerprintInput;
}

export function calculateDeterministicFingerprint(input: FingerprintInput): string {
  const canonical = JSON.stringify(normalizeFingerprintInput(input));
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}
