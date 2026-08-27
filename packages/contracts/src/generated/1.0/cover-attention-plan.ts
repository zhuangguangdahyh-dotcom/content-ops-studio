/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverAttentionPlan {
  plan_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  page_design_intent: "COVER_ENTRY";
  mode:
    | "TYPE_DOMINANT"
    | "IMAGE_DOMINANT"
    | "TYPE_IMAGE_COLLISION"
    | "CROP_DOMINANT"
    | "COLOR_DOMINANT"
    | "EVIDENCE_DOMINANT"
    | "CONTRAST_DOMINANT"
    | "HYBRID_ATTENTION";
  primary_attention: string;
  secondary_attention: string;
  tertiary_attention: string;
  primary_hook: string;
  visual_hook: string;
  visual_mass_plan: string;
  scale_contrast: string;
  crop_strategy: string;
  grid_strategy: string;
  grid_break_strategy: string;
  negative_space_strategy: string;
  image_type_relation: string;
  color_strategy: {
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
  silhouette_strategy: string;
  information_compression: string;
  motif: string;
  rationale: string;
  risks: string[];
  runtime_browsing: false;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
