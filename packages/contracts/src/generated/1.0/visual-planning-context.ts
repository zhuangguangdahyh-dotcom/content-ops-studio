/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualPlanningContext {
  visual_context_id: string;
  project_id: string;
  content_id: string;
  content_status: "COPY_APPROVED";
  content_version: string;
  copy_version: string;
  g3_approval_id: string;
  g3_target_version: string;
  content_package_ref: string;
  content_package_hash: string;
  /**
   * @minItems 1
   */
  page_copy_hashes: [
    {
      page_number: number;
      copy_hash: string;
    },
    ...{
      page_number: number;
      copy_hash: string;
    }[],
  ];
  project_profile_version: number;
  project_visual_preferences: string[];
  project_content_style: string[];
  project_expression_tone: string[];
  active_project_rules: string[];
  rejected_directions: string[];
  platform_pack: {
    id: string;
    version: string;
  };
  industry_pack: {
    id: string;
    version: string;
  };
  historical_visual_plans: string[];
  approved_style_refs: string[];
  available_project_assets: {
    asset_id: string;
    asset_type: string;
    storage_ref: string;
    permission_status: "AUTHORIZED" | "RESTRICTED" | "UNKNOWN";
  }[];
  available_evidence_assets: {
    asset_id: string;
    evidence_id: string;
    storage_ref: string;
    permission_status: "AUTHORIZED" | "RESTRICTED" | "UNKNOWN";
  }[];
  visual_constraints: string[];
  user_overrides: string[];
  capability_snapshot: {
    programmatic_graphics: boolean;
    image_generation: boolean;
    renderer: boolean;
    attachment_upload: boolean;
  };
  ready_for_visual_planning: boolean;
  blocking_reasons: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
