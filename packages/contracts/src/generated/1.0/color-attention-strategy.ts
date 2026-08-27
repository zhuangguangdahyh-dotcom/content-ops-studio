/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ColorAttentionStrategy {
  report_id: string;
  candidate_id: string;
  grayscale_structure_score: number;
  grayscale_check: "PASS" | "COLOR_NOT_ALLOWED_TO_RESCUE_STRUCTURE";
  hierarchy_aligned: boolean;
  color_dimensions: {
    hue: string;
    value: string;
    saturation: string;
    temperature: string;
    quantity: {
      dominant: number;
      support: number;
      accent: number;
    };
  };
  hard_blocks: (
    | "COVER_ATTENTION_DOMINANCE_BLOCKED"
    | "PRIMARY_HOOK_TOO_WEAK"
    | "MULTIPLE_PRIMARY_FOCI"
    | "ONE_SECOND_RECOGNITION_FAILED"
    | "THUMBNAIL_IMPACT_WEAK"
    | "VISUAL_MASS_HIERARCHY_WEAK"
    | "COVER_INFORMATION_OVERLOADED"
    | "COVER_SILHOUETTE_GENERIC"
    | "SCROLL_STOPPING_CONTRAST_WEAK"
    | "EDITORIAL_TENSION_WEAK"
    | "COLOR_RESCUES_WEAK_STRUCTURE"
    | "COLOR_HIERARCHY_CONFLICT"
    | "COVER_INNER_PAGE_UNDIFFERENTIATED"
  )[];
  result: "PASS" | "BLOCKED";
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
