/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ImageProductionBatchPlan {
  batch_plan_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version: string | null;
  final_page_count: number;
  source_asset_count: number;
  direction_candidate_count: number;
  formal_candidate_count: number;
  generation_attempt_count: number;
  failed_attempt_count: number;
  retained_history_count: number;
  /**
   * @minItems 1
   */
  pages: [
    {
      page_number: number;
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      status: "BLOCKED_BY_G4" | "ELIGIBLE" | "PLANNED";
    },
    ...{
      page_number: number;
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      status: "BLOCKED_BY_G4" | "ELIGIBLE" | "PLANNED";
    }[],
  ];
  requires_g4: boolean;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
