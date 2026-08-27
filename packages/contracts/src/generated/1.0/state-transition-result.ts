/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Stable pure result for a state transition evaluation.
 */
export interface StateTransitionResult {
  allowed: boolean;
  machine:
    | "project-status"
    | "config-confirmation"
    | "painpoint-review"
    | "painpoint-contentization"
    | "content-status"
    | "image-status"
    | "first-page-approval"
    | "final-approval"
    | "sync-status"
    | "rule-status"
    | "run-status";
  from_state: string;
  to_state: string;
  next_state: string | null;
  error_code:
    | (
        | "INVALID_TRANSITION"
        | "APPROVAL_REQUIRED"
        | "APPROVAL_MISMATCH"
        | "APPROVAL_STALE"
        | "INVARIANT_VIOLATION"
        | "OWNER_SKILL_MISMATCH"
        | "TERMINAL_STATE"
      )
    | null;
  reasons: string[];
  required_gate:
    ("PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET") | null;
  invalidated_approvals: string[];
  invalidated_artifacts: string[];
  required_actions: string[];
  evaluated_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
