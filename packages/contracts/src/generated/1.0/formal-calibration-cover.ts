/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FormalCalibrationCover {
  formal_cover_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  calibration_cover_version: string;
  selection_id: string;
  selected_candidate_id: string;
  selected_candidate_checksum: string;
  asset_id: string;
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
  thumbnail_310: {
    asset_ref: string;
    checksum: string;
    width: number;
    height: number;
    actual_pixel_inspection: "PASS";
  };
  thumbnail_186: {
    asset_ref: string;
    checksum: string;
    width: number;
    height: number;
    actual_pixel_inspection: "PASS";
  };
  attention_mode: "TYPE_DOMINANT";
  composition_family:
    | "FULL_BLEED_ANCHORED"
    | "ASYMMETRIC_NEGATIVE_SPACE"
    | "IMAGE_TEXT_INTERLOCK"
    | "CROP_LAYERED"
    | "MULTI_EVIDENCE_EDITORIAL"
    | "TYPOGRAPHIC_FIELD"
    | "DIAGNOSTIC_COMPOSITION"
    | "SPLIT_DEPTH"
    | "EDGE_ANCHORED"
    | "SUBJECT_OVERLAP";
  asset_channel: "AI_GENERATED_VISUAL";
  visual_mode: "EDITORIAL_SERIES";
  primary_hook: string;
  supporting_signal: string;
  font_resolution: {
    requested_font_family: "MODERN_CHINESE_SERIF";
    resolved_font_family: string;
    title_weight: number;
    supporting_weight: number;
    synthetic_bold: false;
    font_downloaded: false;
    silent_pingfang_fallback: false;
  };
  scores: {
    cover_attention: number;
    click_clarity: number;
    semantic_relevance: number;
    painpoint_scene: number;
    editorial_spatial: number;
    image_text_integration: number;
    image_quality: number;
  };
  quality_gates: {
    authenticity_integrity: "PASS";
    mechanical: "PASS";
    copy_fidelity: "PASS";
    typography_policy: "PASS";
    typography_spatial_integrity: "PASS";
    typography_breathing_room: "PASS";
    thumbnail: "PASS";
    locale_fit: "PASS";
    visual_mass: "PASS";
    greyscale_hierarchy: "PASS";
    color_intelligence: "PASS";
    typography_as_form: "PASS";
    actual_pixel_inspection: "PASS";
  };
  /**
   * @maxItems 0
   */
  hard_blocks: [];
  same_as_candidate_asset: false;
  deterministic_replay: true;
  g4_eligible: true;
  operator_approved: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
