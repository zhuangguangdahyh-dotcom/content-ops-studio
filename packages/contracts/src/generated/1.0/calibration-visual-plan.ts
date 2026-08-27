/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationVisualPlan {
  visual_plan_id: string;
  /**
   * Distinguishes canonical Production projects from isolated fictional Calibration projects without widening Production project identifiers.
   */
  project_ref:
    | {
        project_kind: "PRODUCTION_PROJECT";
        project_id: string;
      }
    | {
        project_kind: "CALIBRATION_PROJECT";
        project_id: string;
      };
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  page_count: 6;
  content_package_ref: string;
  content_package_hash: string;
  g3_approval_id: string;
  g3_approval_ref: string;
  g3_approval_hash: string;
  audience: string;
  painpoint: string;
  content_value: string;
  /**
   * @minItems 6
   * @maxItems 6
   */
  narrative: [string, string, string, string, string, string];
  /**
   * @minItems 6
   */
  calibration_systems: [
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    (
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    ),
    ...(
      | "UNIVERSAL_VISUAL_CALIBRATION_V1"
      | "EDITORIAL_DESIGN_KNOWLEDGE_V1"
      | "COVER_ATTENTION_INTELLIGENCE_V1"
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_V1"
      | "TYPOGRAPHY_BREATHING_ROOM_V1"
      | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY_V1"
    )[],
  ];
  historical_style_reference: {
    style_lock_version: "SLV-1";
    usage: "HISTORICAL_CALIBRATION_STYLE_REFERENCE";
  };
  active_style_lock_for_current_version: null;
  /**
   * @minItems 6
   * @maxItems 6
   */
  pages: [
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      copy_hash: string;
      visual_purpose: string;
      composition_family: string;
      asset_strategy: "REUSED_VERIFIED_ASSET" | "PLANNED_NOT_PRODUCED";
      typography_role: string;
      production_status: "PENDING_G4_REVIEW" | "NOT_CREATED";
    },
  ];
  status: "CREATED";
  remaining_pages_created: 0;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
