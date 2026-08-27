/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Unified deterministic Skill result contract.
 */
export interface TaskResult {
  status:
    "SUCCESS" | "PARTIAL" | "AWAITING_APPROVAL" | "BLOCKED" | "CONFLICT" | "FAILED" | "CANCELLED";
  skill: string;
  run_id: string;
  project_id: string;
  state_before: {
    [k: string]: unknown;
  };
  state_after: {
    [k: string]: unknown;
  };
  created_records: {
    [k: string]: unknown;
  }[];
  updated_records: {
    [k: string]: unknown;
  }[];
  artifacts: {
    [k: string]: unknown;
  }[];
  approval_request: {
    approval_id: string;
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type:
      | "PROJECT"
      | "PAINPOINT_BATCH"
      | "CONTENT"
      | "CONTENT_PACKAGE"
      | "FIRST_PAGE_ASSET"
      | "IMAGE_SET";
    target_id: string;
    target_version: string;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    comment: string;
    source_run_id: string;
    created_at: string;
    deprecated_at?: string | null;
    schema_version: "1.0.0";
  } | null;
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
  next_route: string | null;
}
