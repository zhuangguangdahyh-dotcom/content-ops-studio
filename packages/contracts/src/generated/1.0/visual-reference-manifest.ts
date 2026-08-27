/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface VisualReferenceManifest {
  visual_reference_manifest_id: string;
  project_id: string;
  content_id: string;
  references: {
    reference_id: string;
    reference_type:
      | "PROJECT_ASSET"
      | "USER_REFERENCE"
      | "HISTORICAL_APPROVED_STYLE"
      | "EVIDENCE_ASSET"
      | "LICENSED_EXTERNAL_REFERENCE"
      | "INTERNAL_DESIGN_TOKEN";
    source_type: "PROJECT_HOME" | "EVIDENCE_RECORD" | "LICENSED_SOURCE" | "INTERNAL_TOKEN";
    asset_ref: string | null;
    source_location: string | null;
    evidence_id: string | null;
    description: string;
    allowed_usage: string[];
    prohibited_usage: string[];
    copyright_or_permission_status: "AUTHORIZED" | "LICENSED" | "RESTRICTED" | "UNKNOWN";
    style_attributes: string[];
    content_relevance: string;
    page_relevance: number[];
    approved: boolean;
    rejection_reason: string | null;
  }[];
  reference_count: number;
  reference_type_counts: {
    [k: string]: number;
  };
  approved_count: number;
  rejected_count: number;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
