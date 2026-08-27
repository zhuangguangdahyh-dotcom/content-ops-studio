/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Traceable safe error with retry guidance.
 */
export interface Error {
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
}
