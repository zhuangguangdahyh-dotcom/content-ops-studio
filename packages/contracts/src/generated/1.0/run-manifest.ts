/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Durable local record of versions, checkpoints, artifacts, and outcome.
 */
export interface RunManifest {
  contract_version: "1.0.0";
  schema_version: "1.0.0";
  run_id: string;
  project_id: string;
  task_type: string;
  run_state:
    | "RUN_CREATED"
    | "RUN_PREFLIGHT"
    | "RUNNING"
    | "AWAITING_APPROVAL"
    | "RUN_PARTIAL"
    | "RUN_BLOCKED"
    | "RUN_CONFLICT"
    | "RUN_FAILED"
    | "RUN_CANCELLED"
    | "RUN_SUCCEEDED"
    | "RUN_RESUMING";
  started_at: string;
  updated_at: string;
  checkpoints: {
    name: string;
    status: "PENDING" | "COMPLETE" | "FAILED";
    recorded_at: string;
  }[];
  artifacts: {
    artifact_type: string;
    relative_path: string;
    version: string;
  }[];
  warnings: string[];
  errors: {
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
  }[];
}
