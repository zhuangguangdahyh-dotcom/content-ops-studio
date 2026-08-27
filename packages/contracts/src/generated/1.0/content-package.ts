/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Local structured content package and its exact rule/evidence/version snapshot.
 */
export interface ContentPackage {
  /**
   * One content item with one primary painpoint and separate business, visual, approval, and sync states.
   */
  content_record: {
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
  };
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
    }[],
  ];
  evidence_refs: string[];
  /**
   * Confirmed compiled runtime snapshot; each item remains an atomic rule.
   */
  project_rule_snapshot: {
    project_id: string;
    rule_snapshot_version: string;
    compiled_at: string;
    source_rule_ids: string[];
    hard_requirements: string[];
    preferences: string[];
    prohibitions: string[];
    corrections: string[];
    workflow_rules: string[];
    compilation_status: "CONFIRMED_SNAPSHOT";
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  platform_pack_id: string;
  platform_pack_version: string;
  industry_pack_id: string;
  industry_pack_version: string;
  /**
   * Deterministic non-semantic normalized-input hash.
   */
  content_fingerprint: {
    algorithm: "SHA-256";
    algorithm_version: "1.0.0";
    normalized_inputs: {
      painpoint_id: string;
      content_angle: string;
      core_viewpoint: string;
      cover_hook: string;
      content_structure_type: string;
      main_conclusion: string;
    };
    hash: string;
    semantic_embedding_ref: string | null;
    similarity_threshold: number | null;
    created_at: string;
  };
  approval_request: {
    approval_id: string;
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type:
      | "PROJECT"
      | "PAINPOINT_BATCH"
      | "CONTENT"
      | "CONTENT_PACKAGE"
      | "FIRST_PAGE_ASSET"
      | "IMAGE_SET";
    target_id: string;
    target_version: string;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    comment: string;
    source_run_id: string;
    created_at: string;
    deprecated_at?: string | null;
    schema_version: "1.0.0";
  } | null;
  generated_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
