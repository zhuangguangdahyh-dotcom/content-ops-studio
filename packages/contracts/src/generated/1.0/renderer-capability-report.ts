/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface RendererCapabilityReport {
  capability_report_id: string;
  renderer_id: "PLAYWRIGHT_HTML_CSS";
  node_version: string;
  platform: "darwin" | "linux" | "win32";
  architecture: "arm64" | "x64";
  playwright_core_version: "1.62.1";
  playwright_setup_version: "1.62.1";
  browser_installation_status: "INSTALLED" | "NOT_INSTALLED" | "VERSION_MISMATCH";
  browser_family: "CHROMIUM";
  browser_version: string | null;
  browser_executable_hash_or_version: string | null;
  browser_path_policy: "PLUGIN_DATA" | "EXTERNAL_CACHE";
  browser_launch_status: "PASSED" | "FAILED" | "NOT_RUN";
  font_availability: string[];
  font_fallback_status: "PRIMARY" | "FALLBACK_READABLE" | "UNAVAILABLE";
  /**
   * @minItems 1
   */
  supported_visual_modes: ["EDITORIAL_SERIES", ..."EDITORIAL_SERIES"[]];
  /**
   * @minItems 1
   */
  supported_asset_strategies: [
    "PROGRAMMATIC_GRAPHIC" | "NO_BACKGROUND_ASSET" | "PROJECT_ASSET" | "EVIDENCE_ASSET",
    ...("PROGRAMMATIC_GRAPHIC" | "NO_BACKGROUND_ASSET" | "PROJECT_ASSET" | "EVIDENCE_ASSET")[],
  ];
  /**
   * @minItems 1
   */
  unsupported_asset_strategies: [
    "GENERATED_BACKGROUND" | "REMOTE_URL" | "WEB_SCREENSHOT",
    ...("GENERATED_BACKGROUND" | "REMOTE_URL" | "WEB_SCREENSHOT")[],
  ];
  network_blocking_status: "PASSED" | "FAILED" | "NOT_RUN";
  plugin_root_write_status: "READ_ONLY";
  plugin_data_write_status: "WRITABLE" | "NOT_WRITABLE";
  warnings: string[];
  blocking_errors: string[];
  overall_status: "READY" | "READY_WITH_WARNINGS" | "BLOCKED";
  checked_at: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
