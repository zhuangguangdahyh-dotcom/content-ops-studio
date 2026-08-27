/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Non-secret external workspace identifiers and verification state.
 */
export interface WorkspaceConnection {
  provider: "FEISHU" | "MOCK";
  project_id: string;
  workspace_identifier: string;
  app_token: string;
  table_ids: {
    projectConfig: string;
    painpoints: string;
    contents: string;
    rulesAndFeedback: string;
  };
  field_ids: {
    [k: string]: string;
  };
  view_ids: {
    [k: string]: string;
  };
  schema_version: "1.0.0";
  last_verified_at: string | null;
  verification_status: "UNVERIFIED" | "VERIFIED" | "FAILED";
}
