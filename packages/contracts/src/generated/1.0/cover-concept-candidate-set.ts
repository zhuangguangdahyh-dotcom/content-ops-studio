/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverConceptCandidateSet {
  candidate_set_id: string;
  project_id: string;
  content_id: string;
  account_goal:
    | "LEAD_GENERATION"
    | "BRAND_BUILDING"
    | "KNOWLEDGE_EDUCATION"
    | "PRODUCT_SALES"
    | "COMMUNITY"
    | "PORTFOLIO_SHOWCASE";
  status: "AWAITING_USER_SELECTION";
  /**
   * @minItems 3
   * @maxItems 3
   */
  candidates: [
    {
      candidate_id: string;
      cover_copy_package_id: string;
      cover_primary_hook: string;
      cover_secondary_line: string;
      conversion_strategy:
        | "TARGET_AUDIENCE_FIRST"
        | "PAINPOINT_FIRST"
        | "VALUE_FIRST"
        | "RISK_FIRST"
        | "DECISION_FIRST"
        | "RESULT_FIRST"
        | "CONTRAST_FIRST"
        | "QUESTION_FIRST";
      cover_objective:
        | "AUDIENCE_FILTER"
        | "PAINPOINT_DIRECT"
        | "VALUE_DIRECT"
        | "RISK_WARNING"
        | "DECISION_CHECKLIST"
        | "RESULT_EVIDENCE"
        | "BRAND_STATEMENT";
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      background_semantic_role:
        | "DIRECT_INDUSTRY_SCENE"
        | "DIRECT_BUSINESS_SCENE"
        | "DIRECT_CUSTOMER_SCENE"
        | "DIRECT_PAINPOINT_SCENE"
        | "DIRECT_VALUE_SCENE"
        | "PROJECT_ASSET"
        | "SUBJECT_PERSON"
        | "PRODUCT_SUBJECT"
        | "SPACE_SUBJECT"
        | "EVIDENCE_ASSET"
        | "ABSTRACT_SEMANTIC"
        | "DECORATIVE_ONLY";
      composition_summary: string;
      text_to_image_ratio: string;
      full_preview_ref: string;
      thumbnail_310_ref: string;
      thumbnail_186_ref: string;
      click_clarity_report_id: string;
      semantic_relevance_report_id: string;
      image_quality_report_id: string;
      click_clarity_score: number;
      semantic_relevance_score: number;
      image_quality_score: number;
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      main_strength: string;
      main_risk: string;
      host_imagegen: boolean;
      renderer: true;
    },
    {
      candidate_id: string;
      cover_copy_package_id: string;
      cover_primary_hook: string;
      cover_secondary_line: string;
      conversion_strategy:
        | "TARGET_AUDIENCE_FIRST"
        | "PAINPOINT_FIRST"
        | "VALUE_FIRST"
        | "RISK_FIRST"
        | "DECISION_FIRST"
        | "RESULT_FIRST"
        | "CONTRAST_FIRST"
        | "QUESTION_FIRST";
      cover_objective:
        | "AUDIENCE_FILTER"
        | "PAINPOINT_DIRECT"
        | "VALUE_DIRECT"
        | "RISK_WARNING"
        | "DECISION_CHECKLIST"
        | "RESULT_EVIDENCE"
        | "BRAND_STATEMENT";
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      background_semantic_role:
        | "DIRECT_INDUSTRY_SCENE"
        | "DIRECT_BUSINESS_SCENE"
        | "DIRECT_CUSTOMER_SCENE"
        | "DIRECT_PAINPOINT_SCENE"
        | "DIRECT_VALUE_SCENE"
        | "PROJECT_ASSET"
        | "SUBJECT_PERSON"
        | "PRODUCT_SUBJECT"
        | "SPACE_SUBJECT"
        | "EVIDENCE_ASSET"
        | "ABSTRACT_SEMANTIC"
        | "DECORATIVE_ONLY";
      composition_summary: string;
      text_to_image_ratio: string;
      full_preview_ref: string;
      thumbnail_310_ref: string;
      thumbnail_186_ref: string;
      click_clarity_report_id: string;
      semantic_relevance_report_id: string;
      image_quality_report_id: string;
      click_clarity_score: number;
      semantic_relevance_score: number;
      image_quality_score: number;
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      main_strength: string;
      main_risk: string;
      host_imagegen: boolean;
      renderer: true;
    },
    {
      candidate_id: string;
      cover_copy_package_id: string;
      cover_primary_hook: string;
      cover_secondary_line: string;
      conversion_strategy:
        | "TARGET_AUDIENCE_FIRST"
        | "PAINPOINT_FIRST"
        | "VALUE_FIRST"
        | "RISK_FIRST"
        | "DECISION_FIRST"
        | "RESULT_FIRST"
        | "CONTRAST_FIRST"
        | "QUESTION_FIRST";
      cover_objective:
        | "AUDIENCE_FILTER"
        | "PAINPOINT_DIRECT"
        | "VALUE_DIRECT"
        | "RISK_WARNING"
        | "DECISION_CHECKLIST"
        | "RESULT_EVIDENCE"
        | "BRAND_STATEMENT";
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      background_semantic_role:
        | "DIRECT_INDUSTRY_SCENE"
        | "DIRECT_BUSINESS_SCENE"
        | "DIRECT_CUSTOMER_SCENE"
        | "DIRECT_PAINPOINT_SCENE"
        | "DIRECT_VALUE_SCENE"
        | "PROJECT_ASSET"
        | "SUBJECT_PERSON"
        | "PRODUCT_SUBJECT"
        | "SPACE_SUBJECT"
        | "EVIDENCE_ASSET"
        | "ABSTRACT_SEMANTIC"
        | "DECORATIVE_ONLY";
      composition_summary: string;
      text_to_image_ratio: string;
      full_preview_ref: string;
      thumbnail_310_ref: string;
      thumbnail_186_ref: string;
      click_clarity_report_id: string;
      semantic_relevance_report_id: string;
      image_quality_report_id: string;
      click_clarity_score: number;
      semantic_relevance_score: number;
      image_quality_score: number;
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      main_strength: string;
      main_risk: string;
      host_imagegen: boolean;
      renderer: true;
    },
  ];
  full_contact_sheet_ref: string;
  thumbnail_310_contact_sheet_ref: string;
  thumbnail_186_contact_sheet_ref: string;
  material_difference_verified: true;
  formal_fpv_count: 0;
  g4_count: 0;
  style_lock_count: 0;
  feishu_write_count: 0;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
