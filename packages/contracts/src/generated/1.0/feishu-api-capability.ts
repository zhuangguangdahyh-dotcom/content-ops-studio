/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuApiCapability {
  capability_id: string;
  operation: string;
  endpoint: string;
  http_method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  sdk_method: string | null;
  transport_strategy: "NODE24_NATIVE_FETCH";
  required_permissions: string[];
  pagination: "NONE" | "PAGE_TOKEN" | "UNKNOWN_REQUIRES_RUNTIME_CONFIRMATION";
  batch_limit: number | "UNKNOWN_REQUIRES_RUNTIME_CONFIRMATION" | null;
  rate_limit: "SERVER_DIRECTED" | "UNKNOWN_REQUIRES_RUNTIME_CONFIRMATION";
  retry_classification: string;
  implementation_status:
    "DOCUMENTED" | "IMPLEMENTED_OFFLINE" | "LIVE_VERIFIED" | "DEFERRED" | "UNSUPPORTED";
  live_verified: boolean;
  official_source: string;
  snapshot_date: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
