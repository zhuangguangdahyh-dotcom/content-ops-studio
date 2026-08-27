/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Complete deterministic transition evaluation input.
 */
export interface StateTransitionRequest {
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
  trigger: string;
  actor_skill: string;
  project_id: string;
  target_type:
    "PROJECT" | "PAINPOINT_BATCH" | "PAINPOINT" | "CONTENT" | "IMAGE_SET" | "RULE" | "RUN";
  target_id: string;
  target_version: string;
  approval_event: {
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
  current_context: {
    [k: string]: unknown;
  };
  available_artifacts: {
    artifact_type: string;
    artifact_id: string;
    version: string;
    status: string;
  }[];
  requested_at: string;
  run_id: string;
  schema_version: "1.0.0";
}
