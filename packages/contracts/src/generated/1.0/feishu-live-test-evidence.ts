/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuLiveTestEvidence {
  evidence_id: string;
  run_id: string;
  provider: "FEISHU";
  region: "CHINA";
  auth_mode: "SELF_BUILT_TENANT_APP";
  test_base_title_hash: string | null;
  test_base_identifier_hash: string | null;
  operations_attempted: number;
  operations_passed: number;
  operations_failed: number;
  tables_verified: number;
  fields_verified: number;
  relations_verified: number;
  views_verified: number;
  records_verified: number;
  idempotent_replay_result: "NOT_RUN" | "PASSED" | "FAILED" | "BLOCKED";
  repair_result: "NOT_RUN" | "PASSED" | "FAILED" | "BLOCKED";
  cleanup_status: "NOT_APPLICABLE" | "MANUAL_REQUIRED" | "COMPLETED_MANUALLY";
  manual_cleanup_required: boolean;
  sensitive_data_redacted: true;
  started_at: string | null;
  completed_at: string | null;
  overall_status: "PASSED" | "FAILED" | "NOT_CONFIGURED" | "NOT_RUN" | "BLOCKED";
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
