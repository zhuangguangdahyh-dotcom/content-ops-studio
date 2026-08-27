/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationStyleLockPreview {
  preview_id: string;
  project_id: string;
  content_id: string;
  source_asset_id: string;
  source_asset_checksum: string;
  status: "PREVIEW_ONLY_PENDING_G4";
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
  creates_style_lock: false;
  creates_project_preference: false;
  creates_industry_rule: false;
  creates_global_preference: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
