/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationCoverRevision {
  revision_id: string;
  project_id: string;
  content_id: string;
  source_review_request_id: string;
  source_cover_version: "FPV-1";
  source_asset_id: string;
  source_asset_checksum: string;
  decision: "REVISE";
  /**
   * @minItems 2
   * @maxItems 2
   */
  revision_classification: {
    [k: string]: unknown;
  } & ["RENDER_ONLY" | "PAGE_COMPOSITION", "RENDER_ONLY" | "PAGE_COMPOSITION"];
  defect_code: "TEXT_BACKGROUND_LOCAL_CONTRAST_FAILURE";
  source_disposition: "QUALITY_DEFECT_REFERENCE";
  source_preserved: true;
  target_cover_version: "FPV-2";
  content_version: "CV-1";
  copy_version: "CV-1";
  visual_plan_version: "VV-1";
  attention_mode: "TYPE_DOMINANT";
  creates_preference: false;
  creates_style_lock: false;
  remaining_pages_created: 0;
  feishu_writes: 0;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
