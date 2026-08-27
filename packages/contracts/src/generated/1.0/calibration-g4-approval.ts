/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface CalibrationG4Approval {
  approval_evidence_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  first_page_version: string;
  asset_id: string;
  asset_checksum: string;
  attention_mode: "TYPE_DOMINANT";
  formal_run_id: string;
  decision: "APPROVE";
  status: "PASSED";
  /**
   * A single explicit human decision bound to one target version.
   */
  approval_event: {
    approval_id: string;
    gate: "PROJECT_PROFILE" | "PAINPOINTS" | "CONTENT_COPY" | "FIRST_PAGE" | "FINAL_SET";
    target_type:
      | "PROJECT"
      | "PAINPOINT_BATCH"
      | "CONTENT"
      | "CONTENT_PACKAGE"
      | "FIRST_PAGE_ASSET"
      | "IMAGE_SET";
    target_id: string;
    target_version: string;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    comment: string;
    source_run_id: string;
    created_at: string;
    deprecated_at?: string | null;
    schema_version: "1.0.0";
  };
  /**
   * @minItems 7
   */
  qa_evidence: [
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    {
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    },
    ...{
      evidence_type:
        | "FORMAL_COVER"
        | "RASTER_CONTRAST"
        | "FULL_PNG"
        | "DETERMINISTIC_REPLAY"
        | "THUMBNAIL_310"
        | "THUMBNAIL_186"
        | "BACKGROUND_ANALYSIS";
      artifact_ref: string;
      checksum: string;
      result: "PASS";
    }[],
  ];
  /**
   * @maxItems 0
   */
  hard_blocks: [];
  /**
   * @maxItems 0
   */
  requested_changes: [];
  /**
   * @minItems 2
   */
  accepted_non_blocking_risks: [string, string, ...string[]];
  style_lock_authorized: true;
  remaining_page_production_eligibility: "ELIGIBLE";
  remaining_pages_created: 0;
  image_generation_calls: 0;
  feishu_writes: 0;
  idempotency_key: string;
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
