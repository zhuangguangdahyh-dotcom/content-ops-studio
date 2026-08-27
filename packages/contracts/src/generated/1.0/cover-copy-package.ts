/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CoverCopyPackage {
  cover_copy_package_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  cover_copy_version: string;
  publish_title: string;
  cover_primary_hook: string;
  cover_secondary_line: string;
  cover_supporting_copy: string;
  page_1_content_copy: string;
  cover_objective:
    | "AUDIENCE_FILTER"
    | "PAINPOINT_DIRECT"
    | "VALUE_DIRECT"
    | "RISK_WARNING"
    | "DECISION_CHECKLIST"
    | "RESULT_EVIDENCE"
    | "BRAND_STATEMENT";
  conversion_strategy:
    | "TARGET_AUDIENCE_FIRST"
    | "PAINPOINT_FIRST"
    | "VALUE_FIRST"
    | "RISK_FIRST"
    | "DECISION_FIRST"
    | "RESULT_FIRST"
    | "CONTRAST_FIRST"
    | "QUESTION_FIRST";
  target_customer_signal: {
    present: boolean;
    text: string;
  };
  painpoint_signal: {
    present: boolean;
    text: string;
  };
  value_signal: {
    present: boolean;
    text: string;
  };
  risk_signal: {
    present: boolean;
    text: string;
  };
  decision_signal: {
    present: boolean;
    text: string;
  };
  character_counts: {
    publish_title: number;
    cover_primary_hook: number;
    cover_secondary_line: number;
    cover_supporting_copy: number;
  };
  line_limits: {
    primary: number;
    secondary: number;
    supporting: number;
  };
  claim_refs: string[];
  content_alignment: "ALIGNED" | "MISALIGNED";
  misleading_risk: "NONE" | "LOW" | "MEDIUM" | "HIGH" | "BLOCKED";
  ready_for_g3: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
