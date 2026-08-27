/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationReboundFirstPage {
  manifest_id: string;
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
  asset_id: string;
  asset_source_type: "REUSED_VERIFIED_ASSET";
  source_asset_id: string;
  source_asset_ref: string;
  source_asset_checksum: string;
  asset_ref: string;
  asset_checksum: string;
  asset_file_size: number;
  canvas: {
    width: number;
    height: number;
    aspect_ratio: string;
    orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
    resolution_unit: "PX";
  };
  copy_equivalence: {
    copy_byte_equivalence: "PASS";
    content_promise_equivalence: "PASS";
    page_role_equivalence: "PASS";
    page_intent_equivalence: "PASS";
  };
  asset_byte_reuse_eligibility: "PASSED";
  image_bytes: "UNCHANGED";
  current_version_qa: {
    qa_binding_id: string;
    target_binding: string;
    /**
     * @minItems 21
     * @maxItems 21
     */
    checks: [
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
      {
        check:
          | "COPY_FIDELITY"
          | "TYPOGRAPHY_POLICY"
          | "TYPOGRAPHY_SPATIAL_INTEGRITY"
          | "TYPOGRAPHY_BREATHING_ROOM"
          | "RASTER_TEXT_BACKGROUND_CONTRAST_INTEGRITY"
          | "CONTRAST_STABILITY"
          | "BACKGROUND_COMPLEXITY"
          | "THUMBNAIL_QA"
          | "COVER_CLICK_CLARITY"
          | "SEMANTIC_RELEVANCE"
          | "PAINPOINT_SCENE_CONGRUENCE"
          | "EDITORIAL_SPATIAL"
          | "IMAGE_TEXT_INTEGRATION"
          | "COVER_ATTENTION"
          | "VISUAL_MASS"
          | "GREYSCALE_HIERARCHY"
          | "COLOR_INTELLIGENCE"
          | "TYPOGRAPHY_AS_FORM"
          | "IMAGE_QUALITY"
          | "ACTUAL_PIXEL_QA"
          | "DETERMINISTIC_ASSET_VERIFICATION";
        result: "PASS";
        binding_basis: string;
      },
    ];
    /**
     * @minItems 5
     */
    evidence_refs: [
      {
        artifact_ref: string;
        checksum: string;
      },
      {
        artifact_ref: string;
        checksum: string;
      },
      {
        artifact_ref: string;
        checksum: string;
      },
      {
        artifact_ref: string;
        checksum: string;
      },
      {
        artifact_ref: string;
        checksum: string;
      },
      ...{
        artifact_ref: string;
        checksum: string;
      }[],
    ];
    /**
     * @maxItems 0
     */
    hard_blocks: [];
    status: "PASSED";
  };
  historical_manifest_modified: false;
  operator_approved: false;
  g4_eligible: true;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
