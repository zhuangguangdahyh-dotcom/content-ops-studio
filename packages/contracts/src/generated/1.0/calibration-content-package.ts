/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * A versioned, local-only fictional Calibration Content Package that cannot authorize Production Workspace writes.
 */
export interface CalibrationContentPackage {
  package_id: string;
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
   * @minItems 1
   */
  pages: [
    {
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      section: string | null;
      primary_judgment: string;
      supporting_copy: string;
      core_structure: string[];
      content_function: string;
      primary_information_task: string;
      negative_constraints: string[];
      copy_snapshot: string;
    },
    ...{
      page_number: number;
      page_role:
        | "COVER"
        | "PROBLEM"
        | "SCENARIO"
        | "MISCONCEPTION"
        | "ANALYSIS"
        | "EVIDENCE"
        | "SOLUTION"
        | "STEP"
        | "COMPARISON"
        | "CASE"
        | "SUMMARY"
        | "CTA";
      page_intent: "COVER_ENTRY" | "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
      section: string | null;
      primary_judgment: string;
      supporting_copy: string;
      core_structure: string[];
      content_function: string;
      primary_information_task: string;
      negative_constraints: string[];
      copy_snapshot: string;
    }[],
  ];
  audience: string;
  painpoint: string;
  content_promise: string;
  content_value: {
    statement: string;
    /**
     * @minItems 1
     */
    value_types: [
      "DECISION_VALUE" | "RISK_REDUCTION" | "SELF_DIAGNOSIS",
      ...("DECISION_VALUE" | "RISK_REDUCTION" | "SELF_DIAGNOSIS")[],
    ];
  };
  /**
   * @minItems 1
   */
  narrative_structure: [
    {
      page_number: number;
      purpose: string;
    },
    ...{
      page_number: number;
      purpose: string;
    }[],
  ];
  content_fingerprint: string;
  quality_report_ref: string;
  source_run_id: string;
  version_binding: {
    current: string;
    legacy: string;
    legacy_status: "HISTORICAL_VALID_NOT_CURRENT_FOR_CV2";
  };
  status: "G3_PENDING";
  production_workspace_write_eligible: false;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  generated_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
