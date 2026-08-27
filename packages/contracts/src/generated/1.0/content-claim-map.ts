/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ContentClaimMap {
  claim_map_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  /**
   * @minItems 1
   */
  claims: [
    {
      claim_id: string;
      page_number: number;
      claim_type:
        | "FACTUAL_EXTERNAL"
        | "PROJECT_FIRST_PARTY"
        | "PROFESSIONAL_JUDGMENT"
        | "OPINION"
        | "EXAMPLE"
        | "CALL_TO_ACTION";
      claim_text: string;
      evidence_refs: string[];
      support_status:
        | "SUPPORTED"
        | "SUPPORTED_WITH_LIMITATIONS"
        | "JUDGMENT_NO_EXTERNAL_EVIDENCE_REQUIRED"
        | "OPINION_NO_EXTERNAL_EVIDENCE_REQUIRED"
        | "UNSUPPORTED"
        | "REWRITE_REQUIRED";
      support_rationale: string;
      limitations: string[];
      rewrite_requirement: string | null;
    },
    ...{
      claim_id: string;
      page_number: number;
      claim_type:
        | "FACTUAL_EXTERNAL"
        | "PROJECT_FIRST_PARTY"
        | "PROFESSIONAL_JUDGMENT"
        | "OPINION"
        | "EXAMPLE"
        | "CALL_TO_ACTION";
      claim_text: string;
      evidence_refs: string[];
      support_status:
        | "SUPPORTED"
        | "SUPPORTED_WITH_LIMITATIONS"
        | "JUDGMENT_NO_EXTERNAL_EVIDENCE_REQUIRED"
        | "OPINION_NO_EXTERNAL_EVIDENCE_REQUIRED"
        | "UNSUPPORTED"
        | "REWRITE_REQUIRED";
      support_rationale: string;
      limitations: string[];
      rewrite_requirement: string | null;
    }[],
  ];
  supported_claim_count: number;
  unsupported_claim_count: number;
  judgment_claim_count: number;
  opinion_claim_count: number;
  ready_for_copy_review: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
