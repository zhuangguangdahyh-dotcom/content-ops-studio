/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface FeishuProvisioningState {
  provisioning_id: string;
  project_id: string;
  run_id: string;
  base_creation_status:
    "NOT_STARTED" | "CREATED_UNVERIFIED" | "VERIFIED" | "ADOPTED" | "ORPHAN_CANDIDATE" | "FAILED";
  app_token_reference: string | null;
  table_states: {
    logical_key: string;
    status: "PENDING" | "CREATED" | "ADOPTED" | "VERIFIED" | "FAILED" | "CONFLICT";
    remote_reference: string | null;
  }[];
  field_states: {
    logical_key: string;
    status: "PENDING" | "CREATED" | "ADOPTED" | "VERIFIED" | "FAILED" | "CONFLICT";
    remote_reference: string | null;
  }[];
  relation_states: {
    logical_key: string;
    status: "PENDING" | "CREATED" | "ADOPTED" | "VERIFIED" | "FAILED" | "CONFLICT";
    remote_reference: string | null;
  }[];
  view_states: {
    logical_key: string;
    status: "PENDING" | "CREATED" | "ADOPTED" | "VERIFIED" | "FAILED" | "CONFLICT";
    remote_reference: string | null;
  }[];
  record_states: {
    logical_key: string;
    status: "PENDING" | "CREATED" | "ADOPTED" | "VERIFIED" | "FAILED" | "CONFLICT";
    remote_reference: string | null;
  }[];
  current_phase: number;
  completed_operations: string[];
  failed_operations: string[];
  pending_operations: string[];
  remote_identifiers: {
    [k: string]: string;
  };
  mapping_version: number;
  journal_head: string | null;
  write_log_head: string | null;
  checkpoint_id: string | null;
  overall_status:
    "PLANNED" | "IN_PROGRESS" | "AWAITING_APPROVAL" | "SUCCESS" | "BLOCKED" | "FAILED" | "CONFLICT";
  created_at: string;
  updated_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
