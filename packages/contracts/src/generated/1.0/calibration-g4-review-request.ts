/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG4ReviewRequest {
  review_request_id: string;
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
  content_package_ref: string;
  content_package_hash: string;
  g3_approval_id: string;
  g3_approval_ref: string;
  visual_plan_ref: string;
  visual_plan_hash: string;
  first_page_manifest_ref: string;
  first_page_manifest_hash: string;
  current_version_qa_binding_id: string;
  gate: "CALIBRATION_G4";
  status: "AWAITING_USER_APPROVAL";
  decision: "PENDING_OPERATOR";
  approval_event_created: false;
  style_lock_created: false;
  remaining_pages_created: 0;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
