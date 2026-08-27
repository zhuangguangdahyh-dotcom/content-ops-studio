/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface GlobalUserVisualPreference {
  preference_id: string;
  preference_version: string;
  /**
   * @minItems 1
   */
  active_rule_refs: [string, ...string[]];
  supersedes_version: string | null;
  confirmed_by_operator: true;
  source_event_id: string;
  run_id: string;
  created_at: string;
  updated_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
