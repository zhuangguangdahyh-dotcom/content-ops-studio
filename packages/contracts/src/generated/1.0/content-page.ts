/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * One structured page in a content package.
 */
export interface ContentPage {
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
  copy_version: string;
  headline: string;
  body: string;
  supporting_text: string;
  content_purpose: string;
  background_direction: string;
  visual_evidence_requirement: string;
  layout_notes: string;
  negative_constraints: string[];
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
