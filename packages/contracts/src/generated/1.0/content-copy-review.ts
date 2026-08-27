/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export type ContentCopyReview = {
  [k: string]: unknown;
} & {
  copy_review_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
  overall_comment: string;
  title_feedback: string;
  body_feedback: string;
  cta_feedback: string;
  page_feedback: {
    page_number: number;
    comment: string;
    requested_change: string;
  }[];
  requested_changes: string[];
  reviewer_role: "OPERATOR";
  source_run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
