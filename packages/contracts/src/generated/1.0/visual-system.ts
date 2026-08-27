/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Version-bound global visual rules and the complete ordered page system.
 */
export interface VisualSystem {
  visual_system_id: string;
  project_id: string;
  content_id: string;
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
  visual_status:
    | "VISUAL_DRAFT"
    | "VISUAL_VALIDATED"
    | "FIRST_PAGE_READY"
    | "STYLE_LOCKED"
    | "VISUAL_INVALIDATED";
  canvas: {
    width: number;
    height: number;
    aspect_ratio: string;
    orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
    resolution_unit: "PX";
  };
  safe_area: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: "PX" | "PERCENT";
  };
  grid_system: {
    rules: string[];
  };
  /**
   * @minItems 1
   */
  typography_tokens: [
    {
      token_id: string;
      role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
      font_family: string;
      font_weight: number;
      font_size: number;
      line_height: number;
      letter_spacing: number;
      alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
      max_lines: number;
      overflow_strategy:
        "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
    },
    ...{
      token_id: string;
      role: "TITLE" | "BODY" | "SUPPORTING" | "PAGE_NUMBER" | "BRAND";
      font_family: string;
      font_weight: number;
      font_size: number;
      line_height: number;
      letter_spacing: number;
      alignment: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFY";
      max_lines: number;
      overflow_strategy:
        "REFLOW" | "MOVE_TO_NEXT_PAGE" | "REVISE_COPY" | "CHANGE_LAYOUT" | "BLOCK_AND_RETURN";
    }[],
  ];
  /**
   * @minItems 1
   */
  color_tokens: [
    {
      token_id: string;
      role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
      value: string;
      color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
      opacity: number;
    },
    ...{
      token_id: string;
      role: "BACKGROUND" | "PRIMARY_TEXT" | "SECONDARY_TEXT" | "ACCENT" | "OVERLAY" | "BRAND";
      value: string;
      color_space: "SRGB" | "DISPLAY_P3" | "HEX" | "RGBA";
      opacity: number;
    }[],
  ];
  global_image_treatment: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    overlay: string;
    gradient: string;
    mask: string;
    crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
  };
  global_layout_rules: {
    rules: string[];
  };
  brand_mark_rules: {
    rules: string[];
  };
  page_number_rules: {
    rules: string[];
  };
  global_visual_direction: string;
  global_background_strategy: string;
  global_negative_constraints: string[];
  project_rule_snapshot_id: string;
  platform_pack_id: string;
  platform_pack_version: string;
  industry_pack_id: string;
  industry_pack_version: string;
  /**
   * @minItems 1
   */
  pages: [
    {
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
    },
    ...{
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
    }[],
  ];
  created_by_skill: "visual-planning";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
