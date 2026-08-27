/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationStyleLockV2 {
  style_lock_id: string;
  style_lock_version: string;
  status: "ACTIVE";
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
  source_asset_id: string;
  source_asset_checksum: string;
  source_g4_approval_id: string;
  source_g4_approval_ref: string;
  source_g4_approval_hash: string;
  inherited_calibration_status: "CALIBRATION_VALIDATED_V1";
  /**
   * @minItems 6
   */
  validated_systems: [string, string, string, string, string, string, ...string[]];
  /**
   * @minItems 7
   */
  cover_locked_rules: [string, string, string, string, string, string, string, ...string[]];
  /**
   * @minItems 7
   */
  group_shared_rules: [string, string, string, string, string, string, string, ...string[]];
  /**
   * @minItems 7
   */
  content_page_allowed_variations: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    ...string[],
  ];
  /**
   * @minItems 7
   */
  prohibited_deviations: [string, string, string, string, string, string, string, ...string[]];
  historical_style_lock: {
    style_lock_version: "SLV-1";
    status: "HISTORICAL_VALID_FOR_CV1_ONLY";
  };
  universal_template_created: false;
  remaining_page_production_eligibility: "ELIGIBLE";
  remaining_pages_created: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
