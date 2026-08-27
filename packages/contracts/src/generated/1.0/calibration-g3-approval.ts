/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG3Approval {
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
  page_count: 6;
  content_package_id: string;
  content_package_ref: string;
  content_package_hash: string;
  content_fingerprint: string;
  quality_report_ref: string;
  quality_report_hash: string;
  review_request_ref: string;
  review_request_hash: string;
  reviewed_source_run_id: string;
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
  visual_rebinding_authorized: true;
  production_workspace_write_eligible: false;
  feishu_writes: 0;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
