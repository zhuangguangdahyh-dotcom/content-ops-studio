/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualDirectionCandidateSet {
  candidate_set_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  source_visual_plan_version: string;
  status: "PLANNED" | "GENERATING" | "AWAITING_USER_SELECTION" | "SELECTED" | "BLOCKED";
  /**
   * @minItems 2
   * @maxItems 3
   */
  candidates:
    | [
        {
          candidate_id: string;
          asset_id: string;
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
          composition_summary: string;
          /**
           * @minItems 2
           */
          palette: [string, string, ...string[]];
          typography_character: string;
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
          quality_score: number;
          /**
           * @maxItems 0
           */
          hard_blocks: [];
          host_imagegen: boolean;
          renderer: boolean;
          delivery_role: "DIRECTION_CANDIDATE_ONLY";
        },
        {
          candidate_id: string;
          asset_id: string;
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
          composition_summary: string;
          /**
           * @minItems 2
           */
          palette: [string, string, ...string[]];
          typography_character: string;
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
          quality_score: number;
          /**
           * @maxItems 0
           */
          hard_blocks: [];
          host_imagegen: boolean;
          renderer: boolean;
          delivery_role: "DIRECTION_CANDIDATE_ONLY";
        },
      ]
    | [
        {
          candidate_id: string;
          asset_id: string;
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
          composition_summary: string;
          /**
           * @minItems 2
           */
          palette: [string, string, ...string[]];
          typography_character: string;
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
          quality_score: number;
          /**
           * @maxItems 0
           */
          hard_blocks: [];
          host_imagegen: boolean;
          renderer: boolean;
          delivery_role: "DIRECTION_CANDIDATE_ONLY";
        },
        {
          candidate_id: string;
          asset_id: string;
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
          composition_summary: string;
          /**
           * @minItems 2
           */
          palette: [string, string, ...string[]];
          typography_character: string;
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
          quality_score: number;
          /**
           * @maxItems 0
           */
          hard_blocks: [];
          host_imagegen: boolean;
          renderer: boolean;
          delivery_role: "DIRECTION_CANDIDATE_ONLY";
        },
        {
          candidate_id: string;
          asset_id: string;
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
          composition_summary: string;
          /**
           * @minItems 2
           */
          palette: [string, string, ...string[]];
          typography_character: string;
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
          quality_score: number;
          /**
           * @maxItems 0
           */
          hard_blocks: [];
          host_imagegen: boolean;
          renderer: boolean;
          delivery_role: "DIRECTION_CANDIDATE_ONLY";
        },
      ];
  material_difference_verified: true;
  formal_delivery_count: 0;
  feishu_formal_write_count: 0;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
