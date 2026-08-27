/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Version-bound item decisions for G2 PAINPOINTS review.
 */
export interface PainpointReviewBatch {
  review_batch_id: string;
  research_batch_id: string;
  project_id: string;
  painpoint_batch_version: number;
  review_version: number;
  /**
   * @minItems 1
   */
  items: [
    {
      painpoint_id: string;
      painpoint_version: number;
      decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
      comment: string;
      requested_changes: string[];
    },
    ...{
      painpoint_id: string;
      painpoint_version: number;
      decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
      comment: string;
      requested_changes: string[];
    }[],
  ];
  summary_decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE" | "MIXED";
  approved_count: number;
  revision_required_count: number;
  rejected_count: number;
  paused_count: number;
  reviewer_role: "OPERATOR";
  source_run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
