/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Industry-neutral visual motif, page-duty, distinct-background and continuity plan for one formal image set.
 */
export interface ImageSetProductionStrategy {
  strategy_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version: string;
  visual_mode:
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY";
  visual_motif: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
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
          planned_background_key: string | null;
          shot_signature: string | null;
          composition_family: string;
          /**
           * @minItems 2
           */
          continuity_anchor_refs: [string, string, ...string[]];
          difference_from_previous: string;
        },
      ];
  distinct_backgrounds_required: number;
  planned_distinct_backgrounds: number;
  composition_family_count: number;
  result: "PLANNED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
