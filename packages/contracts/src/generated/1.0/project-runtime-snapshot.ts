/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Immutable non-secret project and capability state read by one run.
 */
export interface ProjectRuntimeSnapshot {
  snapshot_id: string;
  project_id: string;
  project_profile: {
    [k: string]: unknown;
  };
  project_profile_version: number;
  platform_pack_resolution: {
    id: string;
    version: string;
    sha256: string;
  };
  industry_pack_resolution: {
    id: string;
    version: string;
    sha256: string;
  };
  active_project_rules: string[];
  rejected_directions: string[];
  workspace_connection_snapshot: {
    provider: "MOCK" | "FEISHU" | "NONE";
    status: "MOCK_ONLY" | "NOT_CONFIGURED" | "VERIFIED" | "FAILED";
    workspace_label: string | null;
  };
  capability_snapshot: {
    capability: string;
    provider: string;
    status: "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";
    checked_at: string;
  }[];
  source_record_versions: {
    [k: string]: number;
  };
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
