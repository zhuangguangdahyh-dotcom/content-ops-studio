/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Truthful Runtime support, evidence, local readiness, and independent production-integration report.
 */
export interface RuntimeDiagnostic {
  diagnostic_id: string;
  runtime_mode: "MOCK" | "DRY_RUN" | "PRODUCTION";
  current_runtime: {
    name: "node";
    version: string;
    major: number;
    platform: string;
    architecture: string;
  };
  runtime_support_policy: {
    policy_version: "1.0.0";
    runtime_name: "node";
    supported_range: ">=24 <25";
    primary_major: 24;
    support_level: "SUPPORTED_AND_VERIFIED";
  };
  /**
   * @minItems 1
   */
  runtime_evidence: [
    {
      evidence_id: string;
      runtime_name: "node";
      runtime_version: string;
      runtime_major: number;
      support_policy_status:
        "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";
      policy_reason_code:
        | "PROJECT_SUPPORTED_RUNTIME"
        | "OUTSIDE_PROJECT_SUPPORT_POLICY"
        | "NOT_VALIDATED_BY_THIS_PROJECT"
        | "PROJECT_DEPRECATED_RUNTIME"
        | "UPSTREAM_EOL";
      execution_status: "NOT_RUN" | "PASSED" | "FAILED" | "NOT_AVAILABLE" | "NOT_REQUIRED";
      evidence_source: "LOCAL" | "CI" | "HISTORICAL" | "POLICY" | "TEST";
      report_path: string;
      limitations: string[];
    },
    ...{
      evidence_id: string;
      runtime_name: "node";
      runtime_version: string;
      runtime_major: number;
      support_policy_status:
        "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";
      policy_reason_code:
        | "PROJECT_SUPPORTED_RUNTIME"
        | "OUTSIDE_PROJECT_SUPPORT_POLICY"
        | "NOT_VALIDATED_BY_THIS_PROJECT"
        | "PROJECT_DEPRECATED_RUNTIME"
        | "UPSTREAM_EOL";
      execution_status: "NOT_RUN" | "PASSED" | "FAILED" | "NOT_AVAILABLE" | "NOT_REQUIRED";
      evidence_source: "LOCAL" | "CI" | "HISTORICAL" | "POLICY" | "TEST";
      report_path: string;
      limitations: string[];
    }[],
  ];
  supported_runtime_match: boolean;
  /**
   * @minItems 1
   */
  upstream_lifecycle_snapshot: [
    {
      runtime_name: "node";
      runtime_major: number;
      upstream_status: "LTS" | "CURRENT" | "EOL" | "NOT_SNAPSHOTTED";
      project_status: "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";
      execution_status: "NOT_RUN" | "PASSED" | "FAILED" | "NOT_AVAILABLE" | "NOT_REQUIRED";
    },
    ...{
      runtime_name: "node";
      runtime_major: number;
      upstream_status: "LTS" | "CURRENT" | "EOL" | "NOT_SNAPSHOTTED";
      project_status: "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";
      execution_status: "NOT_RUN" | "PASSED" | "FAILED" | "NOT_AVAILABLE" | "NOT_REQUIRED";
    }[],
  ];
  local_runtime_readiness: "READY" | "BLOCKED";
  production_integration_readiness: "READY" | "BLOCKED";
  cross_platform_ci_evidence: "PASSED" | "FAILED" | "UNVERIFIED";
  project_home_status: "NOT_PROVIDED" | "NOT_CREATED" | "READY" | "INVALID" | "UNAVAILABLE";
  schema_status: "READY" | "READY_WITH_WARNINGS" | "BLOCKED";
  pack_status: "READY" | "READY_WITH_WARNINGS" | "BLOCKED";
  capabilities: {
    capability: string;
    provider: string;
    status: "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
    limitations: string[];
    last_verified_at: string;
    blocking_reason: string | null;
  }[];
  adapters: {
    capability: string;
    provider: string;
    status: "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
    limitations: string[];
    last_verified_at: string;
    blocking_reason: string | null;
  }[];
  git_status: "COMMITTED" | "UNBORN_WORKING_TREE" | "DIRTY" | "UNAVAILABLE";
  remote_status: "CONFIGURED" | "NOT_CONFIGURED" | "UNAVAILABLE";
  warnings: string[];
  blocking_errors: string[];
  overall_status: "READY" | "READY_WITH_WARNINGS" | "BLOCKED";
  checked_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
