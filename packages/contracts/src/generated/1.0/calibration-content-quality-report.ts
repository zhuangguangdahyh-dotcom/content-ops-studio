/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationContentQualityReport {
  quality_report_id: string;
  /**
   * Distinguishes canonical Production projects from isolated fictional Calibration projects without widening Production project identifiers.
   */
  project_ref:
    | {
        project_kind: "PRODUCTION_PROJECT";
        project_id: string;
      }
    | {
        project_kind: "CALIBRATION_PROJECT";
        project_id: string;
      };
  content_id: string;
  content_version: string;
  copy_version: string;
  page_count: number;
  /**
   * @minItems 13
   * @maxItems 13
   */
  checks: [
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
    {
      check:
        | "COVER_PROMISE_ALIGNMENT"
        | "AUDIENCE_FIT"
        | "PAINPOINT_CONSISTENCY"
        | "PAGE_ROLE_DISTINCTION"
        | "PAGE_INTENT_FIT"
        | "ONE_PRIMARY_JUDGMENT_PER_PAGE"
        | "NARRATIVE_PROGRESSION"
        | "VALUE_DELIVERY"
        | "CLAIM_SAFETY"
        | "UNSUPPORTED_CLAIM"
        | "COPY_DENSITY"
        | "REPETITION"
        | "SUMMARY_CONSISTENCY";
      score: number;
      passed: boolean;
      blocking: boolean;
      rationale: string;
    },
  ];
  weighted_score: number;
  blocking_failures: string[];
  ready_for_g3: boolean;
  revision_suggestions: string[];
  production_workspace_write_eligible: false;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
