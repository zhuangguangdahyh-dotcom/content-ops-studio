import { readFile } from "node:fs/promises";
import type { RuntimeEvidence } from "../../../contracts/src/generated/1.0/index.js";
import { RuntimeFailure } from "../types.js";

export type RuntimeSupportStatus =
  "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";

export interface RuntimeSupportPolicy {
  policyVersion: string;
  pluginVersion: string;
  decisionDate: string;
  upstreamStatusSnapshotDate: string;
  primaryRuntime: {
    name: "node";
    major: number;
    range: string;
    supportLevel: "SUPPORTED_AND_VERIFIED";
    releaseChannel: "LTS";
  };
  unsupportedRuntimes: Array<{
    name: "node";
    range?: string;
    major?: number;
    reasonCode: "OUTSIDE_PROJECT_SUPPORT_POLICY" | "UPSTREAM_EOL";
  }>;
  unclaimedRuntimes: Array<{
    name: "node";
    major: number;
    reasonCode: "NOT_VALIDATED_BY_THIS_PROJECT";
  }>;
  requiredEvidenceCommands: string[];
}

export interface ParsedRuntimeVersion {
  version: string;
  major: number;
  minor: number;
  patch: number;
}

export interface RuntimeSupportEvaluation {
  status: RuntimeSupportStatus;
  reasonCode:
    | "PROJECT_SUPPORTED_RUNTIME"
    | "OUTSIDE_PROJECT_SUPPORT_POLICY"
    | "NOT_VALIDATED_BY_THIS_PROJECT"
    | "PROJECT_DEPRECATED_RUNTIME"
    | "UPSTREAM_EOL";
  supportedRange: string;
  matches: boolean;
}

export const EXPECTED_NODE_MAJOR = 24;
export const EXPECTED_NODE_RANGE = ">=24 <25";
export const DEFAULT_RUNTIME_SUPPORT_POLICY: RuntimeSupportPolicy = {
  policyVersion: "1.0.0",
  pluginVersion: "0.2.0",
  decisionDate: "2026-08-24",
  upstreamStatusSnapshotDate: "2026-08-24",
  primaryRuntime: {
    name: "node",
    major: EXPECTED_NODE_MAJOR,
    range: EXPECTED_NODE_RANGE,
    supportLevel: "SUPPORTED_AND_VERIFIED",
    releaseChannel: "LTS",
  },
  unsupportedRuntimes: [
    { name: "node", range: "<24", reasonCode: "OUTSIDE_PROJECT_SUPPORT_POLICY" },
    { name: "node", major: 20, reasonCode: "UPSTREAM_EOL" },
  ],
  unclaimedRuntimes: [22, 25, 26].map((major) => ({
    name: "node" as const,
    major,
    reasonCode: "NOT_VALIDATED_BY_THIS_PROJECT" as const,
  })),
  requiredEvidenceCommands: [
    "pnpm contracts:check-generated",
    "pnpm contracts:validate",
    "pnpm runtime-policy:validate",
    "pnpm state:validate",
    "pnpm runtime:test",
    "pnpm recovery:test",
    "pnpm scan:secrets",
  ],
};

export function parseRuntimeVersion(value: string): ParsedRuntimeVersion {
  const match = value.match(/^v?(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$/);
  if (!match)
    throw new RuntimeFailure(
      "RUNTIME_VERSION_MISMATCH",
      "Runtime version is not strict SemVer.",
      2,
    );
  const major = Number(match[1]);
  const minor = Number(match[2]);
  const patch = Number(match[3]);
  return { version: `v${major}.${minor}.${patch}`, major, minor, patch };
}

export function validateRuntimePolicy(policy: RuntimeSupportPolicy): string[] {
  const issues: string[] = [];
  if (policy.policyVersion !== "1.0.0") issues.push("POLICY_VERSION_MISMATCH");
  if (policy.pluginVersion !== "0.2.0") issues.push("PLUGIN_VERSION_MISMATCH");
  if (policy.primaryRuntime.name !== "node") issues.push("PRIMARY_RUNTIME_INVALID");
  if (policy.primaryRuntime.major !== EXPECTED_NODE_MAJOR) issues.push("PRIMARY_MAJOR_MISMATCH");
  if (policy.primaryRuntime.range !== EXPECTED_NODE_RANGE) issues.push("SUPPORTED_RANGE_MISMATCH");
  if (policy.primaryRuntime.supportLevel !== "SUPPORTED_AND_VERIFIED")
    issues.push("SUPPORT_LEVEL_INVALID");
  if (policy.primaryRuntime.releaseChannel !== "LTS") issues.push("RELEASE_CHANNEL_INVALID");
  if (
    policy.unclaimedRuntimes.some((entry) => entry.major === policy.primaryRuntime.major) ||
    policy.unsupportedRuntimes.some((entry) => entry.major === policy.primaryRuntime.major)
  )
    issues.push("POLICY_CONTRADICTION");
  const unclaimedMajors = policy.unclaimedRuntimes.map((entry) => entry.major);
  if (new Set(unclaimedMajors).size !== unclaimedMajors.length)
    issues.push("DUPLICATE_UNCLAIMED_RUNTIME");
  if (
    !policy.unsupportedRuntimes.some(
      (entry) => entry.major === 20 && entry.reasonCode === "UPSTREAM_EOL",
    )
  )
    issues.push("NODE20_EOL_STATUS_MISSING");
  if (policy.requiredEvidenceCommands.length === 0) issues.push("EVIDENCE_COMMANDS_MISSING");
  return issues;
}

export function assertRuntimePolicy(policy: RuntimeSupportPolicy): void {
  const issues = validateRuntimePolicy(policy);
  if (issues.length) throw new RuntimeFailure("RUNTIME_POLICY_INVALID", issues.join("; "), 2);
}

export async function loadRuntimeSupportPolicy(file: string): Promise<RuntimeSupportPolicy> {
  let value: RuntimeSupportPolicy;
  try {
    value = JSON.parse(await readFile(file, "utf8")) as RuntimeSupportPolicy;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT")
      throw new RuntimeFailure("RUNTIME_POLICY_INVALID", "Runtime policy is missing.", 2);
    throw error;
  }
  assertRuntimePolicy(value);
  return value;
}

export function evaluateRuntimeSupport(
  policy: RuntimeSupportPolicy,
  runtimeVersion: string,
): RuntimeSupportEvaluation {
  assertRuntimePolicy(policy);
  const runtime = parseRuntimeVersion(runtimeVersion);
  if (runtime.major === policy.primaryRuntime.major)
    return {
      status: "SUPPORTED",
      reasonCode: "PROJECT_SUPPORTED_RUNTIME",
      supportedRange: policy.primaryRuntime.range,
      matches: true,
    };
  const unclaimed = policy.unclaimedRuntimes.find((entry) => entry.major === runtime.major);
  if (unclaimed)
    return {
      status: "UNCLAIMED",
      reasonCode: unclaimed.reasonCode,
      supportedRange: policy.primaryRuntime.range,
      matches: false,
    };
  const explicit = policy.unsupportedRuntimes.find((entry) => entry.major === runtime.major);
  return {
    status: explicit?.reasonCode === "UPSTREAM_EOL" ? "UPSTREAM_EOL" : "UNSUPPORTED",
    reasonCode: explicit?.reasonCode ?? "OUTSIDE_PROJECT_SUPPORT_POLICY",
    supportedRange: policy.primaryRuntime.range,
    matches: false,
  };
}

export function assertRuntimeSupported(
  policy: RuntimeSupportPolicy,
  runtimeVersion: string,
  options: { enforceSupportedRuntime?: boolean; allowUnclaimedRuntime?: boolean } = {},
): RuntimeSupportEvaluation {
  const evaluation = evaluateRuntimeSupport(policy, runtimeVersion);
  if (options.enforceSupportedRuntime === false) return evaluation;
  if (evaluation.status === "SUPPORTED") return evaluation;
  if (evaluation.status === "UNCLAIMED" && options.allowUnclaimedRuntime) return evaluation;
  if (evaluation.status === "UNCLAIMED")
    throw new RuntimeFailure(
      "UNCLAIMED_RUNTIME",
      `Runtime ${runtimeVersion} is not claimed by this project.`,
      2,
    );
  throw new RuntimeFailure(
    "UNSUPPORTED_RUNTIME",
    `Runtime ${runtimeVersion} is outside project support policy.`,
    2,
  );
}

export function validateRuntimeEvidence(
  evidence: RuntimeEvidence,
  policy: RuntimeSupportPolicy,
): string[] {
  const issues: string[] = [];
  let parsed: ParsedRuntimeVersion;
  try {
    parsed = parseRuntimeVersion(evidence.runtime_version);
  } catch {
    return ["RUNTIME_VERSION_MISMATCH"];
  }
  if (parsed.major !== evidence.runtime_major) issues.push("RUNTIME_MAJOR_MISMATCH");
  const evaluation = evaluateRuntimeSupport(policy, evidence.runtime_version);
  if (evaluation.status !== evidence.support_policy_status)
    issues.push("EVIDENCE_POLICY_STATUS_MISMATCH");
  if (evidence.runtime_range !== policy.primaryRuntime.range)
    issues.push("EVIDENCE_RUNTIME_RANGE_MISMATCH");
  if (evidence.execution_status === "PASSED") {
    if (evidence.command_results.length === 0) issues.push("PASSED_RESULTS_MISSING");
    if (
      evidence.command_results.some(
        (result) => result.status !== "PASSED" || result.exit_code !== 0,
      )
    )
      issues.push("PASSED_CONTAINS_FAILED_COMMAND");
    const commands = new Set(evidence.commands);
    for (const command of policy.requiredEvidenceCommands)
      if (!commands.has(command)) issues.push(`REQUIRED_COMMAND_MISSING:${command}`);
  }
  return issues;
}

export function assertRuntimeEvidence(
  evidence: RuntimeEvidence,
  policy: RuntimeSupportPolicy,
): void {
  const issues = validateRuntimeEvidence(evidence, policy);
  if (issues.length) throw new RuntimeFailure("RUNTIME_EVIDENCE_MISSING", issues.join("; "), 2);
}
