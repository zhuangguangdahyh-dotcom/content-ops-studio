/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Deterministic non-semantic normalized-input hash.
 */
export interface ContentFingerprint {
  algorithm: "SHA-256";
  algorithm_version: "1.0.0";
  normalized_inputs: {
    painpoint_id: string;
    content_angle: string;
    core_viewpoint: string;
    cover_hook: string;
    content_structure_type: string;
    main_conclusion: string;
  };
  hash: string;
  semantic_embedding_ref: string | null;
  similarity_threshold: number | null;
  created_at: string;
}
