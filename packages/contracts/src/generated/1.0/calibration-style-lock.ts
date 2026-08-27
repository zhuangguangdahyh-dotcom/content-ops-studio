/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationStyleLock {
  style_lock_id: string;
  style_lock_version: "SLV-1";
  status: "CREATED";
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: "FPV-2";
  source_asset_id: string;
  source_asset_checksum: string;
  source_approval_id: string;
  source_approval_evidence_id: string;
  /**
   * @minItems 1
   */
  cover_locked_rules: [string, ...string[]];
  /**
   * @minItems 1
   */
  group_shared_rules: [string, ...string[]];
  /**
   * @minItems 1
   */
  content_page_allowed_variations: [string, ...string[]];
  /**
   * @minItems 1
   */
  prohibited_deviations: [string, ...string[]];
  lock_scope: "CALIBRATION_DESIGN_QA_LOGIC";
  universal_template_created: false;
  /**
   * @minItems 6
   * @maxItems 6
   */
  universal_template_exclusions: [
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
  ];
  remaining_page_production_eligibility: "ELIGIBLE";
  remaining_pages_created: 0;
  feishu_writes: 0;
  idempotency_key: string;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  invalidated_at: string | null;
}
