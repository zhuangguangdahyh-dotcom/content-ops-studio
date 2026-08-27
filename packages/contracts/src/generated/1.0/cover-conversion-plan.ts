/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverConversionPlan {
  cover_conversion_plan_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  platform: "XIAOHONGSHU";
  account_goal:
    | "LEAD_GENERATION"
    | "BRAND_BUILDING"
    | "KNOWLEDGE_EDUCATION"
    | "PRODUCT_SALES"
    | "COMMUNITY"
    | "PORTFOLIO_SHOWCASE";
  cover_objective:
    | "AUDIENCE_FILTER"
    | "PAINPOINT_DIRECT"
    | "VALUE_DIRECT"
    | "RISK_WARNING"
    | "DECISION_CHECKLIST"
    | "RESULT_EVIDENCE"
    | "BRAND_STATEMENT";
  subject: string;
  audience: string;
  painpoint: string;
  content_value: string;
  decision_stage: string;
  publish_title: string;
  page_1_content_copy: string;
  /**
   * @minItems 1
   * @maxItems 8
   */
  strategy_candidates:
    | [
        | "TARGET_AUDIENCE_FIRST"
        | "PAINPOINT_FIRST"
        | "VALUE_FIRST"
        | "RISK_FIRST"
        | "DECISION_FIRST"
        | "RESULT_FIRST"
        | "CONTRAST_FIRST"
        | "QUESTION_FIRST",
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ]
    | [
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
        (
          | "TARGET_AUDIENCE_FIRST"
          | "PAINPOINT_FIRST"
          | "VALUE_FIRST"
          | "RISK_FIRST"
          | "DECISION_FIRST"
          | "RESULT_FIRST"
          | "CONTRAST_FIRST"
          | "QUESTION_FIRST"
        ),
      ];
  selected_strategy:
    | "TARGET_AUDIENCE_FIRST"
    | "PAINPOINT_FIRST"
    | "VALUE_FIRST"
    | "RISK_FIRST"
    | "DECISION_FIRST"
    | "RESULT_FIRST"
    | "CONTRAST_FIRST"
    | "QUESTION_FIRST";
  primary_hook_constraints: {
    recommended_min_visible_characters: number;
    recommended_max_visible_characters: number;
    hard_max_visible_characters: number;
    max_lines: number;
  };
  secondary_line_constraints: {
    recommended_min_visible_characters: number;
    recommended_max_visible_characters: number;
    hard_max_visible_characters: number;
    max_lines: number;
  };
  thumbnail_constraints: {
    /**
     * @minItems 2
     * @maxItems 2
     */
    targets: ["310x414" | "186x248", "310x414" | "186x248"];
    primary_min_effective_font_px: number;
    secondary_min_effective_font_px: number;
    primary_max_lines: number;
  };
  project_visual_profile_version: string | null;
  global_visual_preference_version: string;
  industry_pack_version: string;
  platform_pack_version: string;
  ambiguities: string[];
  /**
   * @maxItems 1
   */
  blocking_questions: [] | [string];
  ready: boolean;
  plan_hash: string;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
