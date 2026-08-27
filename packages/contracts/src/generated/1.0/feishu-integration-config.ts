/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuIntegrationConfig {
  provider: "FEISHU";
  region: "CHINA";
  auth_mode: "SELF_BUILT_TENANT_APP";
  app_id_reference: string;
  secret_provider: "ENVIRONMENT" | "OS_SECURE_STORE" | "MCP_SECURE_CONNECTION";
  parent_folder_token_reference: string | null;
  test_parent_folder_token_reference: string | null;
  base_url: "https://open.feishu.cn";
  request_timeout_ms: number;
  retry_policy: {
    max_attempts: number;
    base_delay_ms: number;
    max_delay_ms: number;
    jitter: boolean;
  };
  rate_limit_policy: {
    strategy: "SERVER_DIRECTED_BOUNDED";
    respect_retry_after: true;
  };
  token_refresh_policy: {
    refresh_window_seconds: number;
    single_flight: true;
  };
  live_write_enabled: boolean;
  live_test_enabled: boolean;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
