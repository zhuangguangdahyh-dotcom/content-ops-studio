/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface IndustryVisualPack {
  pack_id:
    | "GENERIC"
    | "COMMERCIAL_SPACE_HOSPITALITY"
    | "PROFESSIONAL_SERVICES"
    | "PERSONAL_IP_CREATOR"
    | "MEDICAL_AESTHETICS_HEALTH"
    | "PRODUCT_CONSUMER"
    | "FOOD_BEVERAGE_LIFESTYLE";
  pack_version: string;
  display_name: string;
  /**
   * @minItems 1
   */
  supported_industries: [string, ...string[]];
  /**
   * @minItems 1
   */
  default_visual_mode_ranking: [
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    ...(
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    )[],
  ];
  /**
   * @minItems 1
   */
  asset_source_priority: [
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    ...(
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    )[],
  ];
  /**
   * @minItems 1
   */
  identity_invariants: [string, ...string[]];
  /**
   * @minItems 1
   */
  specialized_hard_blocks: [string, ...string[]];
  /**
   * @minItems 1
   */
  specialized_quality_checks: [string, ...string[]];
  /**
   * @minItems 1
   */
  consistency_requirements: [string, ...string[]];
  /**
   * @minItems 1
   */
  fallback_strategies: [string, ...string[]];
  /**
   * @minItems 1
   */
  recommended_questions: [string, ...string[]];
  /**
   * @minItems 1
   */
  prohibited_claims_or_representations: [string, ...string[]];
  allowed_overlays: (
    | "PERSON_CONTINUITY"
    | "PRODUCT_IDENTITY"
    | "SPACE_IDENTITY"
    | "EVIDENCE_AUTHENTICITY"
    | "REGULATED_CLAIMS"
    | "BEFORE_AFTER_INTEGRITY"
    | "BRAND_ASSET_INTEGRITY"
  )[];
  /**
   * @minItems 1
   */
  known_limitations: [string, ...string[]];
  contains_customer_assets: false;
  schema_version: "1.0.0";
}
