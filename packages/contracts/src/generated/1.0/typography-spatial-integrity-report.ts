/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface TypographySpatialIntegrityReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  typography_policy_result: "PASS" | "FAIL";
  title_measurement: {
    layer_id: string;
    role: "TITLE" | "SECONDARY" | "BODY" | "SIGNATURE" | "PAGE_NUMBER";
    text: string;
    /**
     * @minItems 1
     */
    lines: [string, ...string[]];
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    container_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
    container_padding_px: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    } | null;
    computed_font_family: string;
    computed_font_size_px: number;
    computed_font_weight: number;
    computed_line_height_px: number;
    computed_letter_spacing_px: number;
    z_index: number;
    visibility: "VISIBLE" | "HIDDEN";
  };
  secondary_measurement: {
    layer_id: string;
    role: "TITLE" | "SECONDARY" | "BODY" | "SIGNATURE" | "PAGE_NUMBER";
    text: string;
    /**
     * @minItems 1
     */
    lines: [string, ...string[]];
    bounding_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    container_box: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
    container_padding_px: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    } | null;
    computed_font_family: string;
    computed_font_size_px: number;
    computed_font_weight: number;
    computed_line_height_px: number;
    computed_letter_spacing_px: number;
    z_index: number;
    visibility: "VISIBLE" | "HIDDEN";
  };
  minimum_text_layer_gap_px: number;
  findings: {
    code:
      | "TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED"
      | "TEXT_TEXT_OVERLAP"
      | "TEXT_GRAPHIC_OCCLUSION"
      | "TEXT_REGION_COLLISION"
      | "INSUFFICIENT_CONTAINER_PADDING"
      | "LINE_GLYPH_COLLISION"
      | "FORCED_TRACKING_DISTORTION"
      | "ORPHAN_CHARACTER_BREAK"
      | "COMPETING_PRIMARY_TEXT"
      | "DENSITY_FORCED_COMPRESSION";
    /**
     * @minItems 1
     */
    layer_ids: [string, ...string[]];
    reason: string;
  }[];
  hard_blocks: (
    | "TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED"
    | "TEXT_TEXT_OVERLAP"
    | "TEXT_GRAPHIC_OCCLUSION"
    | "TEXT_REGION_COLLISION"
    | "INSUFFICIENT_CONTAINER_PADDING"
    | "LINE_GLYPH_COLLISION"
    | "FORCED_TRACKING_DISTORTION"
    | "ORPHAN_CHARACTER_BREAK"
    | "COMPETING_PRIMARY_TEXT"
    | "DENSITY_FORCED_COMPRESSION"
  )[];
  mechanical_geometry_checked: true;
  visual_spatial_qa_result: "PASS" | "FAIL" | "PENDING";
  result: "PASS" | "BLOCKED";
  visual_quality_eligible: boolean;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
