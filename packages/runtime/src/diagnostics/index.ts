import type {
  RuntimeDiagnostic,
  RuntimeEvidence,
} from "../../../contracts/src/generated/1.0/index.js";
import type { CapabilityRecord } from "../capabilities/index.js";
import {
  evaluateRuntimeSupport,
  parseRuntimeVersion,
  type RuntimeSupportPolicy,
} from "../runtime-policy/index.js";
import type { RuntimeMode } from "../types.js";

export interface DiagnosticInput {
  id: string;
  mode: RuntimeMode;
  checkedAt: string;
  currentRuntimeVersion: string;
  runtimePolicy: RuntimeSupportPolicy;
  runtimeEvidence: RuntimeEvidence[];
  crossPlatformCiEvidence: RuntimeDiagnostic["cross_platform_ci_evidence"];
  projectHomeStatus: RuntimeDiagnostic["project_home_status"];
  schemaReady: boolean;
  packWarnings: string[];
  capabilities: CapabilityRecord[];
  gitStatus: RuntimeDiagnostic["git_status"];
  remoteStatus: RuntimeDiagnostic["remote_status"];
}

export function buildPolicyRuntimeEvidence(
  policy: RuntimeSupportPolicy,
  checkedAt: string,
  packageManagerVersion: string,
): RuntimeEvidence[] {
  const base = {
    runtime_name: "node" as const,
    runtime_range: policy.primaryRuntime.range,
    commands: [],
    command_results: [],
    environment: {
      package_manager: "pnpm" as const,
      package_manager_version: packageManagerVersion,
      ci: false,
    },
    platform: process.platform,
    architecture: process.arch,
    started_at: checkedAt,
    completed_at: checkedAt,
    evidence_source: "POLICY" as const,
    report_path: "plugins/content-ops-studio/config/runtime-support-policy.json",
    schema_version: "1.0.0" as const,
    extensions: {},
  };
  return [
    {
      ...base,
      evidence_id: "RTE-NODE20-POLICY-CURRENT",
      runtime_version: "v20.0.0",
      runtime_major: 20,
      support_policy_status: "UPSTREAM_EOL",
      policy_reason_code: "UPSTREAM_EOL",
      execution_status: "NOT_REQUIRED",
      limitations: ["Node 20 is EOL and outside the V0.1.0 support policy."],
    },
    ...[22, 26].map((major): RuntimeEvidence => ({
      ...base,
      evidence_id: `RTE-NODE${major}-POLICY-CURRENT`,
      runtime_version: `v${major}.0.0`,
      runtime_major: major,
      support_policy_status: "UNCLAIMED",
      policy_reason_code: "NOT_VALIDATED_BY_THIS_PROJECT",
      execution_status: "NOT_RUN",
      limitations: ["This project makes no compatibility claim for this Runtime major."],
    })),
  ];
}

function executionForMajor(evidence: RuntimeEvidence[], major: number) {
  return (
    evidence.find((item) => item.runtime_major === major)?.execution_status ??
    (major === 20 ? "NOT_REQUIRED" : "NOT_RUN")
  );
}

export function buildRuntimeDiagnostic(input: DiagnosticInput): RuntimeDiagnostic {
  const current = parseRuntimeVersion(input.currentRuntimeVersion);
  const runtimeEvaluation = evaluateRuntimeSupport(input.runtimePolicy, current.version);
  const currentEvidence = input.runtimeEvidence.find(
    (evidence) =>
      evidence.runtime_major === current.major && evidence.execution_status === "PASSED",
  );
  const localRuntimeReady =
    runtimeEvaluation.matches && input.schemaReady && Boolean(currentEvidence);
  const productionBlocked = input.capabilities.some((capability) =>
    ["MOCK_ONLY", "NOT_IMPLEMENTED", "UNAVAILABLE", "BLOCKED", "UNKNOWN"].includes(
      capability.status,
    ),
  );
  const blockingErrors = [
    ...(runtimeEvaluation.matches ? [] : [runtimeEvaluation.status]),
    ...(input.schemaReady ? [] : ["SCHEMA_REGISTRY_NOT_READY"]),
    ...(currentEvidence ? [] : ["RUNTIME_EVIDENCE_MISSING"]),
    ...(input.mode === "PRODUCTION" && productionBlocked
      ? ["PRODUCTION_INTEGRATIONS_NOT_IMPLEMENTED"]
      : []),
  ];
  const warnings = [
    ...input.packWarnings,
    ...(productionBlocked ? ["Production integrations are not implemented."] : []),
    ...(input.crossPlatformCiEvidence === "UNVERIFIED"
      ? ["Cross-platform CI has not run on a configured remote."]
      : []),
    ...input.capabilities
      .filter((capability) => capability.status === "MOCK_ONLY")
      .map((capability) => `${capability.capability} is MOCK_ONLY.`),
  ];
  return {
    diagnostic_id: input.id,
    runtime_mode: input.mode,
    current_runtime: {
      name: "node",
      version: current.version,
      major: current.major,
      platform: process.platform,
      architecture: process.arch,
    },
    runtime_support_policy: {
      policy_version: input.runtimePolicy.policyVersion as "1.0.0",
      runtime_name: input.runtimePolicy.primaryRuntime.name,
      supported_range: input.runtimePolicy.primaryRuntime.range as ">=24 <25",
      primary_major: input.runtimePolicy.primaryRuntime.major as 24,
      support_level: input.runtimePolicy.primaryRuntime.supportLevel,
    },
    runtime_evidence: input.runtimeEvidence.map(
      ({
        evidence_id,
        runtime_name,
        runtime_version,
        runtime_major,
        support_policy_status,
        policy_reason_code,
        execution_status,
        evidence_source,
        report_path,
        limitations,
      }) => ({
        evidence_id,
        runtime_name,
        runtime_version,
        runtime_major,
        support_policy_status,
        policy_reason_code,
        execution_status,
        evidence_source,
        report_path,
        limitations,
      }),
    ) as RuntimeDiagnostic["runtime_evidence"],
    supported_runtime_match: runtimeEvaluation.matches,
    upstream_lifecycle_snapshot: [
      {
        runtime_name: "node",
        runtime_major: 20,
        upstream_status: "EOL",
        project_status: "UPSTREAM_EOL",
        execution_status: executionForMajor(input.runtimeEvidence, 20),
      },
      {
        runtime_name: "node",
        runtime_major: 22,
        upstream_status: "LTS",
        project_status: "UNCLAIMED",
        execution_status: executionForMajor(input.runtimeEvidence, 22),
      },
      {
        runtime_name: "node",
        runtime_major: 24,
        upstream_status: "LTS",
        project_status: "SUPPORTED",
        execution_status: executionForMajor(input.runtimeEvidence, 24),
      },
      {
        runtime_name: "node",
        runtime_major: 26,
        upstream_status: "CURRENT",
        project_status: "UNCLAIMED",
        execution_status: executionForMajor(input.runtimeEvidence, 26),
      },
    ],
    local_runtime_readiness: localRuntimeReady ? "READY" : "BLOCKED",
    production_integration_readiness: productionBlocked ? "BLOCKED" : "READY",
    cross_platform_ci_evidence: input.crossPlatformCiEvidence,
    project_home_status: input.projectHomeStatus,
    schema_status: input.schemaReady ? "READY" : "BLOCKED",
    pack_status: input.packWarnings.length ? "READY_WITH_WARNINGS" : "READY",
    capabilities: input.capabilities,
    adapters: input.capabilities.filter((capability) => capability.capability.includes("adapter")),
    git_status: input.gitStatus,
    remote_status: input.remoteStatus,
    warnings,
    blocking_errors: blockingErrors,
    overall_status:
      blockingErrors.length > 0 ? "BLOCKED" : warnings.length > 0 ? "READY_WITH_WARNINGS" : "READY",
    checked_at: input.checkedAt,
    schema_version: "1.0.0",
    extensions: {
      runtime_policy_snapshot_date: input.runtimePolicy.upstreamStatusSnapshotDate,
    },
  };
}
