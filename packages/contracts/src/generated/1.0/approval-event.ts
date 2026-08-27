/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * A single explicit human decision bound to one target version.
 */
export interface ApprovalEvent {
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
}
