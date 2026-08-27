/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Normalized versioned industry scaffold or knowledge pack without customer-specific rules.
 */
export interface IndustryPack {
  id: string;
  version: string;
  display_name: string;
  status: "SCAFFOLD" | "ACTIVE" | "DEPRECATED";
  industry_context: string;
  audience_taxonomy: string[];
  decision_chain: string[];
  painpoint_taxonomy: string[];
  content_angle_library: string[];
  visual_evidence_library: string[];
  claim_boundaries: string[];
  prohibited_patterns: string[];
  extensions: {
    [k: string]: unknown;
  };
}
