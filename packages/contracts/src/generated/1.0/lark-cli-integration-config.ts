/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LarkCliIntegrationConfig {
  binary: string;
  package: "@larksuite/cli";
  version: string;
  version_policy: {
    tested: string;
    minimum: string;
    maximum_exclusive: string;
    install_spec: string;
  };
  identity: "user";
  output_format: "json";
  /**
   * @minItems 1
   */
  allowed_commands: [string, ...string[]];
  raw_api_policy: "DISABLED" | "EXACT_ALLOWLIST_ONLY";
  auth_status:
    | "NOT_CHECKED"
    | "NOT_CONFIGURED"
    | "AWAITING_USER_AUTHORIZATION"
    | "AWAITING_ADMIN_APPROVAL"
    | "AUTHENTICATED"
    | "BLOCKED";
  credential_storage: "SYSTEM_KEYCHAIN_OWNED_BY_OFFICIAL_CLI";
  risk_control_status: "OFFICIAL_DEFAULT_ENFORCED";
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
