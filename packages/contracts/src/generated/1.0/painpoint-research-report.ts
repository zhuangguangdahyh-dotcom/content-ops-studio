/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Complete recoverable research result before G2 review.
 */
export interface PainpointResearchReport {
  report_id: string;
  /**
   * Run-bound plan for evidence-backed painpoint research.
   */
  research_plan: {
    research_plan_id: string;
    project_id: string;
    run_id: string;
    project_profile_version: number;
    platform_pack: {
      id: string;
      version: string;
    };
    industry_pack: {
      id: string;
      version: string;
    };
    requested_count: number;
    minimum_acceptable_count: number;
    allow_hypothesis_candidates: boolean;
    research_objective: string;
    /**
     * @minItems 1
     */
    audience_segments: [string, ...string[]];
    /**
     * @minItems 1
     */
    decision_stages: [
      (
        | "PROBLEM_AWARENESS"
        | "ACTIVE_SEARCH"
        | "SOLUTION_COMPARISON"
        | "RISK_EVALUATION"
        | "PURCHASE_DECISION"
        | "USAGE_EXPERIENCE"
        | "REPURCHASE_REFERRAL"
      ),
      ...(
        | "PROBLEM_AWARENESS"
        | "ACTIVE_SEARCH"
        | "SOLUTION_COMPARISON"
        | "RISK_EVALUATION"
        | "PURCHASE_DECISION"
        | "USAGE_EXPERIENCE"
        | "REPURCHASE_REFERRAL"
      )[],
    ];
    /**
     * @minItems 1
     */
    business_scenarios: [string, ...string[]];
    /**
     * @minItems 1
     */
    region_scope: [string, ...string[]];
    date_scope: {
      from: string | null;
      to: string | null;
    };
    /**
     * @minItems 1
     */
    language_scope: [string, ...string[]];
    /**
     * @minItems 1
     */
    source_strategy: [string, ...string[]];
    /**
     * @minItems 1
     */
    query_plan: [
      {
        query_id: string;
        query: string;
        purpose: string;
        /**
         * @minItems 1
         */
        source_types: [string, ...string[]];
      },
      ...{
        query_id: string;
        query: string;
        purpose: string;
        /**
         * @minItems 1
         */
        source_types: [string, ...string[]];
      }[],
    ];
    user_material_refs: string[];
    required_source_mix: {
      minimum_sources: number;
      minimum_source_types: number;
      require_official_or_first_party: boolean;
    };
    /**
     * @minItems 1
     */
    evidence_requirements: [string, ...string[]];
    /**
     * @minItems 1
     */
    deduplication_policy: [string, ...string[]];
    scoring_policy: {
      policy_id: string;
      policy_version: string;
      core_threshold: number;
      important_threshold: number;
    };
    /**
     * @minItems 1
     */
    expected_artifacts: [string, ...string[]];
    /**
     * @minItems 1
     */
    capability_requirements: [string, ...string[]];
    plan_hash: string;
    created_at: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  /**
   * Confirmed separation of Operator, Subject, and Audience project configuration.
   */
  project_profile_snapshot: {
    project_id: string;
    project_name: string;
    project_status:
      | "PROJECT_INITIALIZING"
      | "PROJECT_PENDING_CONFIRMATION"
      | "PROJECT_ACTIVE"
      | "PROJECT_PAUSED"
      | "PROJECT_ARCHIVED";
    config_confirmation_status: "CONFIG_PENDING" | "CONFIG_CONFIRMED" | "CONFIG_UPDATE_REQUIRED";
    subject: {
      role: "SUBJECT";
      entity_id: string;
      description: string;
    };
    subject_name: string;
    subject_type: "PERSON" | "BRAND" | "ORGANIZATION" | "STORE" | "PRODUCT";
    public_identity_and_intro: string;
    industry: string;
    industry_subfields: string[];
    /**
     * @minItems 1
     */
    core_business_or_products: [string, ...string[]];
    service_region: string[];
    price_band: string;
    audience_profile: {
      role: "AUDIENCE";
      description: string;
      /**
       * @minItems 1
       */
      segments: [string, ...string[]];
    };
    /**
     * @minItems 1
     */
    audience_decision_characteristics: [string, ...string[]];
    professional_advantages: string[];
    personality_and_expression_advantages: string[];
    /**
     * @minItems 1
     */
    content_objectives: [
      (
        | "AWARENESS"
        | "TRUST"
        | "EDUCATION"
        | "LEAD_GENERATION"
        | "CONSULTATION"
        | "CONVERSION"
        | "RETENTION"
      ),
      ...(
        | "AWARENESS"
        | "TRUST"
        | "EDUCATION"
        | "LEAD_GENERATION"
        | "CONSULTATION"
        | "CONVERSION"
        | "RETENTION"
      )[],
    ];
    /**
     * @minItems 1
     */
    core_content_directions: [string, ...string[]];
    content_style: string[];
    expression_tone: string[];
    /**
     * @minItems 1
     */
    target_platforms: [string, ...string[]];
    primary_platform: string;
    default_page_count: number;
    default_aspect_ratio: string;
    visual_preferences: string[];
    direct_message_hook_rules: string[];
    title_rules: string[];
    prohibited_expressions: string[];
    prohibited_visuals: string[];
    industry_pack: string;
    platform_pack: string;
    operator_notes: {
      role: "OPERATOR";
      notes: string;
    };
    configuration_version: number;
    schema_version: "1.0.0";
    last_run_id: string;
    created_at: string;
    updated_at: string;
    data_source: "OPERATOR_INPUT" | "CUSTOMER_MATERIAL" | "MIGRATED" | "MOCK";
    extensions: {
      [k: string]: unknown;
    };
  };
  /**
   * Deduplicated source metadata and bounded summaries; full page bodies are forbidden.
   */
  source_manifest: {
    manifest_id: string;
    research_plan_id: string;
    project_id: string;
    run_id: string;
    /**
     * @minItems 1
     */
    sources: [
      {
        source_id: string;
        source_type:
          | "OFFICIAL_SOURCE"
          | "FIRST_PARTY_DATA"
          | "CUSTOMER_MATERIAL"
          | "CUSTOMER_INTERVIEW"
          | "INDUSTRY_REPORT"
          | "PLATFORM_DOCUMENTATION"
          | "SOCIAL_COMMENT"
          | "PUBLIC_REVIEW"
          | "COMPETITOR_CONTENT"
          | "QUESTION_AND_ANSWER"
          | "FORUM"
          | "NEWS"
          | "MANUAL_SOURCE";
        publisher_or_owner: string;
        source_location: string;
        source_date: string | null;
        retrieved_at: string;
        language: string;
        summary: string;
        /**
         * @minItems 1
         */
        supported_claims: [string, ...string[]];
        limitations: string;
        credibility_notes: string;
        is_first_party: boolean;
        is_user_provided: boolean;
        is_current: boolean;
        duplicate_of: string | null;
        content_hash: string;
        extensions: {
          [k: string]: unknown;
        };
      },
      ...{
        source_id: string;
        source_type:
          | "OFFICIAL_SOURCE"
          | "FIRST_PARTY_DATA"
          | "CUSTOMER_MATERIAL"
          | "CUSTOMER_INTERVIEW"
          | "INDUSTRY_REPORT"
          | "PLATFORM_DOCUMENTATION"
          | "SOCIAL_COMMENT"
          | "PUBLIC_REVIEW"
          | "COMPETITOR_CONTENT"
          | "QUESTION_AND_ANSWER"
          | "FORUM"
          | "NEWS"
          | "MANUAL_SOURCE";
        publisher_or_owner: string;
        source_location: string;
        source_date: string | null;
        retrieved_at: string;
        language: string;
        summary: string;
        /**
         * @minItems 1
         */
        supported_claims: [string, ...string[]];
        limitations: string;
        credibility_notes: string;
        is_first_party: boolean;
        is_user_provided: boolean;
        is_current: boolean;
        duplicate_of: string | null;
        content_hash: string;
        extensions: {
          [k: string]: unknown;
        };
      }[],
    ];
    source_count: number;
    source_type_counts: {
      [k: string]: number;
    };
    duplicate_source_count: number;
    rejected_source_count: number;
    retrieved_at: string;
    schema_version: "1.0.0";
    extensions: {
      [k: string]: unknown;
    };
  };
  evidence_records: {
    [k: string]: unknown;
  }[];
  painpoint_candidates: {
    painpoint_id: string;
    project_id: string;
    record_unique_key: string;
    painpoint_name: string;
    review_status:
      | "PAINPOINT_PENDING"
      | "PAINPOINT_CONFIRMED"
      | "PAINPOINT_REVISION_REQUIRED"
      | "PAINPOINT_REJECTED"
      | "PAINPOINT_PAUSED";
    business_scenario: string;
    audience_type: string;
    decision_stage:
      | "PROBLEM_AWARENESS"
      | "ACTIVE_SEARCH"
      | "SOLUTION_COMPARISON"
      | "RISK_EVALUATION"
      | "PURCHASE_DECISION"
      | "USAGE_EXPERIENCE"
      | "REPURCHASE_REFERRAL";
    explicit_need: string;
    deep_anxiety: string;
    trigger_events: string[];
    primary_barriers: string[];
    analysis_reason: string;
    commercial_loss_or_real_cost: string;
    content_entry_angles: string[];
    subject_advantages_to_express: string[];
    /**
     * @minItems 1
     */
    evidence_refs: [string, ...string[]];
    evidence_confidence:
      "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
    painpoint_priority: "CORE" | "IMPORTANT" | "SUPPLEMENTARY";
    promotion_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    contentization_status:
      | "PAINPOINT_NOT_CONTENTIZED"
      | "PAINPOINT_CONTENT_IN_PROGRESS"
      | "PAINPOINT_CONTENT_AVAILABLE"
      | "PAINPOINT_COVERED"
      | "PAINPOINT_PAUSED";
    related_content_ids: string[];
    finalized_content_count: number;
    latest_content_date: string | null;
    duplication_risk: "LOW" | "MEDIUM" | "HIGH";
    version: number;
    research_batch_id: string;
    schema_version: "1.0.0";
    last_run_id: string;
    created_at: string;
    updated_at: string;
    extensions: {
      [k: string]: unknown;
    };
  }[];
  scoring_records: {
    [k: string]: unknown;
  }[];
  requested_count: number;
  produced_count: number;
  evidence_backed_count: number;
  hypothesis_count: number;
  insufficiency_reason: string | null;
  decision_chain_summary: string;
  business_scenario_summary: string;
  audience_summary: string;
  deduplication_report: string;
  coverage_report: string;
  source_limitations: string[];
  recommended_painpoints: string[];
  deferred_candidates: string[];
  rejected_candidates: string[];
  /**
   * Research batch that reports produced evidence-backed and hypothesis counts honestly.
   */
  final_painpoint_batch: {
    research_batch_id: string;
    project_id: string;
    requested_count: number;
    produced_count: number;
    evidence_backed_count: number;
    hypothesis_count: number;
    research_scope: string;
    date_range: {
      from: string | null;
      to: string | null;
    };
    region_scope: string[];
    painpoints: {
      painpoint_id: string;
      project_id: string;
      record_unique_key: string;
      painpoint_name: string;
      review_status:
        | "PAINPOINT_PENDING"
        | "PAINPOINT_CONFIRMED"
        | "PAINPOINT_REVISION_REQUIRED"
        | "PAINPOINT_REJECTED"
        | "PAINPOINT_PAUSED";
      business_scenario: string;
      audience_type: string;
      decision_stage:
        | "PROBLEM_AWARENESS"
        | "ACTIVE_SEARCH"
        | "SOLUTION_COMPARISON"
        | "RISK_EVALUATION"
        | "PURCHASE_DECISION"
        | "USAGE_EXPERIENCE"
        | "REPURCHASE_REFERRAL";
      explicit_need: string;
      deep_anxiety: string;
      trigger_events: string[];
      primary_barriers: string[];
      analysis_reason: string;
      commercial_loss_or_real_cost: string;
      content_entry_angles: string[];
      subject_advantages_to_express: string[];
      /**
       * @minItems 1
       */
      evidence_refs: [string, ...string[]];
      evidence_confidence:
        "A_DIRECT_STRONG" | "B_MULTI_SOURCE" | "C_SINGLE_OR_INDIRECT" | "D_HYPOTHESIS";
      painpoint_priority: "CORE" | "IMPORTANT" | "SUPPLEMENTARY";
      promotion_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      contentization_status:
        | "PAINPOINT_NOT_CONTENTIZED"
        | "PAINPOINT_CONTENT_IN_PROGRESS"
        | "PAINPOINT_CONTENT_AVAILABLE"
        | "PAINPOINT_COVERED"
        | "PAINPOINT_PAUSED";
      related_content_ids: string[];
      finalized_content_count: number;
      latest_content_date: string | null;
      duplication_risk: "LOW" | "MEDIUM" | "HIGH";
      version: number;
      research_batch_id: string;
      schema_version: "1.0.0";
      last_run_id: string;
      created_at: string;
      updated_at: string;
      extensions: {
        [k: string]: unknown;
      };
    }[];
    evidence_records: {
      [k: string]: unknown;
    }[];
    deduplication_summary: string;
    partial_failures: {
      code:
        | "INPUT_MISSING"
        | "PROJECT_NOT_RESOLVED"
        | "PROJECT_NOT_CONFIRMED"
        | "WORKSPACE_NOT_READY"
        | "SCHEMA_MISMATCH"
        | "INVALID_STATE"
        | "LOCKED_FIELD"
        | "CONFLICT_DETECTED"
        | "TOOL_UNAVAILABLE"
        | "PERMISSION_DENIED"
        | "INSUFFICIENT_EVIDENCE"
        | "DUPLICATE_RISK"
        | "UNSUPPORTED_CLAIM"
        | "GENERATION_FAILED"
        | "RENDER_FAILED"
        | "QA_FAILED"
        | "SYNC_PARTIAL"
        | "USER_APPROVAL_REQUIRED"
        | "UNSUPPORTED_REQUEST"
        | "APPROVAL_REQUIRED"
        | "APPROVAL_MISMATCH"
        | "APPROVAL_STALE"
        | "INVARIANT_VIOLATION"
        | "OWNER_SKILL_MISMATCH"
        | "MIGRATION_PATH_MISSING";
      message: string;
      retryable: boolean;
      scope: string;
      recommended_action: string;
      extensions: {
        [k: string]: unknown;
      };
    }[];
    write_summary: string;
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
    run_id: string;
    schema_version: "1.0.0";
    created_at: string;
    completion_status: "COMPLETE" | "PARTIAL" | "EMPTY_WITH_REASON";
  };
  /**
   * A single explicit human decision bound to one target version.
   */
  g2_approval_request: {
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
  };
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
