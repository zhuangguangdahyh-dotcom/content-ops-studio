/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface TypographyDefaultPolicy {
  policy_id: "UNIVERSAL-TYPOGRAPHY-DEFAULT";
  policy_version: "TDPV-1";
  fallback_only: true;
  /**
   * @minItems 4
   */
  chinese_serif_candidates: [string, string, string, string, ...string[]];
  subtitle: {
    family_class: "MODERN_CHINESE_SERIF";
    /**
     * @minItems 1
     */
    preferred_weights: [number, ...number[]];
    relative_size_min: number;
    relative_size_max: number;
    default_bold: boolean;
  };
  body: {
    family_class: "MODERN_CHINESE_SERIF";
    /**
     * @minItems 1
     */
    preferred_weights: [number, ...number[]];
    relative_size_min: number;
    relative_size_max: number;
    default_bold: boolean;
  };
  geometry: {
    title_line_height: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
    title_letter_spacing_em: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
    subtitle_line_height: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
    subtitle_letter_spacing_em: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
    body_line_height: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
    body_letter_spacing_em: {
      minimum: number;
      maximum: number;
      hard_coded: false;
    };
  };
  silent_pingfang_fallback_forbidden: true;
  font_download_forbidden: true;
  renderer_probe_required: true;
  run_id: string;
  created_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
