/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ImageProductionPolicy {
  policy_id: "IMAGE-PRODUCTION-SPEC-V1";
  policy_version: "1.0.0";
  /**
   * @minItems 6
   * @maxItems 6
   */
  asset_channels: [
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
    (
      | "PROJECT_ASSET"
      | "AI_GENERATED_VISUAL"
      | "PROGRAMMATIC_GRAPHIC"
      | "EVIDENCE_ASSET"
      | "PURE_TYPOGRAPHY"
      | "MIXED_ASSET"
    ),
  ];
  /**
   * @minItems 7
   * @maxItems 7
   */
  visual_modes: [
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
    (
      | "SCENE_SERIES"
      | "EDITORIAL_SERIES"
      | "PRODUCT_LIFESTYLE"
      | "EVIDENCE_LED"
      | "MIXED"
      | "CHARACTER_SERIES"
      | "PURE_TYPOGRAPHY"
    ),
  ];
  candidate_count: {
    minimum: 2;
    maximum: 3;
  };
  final_page_count_range: {
    minimum: 4;
    maximum: 8;
  };
  candidate_quality_threshold: 75;
  formal_quality_threshold: number;
  /**
   * @minItems 1
   */
  hard_blocks: [string, ...string[]];
  formal_text_renderer_only: true;
  production_mock_fallback: false;
  schema_version: "1.0.0";
}
