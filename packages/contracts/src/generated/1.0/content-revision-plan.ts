/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ContentRevisionPlan {
  revision_plan_id: string;
  project_id: string;
  content_id: string;
  from_content_version: string;
  from_copy_version: string;
  to_content_version: string;
  to_copy_version: string;
  revision_scope:
    | "TITLE_ONLY"
    | "BODY_ONLY"
    | "CTA_ONLY"
    | "PAGE_COPY"
    | "STRUCTURE"
    | "CORE_VIEWPOINT"
    | "FULL_REWRITE";
  title_changes: string[];
  body_changes: string[];
  cta_changes: string[];
  page_changes: string[];
  claim_changes: string[];
  preserved_elements: string[];
  invalidated_artifacts: string[];
  requires_new_duplication_check: true;
  requires_new_claim_validation: true;
  requires_new_g3: true;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
