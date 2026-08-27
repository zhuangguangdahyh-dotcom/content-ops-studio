/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG4ApprovalV2 {
  approval_evidence_id: string;
  /**
   * Distinguishes canonical Production projects from isolated fictional Calibration projects without widening Production project identifiers.
   */
  project_ref:
    | {
        project_kind: "PRODUCTION_PROJECT";
        project_id: string;
      }
    | {
        project_kind: "CALIBRATION_PROJECT";
        project_id: string;
      };
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  asset_id: string;
  asset_checksum: string;
  g3_approval_id: string;
  g3_approval_ref: string;
  g3_approval_hash: string;
  current_version_qa_binding_id: string;
  g4_review_request_ref: string;
  g4_review_request_hash: string;
  decision: "APPROVE";
  status: "PASSED";
  /**
   * A single explicit human decision bound to one target version.
   */
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
  };
  style_lock_authorized: true;
  remaining_page_production_eligibility: "ELIGIBLE";
  renderer_calls: 0;
  imagegen_calls: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
