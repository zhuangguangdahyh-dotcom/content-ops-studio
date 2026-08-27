/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface LarkCliCommand {
  operation: string;
  /**
   * @minItems 1
   */
  argv: [string, ...string[]];
  identity: "user" | "bot";
  dry_run: boolean;
  timeout_ms: number;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
