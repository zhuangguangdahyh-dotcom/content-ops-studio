/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Executable version-bound visual direction for one content page.
 */
export interface PageVisualPlan {
  page_visual_plan_id: string;
  project_id: string;
  content_id: string;
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
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  visual_mode:
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY";
  visual_purpose: string;
  copy_snapshot: {
    copy_version: string;
    headline: string;
    body: string;
    supporting_text: string;
  };
  background_direction: string;
  visual_evidence_requirement: string;
  asset_requirements: string[];
  composition: string;
  camera_and_lens_direction: string | null;
  lighting_direction: string | null;
  material_and_texture_direction: string | null;
  character_or_subject_direction: string | null;
  /**
   * @minItems 1
   */
  layout_regions: [
    {
      region_id: string;
      role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
      bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
        unit: "PX" | "PERCENT";
      };
      z_index: number;
    },
    ...{
      region_id: string;
      role: "BACKGROUND" | "TEXT" | "IMAGE" | "BRAND" | "PAGE_NUMBER";
      bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
        unit: "PX" | "PERCENT";
      };
      z_index: number;
    }[],
  ];
  text_layers: {
    layer_id: string;
    role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
    content_source: string;
    content_snapshot: string;
    bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
      unit: "PX" | "PERCENT";
    };
    typography_token_id: string;
    color_token_id: string;
    z_index: number;
    required: boolean;
  }[];
  image_treatment: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    overlay: string;
    gradient: string;
    mask: string;
    crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
  };
  safe_area: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: "PX" | "PERCENT";
  };
  estimated_text_density: number;
  max_text_density: number;
  overflow_strategy:
    "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
  negative_constraints: string[];
  allowed_variations: string[];
  fallback_strategy: string;
  approval_dependency: "COPY_APPROVED" | "FIRST_PAGE_APPROVED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
