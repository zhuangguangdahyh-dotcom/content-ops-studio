/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualPlanRevision {
  visual_revision_plan_id: string;
  project_id: string;
  content_id: string;
  from_visual_plan_version: string;
  to_visual_plan_version: string;
  revision_scope:
    | "GLOBAL_DIRECTION"
    | "VISUAL_MODE"
    | "COLOR_SYSTEM"
    | "TYPOGRAPHY_SYSTEM"
    | "LAYOUT_SYSTEM"
    | "PAGE_PLAN"
    | "ASSET_STRATEGY"
    | "TEXT_LAYER_ONLY"
    | "FULL_VISUAL_REPLAN";
  direction_changes: string[];
  mode_changes: string[];
  color_changes: string[];
  typography_changes: string[];
  layout_changes: string[];
  page_changes: string[];
  asset_strategy_changes: string[];
  preserved_elements: string[];
  invalidated_artifacts: string[];
  requires_content_revision: boolean;
  requires_new_g3: boolean;
  requires_first_page_regeneration: false;
  requires_new_g4: false;
  dry_run: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
