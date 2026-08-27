/*
 * AUTO-GENERATED FILE.
 * DO NOT EDIT DIRECTLY.
 * Modify the source JSON Schema instead.
 */

export interface RendererEnvironmentEvidence {
  renderer_environment_id: string;
  renderer_id: "PLAYWRIGHT_HTML_CSS";
  renderer_version: "1.0.0";
  node_version: string;
  platform: "darwin" | "linux" | "win32";
  architecture: "arm64" | "x64";
  playwright_version: "1.62.1";
  chromium_version: string;
  headless_mode: "HEADLESS";
  viewport: {
    width: 1242;
    height: 1660;
  };
  device_scale_factor: 1;
  locale: "zh-CN";
  timezone: "Asia/Shanghai";
  color_scheme: "light";
  reduced_motion: "reduce";
  screenshot_options: {
    type: "png";
    animations: "disabled";
    caret: "hide";
    scale: "css";
    omit_background: false;
  };
  /**
   * @minItems 1
   */
  resolved_fonts: [
    {
      role: string;
      family: string;
    },
    ...{
      role: string;
      family: string;
    }[],
  ];
  font_profile_hash: string;
  network_requests_attempted: number;
  network_requests_blocked: number;
  environment_fingerprint: string;
  created_at: string;
  run_id: string;
  schema_version: "1.0.0";
  extensions: {
    [k: string]: unknown;
  };
}
