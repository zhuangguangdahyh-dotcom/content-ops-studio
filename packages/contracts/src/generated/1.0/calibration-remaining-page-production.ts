/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationRemainingPageProduction {
  production_id: string;
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
  first_page_version: string;
  first_page_asset_id: string;
  first_page_checksum: string;
  g4_approval_id: string;
  style_lock_id: string;
  style_lock_version: string;
  rhythm_plan: {
    plan_id: string;
    /**
     * @minItems 6
     * @maxItems 6
     */
    pages: [
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
      {
        page_number: number;
        page_intent: string;
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
        composition_family: string;
        visual_intensity: "HIGH" | "MEDIUM" | "LOW";
        information_density: "HIGH" | "MEDIUM" | "LOW";
        image_dominance: "HIGH" | "MEDIUM" | "LOW";
        typography_scale: "COVER" | "CONTENT_LARGE" | "CONTENT_MEDIUM" | "CONTENT_SMALL";
        color_intensity: "HIGH" | "MEDIUM" | "LOW";
        rhythm_role: "OPEN" | "BUILD" | "PAUSE" | "ACCELERATE" | "PROVE" | "RESOLVE";
        reading_path: string;
        visual_motif: string;
        /**
         * @minItems 2
         */
        continuity_requirements: [string, string, ...string[]];
      },
    ];
    status: "EXECUTED";
  };
  /**
   * @minItems 5
   * @maxItems 5
   */
  page_reports: [
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
      page_intent: string;
      composition_family: string;
      visual_intensity: "HIGH" | "MEDIUM" | "LOW";
      asset_source: "VERIFIED_MASTER_ASSET_CROP";
      asset: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_310: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_186: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      copy_hash: string;
      /**
       * @minItems 15
       * @maxItems 15
       */
      single_page_qa: [
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
      ];
      scores: {
        editorial_spatial: number;
        image_text_integration: number;
        image_quality: number;
      };
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      status: "PASSED";
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
      page_intent: string;
      composition_family: string;
      visual_intensity: "HIGH" | "MEDIUM" | "LOW";
      asset_source: "VERIFIED_MASTER_ASSET_CROP";
      asset: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_310: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_186: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      copy_hash: string;
      /**
       * @minItems 15
       * @maxItems 15
       */
      single_page_qa: [
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
      ];
      scores: {
        editorial_spatial: number;
        image_text_integration: number;
        image_quality: number;
      };
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      status: "PASSED";
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
      page_intent: string;
      composition_family: string;
      visual_intensity: "HIGH" | "MEDIUM" | "LOW";
      asset_source: "VERIFIED_MASTER_ASSET_CROP";
      asset: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_310: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_186: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      copy_hash: string;
      /**
       * @minItems 15
       * @maxItems 15
       */
      single_page_qa: [
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
      ];
      scores: {
        editorial_spatial: number;
        image_text_integration: number;
        image_quality: number;
      };
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      status: "PASSED";
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
      page_intent: string;
      composition_family: string;
      visual_intensity: "HIGH" | "MEDIUM" | "LOW";
      asset_source: "VERIFIED_MASTER_ASSET_CROP";
      asset: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_310: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_186: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      copy_hash: string;
      /**
       * @minItems 15
       * @maxItems 15
       */
      single_page_qa: [
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
      ];
      scores: {
        editorial_spatial: number;
        image_text_integration: number;
        image_quality: number;
      };
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      status: "PASSED";
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
      page_intent: string;
      composition_family: string;
      visual_intensity: "HIGH" | "MEDIUM" | "LOW";
      asset_source: "VERIFIED_MASTER_ASSET_CROP";
      asset: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_310: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      thumbnail_186: {
        asset_ref: string;
        checksum: string;
        width: number;
        height: number;
      };
      copy_hash: string;
      /**
       * @minItems 15
       * @maxItems 15
       */
      single_page_qa: [
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
        {
          check:
            | "AUTHENTICITY"
            | "MECHANICAL_QA"
            | "COPY_FIDELITY"
            | "TYPOGRAPHY_POLICY"
            | "TYPOGRAPHY_SPATIAL_INTEGRITY"
            | "TYPOGRAPHY_BREATHING_ROOM"
            | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
            | "CONTRAST_STABILITY"
            | "BACKGROUND_COMPLEXITY"
            | "SEMANTIC_RELEVANCE"
            | "PAGE_INTENT_FIT"
            | "EDITORIAL_SPATIAL"
            | "IMAGE_TEXT_INTEGRATION"
            | "IMAGE_QUALITY"
            | "ACTUAL_PIXEL_INSPECTION";
          result: "PASS";
        },
      ];
      scores: {
        editorial_spatial: number;
        image_text_integration: number;
        image_quality: number;
      };
      /**
       * @maxItems 0
       */
      hard_blocks: [];
      status: "PASSED";
    },
  ];
  space_identity_continuity: {
    status: "PASSED";
    /**
     * @minItems 3
     */
    basis: [string, string, string, ...string[]];
    /**
     * @maxItems 0
     */
    hard_blocks: [];
  };
  group_editorial_rhythm: {
    status: "PASSED";
    /**
     * @minItems 1
     */
    visual_intensity_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    information_density_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    image_dominance_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    typography_scale_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    composition_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    reading_path_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    pause_points: [string, ...string[]];
    /**
     * @minItems 1
     */
    proof_points: [string, ...string[]];
    resolution: string;
    /**
     * @maxItems 0
     */
    hard_blocks: [];
  };
  group_color_rhythm: {
    status: "PASSED";
    /**
     * @minItems 1
     */
    dominant_color_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    value_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    saturation_sequence: [string, ...string[]];
    /**
     * @minItems 1
     */
    temperature_sequence: [string, ...string[]];
    accent_repetition: string;
    accent_spacing: string;
    /**
     * @maxItems 0
     */
    hard_blocks: [];
  };
  group_qa: {
    status: "PASSED";
    score: number;
    /**
     * @minItems 9
     */
    dimensions: [
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      {
        dimension: string;
        score: number;
        maximum: number;
      },
      ...{
        dimension: string;
        score: number;
        maximum: number;
      }[],
    ];
    /**
     * @maxItems 0
     */
    hard_blocks: [];
    aesthetic_risks: string[];
  };
  /**
   * @minItems 3
   * @maxItems 3
   */
  contact_sheets: [
    {
      asset_ref: string;
      checksum: string;
      width: number;
      height: number;
    },
    {
      asset_ref: string;
      checksum: string;
      width: number;
      height: number;
    },
    {
      asset_ref: string;
      checksum: string;
      width: number;
      height: number;
    },
  ];
  remaining_pages_planned: 5;
  remaining_pages_generated: 5;
  total_pages: 6;
  imagegen_calls: number;
  renderer_calls: number;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  status: "G5_READY";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
