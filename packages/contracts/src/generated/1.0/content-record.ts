/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * One content item with one primary painpoint and separate business, visual, approval, and sync states.
 */
export interface ContentRecord {
  content_id: string;
  project_id: string;
  record_unique_key: string;
  primary_painpoint_id: string;
  content_topic: string;
  content_angle: string;
  content_structure_type:
    | "PROBLEM_DECONSTRUCTION"
    | "CHECKLIST"
    | "MISCONCEPTION"
    | "CASE"
    | "STEPS"
    | "VIEWPOINT"
    | "COMPARISON"
    | "DIAGNOSIS"
    | "DECISION_GUIDANCE"
    | "STORY";
  audience_explicit_need: string;
  audience_deep_anxiety: string;
  single_core_problem: string;
  core_viewpoint: string;
  solution_logic: string;
  content_objective:
    | "AWARENESS"
    | "TRUST"
    | "EDUCATION"
    | "LEAD_GENERATION"
    | "CONSULTATION"
    | "CONVERSION"
    | "RETENTION";
  page_count: number;
  page_structure_summary: string;
  background_direction: string;
  visual_plan_summary: string;
  direct_message_hook: string;
  publish_title: string;
  title_character_count: number;
  publish_body: string;
  promotion_suitability: "HIGH" | "MEDIUM" | "LOW" | "NOT_RECOMMENDED";
  promotion_reason: string;
  duplication_risk: "LOW" | "MEDIUM" | "HIGH";
  content_status:
    | "CONTENT_ANALYSIS_PENDING"
    | "CONTENT_PLANNING"
    | "COPY_PENDING_APPROVAL"
    | "COPY_REVISION_REQUIRED"
    | "COPY_APPROVED"
    | "VISUAL_PLANNING"
    | "FINAL_REVIEW_PENDING"
    | "CONTENT_FINALIZED"
    | "CONTENT_PUBLISHED"
    | "CONTENT_PAUSED"
    | "CONTENT_DISCARDED";
  image_status:
    | "IMAGE_NOT_GENERATED"
    | "FIRST_PAGE_GENERATING"
    | "FIRST_PAGE_PENDING_APPROVAL"
    | "FIRST_PAGE_APPROVED"
    | "IMAGE_SET_GENERATING"
    | "IMAGE_SET_GENERATED"
    | "IMAGE_GENERATION_FAILED";
  first_page_approval_status:
    | "FIRST_PAGE_NOT_SUBMITTED"
    | "FIRST_PAGE_APPROVAL_PENDING"
    | "FIRST_PAGE_REVISION_REQUIRED"
    | "FIRST_PAGE_APPROVAL_APPROVED"
    | "FIRST_PAGE_APPROVAL_REJECTED";
  final_approval_status:
    | "FINAL_NOT_SUBMITTED"
    | "FINAL_APPROVAL_PENDING"
    | "FINAL_REVISION_REQUIRED"
    | "FINAL_APPROVAL_APPROVED";
  sync_status:
    "SYNC_NOT_STARTED" | "SYNC_IN_PROGRESS" | "SYNC_COMPLETED" | "SYNC_PARTIAL" | "SYNC_FAILED";
  output_relative_path: string | null;
  creation_source: "OPERATOR" | "RESEARCH" | "FEEDBACK" | "MIGRATION" | "MOCK";
  content_version: string;
  copy_version: string;
  visual_plan_version: string | null;
  style_lock_version: string | null;
  schema_version: "1.0.0";
  last_run_id: string;
  finalized_at: string | null;
  created_at: string;
  updated_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
