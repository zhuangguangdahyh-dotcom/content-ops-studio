/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Structured evidence with claims, confidence, citation, and limitations.
 */
export type EvidenceRecord = {
  [k: string]: unknown;
} & {
  evidence_id: string;
  project_id: string;
  source_type:
    | "OFFICIAL_SOURCE"
    | "FIRST_PARTY_DATA"
    | "CUSTOMER_MATERIAL"
    | "CUSTOMER_INTERVIEW"
    | "INDUSTRY_REPORT"
    | "PLATFORM_DOCUMENTATION"
    | "SOCIAL_COMMENT"
    | "PUBLIC_REVIEW"
    | "COMPETITOR_CONTENT"
    | "QUESTION_AND_ANSWER"
    | "FORUM"
    | "NEWS"
    | "MANUAL_SOURCE"
    | "MODEL_HYPOTHESIS";
  source_name: string;
  source_location: string;
  source_date: string | null;
  retrieved_at: string;
  summary: string;
  /**
   * @minItems 1
   */
  supported_claims: [string, ...string[]];
  confidence: "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
  is_first_party: boolean;
  citation_locator: string;
  limitations: string;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
};
