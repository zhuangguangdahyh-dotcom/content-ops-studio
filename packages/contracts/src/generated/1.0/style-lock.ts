/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Visual rules locked by a current approved G4 first page.
 */
export interface StyleLock {
  style_lock_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  source_first_page_checksum: string;
  renderer_environment_ref: string;
  style_lock_version: string;
  source_first_page_plan_id: string;
  source_first_page_asset: {
    asset_id: string;
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "RENDERED_PAGE"
      | "FINAL_PAGE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE";
    asset_type: "IMAGE" | "TEXT" | "JSON" | "DOCUMENT";
    mime_type: string;
    relative_path: string;
    source_type:
      | "MOCK"
      | "PROMPT_ONLY"
      | "PROGRAMMATIC"
      | "GENERATED"
      | "RENDERED"
      | "OPERATOR_SUPPLIED"
      | "LOCAL_EDIT"
      | "HOST_NATIVE_IMAGEGEN";
    source_adapter: string;
    source_run_id: string;
    source_generation_id: string | null;
    version: number;
    width: number | null;
    height: number | null;
    file_size: number;
    checksum: string;
    created_at: string;
    extensions: {
      [k: string]: unknown;
    };
  };
  first_page_approval_id: string;
  first_page_approval_version: string;
  /**
   * A single explicit human decision bound to one target version.
   */
  first_page_approval: {
    approval_id: string;
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type:
      | "PROJECT"
      | "PAINPOINT_BATCH"
      | "CONTENT"
      | "CONTENT_PACKAGE"
      | "FIRST_PAGE_ASSET"
      | "IMAGE_SET";
    target_id: string;
    target_version: string;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    comment: string;
    source_run_id: string;
    created_at: string;
    deprecated_at?: string | null;
    schema_version: "1.0.0";
  };
  locked_canvas: {
    width: number;
    height: number;
    aspect_ratio: string;
    orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
    resolution_unit: "PX";
  };
  locked_safe_area: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: "PX" | "PERCENT";
  };
  /**
   * @minItems 1
   */
  locked_typography_tokens: [
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
  locked_color_tokens: [
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
  locked_grid: {
    [k: string]: string | number | boolean;
  };
  locked_image_treatment: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    overlay: string;
    gradient: string;
    mask: string;
    crop_strategy: "COVER" | "CONTAIN" | "FOCAL_POINT" | "NONE";
  };
  /**
   * @minItems 1
   */
  locked_layout_logic: [string, ...string[]];
  locked_brand_rules: string[];
  locked_page_number_rules: string[];
  locked_visual_mode:
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY";
  /**
   * @minItems 1
   */
  locked_rules: [string, ...string[]];
  /**
   * @minItems 1
   */
  allowed_variations: [string, ...string[]];
  allowed_page_variations: string[];
  /**
   * @minItems 8
   */
  prohibited_deviations: [
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    (
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    ),
    ...(
      | "CHANGE_TYPOGRAPHY_SYSTEM"
      | "CHANGE_GLOBAL_COLOR_SYSTEM"
      | "CHANGE_VISUAL_MODE"
      | "CHANGE_GLOBAL_IMAGE_TREATMENT"
      | "CHANGE_PRIMARY_LAYOUT_LOGIC"
      | "CHANGE_SAFE_AREA_SYSTEM"
      | "CHANGE_BRAND_MARK_RULES"
      | "CHANGE_PAGE_NUMBER_RULES"
    )[],
  ];
  created_by_skill: "image-set-production";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  invalidated_at: string | null;
  extensions: {
    [k: string]: unknown;
  };
}
