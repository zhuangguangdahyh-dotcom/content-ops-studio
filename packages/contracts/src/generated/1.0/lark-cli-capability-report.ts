/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LarkCliCapabilityReport {
  status: "READY" | "BLOCKED";
  /**
   * @minItems 1
   */
  required_commands: [string, ...string[]];
  available_commands: string[];
  missing_commands: string[];
  raw_api_fallback: "DISABLED" | "EXACT_ALLOWLIST_ONLY";
  probed_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
