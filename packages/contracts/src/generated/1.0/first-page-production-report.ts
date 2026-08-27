/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FirstPageProductionReport {
  first_page_production_report_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  production_plan_ref: string;
  renderer_environment_ref: string;
  generation_manifest_ref: string;
  render_report_ref: string;
  qa_report_ref: string;
  background_asset_ref: {
    asset_id: string;
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "RENDERED_PAGE"
      | "FINAL_PAGE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE";
    asset_type: "IMAGE" | "TEXT" | "JSON" | "DOCUMENT";
    mime_type: string;
    relative_path: string;
    source_type:
      | "MOCK"
      | "PROMPT_ONLY"
      | "PROGRAMMATIC"
      | "GENERATED"
      | "RENDERED"
      | "OPERATOR_SUPPLIED"
      | "LOCAL_EDIT"
      | "HOST_NATIVE_IMAGEGEN";
    source_adapter: string;
    source_run_id: string;
    source_generation_id: string | null;
    version: number;
    width: number | null;
    height: number | null;
    file_size: number;
    checksum: string;
    created_at: string;
    extensions: {
      [k: string]: unknown;
    };
  };
  rendered_asset_ref: {
    asset_id: string;
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "RENDERED_PAGE"
      | "FINAL_PAGE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE";
    asset_type: "IMAGE" | "TEXT" | "JSON" | "DOCUMENT";
    mime_type: string;
    relative_path: string;
    source_type:
      | "MOCK"
      | "PROMPT_ONLY"
      | "PROGRAMMATIC"
      | "GENERATED"
      | "RENDERED"
      | "OPERATOR_SUPPLIED"
      | "LOCAL_EDIT"
      | "HOST_NATIVE_IMAGEGEN";
    source_adapter: string;
    source_run_id: string;
    source_generation_id: string | null;
    version: number;
    width: number | null;
    height: number | null;
    file_size: number;
    checksum: string;
    created_at: string;
    extensions: {
      [k: string]: unknown;
    };
  };
  output_width: 1242;
  output_height: 1660;
  output_format: "PNG";
  output_checksum: string;
  copy_fidelity_status: "PASS" | "FAIL";
  layout_status: "PASS" | "FAIL";
  safe_area_status: "PASS" | "FAIL";
  font_status: "PASS" | "PASS_WITH_WARNING" | "FAIL";
  network_status: "PASS_NO_ATTEMPTS" | "PASS_ALL_BLOCKED" | "FAIL";
  ready_for_g4: boolean;
  blocking_reasons: string[];
  warnings: string[];
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
