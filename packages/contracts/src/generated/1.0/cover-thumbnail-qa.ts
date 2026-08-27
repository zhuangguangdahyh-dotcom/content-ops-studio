/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverThumbnailQa {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  source_asset_checksum: string;
  /**
   * @minItems 2
   * @maxItems 2
   */
  thumbnails: [
    {
      size: "310x414" | "186x248";
      width: 186 | 310;
      height: 248 | 414;
      relative_path: string;
      checksum: string;
      primary_effective_font_px: number;
      secondary_effective_font_px: number;
      readable: boolean;
    },
    {
      size: "310x414" | "186x248";
      width: 186 | 310;
      height: 248 | 414;
      relative_path: string;
      checksum: string;
      primary_effective_font_px: number;
      secondary_effective_font_px: number;
      readable: boolean;
    },
  ];
  primary_hook_lines: number;
  primary_hook_first_focus: boolean;
  single_click_message: boolean;
  audience_or_painpoint_or_value_clear: boolean;
  background_competes: boolean;
  small_paragraph_present: boolean;
  text_background_contrast: number;
  text_visual_share: number;
  business_scene_recognizable: boolean;
  hard_blocks: string[];
  result: "PASS" | "FAIL" | "BLOCKED";
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
