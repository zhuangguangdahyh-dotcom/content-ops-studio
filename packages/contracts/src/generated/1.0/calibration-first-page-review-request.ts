/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationFirstPageReviewRequest {
  review_request_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  calibration_cover_version: string;
  asset_id: string;
  asset_checksum: string;
  gate: "CALIBRATION_G4";
  status: "AWAITING_USER_APPROVAL";
  decision: "PENDING_OPERATOR";
  reviewer_role: "OPERATOR";
  approval_event_created: false;
  style_lock_created: false;
  remaining_pages_created: 0;
  feishu_writes: 0;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
