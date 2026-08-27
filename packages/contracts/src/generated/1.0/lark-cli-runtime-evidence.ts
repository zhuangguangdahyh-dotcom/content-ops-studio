/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LarkCliRuntimeEvidence {
  evidence_id: string;
  version: string;
  version_status: "SUPPORTED" | "TOO_OLD" | "UNCLAIMED" | "INVALID";
  auth_state:
    | "NOT_CONFIGURED"
    | "AWAITING_USER_AUTHORIZATION"
    | "AWAITING_ADMIN_APPROVAL"
    | "AUTHENTICATED"
    | "BLOCKED";
  identity: "user" | "bot";
  capability_status: "READY" | "BLOCKED" | "NOT_RUN";
  live_status:
    | "PASSED"
    | "FAILED"
    | "NOT_RUN"
    | "AWAITING_USER_AUTHORIZATION"
    | "AWAITING_ADMIN_APPROVAL"
    | "BLOCKED";
  checked_at: string;
  limitations: string[];
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
