/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface ImageProductionContext {
  context_id: string;
  project_id: string;
  content_id: string;
  content_version: string;
  copy_version: string;
  visual_plan_version: string;
  page_count: number;
  project_visual_profile_maturity: "UNMATURE" | "MATURE" | "UNAVAILABLE";
  direction_selection_status:
    "REQUIRED" | "AWAITING_USER_SELECTION" | "SELECTED" | "SKIPPED_EXPLICIT_DIRECTION";
  host_imagegen_capability: "READY" | "UNAVAILABLE" | "UNVERIFIED";
  industry_pack_binding: {
    pack_id:
      | "GENERIC"
      | "COMMERCIAL_SPACE_HOSPITALITY"
      | "PROFESSIONAL_SERVICES"
      | "PERSONAL_IP_CREATOR"
      | "MEDICAL_AESTHETICS_HEALTH"
      | "PRODUCT_CONSUMER"
      | "FOOD_BEVERAGE_LIFESTYLE";
    pack_version: string;
  };
  overlay_bindings: {
    overlay_id:
      | "PERSON_CONTINUITY"
      | "PRODUCT_IDENTITY"
      | "SPACE_IDENTITY"
      | "EVIDENCE_AUTHENTICITY"
      | "REGULATED_CLAIMS"
      | "BEFORE_AFTER_INTEGRITY"
      | "BRAND_ASSET_INTEGRITY";
    overlay_version: string;
  }[];
  rejected_directions: string[];
  run_id: string;
  schema_version: "1.0.0";
  created_at: string;
}
