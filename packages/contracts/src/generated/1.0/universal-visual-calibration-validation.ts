/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface UniversalVisualCalibrationValidation {
  validation_id: string;
  status: "CALIBRATION_VALIDATED_V1";
  validation_scope: "RULES_KNOWLEDGE_QA_AND_DECISION_SYSTEMS_ONLY";
  project_id: string;
  content_id: string;
  source_approval_id: string;
  source_style_lock_id: string;
  /**
   * @minItems 6
   * @maxItems 6
   */
  validated_systems: [
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
    {
      system:
        | "UNIVERSAL_DEFAULT_VISUAL_BASELINE_V1"
        | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
        | "COVER_ATTENTION_INTELLIGENCE_V1"
        | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
        | "TYPOGRAPHY_BREATHING_ROOM_V1"
        | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1";
      status: "CALIBRATION_VALIDATED_V1";
    },
  ];
  universal_template_created: false;
  /**
   * @minItems 6
   * @maxItems 6
   */
  universal_template_exclusions: [
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
    "LAYOUT" | "COLOR" | "STOREFRONT" | "TITLE_POSITION" | "CROP" | "TYPE_DOMINANT",
  ];
  project_profile_mutated: false;
  industry_pack_mutated: false;
  universal_default_mutated: false;
  c0001_unchanged: true;
  historical_assets_preserved: true;
  remaining_page_production_eligibility: "ELIGIBLE";
  remaining_pages_created: 0;
  image_generation_calls: 0;
  feishu_writes: 0;
  idempotency_key: string;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
