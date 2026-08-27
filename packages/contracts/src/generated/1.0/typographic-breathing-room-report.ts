/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface TypographicBreathingRoomReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  title_to_secondary_distance_px: number;
  title_to_secondary_ratio: number;
  reference_soft_range: {
    minimum: 0.5;
    maximum: 1;
    fixed_pixel_rule: false;
  };
  minimum_container_padding_px: number | null;
  minimum_text_to_image_distance_px: number;
  text_to_image_distance_ratio: number;
  information_groups_visually_distinct: boolean;
  visual_pressure_detected: boolean;
  score: number;
  hard_blocks: "TYPOGRAPHIC_BREATHING_ROOM_WEAK"[];
  result: "PASS" | "BLOCKED";
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
