/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualAssetRoutingPlan {
  routing_plan_id: string;
  context_id: string;
  project_id: string;
  content_id: string;
  /**
   * @minItems 1
   */
  routes: [
    {
      page_number: number;
      asset_channel:
        | "PROJECT_ASSET"
        | "AI_GENERATED_VISUAL"
        | "PROGRAMMATIC_GRAPHIC"
        | "EVIDENCE_ASSET"
        | "PURE_TYPOGRAPHY"
        | "MIXED_ASSET";
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      purpose: string;
      formal_text_policy: "RENDERER_ONLY";
      requires_authorization: boolean;
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
      visual_mode:
        | "SCENE_SERIES"
        | "EDITORIAL_SERIES"
        | "PRODUCT_LIFESTYLE"
        | "EVIDENCE_LED"
        | "MIXED"
        | "CHARACTER_SERIES"
        | "PURE_TYPOGRAPHY";
      purpose: string;
      formal_text_policy: "RENDERER_ONLY";
      requires_authorization: boolean;
    }[],
  ];
  /**
   * @minItems 9
   * @maxItems 9
   */
  priority_order: [string, string, string, string, string, string, string, string, string];
  requires_direction_candidates: boolean;
  blocked_reasons: string[];
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
