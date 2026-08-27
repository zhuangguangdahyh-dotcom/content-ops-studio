/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

/**
 * Normalized versioned platform rules; scaffold status is explicit.
 */
export interface PlatformPack {
  id: string;
  version: string;
  display_name: string;
  status: "SCAFFOLD" | "ACTIVE" | "DEPRECATED";
  /**
   * @minItems 1
   */
  supported_formats: [string, ...string[]];
  default_aspect_ratio: string;
  default_page_range: {
    min: number;
    max: number;
  };
  default_page_count: number;
  title_visible_character_limit: number;
  rules: string[];
  prohibited_patterns: string[];
  extensions: {
    [k: string]: unknown;
  };
}
