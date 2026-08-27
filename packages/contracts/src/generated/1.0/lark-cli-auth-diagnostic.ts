/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LarkCliAuthDiagnostic {
  diagnostic_id: string;
  state:
    | "NOT_CONFIGURED"
    | "AWAITING_USER_AUTHORIZATION"
    | "AWAITING_ADMIN_APPROVAL"
    | "AUTHENTICATED"
    | "BLOCKED";
  identity: "user" | "bot";
  configured: boolean;
  authenticated: boolean;
  required_scope_count: number;
  granted_scope_count: number;
  missing_scopes: string[];
  authorization_url_present: boolean;
  token_exposed: false;
  checked_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
