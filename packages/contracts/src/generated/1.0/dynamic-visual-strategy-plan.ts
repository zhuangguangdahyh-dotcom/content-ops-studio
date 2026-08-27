/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface DynamicVisualStrategyPlan {
  strategy_plan_id: string;
  project_id: string;
  content_id: string;
  project_profile_version: string;
  profile_maturity_status: "COLD_START" | "LEARNING" | "MATURE" | "REVIEW_REQUIRED";
  synthesis_status: "PLANNED" | "BLOCKED_REVIEW_REQUIRED";
  strategy_summary: string;
  decision_precedence: string[];
  /**
   * @minItems 1
   */
  page_strategies: [
    {
      page_number: number;
      page_role: string;
      page_design_intent?:
        | "COVER_ENTRY"
        | "CONTENT_EDITORIAL"
        | "EVIDENCE_PAGE"
        | "DIAGNOSTIC_PAGE"
        | "SUMMARY_PAGE"
        | "CTA_PAGE";
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
      background_direction: string;
      image_subject: string;
      composition_direction: string;
      image_realism: string;
      color_strategy: string;
      typography: {
        font_character: string;
        title_size_strategy: string;
        body_size_strategy: string;
        font_weight: string;
        line_height: string;
        letter_spacing: string;
        alignment: string;
        text_region: string;
        text_image_ratio: string;
      };
      effects: {
        effects: string[];
        mask: string;
        shadow: string;
        gradient: string;
        border: string;
        texture: string;
      };
      selection_reason: string;
    },
    ...{
      page_number: number;
      page_role: string;
      page_design_intent?:
        | "COVER_ENTRY"
        | "CONTENT_EDITORIAL"
        | "EVIDENCE_PAGE"
        | "DIAGNOSTIC_PAGE"
        | "SUMMARY_PAGE"
        | "CTA_PAGE";
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
      background_direction: string;
      image_subject: string;
      composition_direction: string;
      image_realism: string;
      color_strategy: string;
      typography: {
        font_character: string;
        title_size_strategy: string;
        body_size_strategy: string;
        font_weight: string;
        line_height: string;
        letter_spacing: string;
        alignment: string;
        text_region: string;
        text_image_ratio: string;
      };
      effects: {
        effects: string[];
        mask: string;
        shadow: string;
        gradient: string;
        border: string;
        texture: string;
      };
      selection_reason: string;
    }[],
  ];
  /**
   * @maxItems 3
   */
  candidate_directions:
    | []
    | [
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
      ]
    | [
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
      ]
    | [
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
        {
          candidate_key: string;
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
          subject_direction: string;
          composition_direction: string;
          palette_direction: string;
          material_difference_basis: string;
        },
      ];
  image_count: number;
  candidate_count: number;
  /**
   * @minItems 1
   */
  production_batches: [
    {
      batch_number: number;
      /**
       * @minItems 1
       */
      page_numbers: [number, ...number[]];
      gate: "DIRECTION_SELECTION" | "G4" | "STYLE_LOCK";
    },
    ...{
      batch_number: number;
      /**
       * @minItems 1
       */
      page_numbers: [number, ...number[]];
      gate: "DIRECTION_SELECTION" | "G4" | "STYLE_LOCK";
    }[],
  ];
  quality_thresholds: {
    direction_candidate: number;
    formal_asset: number;
    group: number;
    core_dimension_floor: number;
  };
  consistency_risks: string[];
  confidence_report_id: string;
  ambiguity_report_id: string;
  selection_reasons: string[];
  current_override_applied: boolean;
  long_term_profile_mutated: false;
  industry_pack_mutated: false;
  global_preference_mutated: false;
  cover_visual_strategy?: string;
  cover_text_prominence?: string;
  cover_text_to_image_ratio?: string;
  cover_background_semantic_role?:
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
  /**
   * @minItems 2
   * @maxItems 2
   */
  cover_thumbnail_targets?: ["310x414" | "186x248", "310x414" | "186x248"];
  cover_click_clarity_target?: number;
  semantic_relevance_target?: number;
  cover_candidate_count?: number;
  cover_candidate_diversity_reason?: string;
  universal_visual_default_version?: string;
  typography_default_policy_version?: string;
  editorial_spatial_policy_version?: string;
  resolved_typography_strategy?: string;
  resolved_composition_family?:
    | "FULL_BLEED_ANCHORED"
    | "ASYMMETRIC_NEGATIVE_SPACE"
    | "IMAGE_TEXT_INTERLOCK"
    | "CROP_LAYERED"
    | "MULTI_EVIDENCE_EDITORIAL"
    | "TYPOGRAPHIC_FIELD"
    | "DIAGNOSTIC_COMPOSITION"
    | "SPLIT_DEPTH"
    | "EDGE_ANCHORED"
    | "SUBJECT_OVERLAP";
  image_text_integration_strategy?: string;
  candidate_diversity_strategy?: string;
  painpoint_scene_strategy?: string;
  editorial_design_knowledge_version?: "1.0.0";
  cover_attention_plan_ref?: string;
  cover_attention_mode?:
    | "TYPE_DOMINANT"
    | "IMAGE_DOMINANT"
    | "TYPE_IMAGE_COLLISION"
    | "CROP_DOMINANT"
    | "COLOR_DOMINANT"
    | "EVIDENCE_DOMINANT"
    | "CONTRAST_DOMINANT"
    | "HYBRID_ATTENTION";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
