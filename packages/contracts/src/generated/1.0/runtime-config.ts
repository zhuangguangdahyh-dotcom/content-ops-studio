/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Explicit local runtime mode, roots, capability boundaries, durability policy, and safe defaults.
 */
export interface RuntimeConfig {
  runtime_mode: "MOCK" | "DRY_RUN" | "PRODUCTION";
  content_ops_home: string;
  plugin_root: string;
  schema_version: "1.0.0";
  workspace_adapter: {
    implementation: string;
    capability_status:
      "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  };
  research_adapter: {
    implementation: string;
    capability_status:
      "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  };
  image_adapter: {
    implementation: string;
    capability_status:
      "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  };
  renderer_adapter: {
    implementation: string;
    capability_status:
      "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  };
  asset_store: {
    implementation: string;
    capability_status:
      "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
  };
  strict_mode: true;
  allow_fixture_workflows: boolean;
  allow_mock_adapters: boolean;
  allow_external_network: false;
  required_runtime_policy: {
    policy_version: "1.0.0";
    runtime_name: "node";
    supported_range: ">=24 <25";
    primary_major: 24;
  };
  enforce_supported_runtime: true;
  allow_unclaimed_runtime: false;
  lock_timeout_ms: number;
  stale_lock_threshold_ms: number;
  checkpoint_policy: {
    enabled: true;
    verify_after_write: true;
    fsync: "REQUIRED_WHERE_SUPPORTED" | "BEST_EFFORT";
  };
  journal_policy: {
    enabled: true;
    verify_after_write: true;
    fsync: "REQUIRED_WHERE_SUPPORTED" | "BEST_EFFORT";
  };
  log_redaction: {
    enabled: true;
    /**
     * @minItems 1
     */
    blocked_keys: [
      "access_token" | "authorization" | "app_secret" | "api_key" | "signed_url",
      ...("access_token" | "authorization" | "app_secret" | "api_key" | "signed_url")[],
    ];
  };
  file_permissions: {
    project_directory: "0700";
    sensitive_json: "0600";
    report: "0644";
  };
  created_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
