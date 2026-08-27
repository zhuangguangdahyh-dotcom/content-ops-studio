/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export type FirstPageReview = {
  [k: string]: unknown;
} & {
  first_page_review_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  asset_checksum: string;
  decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
  overall_comment: string;
  layout_feedback: string;
  typography_feedback: string;
  color_feedback: string;
  hierarchy_feedback: string;
  graphic_feedback: string;
  copy_feedback: string;
  /**
   * @maxItems 20
   */
  requested_changes:
    | []
    | [string]
    | [string, string]
    | [string, string, string]
    | [string, string, string, string]
    | [string, string, string, string, string]
    | [string, string, string, string, string, string]
    | [string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string]
    | [string, string, string, string, string, string, string, string, string, string, string]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ]
    | [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
  revision_classification:
    "NONE" | "RENDER_ONLY" | "PAGE_VISUAL_PLAN" | "GLOBAL_VISUAL_PLAN" | "CONTENT_COPY";
  /**
   * @minItems 1
   */
  revision_routes?: [
    "RENDER_ONLY" | "PAGE_VISUAL_PLAN" | "GLOBAL_VISUAL_DIRECTION" | "CONTENT_COPY",
    ...("RENDER_ONLY" | "PAGE_VISUAL_PLAN" | "GLOBAL_VISUAL_DIRECTION" | "CONTENT_COPY")[],
  ];
  reviewer_role: "OPERATOR";
  source_run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
