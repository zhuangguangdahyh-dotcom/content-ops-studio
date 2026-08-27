/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG5ReviewRequest {
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
  g4_approval_id: string;
  style_lock_id: string;
  style_lock_version: string;
  production_report_ref: string;
  production_report_hash: string;
  group_qa_score: number;
  /**
   * @maxItems 0
   */
  hard_blocks: [];
  /**
   * @minItems 4
   */
  feedback_classes: [
    "SINGLE_PAGE_REVISION" | "GROUP_VISUAL_REVISION" | "CONTENT_REVISION" | "STYLE_LOCK_REVISION",
    "SINGLE_PAGE_REVISION" | "GROUP_VISUAL_REVISION" | "CONTENT_REVISION" | "STYLE_LOCK_REVISION",
    "SINGLE_PAGE_REVISION" | "GROUP_VISUAL_REVISION" | "CONTENT_REVISION" | "STYLE_LOCK_REVISION",
    "SINGLE_PAGE_REVISION" | "GROUP_VISUAL_REVISION" | "CONTENT_REVISION" | "STYLE_LOCK_REVISION",
    ...(
      "SINGLE_PAGE_REVISION" | "GROUP_VISUAL_REVISION" | "CONTENT_REVISION" | "STYLE_LOCK_REVISION"
    )[],
  ];
  status: "AWAITING_USER_APPROVAL";
  decision: "PENDING_OPERATOR";
  approval_event_created: false;
  final_manifest_created: false;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
