/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Renderer-complete, copy-equivalent direction previews and an external-label contact sheet that preserve the source candidates.
 */
export interface VisualDirectionComparisonSet {
  comparison_set_id: string;
  project_id: string;
  content_id: string;
  source_candidate_set_id: string;
  source_run_id: string;
  feedback_event_id: string;
  status: "AWAITING_USER_SELECTION";
  approved_copy: {
    body: string;
    approved_text_only: true;
    renderer_only: true;
  };
  preview_conditions: {
    width: 1242;
    height: 1660;
    aspect_ratio: "3:4";
    same_copy: true;
    same_scale_in_contact_sheet: true;
    candidate_labels_outside_frames: true;
    text_overflow_free: true;
    mobile_title_legible: true;
  };
  /**
   * @minItems 3
   * @maxItems 3
   */
  previews: [
    {
      candidate_id: string;
      original_asset_id: string;
      original_checksum: string;
      preview_asset: {
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
      quality_report_id: string;
      quality_score: number;
      content_match_strength: string;
      aesthetic_risk: string;
      mobile_thumbnail_performance: "PASS" | "FAIL";
      host_imagegen_dependency: boolean;
      renderer_dependency: true;
    },
    {
      candidate_id: string;
      original_asset_id: string;
      original_checksum: string;
      preview_asset: {
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
      quality_report_id: string;
      quality_score: number;
      content_match_strength: string;
      aesthetic_risk: string;
      mobile_thumbnail_performance: "PASS" | "FAIL";
      host_imagegen_dependency: boolean;
      renderer_dependency: true;
    },
    {
      candidate_id: string;
      original_asset_id: string;
      original_checksum: string;
      preview_asset: {
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
      quality_report_id: string;
      quality_score: number;
      content_match_strength: string;
      aesthetic_risk: string;
      mobile_thumbnail_performance: "PASS" | "FAIL";
      host_imagegen_dependency: boolean;
      renderer_dependency: true;
    },
  ];
  contact_sheet_asset: {
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
  long_term_rule_candidate: false;
  formal_delivery_count: 0;
  feishu_formal_write_count: 0;
  vv2_created: false;
  fpv2_created: false;
  g4_created: false;
  style_lock_created: false;
  remaining_pages_created: 0;
  idempotency_key: string;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
