/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Immutable attempt history for a requested visual asset; success is never implied.
 */
export interface GenerationManifest {
  generation_id: string;
  project_id: string;
  content_id: string;
  page_number: number;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version: string | null;
  generation_type:
    | "PROGRAMMATIC_GRAPHIC"
    | "FIRST_PAGE_BACKGROUND"
    | "PAGE_BACKGROUND"
    | "ILLUSTRATION"
    | "PRODUCT_IMAGE"
    | "EVIDENCE_ASSET"
    | "HOST_NATIVE_IMAGEGEN"
    | "DIRECTION_CANDIDATE"
    | "REGENERATION"
    | "LOCAL_EDIT";
  adapter: string;
  provider: {
    provider_name: string;
    request_identifier: string | null;
  };
  model_descriptor: {
    model_name: string;
    model_version: string;
  };
  input_assets: {
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
  }[];
  reference_assets: {
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
  }[];
  prompt_snapshot: string;
  negative_constraints: string[];
  requested_output: {
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE"
      | "FORMAL_ASSET";
    mime_type: string;
    canvas: {
      width: number;
      height: number;
      aspect_ratio: string;
      orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
      resolution_unit: "PX";
    };
    relative_path: string;
  };
  attempts: {
    attempt_number: number;
    status: "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "CANCELLED";
    version_binding: {
      content_version: string;
      copy_version: string;
      visual_plan_version: string;
      style_lock_version: string | null;
      asset_version: number;
    };
    request_summary: string;
    output_asset_refs: string[];
    failure_code: string | null;
    failure_message: string | null;
    started_at: string;
    completed_at: string | null;
  }[];
  output_assets: {
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
  }[];
  generation_status:
    | "GENERATION_PENDING"
    | "GENERATION_RUNNING"
    | "GENERATION_SUCCESS"
    | "GENERATION_PARTIAL"
    | "GENERATION_FAILED"
    | "GENERATION_CANCELLED";
  failure_summary: string | null;
  warnings: string[];
  run_id: string;
  schema_version: "1.0.0";
  started_at: string;
  completed_at: string | null;
  extensions: {
    [k: string]: unknown;
  };
}
