/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualFeedbackEvent {
  event_id: string;
  project_id: string;
  content_id: string | null;
  feedback_class:
    "QUALITY_DEFECT" | "PRODUCTION_FEEDBACK" | "VISUAL_PREFERENCE" | "PROJECT_OR_DOMAIN_CONSTRAINT";
  scope:
    | "CURRENT_ELEMENT"
    | "CURRENT_PAGE"
    | "CURRENT_SET"
    | "CURRENT_PROJECT"
    | "INDUSTRY_PACK"
    | "GLOBAL_USER_PREFERENCE";
  target_type: "ELEMENT" | "PAGE" | "SET" | "PROJECT" | "INDUSTRY_PACK" | "GLOBAL";
  target_id: string;
  statement: string;
  is_tool_or_system_defect: boolean;
  long_term_rule_candidate?: boolean;
  creates_long_term_rule: false;
  source: "OPERATOR_FEEDBACK";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
