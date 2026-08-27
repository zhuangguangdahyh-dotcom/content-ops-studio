/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverClickClarityReport {
  report_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string;
  account_goal:
    | "LEAD_GENERATION"
    | "BRAND_BUILDING"
    | "KNOWLEDGE_EDUCATION"
    | "PRODUCT_SALES"
    | "COMMUNITY"
    | "PORTFOLIO_SHOWCASE";
  cover_objective:
    | "AUDIENCE_FILTER"
    | "PAINPOINT_DIRECT"
    | "VALUE_DIRECT"
    | "RISK_WARNING"
    | "DECISION_CHECKLIST"
    | "RESULT_EVIDENCE"
    | "BRAND_STATEMENT";
  /**
   * @minItems 5
   * @maxItems 5
   */
  dimensions: [
    {
      dimension:
        | "TARGET_CUSTOMER_CLARITY"
        | "PAINPOINT_OR_VALUE_CLARITY"
        | "ONE_SECOND_COMPREHENSION"
        | "THUMBNAIL_LEGIBILITY"
        | "CONTENT_PROMISE_ALIGNMENT";
      weight: 10 | 20 | 25;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "TARGET_CUSTOMER_CLARITY"
        | "PAINPOINT_OR_VALUE_CLARITY"
        | "ONE_SECOND_COMPREHENSION"
        | "THUMBNAIL_LEGIBILITY"
        | "CONTENT_PROMISE_ALIGNMENT";
      weight: 10 | 20 | 25;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "TARGET_CUSTOMER_CLARITY"
        | "PAINPOINT_OR_VALUE_CLARITY"
        | "ONE_SECOND_COMPREHENSION"
        | "THUMBNAIL_LEGIBILITY"
        | "CONTENT_PROMISE_ALIGNMENT";
      weight: 10 | 20 | 25;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "TARGET_CUSTOMER_CLARITY"
        | "PAINPOINT_OR_VALUE_CLARITY"
        | "ONE_SECOND_COMPREHENSION"
        | "THUMBNAIL_LEGIBILITY"
        | "CONTENT_PROMISE_ALIGNMENT";
      weight: 10 | 20 | 25;
      score: number;
      reason: string;
    },
    {
      dimension:
        | "TARGET_CUSTOMER_CLARITY"
        | "PAINPOINT_OR_VALUE_CLARITY"
        | "ONE_SECOND_COMPREHENSION"
        | "THUMBNAIL_LEGIBILITY"
        | "CONTENT_PROMISE_ALIGNMENT";
      weight: 10 | 20 | 25;
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
