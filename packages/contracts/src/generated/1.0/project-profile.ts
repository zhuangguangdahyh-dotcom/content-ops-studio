/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Confirmed separation of Operator, Subject, and Audience project configuration.
 */
export interface ProjectProfile {
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
}
