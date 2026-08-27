/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationVisualDirectionSelection {
  selection_id: string;
  candidate_set_id: string;
  candidate_id: string;
  candidate_checksum: string;
  project_id: string;
  content_id: string;
  attention_mode: "TYPE_DOMINANT";
  feedback_class: "PRODUCTION_FEEDBACK";
  scope: "CURRENT_SET";
  purpose: "CALIBRATION";
  selected_by: "OPERATOR";
  formal_asset_reuse_forbidden: true;
  long_term_rule_candidate: false;
  creates_long_term_preference: false;
  creates_g4_approval: false;
  creates_style_lock: false;
  next_visual_plan_version: "VV-1";
  selection_comment: string;
  run_id: string;
  schema_version: "1.0.0";
  selected_at: string;
}
