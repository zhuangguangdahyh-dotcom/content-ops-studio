/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deduplicated source metadata and bounded summaries; full page bodies are forbidden.
 */
export interface ResearchSourceManifest {
  manifest_id: string;
  research_plan_id: string;
  project_id: string;
  run_id: string;
  /**
   * @minItems 1
   */
  sources: [
    {
      source_id: string;
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
        | "MANUAL_SOURCE";
      publisher_or_owner: string;
      source_location: string;
      source_date: string | null;
      retrieved_at: string;
      language: string;
      summary: string;
      /**
       * @minItems 1
       */
      supported_claims: [string, ...string[]];
      limitations: string;
      credibility_notes: string;
      is_first_party: boolean;
      is_user_provided: boolean;
      is_current: boolean;
      duplicate_of: string | null;
      content_hash: string;
      extensions: {
        [k: string]: unknown;
      };
    },
    ...{
      source_id: string;
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
        | "MANUAL_SOURCE";
      publisher_or_owner: string;
      source_location: string;
      source_date: string | null;
      retrieved_at: string;
      language: string;
      summary: string;
      /**
       * @minItems 1
       */
      supported_claims: [string, ...string[]];
      limitations: string;
      credibility_notes: string;
      is_first_party: boolean;
      is_user_provided: boolean;
      is_current: boolean;
      duplicate_of: string | null;
      content_hash: string;
      extensions: {
        [k: string]: unknown;
      };
    }[],
  ];
  source_count: number;
  source_type_counts: {
    [k: string]: number;
  };
  duplicate_source_count: number;
  rejected_source_count: number;
  retrieved_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
