/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deterministic layout and page-export result with explicit blockers.
 */
export interface RenderReport {
  render_report_id: string;
  generation_id: string;
  project_id: string;
  content_id: string;
  page_number: number;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version: string | null;
  renderer: string;
  renderer_version: string;
  render_mode: "MOCK" | "DETERMINISTIC_LAYOUT" | "PLAYWRIGHT_HTML_CSS";
  /**
   * @minItems 1
   */
  input_assets: [
    {
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
    },
    ...{
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
    }[],
  ];
  output_asset: {
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
  } | null;
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
  font_resolution: {
    role: string;
    requested_font: string;
    actual_font: string;
    substitution_reason: string | null;
    impact: "NONE" | "LOW" | "MEDIUM" | "HIGH";
    blocking: boolean;
  }[];
  layout_measurements: {
    layer_id: string;
    measured_bbox: {
      x: number;
      y: number;
      width: number;
      height: number;
      unit: "PX" | "PERCENT";
    };
    line_count: number;
  }[];
  overflow_detected: boolean;
  missing_assets: string[];
  font_fallbacks: {
    role: string;
    requested_font: string;
    actual_font: string;
    substitution_reason: string | null;
    impact: "NONE" | "LOW" | "MEDIUM" | "HIGH";
    blocking: boolean;
  }[];
  clipping_detected: boolean;
  unsafe_regions: {
    x: number;
    y: number;
    width: number;
    height: number;
    unit: "PX" | "PERCENT";
  }[];
  warnings: string[];
  errors: string[];
  render_status:
    | "RENDER_PENDING"
    | "RENDER_RUNNING"
    | "RENDER_SUCCESS"
    | "RENDER_SUCCESS_WITH_WARNINGS"
    | "RENDER_FAILED";
  run_id: string;
  schema_version: "1.0.0";
  started_at: string;
  completed_at: string | null;
  extensions: {
    [k: string]: unknown;
  };
}
