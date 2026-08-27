/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ImageTextIntegrationReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  integration_strategy: string;
  image_responsibility:
    | "INDUSTRY"
    | "BUSINESS_SCENE"
    | "AUDIENCE_CONTEXT"
    | "PAINPOINT"
    | "VALUE"
    | "SUBJECT"
    | "PERSON"
    | "PRODUCT"
    | "SPACE"
    | "EVIDENCE"
    | "EMOTION"
    | "SEMANTIC_METAPHOR";
  /**
   * @minItems 1
   */
  anchor_relationships: [string, ...string[]];
  key_evidence_obscured: false;
  generic_text_over_photo: boolean;
  /**
   * @minItems 5
   * @maxItems 5
   */
  dimensions: [
    {
      dimension:
        | "SUBJECT_OR_EDGE_RELATION"
        | "NEGATIVE_SPACE_RELATION"
        | "FOCUS_COOPERATION"
        | "EVIDENCE_VISIBILITY"
        | "READING_PATH_INTEGRATION";
      weight: 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "SUBJECT_OR_EDGE_RELATION"
        | "NEGATIVE_SPACE_RELATION"
        | "FOCUS_COOPERATION"
        | "EVIDENCE_VISIBILITY"
        | "READING_PATH_INTEGRATION";
      weight: 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "SUBJECT_OR_EDGE_RELATION"
        | "NEGATIVE_SPACE_RELATION"
        | "FOCUS_COOPERATION"
        | "EVIDENCE_VISIBILITY"
        | "READING_PATH_INTEGRATION";
      weight: 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "SUBJECT_OR_EDGE_RELATION"
        | "NEGATIVE_SPACE_RELATION"
        | "FOCUS_COOPERATION"
        | "EVIDENCE_VISIBILITY"
        | "READING_PATH_INTEGRATION";
      weight: 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "SUBJECT_OR_EDGE_RELATION"
        | "NEGATIVE_SPACE_RELATION"
        | "FOCUS_COOPERATION"
        | "EVIDENCE_VISIBILITY"
        | "READING_PATH_INTEGRATION";
      weight: 20;
      score: number;
      reason: string;
    },
  ];
  total_score: number;
  threshold: 85;
  hard_blocks: string[];
  result: "PASS_PENDING_OPERATOR" | "FAIL" | "BLOCKED";
  operator_approval_required: true;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
