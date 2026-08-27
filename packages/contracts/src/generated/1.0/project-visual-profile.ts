/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ProjectVisualProfile {
  profile_id: string;
  project_id: string;
  profile_version: string;
  maturity: "UNMATURE" | "COLD_START" | "LEARNING" | "MATURE" | "REVIEW_REQUIRED";
  maturity_status?: "COLD_START" | "LEARNING" | "MATURE" | "REVIEW_REQUIRED";
  industry_pack_binding: {
    pack_id:
      | "GENERIC"
      | "COMMERCIAL_SPACE_HOSPITALITY"
      | "PROFESSIONAL_SERVICES"
      | "PERSONAL_IP_CREATOR"
      | "MEDICAL_AESTHETICS_HEALTH"
      | "PRODUCT_CONSUMER"
      | "FOOD_BEVERAGE_LIFESTYLE";
    pack_version: string;
  };
  overlay_bindings: {
    overlay_id:
      | "PERSON_CONTINUITY"
      | "PRODUCT_IDENTITY"
      | "SPACE_IDENTITY"
      | "EVIDENCE_AUTHENTICITY"
      | "REGULATED_CLAIMS"
      | "BEFORE_AFTER_INTEGRITY"
      | "BRAND_ASSET_INTEGRITY";
    overlay_version: string;
  }[];
  preferred_visual_modes: (
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY"
  )[];
  preferred_asset_channels: (
    | "PROJECT_ASSET"
    | "AI_GENERATED_VISUAL"
    | "PROGRAMMATIC_GRAPHIC"
    | "EVIDENCE_ASSET"
    | "PURE_TYPOGRAPHY"
    | "MIXED_ASSET"
  )[];
  identity_invariants: string[];
  confirmed_preferences: string[];
  rejected_directions: string[];
  approved_reference_assets: {
    asset_id: string;
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "RENDERED_PAGE"
      | "FINAL_PAGE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE";
    asset_type: "IMAGE" | "TEXT" | "JSON" | "DOCUMENT";
    mime_type: string;
    relative_path: string;
    source_type:
      | "MOCK"
      | "PROMPT_ONLY"
      | "PROGRAMMATIC"
      | "GENERATED"
      | "RENDERED"
      | "OPERATOR_SUPPLIED"
      | "LOCAL_EDIT"
      | "HOST_NATIVE_IMAGEGEN";
    source_adapter: string;
    source_run_id: string;
    source_generation_id: string | null;
    version: number;
    width: number | null;
    height: number | null;
    file_size: number;
    checksum: string;
    created_at: string;
    extensions: {
      [k: string]: unknown;
    };
  }[];
  source_rule_versions: string[];
  asset_source_preferences?: (
    | "PROJECT_ASSET"
    | "AI_GENERATED_VISUAL"
    | "PROGRAMMATIC_GRAPHIC"
    | "EVIDENCE_ASSET"
    | "PURE_TYPOGRAPHY"
    | "MIXED_ASSET"
  )[];
  background_preferences?: string[];
  image_realism_preferences?: string[];
  photography_preferences?: string[];
  illustration_preferences?: string[];
  character_preferences?: string[];
  space_preferences?: string[];
  product_preferences?: string[];
  composition_preferences?: string[];
  composition_family_preferences?: (
    | "FULL_BLEED_ANCHORED"
    | "ASYMMETRIC_NEGATIVE_SPACE"
    | "IMAGE_TEXT_INTERLOCK"
    | "CROP_LAYERED"
    | "MULTI_EVIDENCE_EDITORIAL"
    | "TYPOGRAPHIC_FIELD"
    | "DIAGNOSTIC_COMPOSITION"
    | "SPLIT_DEPTH"
    | "EDGE_ANCHORED"
    | "SUBJECT_OVERLAP"
  )[];
  image_text_integration_preferences?: string[];
  spatial_tension_preferences?: string[];
  negative_space_preferences?: string[];
  visual_focus_preferences?: string[];
  whitespace_preferences?: string[];
  visual_density_preferences?: string[];
  typography_preferences?: string[];
  font_family_preferences?: string[];
  title_font_preferences?: string[];
  subtitle_font_preferences?: string[];
  body_font_preferences?: string[];
  title_size_preferences?: string[];
  body_size_preferences?: string[];
  font_weight_preferences?: string[];
  line_height_preferences?: string[];
  letter_spacing_preferences?: string[];
  alignment_preferences?: string[];
  color_preferences?: string[];
  accent_color_preferences?: string[];
  contrast_preferences?: string[];
  effect_preferences?: string[];
  shadow_preferences?: string[];
  gradient_preferences?: string[];
  mask_preferences?: string[];
  border_preferences?: string[];
  corner_preferences?: string[];
  texture_preferences?: string[];
  cover_account_goal_preferences?: (
    | "LEAD_GENERATION"
    | "BRAND_BUILDING"
    | "KNOWLEDGE_EDUCATION"
    | "PRODUCT_SALES"
    | "COMMUNITY"
    | "PORTFOLIO_SHOWCASE"
  )[];
  cover_objective_preferences?: (
    | "AUDIENCE_FILTER"
    | "PAINPOINT_DIRECT"
    | "VALUE_DIRECT"
    | "RISK_WARNING"
    | "DECISION_CHECKLIST"
    | "RESULT_EVIDENCE"
    | "BRAND_STATEMENT"
  )[];
  cover_primary_hook_length_preferences?: string[];
  cover_primary_hook_line_preferences?: string[];
  cover_secondary_line_preferences?: string[];
  cover_text_prominence_preferences?: string[];
  cover_text_area_preferences?: string[];
  cover_text_to_image_ratio_preferences?: string[];
  cover_thumbnail_font_preferences?: string[];
  cover_alignment_preferences?: string[];
  cover_contrast_preferences?: string[];
  cover_effect_preferences?: string[];
  cover_background_semantic_preferences?: string[];
  cover_approved_reference_elements?: string[];
  cover_rejected_reference_elements?: string[];
  preferred_cover_attention_modes?: (
    | "TYPE_DOMINANT"
    | "IMAGE_DOMINANT"
    | "TYPE_IMAGE_COLLISION"
    | "CROP_DOMINANT"
    | "COLOR_DOMINANT"
    | "EVIDENCE_DOMINANT"
    | "CONTRAST_DOMINANT"
    | "HYBRID_ATTENTION"
  )[];
  cover_visual_mass_preferences?: string[];
  cover_scale_contrast_preferences?: string[];
  cover_grid_discipline_preferences?: string[];
  cover_grid_break_preferences?: string[];
  cover_crop_preferences?: string[];
  cover_negative_space_preferences?: string[];
  cover_color_contrast_preferences?: string[];
  cover_color_quantity_preferences?: string[];
  cover_typography_shape_preferences?: string[];
  cover_info_density_preferences?: string[];
  cover_visual_tension_preferences?: string[];
  formal_text_policy?: "RENDERER_ONLY";
  image_text_policy?: "TEXT_FREE_GENERATED_VISUALS" | "AUTHORIZED_INCIDENTAL_TEXT_ONLY";
  preferred_page_counts?: number[];
  preferred_candidate_counts?: number[];
  production_batch_preferences?: string[];
  quality_thresholds?: {
    direction_candidate: number;
    formal_asset: number;
    group: number;
    core_dimension_floor: number;
  };
  approved_reference_elements?: string[];
  rejected_reference_elements?: string[];
  must_rules?: string[];
  must_not_rules?: string[];
  prefer_rules?: string[];
  avoid_rules?: string[];
  confirmed_feedback_refs?: string[];
  rule_version_refs?: string[];
  known_exceptions?: string[];
  review_required_reasons?: string[];
  confirmed_by_operator: boolean;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
}
