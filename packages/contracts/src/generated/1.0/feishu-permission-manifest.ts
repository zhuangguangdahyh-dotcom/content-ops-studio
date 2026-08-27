/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuPermissionManifest {
  manifest_version: "1.0.0";
  provider: "FEISHU";
  auth_mode: "SELF_BUILT_TENANT_APP";
  /**
   * @minItems 1
   */
  permissions: [
    {
      scope_key: string;
      display_name: string;
      purpose: string;
      required: boolean;
      /**
       * @minItems 1
       */
      operations: [string, ...string[]];
      official_source: string;
    },
    ...{
      scope_key: string;
      display_name: string;
      purpose: string;
      required: boolean;
      /**
       * @minItems 1
       */
      operations: [string, ...string[]];
      official_source: string;
    }[],
  ];
  required_for_read: string[];
  required_for_workspace_create: string[];
  required_for_schema_write: string[];
  required_for_record_read: string[];
  required_for_record_write: string[];
  required_for_view_write: string[];
  optional_permissions: string[];
  deferred_permissions: string[];
  source_snapshot_date: string;
  /**
   * @minItems 1
   */
  source_references: [string, ...string[]];
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
