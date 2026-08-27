/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuWorkspacePlan {
  plan_id: string;
  project_id: string;
  run_id: string;
  base_title: string;
  parent_folder_reference: string;
  blueprint_version: string;
  schema_version: "1.0.0";
  existing_workspace:
    "NONE" | "LOCAL_REFERENCE" | "REMOTE_VERIFIED" | "ORPHAN_CANDIDATE" | "DUPLICATE_CANDIDATES";
  reconciliation_mode: "PROVISION" | "INSPECT" | "VERIFY" | "REPAIR_ADD_ONLY" | "MIGRATE_APPROVED";
  table_operations: {
    operation:
      | "CREATE"
      | "ADOPT"
      | "UPDATE_MAPPING"
      | "SKIP_VERIFIED"
      | "BLOCK_CONFLICT"
      | "REPAIR_ADD_ONLY";
    logical_key: string;
    reason: string;
  }[];
  field_operations: {
    operation:
      | "CREATE"
      | "ADOPT"
      | "UPDATE_MAPPING"
      | "SKIP_VERIFIED"
      | "BLOCK_CONFLICT"
      | "REPAIR_ADD_ONLY";
    logical_key: string;
    reason: string;
  }[];
  relation_operations: {
    operation:
      | "CREATE"
      | "ADOPT"
      | "UPDATE_MAPPING"
      | "SKIP_VERIFIED"
      | "BLOCK_CONFLICT"
      | "REPAIR_ADD_ONLY";
    logical_key: string;
    reason: string;
  }[];
  view_operations: {
    operation:
      | "CREATE"
      | "ADOPT"
      | "UPDATE_MAPPING"
      | "SKIP_VERIFIED"
      | "BLOCK_CONFLICT"
      | "REPAIR_ADD_ONLY";
    logical_key: string;
    reason: string;
  }[];
  record_operations: {
    operation:
      | "CREATE"
      | "ADOPT"
      | "UPDATE_MAPPING"
      | "SKIP_VERIFIED"
      | "BLOCK_CONFLICT"
      | "REPAIR_ADD_ONLY";
    logical_key: string;
    reason: string;
  }[];
  expected_tables: number;
  expected_fields: number;
  expected_views: number;
  expected_relations: number;
  estimated_api_calls: number;
  batching_plan: {
    [k: string]: number | string;
  };
  retry_plan: {
    [k: string]: unknown;
  };
  live_write_required: boolean;
  live_write_confirmed: boolean;
  created_at: string;
  extensions: {
    [k: string]: unknown;
  };
}
