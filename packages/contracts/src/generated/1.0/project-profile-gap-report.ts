/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deterministic DISCOVER result that keeps Operator, Subject and Audience separate.
 */
export interface ProjectProfileGapReport {
  gap_report_id: string;
  project_id: string;
  known_fields: string[];
  missing_required_fields: string[];
  missing_recommended_fields: string[];
  conflicting_fields: {
    field: string;
    reason: string;
  }[];
  inferred_fields: {
    field: string;
    value_summary: string;
    basis: string;
    confirmed: boolean;
  }[];
  operator_known: {
    role: "OPERATOR" | "SUBJECT" | "AUDIENCE";
    known_fields: string[];
  };
  subject_known: {
    role: "OPERATOR" | "SUBJECT" | "AUDIENCE";
    known_fields: string[];
  };
  audience_known: {
    role: "OPERATOR" | "SUBJECT" | "AUDIENCE";
    known_fields: string[];
  };
  material_blockers: string[];
  non_blocking_gaps: string[];
  recommended_questions: string[];
  profile_completeness: number;
  ready_for_project_confirmation: boolean;
  ready_for_painpoint_research: boolean;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
