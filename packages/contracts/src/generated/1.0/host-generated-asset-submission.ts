/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface HostGeneratedAssetSubmission {
  submission_id: string;
  generation_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string | null;
  source_kind: "LOCAL_FILE";
  source_path: string;
  temporary_url: null;
  declared_mime_type: "image/png" | "image/jpeg" | "image/webp";
  expected_role: "DIRECTION_CANDIDATE" | "FORMAL_FIRST_PAGE" | "FORMAL_INNER_PAGE";
  host_provider: string;
  host_model: string | null;
  run_id: string;
  schema_version: "1.0.0";
  submitted_at: string;
}
