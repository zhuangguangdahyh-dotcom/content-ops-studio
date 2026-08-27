/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface GroupQualityReport {
  report_id: string;
  project_id: string;
  content_id: string;
  visual_mode:
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY";
  /**
   * @minItems 2
   */
  asset_ids: [string, string, ...string[]];
  system_consistency: {
    status: "PASS" | "FAIL" | "BLOCKED";
    notes: string[];
  };
  subject_consistency: {
    status: "PASS" | "FAIL" | "BLOCKED";
    notes: string[];
  };
  page_difference: {
    status: "PASS" | "FAIL" | "BLOCKED";
    notes: string[];
  };
  near_duplicate_pairs: [string, string][];
  source_reuse_findings: string[];
  contact_sheet_ref: string;
  hard_blocks: string[];
  operator_approval_required: true;
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
