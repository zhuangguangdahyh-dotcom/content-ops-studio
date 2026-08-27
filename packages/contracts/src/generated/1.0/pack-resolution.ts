/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Immutable per-run Pack/version/rule resolution with conflicts and warnings.
 */
export interface PackResolution {
  resolution_id: string;
  project_id: string;
  platform_pack: {
    id: string;
    version: string;
    status: "SCAFFOLD" | "ACTIVE" | "DEPRECATED";
    snapshot_sha256: string;
  };
  industry_pack: {
    id: string;
    version: string;
    status: "SCAFFOLD" | "ACTIVE" | "DEPRECATED";
    snapshot_sha256: string;
  };
  plugin_defaults: {
    [k: string]: unknown;
  };
  project_rule_snapshot: {
    [k: string]: unknown;
  };
  run_overrides: {
    [k: string]: unknown;
  };
  /**
   * @minItems 6
   * @maxItems 6
   */
  priority_order: never[];
  resolved_values: {
    [k: string]: unknown;
  };
  conflicts: {
    code: string;
    message: string;
    source: string;
  }[];
  warnings: {
    code: string;
    message: string;
    source: string;
  }[];
  resolved_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
