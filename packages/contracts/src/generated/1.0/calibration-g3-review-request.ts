/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG3ReviewRequest {
  review_request_id: string;
  /**
   * Distinguishes canonical Production projects from isolated fictional Calibration projects without widening Production project identifiers.
   */
  project_ref:
    | {
        project_kind: "PRODUCTION_PROJECT";
        project_id: string;
      }
    | {
        project_kind: "CALIBRATION_PROJECT";
        project_id: string;
      };
  content_id: string;
  content_version: string;
  copy_version: string;
  page_count: number;
  content_package_ref: string;
  content_package_hash: string;
  content_fingerprint: string;
  quality_report_ref: string;
  quality_score: number;
  /**
   * @maxItems 0
   */
  blocking_failures: [];
  source_run_id: string;
  status: "AWAITING_USER_APPROVAL";
  decision: "PENDING_OPERATOR";
  approval_created: false;
  legacy_chain: {
    binding: "CV-1 / CV-1 / VV-1 / FPV-2 / APR-20260826-G4A1 / SLV-1";
    status: "PRESERVED_VALID_FOR_CV1_ONLY";
  };
  new_visual_plan: "NOT_CREATED";
  new_first_page: "NOT_CREATED";
  new_g4: "NOT_CREATED";
  slv2: "NOT_CREATED";
  remaining_pages: 0;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  production_workspace_write_eligible: false;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
