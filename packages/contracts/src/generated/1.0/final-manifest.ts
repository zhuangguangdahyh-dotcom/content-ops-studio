/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Immutable approved final-set manifest with current QA, G5, assets, and independent sync status.
 */
export interface FinalManifest {
  final_manifest_id: string;
  project_id: string;
  project_kind: "PRODUCTION" | "CALIBRATION" | "TEST_FIXTURE";
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  style_lock_version: string;
  style_lock_id: string;
  g3_approval_id: string;
  g4_approval_id: string;
  final_approval_id: string;
  final_approval_target_version: string;
  /**
   * A single explicit human decision bound to one target version.
   */
  final_approval: {
    approval_id: string;
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type:
      | "PROJECT"
      | "PAINPOINT_BATCH"
      | "CONTENT"
      | "CONTENT_PACKAGE"
      | "FIRST_PAGE_ASSET"
      | "IMAGE_SET";
    target_id: string;
    target_version: string;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    comment: string;
    source_run_id: string;
    created_at: string;
    deprecated_at?: string | null;
    schema_version: "1.0.0";
  };
  qa_report_id: string;
  qa_status: "QA_PASSED" | "QA_PASSED_WITH_WARNINGS";
  final_output_directory: string;
  /**
   * @minItems 1
   */
  final_assets: [
    {
      page_number: number;
      page_role: string;
      page_intent: string;
      asset_channel: "AI_GENERATED_VISUAL_RENDERER" | "PURE_RENDERER" | "OPERATOR_ASSET_RENDERER";
      renderer_provenance: string;
      imagegen_provenance: string | null;
      single_page_qa_ref: string;
      asset: {
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
    },
    ...{
      page_number: number;
      page_role: string;
      page_intent: string;
      asset_channel: "AI_GENERATED_VISUAL_RENDERER" | "PURE_RENDERER" | "OPERATOR_ASSET_RENDERER";
      renderer_provenance: string;
      imagegen_provenance: string | null;
      single_page_qa_ref: string;
      asset: {
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
    }[],
  ];
  content_package_ref: string;
  visual_system_ref: string;
  style_lock_ref: string;
  /**
   * @minItems 1
   */
  generation_manifest_refs: [string, ...string[]];
  /**
   * @minItems 1
   */
  render_report_refs: [string, ...string[]];
  checksums: {
    [k: string]: string;
  };
  file_count: number;
  page_count: number;
  group_evidence: {
    strategy_ref: string;
    continuity_report_ref: string;
    group_qa_ref: string;
    /**
     * @minItems 3
     */
    contact_sheet_refs: [string, string, string, ...string[]];
  };
  final_manifest_version: string;
  finalized_by: "CONTENT_OPS_RUNTIME";
  origin: "RUNTIME_FINALIZATION";
  business_status: "CONTENT_FINALIZED";
  image_status: "IMAGE_SET_GENERATED";
  sync_status:
    "SYNC_NOT_STARTED" | "SYNC_IN_PROGRESS" | "SYNC_COMPLETED" | "SYNC_PARTIAL" | "SYNC_FAILED";
  finalized_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
