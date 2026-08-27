/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * One canonical append-only Journal event in a SHA-256 hash chain.
 */
export interface RunEvent {
  event_id: string;
  sequence: number;
  event_type:
    | "RUN_CREATED"
    | "RUN_STARTED"
    | "STEP_STARTED"
    | "STEP_COMPLETED"
    | "STEP_FAILED"
    | "CHECKPOINT_CREATED"
    | "APPROVAL_REQUESTED"
    | "APPROVAL_RECORDED"
    | "RUN_RESUMING"
    | "LOCK_RECOVERED"
    | "RUN_BLOCKED"
    | "RUN_COMPLETED"
    | "CORRUPTION_DETECTED";
  run_id: string;
  project_id: string;
  workflow_id: string;
  step_id: string | null;
  status:
    "RECORDED" | "RUNNING" | "SUCCESS" | "FAILED" | "BLOCKED" | "AWAITING_APPROVAL" | "CONFLICT";
  payload_summary: {
    [k: string]: unknown;
  };
  artifact_refs: string[];
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
  previous_event_hash: string;
  event_hash: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
