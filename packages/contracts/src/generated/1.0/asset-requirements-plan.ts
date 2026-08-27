/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface AssetRequirementsPlan {
  asset_requirements_plan_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  /**
   * @minItems 1
   */
  pages: [
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      asset_source_strategy:
        | "PROJECT_ASSET"
        | "USER_REFERENCE"
        | "HISTORICAL_STYLE"
        | "EVIDENCE_SCREENSHOT"
        | "GENERATED_BACKGROUND"
        | "PROGRAMMATIC_GRAPHIC"
        | "LICENSED_ASSET"
        | "NO_BACKGROUND_ASSET";
      asset_purpose: string;
      asset_description: string;
      required_assets: string[];
      optional_assets: string[];
      reference_asset_ids: string[];
      generation_required: boolean;
      programmatic_render_required: boolean;
      evidence_asset_required: boolean;
      aspect_ratio: "3:4";
      composition: string;
      subject: string | null;
      environment: string | null;
      camera_direction: string | null;
      lighting_direction: string | null;
      material_direction: string | null;
      prohibited_content: string[];
      informational_text_in_background_allowed: false;
      fallback_strategy: string;
    },
    ...{
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      asset_source_strategy:
        | "PROJECT_ASSET"
        | "USER_REFERENCE"
        | "HISTORICAL_STYLE"
        | "EVIDENCE_SCREENSHOT"
        | "GENERATED_BACKGROUND"
        | "PROGRAMMATIC_GRAPHIC"
        | "LICENSED_ASSET"
        | "NO_BACKGROUND_ASSET";
      asset_purpose: string;
      asset_description: string;
      required_assets: string[];
      optional_assets: string[];
      reference_asset_ids: string[];
      generation_required: boolean;
      programmatic_render_required: boolean;
      evidence_asset_required: boolean;
      aspect_ratio: "3:4";
      composition: string;
      subject: string | null;
      environment: string | null;
      camera_direction: string | null;
      lighting_direction: string | null;
      material_direction: string | null;
      prohibited_content: string[];
      informational_text_in_background_allowed: false;
      fallback_strategy: string;
    }[],
  ];
  global_asset_rules: string[];
  shared_assets: string[];
  unresolved_assets: string[];
  generation_required_count: number;
  programmatic_graphic_count: number;
  project_asset_count: number;
  evidence_asset_count: number;
  no_asset_count: number;
  ready_for_first_page: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
