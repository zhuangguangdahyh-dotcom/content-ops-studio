/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Traceable idempotent external-write audit record with redacted summaries.
 */
export interface WriteLog {
  write_id: string;
  run_id: string;
  project_id: string;
  owner_skill: string;
  provider: "FEISHU" | "FILESYSTEM" | "MOCK";
  operation: "CREATE" | "UPDATE" | "UPSERT" | "VERIFY";
  target_type: string;
  target_id: string;
  idempotency_key: string;
  state_before: {
    [k: string]: unknown;
  };
  state_after: {
    [k: string]: unknown;
  };
  request_summary: string;
  response_summary: string;
  verification_status: "NOT_RUN" | "VERIFIED" | "FAILED" | "PARTIAL";
  verification_details: string;
  attempt_number: number;
  retryable: boolean;
  error: {
    code:
      | "INPUT_MISSING"
      | "PROJECT_NOT_RESOLVED"
      | "PROJECT_NOT_CONFIRMED"
      | "WORKSPACE_NOT_READY"
      | "SCHEMA_MISMATCH"
      | "INVALID_STATE"
      | "LOCKED_FIELD"
      | "CONFLICT_DETECTED"
      | "TOOL_UNAVAILABLE"
      | "PERMISSION_DENIED"
      | "INSUFFICIENT_EVIDENCE"
      | "DUPLICATE_RISK"
      | "UNSUPPORTED_CLAIM"
      | "GENERATION_FAILED"
      | "RENDER_FAILED"
      | "QA_FAILED"
      | "SYNC_PARTIAL"
      | "USER_APPROVAL_REQUIRED"
      | "UNSUPPORTED_REQUEST"
      | "APPROVAL_REQUIRED"
      | "APPROVAL_MISMATCH"
      | "APPROVAL_STALE"
      | "INVARIANT_VIOLATION"
      | "OWNER_SKILL_MISMATCH"
      | "MIGRATION_PATH_MISSING";
    message: string;
    retryable: boolean;
    scope: string;
    recommended_action: string;
    extensions: {
      [k: string]: unknown;
    };
  } | null;
  started_at: string;
  completed_at: string | null;
}
