/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Actual-asset proof that one formal set is stylistically continuous while its page duties, backgrounds, shots and narrative remain materially different.
 */
export interface ImageSetContinuityReport {
  report_id: string;
  strategy_id: string;
  project_id: string;
  content_id: string;
  /**
   * @minItems 3
   */
  continuity_anchors: [string, string, string, ...string[]];
  /**
   * @minItems 4
   * @maxItems 8
   */
  pages:
    | [
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
        },
      ]
    | [
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
        },
      ]
    | [
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
        },
      ]
    | [
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
        },
      ]
    | [
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
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
          page_duty: "COVER_CLICK" | "VALUE_DELIVERY" | "SUMMARY_CONVERSION";
          semantic_responsibility: string;
          visual_system_key: string;
          background_asset_policy:
            | "DISTINCT_BACKGROUND_REQUIRED"
            | "REUSE_WITH_MATERIAL_TRANSFORMATION"
            | "NO_RASTER_BACKGROUND";
          background_source_checksum: string | null;
          rendered_asset_checksum: string;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchors_present: [string, string, ...string[]];
          page_role_fulfilled: boolean;
          mobile_readable: boolean;
          difference_from_previous_verified: boolean;
        },
      ];
  visual_style_continuity: "PASS" | "FAIL";
  page_duty_fulfillment: "PASS" | "FAIL";
  background_asset_diversity: "PASS" | "FAIL";
  shot_and_composition_diversity: "PASS" | "FAIL";
  narrative_progression: "PASS" | "FAIL";
  mobile_readability: "PASS" | "FAIL";
  duplicate_background_pairs: [number, number][];
  duplicate_shot_pairs: [number, number][];
  hard_blocks: string[];
  operator_approval_required: true;
  result: "PASS_PENDING_OPERATOR" | "FAIL";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
