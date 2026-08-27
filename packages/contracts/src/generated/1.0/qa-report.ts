/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Four-layer content, visual, file, and data quality report.
 */
export interface QaReport {
  qa_report_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  style_lock_version: string | null;
  qa_scope: "FIRST_PAGE" | "PAGE" | "FINAL_SET";
  /**
   * @minItems 4
   */
  checks: [
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    ...{
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    }[],
  ];
  /**
   * @minItems 1
   */
  content_checks: [
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    ...{
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    }[],
  ];
  /**
   * @minItems 1
   */
  visual_checks: [
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    ...{
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    }[],
  ];
  /**
   * @minItems 1
   */
  file_checks: [
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    ...{
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    }[],
  ];
  /**
   * @minItems 1
   */
  data_checks: [
    {
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    },
    ...{
      check_id: string;
      category: "CONTENT" | "VISUAL" | "FILE" | "DATA";
      target: string;
      status: "PASS" | "FAIL" | "SKIP";
      severity: "INFO" | "WARNING" | "ERROR" | "BLOCKING";
      blocking: boolean;
      message: string;
      expected_summary: string;
      actual_summary: string;
      evidence_refs: string[];
      recommended_action: string;
    }[],
  ];
  blocking_failure_count: number;
  warning_count: number;
  passed_count: number;
  overall_status:
    "QA_PENDING" | "QA_RUNNING" | "QA_PASSED" | "QA_PASSED_WITH_WARNINGS" | "QA_FAILED";
  ready_for_final_approval: boolean;
  checked_assets: {
    asset_id: string;
    asset_role:
      | "BACKGROUND"
      | "REFERENCE"
      | "RENDERED_PAGE"
      | "FINAL_PAGE"
      | "EVIDENCE"
      | "PROMPT_ARTIFACT"
      | "DIRECTION_CANDIDATE";
    asset_type: "IMAGE" | "TEXT" | "JSON" | "DOCUMENT";
    mime_type: string;
    relative_path: string;
    source_type:
      | "MOCK"
      | "PROMPT_ONLY"
      | "PROGRAMMATIC"
      | "GENERATED"
      | "RENDERED"
      | "OPERATOR_SUPPLIED"
      | "LOCAL_EDIT"
      | "HOST_NATIVE_IMAGEGEN";
    source_adapter: string;
    source_run_id: string;
    source_generation_id: string | null;
    version: number;
    width: number | null;
    height: number | null;
    file_size: number;
    checksum: string;
    created_at: string;
    extensions: {
      [k: string]: unknown;
    };
  }[];
  checked_manifests: string[];
  run_id: string;
  schema_version: "1.0.0";
  started_at: string;
  completed_at: string | null;
  extensions: {
    [k: string]: unknown;
  };
}
