/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualSemanticRelevanceReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  semantic_role:
    | "DIRECT_INDUSTRY_SCENE"
    | "DIRECT_BUSINESS_SCENE"
    | "DIRECT_CUSTOMER_SCENE"
    | "DIRECT_PAINPOINT_SCENE"
    | "DIRECT_VALUE_SCENE"
    | "PROJECT_ASSET"
    | "SUBJECT_PERSON"
    | "PRODUCT_SUBJECT"
    | "SPACE_SUBJECT"
    | "EVIDENCE_ASSET"
    | "ABSTRACT_SEMANTIC"
    | "DECORATIVE_ONLY";
  direct_relation_statement: string;
  /**
   * @minItems 6
   * @maxItems 6
   */
  dimensions: [
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "INDUSTRY_RELEVANCE"
        | "BUSINESS_SCENE_RELEVANCE"
        | "PAINPOINT_RELEVANCE"
        | "CONTENT_VALUE_RELEVANCE"
        | "PROJECT_OR_SUBJECT_RELEVANCE"
        | "AUDIENCE_RECOGNITION";
      weight: 10 | 15 | 20;
      score: number;
      reason: string;
    },
  ];
  total_score: number;
  threshold: number;
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
