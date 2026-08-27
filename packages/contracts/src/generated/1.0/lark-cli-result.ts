/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export type LarkCliResult = {
  [k: string]: unknown;
} & {
  ok: boolean;
  exit_code: number;
  operation: string;
  duration_ms: number;
  stdout_present: boolean;
  stderr_present: boolean;
  error: null | {
    code: string;
    message: string;
  };
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
};
