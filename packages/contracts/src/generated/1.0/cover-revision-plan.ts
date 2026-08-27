/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverRevisionPlan {
  revision_plan_id: string;
  project_id: string;
  content_id: string;
  source_content_version: string;
  source_copy_version: string;
  source_visual_plan_version: string;
  source_first_page_version: string;
  source_asset_checksum: string;
  /**
   * @minItems 1
   */
  revision_routes: [
    "RENDER_ONLY" | "PAGE_VISUAL_PLAN" | "GLOBAL_VISUAL_DIRECTION" | "CONTENT_COPY",
    ...("RENDER_ONLY" | "PAGE_VISUAL_PLAN" | "GLOBAL_VISUAL_DIRECTION" | "CONTENT_COPY")[],
  ];
  next_content_version: string;
  next_copy_version: string;
  next_cover_copy_version: string;
  requires_new_g3: true;
  preserve_source_asset: true;
  negative_reference_scope: "CURRENT_SET";
  next_action: "COVER_COPY_REVISION_REQUIRED";
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
