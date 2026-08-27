/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Version-agnostic execution evidence with support policy status kept separate from execution status.
 */
export type RuntimeEvidence = {
  [k: string]: unknown;
} & {
  evidence_id: string;
  runtime_name: "node";
  runtime_version: string;
  runtime_major: number;
  runtime_range: string;
  support_policy_status: "SUPPORTED" | "UNSUPPORTED" | "UNCLAIMED" | "DEPRECATED" | "UPSTREAM_EOL";
  policy_reason_code:
    | "PROJECT_SUPPORTED_RUNTIME"
    | "OUTSIDE_PROJECT_SUPPORT_POLICY"
    | "NOT_VALIDATED_BY_THIS_PROJECT"
    | "PROJECT_DEPRECATED_RUNTIME"
    | "UPSTREAM_EOL";
  execution_status: "NOT_RUN" | "PASSED" | "FAILED" | "NOT_AVAILABLE" | "NOT_REQUIRED";
  commands: string[];
  command_results: {
    command: string;
    status: "PASSED" | "FAILED";
    exit_code: number;
  }[];
  environment: {
    package_manager: "pnpm";
    package_manager_version: string;
    ci: boolean;
  };
  platform: string;
  architecture: string;
  started_at: string;
  completed_at: string;
  evidence_source: "LOCAL" | "CI" | "HISTORICAL" | "POLICY" | "TEST";
  report_path: string;
  limitations: string[];
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
