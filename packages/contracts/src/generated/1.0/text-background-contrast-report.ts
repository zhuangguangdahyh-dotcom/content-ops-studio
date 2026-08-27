/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface TextBackgroundContrastReport {
  report_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  calibration_cover_version: string;
  asset_id: string;
  asset_checksum: string;
  canvas: {
    width: number;
    height: number;
    aspect_ratio: string;
    orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
    resolution_unit: "PX";
  };
  heuristic_scope: "CONTENT_OPS_INTERNAL_RELATIVE_LUMINANCE_HEURISTIC_NOT_WCAG_CERTIFICATION";
  gate_after: "TYPOGRAPHY_SPATIAL_INTEGRITY";
  gate_before: "COVER_ATTENTION_DOMINANCE";
  /**
   * @minItems 1
   */
  text_layers: [
    {
      text_layer_id: string;
      role:
        | "PRIMARY_HOOK"
        | "SECONDARY_SIGNAL"
        | "BODY"
        | "LABEL"
        | "CAPTION"
        | "BRAND"
        | "PAGE_NUMBER";
      foreground_color: string;
      foreground_opacity: number;
      text_bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      resolved_font: string;
      resolved_weight: number;
      background_region: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      background_luminance_distribution: {
        minimum: number;
        percentile_10: number;
        median: number;
        percentile_90: number;
        maximum: number;
      };
      local_contrast_distribution: {
        minimum: number;
        percentile_10: number;
        median: number;
        percentile_90: number;
        maximum: number;
      };
      minimum_local_contrast: number;
      low_percentile_local_contrast: number;
      median_local_contrast: number;
      low_contrast_area_ratio: number;
      contrast_variance: number;
      background_complexity: number;
      foreground_background_edge_conflict: number;
      worst_local_region: {
        x: number;
        y: number;
        width: number;
        height: number;
        median_contrast: number;
      };
      actual_pixel_result: "PASS" | "FAIL";
      errors: (
        | "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED"
        | "TEXT_BACKGROUND_CONTRAST_UNSTABLE"
        | "TEXT_BACKGROUND_COMPLEXITY_BLOCKED"
        | "SECONDARY_TEXT_CONTRAST_TOO_LOW"
        | "PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE"
        | "LOW_CONTRAST_AREA_EXCESSIVE"
        | "COLOR_HIERARCHY_REDUCES_LEGIBILITY"
      )[];
    },
    ...{
      text_layer_id: string;
      role:
        | "PRIMARY_HOOK"
        | "SECONDARY_SIGNAL"
        | "BODY"
        | "LABEL"
        | "CAPTION"
        | "BRAND"
        | "PAGE_NUMBER";
      foreground_color: string;
      foreground_opacity: number;
      text_bbox: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      resolved_font: string;
      resolved_weight: number;
      background_region: {
        x: number;
        y: number;
        width: number;
        height: number;
      };
      background_luminance_distribution: {
        minimum: number;
        percentile_10: number;
        median: number;
        percentile_90: number;
        maximum: number;
      };
      local_contrast_distribution: {
        minimum: number;
        percentile_10: number;
        median: number;
        percentile_90: number;
        maximum: number;
      };
      minimum_local_contrast: number;
      low_percentile_local_contrast: number;
      median_local_contrast: number;
      low_contrast_area_ratio: number;
      contrast_variance: number;
      background_complexity: number;
      foreground_background_edge_conflict: number;
      worst_local_region: {
        x: number;
        y: number;
        width: number;
        height: number;
        median_contrast: number;
      };
      actual_pixel_result: "PASS" | "FAIL";
      errors: (
        | "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED"
        | "TEXT_BACKGROUND_CONTRAST_UNSTABLE"
        | "TEXT_BACKGROUND_COMPLEXITY_BLOCKED"
        | "SECONDARY_TEXT_CONTRAST_TOO_LOW"
        | "PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE"
        | "LOW_CONTRAST_AREA_EXCESSIVE"
        | "COLOR_HIERARCHY_REDUCES_LEGIBILITY"
      )[];
    }[],
  ];
  primary_hook_contrast: {
    result: "PASS" | "FAIL";
    observation: string;
  };
  supporting_signal_contrast: {
    result: "PASS" | "FAIL";
    observation: string;
  };
  contrast_stability: {
    result: "PASS" | "FAIL";
    observation: string;
  };
  background_complexity: {
    result: "PASS" | "FAIL";
    observation: string;
  };
  actual_pixel_visual_qa: {
    result: "PASS" | "FAIL";
    observation: string;
  };
  hard_blocks: (
    | "TEXT_BACKGROUND_CONTRAST_INTEGRITY_BLOCKED"
    | "TEXT_BACKGROUND_CONTRAST_UNSTABLE"
    | "TEXT_BACKGROUND_COMPLEXITY_BLOCKED"
    | "SECONDARY_TEXT_CONTRAST_TOO_LOW"
    | "PRIMARY_TEXT_LOCAL_CONTRAST_FAILURE"
    | "LOW_CONTRAST_AREA_EXCESSIVE"
    | "COLOR_HIERARCHY_REDUCES_LEGIBILITY"
  )[];
  result: "PASS" | "FAIL";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
