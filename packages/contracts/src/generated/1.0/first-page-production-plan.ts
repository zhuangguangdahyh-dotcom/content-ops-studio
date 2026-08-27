/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export type FirstPageProductionPlan = {
  [k: string]: unknown;
} & {
  first_page_production_plan_id: string;
  project_id: string;
  content_id: string;
  page_number: 1;
  page_role: "COVER";
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  copy_snapshot_hash: string;
  visual_handoff_ref: string;
  visual_handoff_hash: string;
  page_visual_plan_id: string;
  renderer_config: {
    renderer_config_id: string;
    renderer_id: "PLAYWRIGHT_HTML_CSS";
    renderer_version: "1.0.0";
    runtime_package: "playwright-core";
    runtime_package_version: "1.62.1";
    browser_family: "CHROMIUM";
    browser_channel: "PLAYWRIGHT_MANAGED";
    browser_path_reference: "PLUGIN_DATA_PLAYWRIGHT_BROWSERS" | "EXTERNAL_RENDERER_CACHE";
    headless: true;
    viewport: {
      width: 1242;
      height: 1660;
    };
    device_scale_factor: 1;
    locale: "zh-CN";
    timezone: "Asia/Shanghai";
    color_scheme: "light";
    reduced_motion: "reduce";
    screenshot_options: {
      type: "png";
      animations: "disabled";
      caret: "hide";
      scale: "css";
      omit_background: false;
    };
    network_policy: "BLOCK_ALL";
    font_policy: "SYSTEM_CJK_STACK";
    animation_policy: "DISABLED";
    time_policy: "NO_DYNAMIC_TIME";
    random_policy: "NO_RANDOM_VALUES";
    timeout_ms: number;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  renderer_environment_requirement: {
    platform: "darwin" | "linux" | "win32";
    architecture: "arm64" | "x64";
    browser_family: "CHROMIUM";
    browser_required: true;
    font_profile_required: true;
  };
  template_id: "TPL-EDITORIAL-COVER";
  template_version: "1.0.0";
  asset_strategy: "PROGRAMMATIC_GRAPHIC" | "AI_GENERATED_VISUAL";
  programmatic_graphic_plan: {
    graphic_id: string;
    /**
     * @minItems 1
     */
    primitives: [
      (
        | "RECTANGLE"
        | "ROUNDED_CARD"
        | "LINE"
        | "DIVIDER"
        | "CIRCLE"
        | "NUMBER_MARKER"
        | "BRACKET"
        | "CONNECTOR"
        | "GRID"
        | "FRAME"
        | "ACCENT_BLOCK"
      ),
      ...(
        | "RECTANGLE"
        | "ROUNDED_CARD"
        | "LINE"
        | "DIVIDER"
        | "CIRCLE"
        | "NUMBER_MARKER"
        | "BRACKET"
        | "CONNECTOR"
        | "GRID"
        | "FRAME"
        | "ACCENT_BLOCK"
      )[],
    ];
    contains_formal_copy: false;
    contains_remote_assets: false;
  } | null;
  host_generated_asset_plan?: {
    generation_id: string;
    asset_id: string;
    relative_path: string;
    checksum: string;
    mime_type: "image/png" | "image/jpeg" | "image/webp";
    width: number;
    height: number;
    source_type: "HOST_NATIVE_IMAGEGEN";
    contains_formal_copy: false;
    contains_remote_url: false;
  };
  /**
   * @minItems 1
   */
  text_layer_plan: [
    {
      layer_id: string;
      role: "TITLE" | "BODY" | "PAGE_NUMBER";
      exact_text: string;
      source_hash: string;
    },
    ...{
      layer_id: string;
      role: "TITLE" | "BODY" | "PAGE_NUMBER";
      exact_text: string;
      source_hash: string;
    }[],
  ];
  /**
   * @minItems 1
   */
  font_resolution_plan: [
    {
      role: "TITLE" | "BODY" | "PAGE_NUMBER";
      /**
       * @minItems 1
       */
      font_stack: [string, ...string[]];
    },
    ...{
      role: "TITLE" | "BODY" | "PAGE_NUMBER";
      /**
       * @minItems 1
       */
      font_stack: [string, ...string[]];
    }[],
  ];
  /**
   * @minItems 1
   */
  layout_measurement_plan: [
    (
      | "BOUNDING_CLIENT_RECT"
      | "SCROLL_SIZE"
      | "CLIENT_SIZE"
      | "COMPUTED_FONT"
      | "LINE_COUNT"
      | "Z_INDEX"
      | "VISIBILITY"
      | "OVERLAP"
      | "SAFE_AREA"
      | "CANVAS_SCROLL"
    ),
    ...(
      | "BOUNDING_CLIENT_RECT"
      | "SCROLL_SIZE"
      | "CLIENT_SIZE"
      | "COMPUTED_FONT"
      | "LINE_COUNT"
      | "Z_INDEX"
      | "VISIBILITY"
      | "OVERLAP"
      | "SAFE_AREA"
      | "CANVAS_SCROLL"
    )[],
  ];
  /**
   * @minItems 7
   */
  expected_outputs: [
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    (
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    ),
    ...(
      | "BACKGROUND_SVG"
      | "BACKGROUND_RASTER"
      | "COMPILED_HTML"
      | "FIRST_PAGE_PNG"
      | "GENERATION_MANIFEST"
      | "RENDER_REPORT"
      | "QA_REPORT"
      | "PRODUCTION_REPORT"
      | "ENVIRONMENT_EVIDENCE"
    )[],
  ];
  /**
   * @minItems 1
   */
  qa_requirements: [string, ...string[]];
  live_write_required: true;
  explicit_confirmation: true;
  idempotency_key: string;
  plan_hash: string;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
