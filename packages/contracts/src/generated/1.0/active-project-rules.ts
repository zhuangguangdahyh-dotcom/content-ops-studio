/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Confirmed compiled runtime snapshot; each item remains an atomic rule.
 */
export interface ActiveProjectRules {
  project_id: string;
  rule_snapshot_version: string;
  compiled_at: string;
  source_rule_ids: string[];
  hard_requirements: string[];
  preferences: string[];
  prohibitions: string[];
  corrections: string[];
  workflow_rules: string[];
  compilation_status: "CONFIRMED_SNAPSHOT";
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
