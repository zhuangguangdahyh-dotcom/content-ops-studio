/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Stable logical-key mapping to external field identifiers.
 */
export interface WorkspaceFieldMap {
  provider: "FEISHU" | "MOCK";
  project_id: string;
  blueprint_version: string;
  projectConfig: {
    logicalKey: string;
    externalFieldId: string;
    displayNameSnapshot: string;
    fieldTypeSnapshot: string;
    lastVerifiedAt: string;
  }[];
  painpoints: {
    logicalKey: string;
    externalFieldId: string;
    displayNameSnapshot: string;
    fieldTypeSnapshot: string;
    lastVerifiedAt: string;
  }[];
  contents: {
    logicalKey: string;
    externalFieldId: string;
    displayNameSnapshot: string;
    fieldTypeSnapshot: string;
    lastVerifiedAt: string;
  }[];
  rulesAndFeedback: {
    logicalKey: string;
    externalFieldId: string;
    displayNameSnapshot: string;
    fieldTypeSnapshot: string;
    lastVerifiedAt: string;
  }[];
  generated_at: string;
  schema_version: "1.0.0";
}
