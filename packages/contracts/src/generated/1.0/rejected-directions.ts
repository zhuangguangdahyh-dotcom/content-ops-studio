/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Traceable rejected creative or workflow direction.
 */
export interface RejectedDirections {
  project_id: string;
  direction_id: string;
  module: "CONTENT" | "VISUAL" | "WORKFLOW" | "PLATFORM" | "INDUSTRY";
  rejected_direction: string;
  rejection_reason: string;
  original_user_wording: string;
  related_content_id: string | null;
  related_page_numbers: number[];
  long_term_effective: boolean;
  replacement_suggestion: string;
  source_rule_id: string;
  source_run_id: string;
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
