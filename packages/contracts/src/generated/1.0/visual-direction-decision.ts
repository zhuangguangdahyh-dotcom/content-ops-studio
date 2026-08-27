/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualDirectionDecision {
  visual_direction_decision_id: string;
  visual_context_id: string;
  /**
   * @minItems 1
   */
  candidates: [
    {
      candidate_id: string;
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      direction_name: string;
      direction_summary: string;
      content_fit: string;
      industry_fit: string;
      platform_fit: string;
      project_fit: string;
      asset_feasibility: string;
      text_density_fit: string;
      background_strategy: string;
      typography_strategy: string;
      color_strategy: string;
      layout_strategy: string;
      evidence_strategy: string;
      strengths: string[];
      limitations: string[];
      blocking_risks: string[];
      score: number;
    },
    ...{
      candidate_id: string;
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      direction_name: string;
      direction_summary: string;
      content_fit: string;
      industry_fit: string;
      platform_fit: string;
      project_fit: string;
      asset_feasibility: string;
      text_density_fit: string;
      background_strategy: string;
      typography_strategy: string;
      color_strategy: string;
      layout_strategy: string;
      evidence_strategy: string;
      strengths: string[];
      limitations: string[];
      blocking_risks: string[];
      score: number;
    }[],
  ];
  selected_candidate_id: string;
  selection_rationale: string;
  user_fixed_mode:
    | (
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY"
      )
    | null;
  user_fixed_direction: string | null;
  user_rejected_modes: (
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY"
  )[];
  user_rejected_directions: string[];
  industry_mode_preferences: (
    | "SCENE_SERIES"
    | "EDITORIAL_SERIES"
    | "PRODUCT_LIFESTYLE"
    | "EVIDENCE_LED"
    | "MIXED"
    | "CHARACTER_SERIES"
    | "PURE_TYPOGRAPHY"
  )[];
  platform_constraints: string[];
  asset_feasibility: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
