/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Environment-independent SHA-256 identity for an approved ordered Final Set.
 */
export interface FinalSetFingerprint {
  fingerprint_id: string;
  final_manifest_id: string;
  algorithm: "SHA-256";
  canonical_version: "1.0.0";
  hash: string;
  inputs: {
    versions: {
      content: string;
      copy: string;
      visual_plan: string;
      first_page: string;
    };
    /**
     * @minItems 3
     * @maxItems 3
     */
    approval_ids: [string, string, string];
    style_lock: {
      id: string;
      version: string;
    };
    /**
     * @minItems 1
     */
    ordered_page_checksums: [string, ...string[]];
    group_qa_ref: string;
    continuity_report_ref: string;
    page_count: number;
  };
  schema_version: "1.0.0";
}
