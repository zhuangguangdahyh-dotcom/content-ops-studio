/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuAuthDiagnostic {
  diagnostic_id: string;
  provider: "FEISHU";
  region: "CHINA";
  auth_mode: "SELF_BUILT_TENANT_APP";
  credential_presence: {
    app_id: boolean;
    app_secret: boolean;
    parent_folder: boolean;
    test_parent_folder: boolean;
  };
  secret_redaction_verified: boolean;
  token_request_status: "NOT_ATTEMPTED" | "SUCCESS" | "FAILED" | "NOT_CONFIGURED";
  token_expiry_metadata: {
    expires_in_seconds: number;
    refresh_at: string;
  } | null;
  application_identity_status: "NOT_CHECKED" | "VERIFIED" | "FAILED";
  workspace_access_status: "NOT_CHECKED" | "VERIFIED" | "DENIED";
  permission_status: "NOT_CHECKED" | "SATISFIED" | "MISSING" | "UNKNOWN";
  missing_permissions: string[];
  live_write_gate_status: "DISABLED" | "ENVIRONMENT_ONLY" | "CLI_ONLY" | "CONFIRMED";
  warnings: string[];
  blocking_errors: string[];
  overall_status: "READY" | "DEGRADED" | "BLOCKED" | "NOT_CONFIGURED";
  checked_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
