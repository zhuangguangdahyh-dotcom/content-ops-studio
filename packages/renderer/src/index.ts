import type {
  PageVisualPlan,
  RenderReport,
  StyleLock,
} from "../../contracts/src/generated/1.0/index.js";

export * from "./production.js";
export * from "./production-reliability.js";
export * from "./direction-comparison.js";
export * from "./formal-calibration-cover.js";
export * from "./raster-text-contrast.js";
export * from "./selected-direction-first-page.js";
export * from "./calibration-remaining-pages.js";

export type RenderAssetReference = StyleLock["source_first_page_asset"];
export type RenderCanvas = StyleLock["locked_canvas"];
export type RenderSafeArea = StyleLock["locked_safe_area"];

export interface RendererCapabilities {
  implementationStatus: "MOCK_ONLY";
  producesImageBytes: false;
  browserInstalled: false;
  deterministicLayoutContract: true;
}

export interface RenderRequest {
  page_visual_plan: PageVisualPlan;
  style_lock: StyleLock;
  background_asset: RenderAssetReference;
  text_layers: PageVisualPlan["text_layers"];
  canvas: RenderCanvas;
  safe_area: RenderSafeArea;
  run_context: {
    run_id: string;
    render_report_id: string;
    generation_id: string;
    requested_at: string;
  };
}

export interface RenderResponse {
  render_report: RenderReport;
  output_asset: RenderAssetReference | null;
  layout_warnings: string[];
  errors: Array<{ code: string; message: string }>;
}

export interface RendererAdapter {
  probeCapabilities(): Promise<RendererCapabilities>;
  validateLayout(request: RenderRequest): Promise<Array<{ code: string; message: string }>>;
  renderPage(request: RenderRequest): Promise<RenderResponse>;
  renderSet(requests: RenderRequest[]): Promise<RenderResponse[]>;
  inspectRender(response: RenderResponse): Promise<{ valid: boolean; warnings: string[] }>;
}

function validateMockLayout(request: RenderRequest): Array<{ code: string; message: string }> {
  const errors: Array<{ code: string; message: string }> = [];
  if (
    request.canvas.width !== request.style_lock.locked_canvas.width ||
    request.canvas.height !== request.style_lock.locked_canvas.height
  )
    errors.push({ code: "CANVAS_MISMATCH", message: "Canvas must match Style Lock." });
  if (request.page_visual_plan.visual_plan_version !== request.style_lock.visual_plan_version)
    errors.push({
      code: "STYLE_LOCK_VERSION_MISMATCH",
      message: "Page plan and Style Lock versions differ.",
    });
  return errors;
}

export class MockRendererAdapter implements RendererAdapter {
  async probeCapabilities(): Promise<RendererCapabilities> {
    return Promise.resolve({
      implementationStatus: "MOCK_ONLY",
      producesImageBytes: false,
      browserInstalled: false,
      deterministicLayoutContract: true,
    });
  }

  async validateLayout(request: RenderRequest) {
    return Promise.resolve(validateMockLayout(request));
  }

  async renderPage(request: RenderRequest): Promise<RenderResponse> {
    const plan = request.page_visual_plan;
    const errors = validateMockLayout(request);
    const report: RenderReport = {
      render_report_id: request.run_context.render_report_id,
      generation_id: request.run_context.generation_id,
      project_id: plan.project_id,
      content_id: plan.content_id,
      page_number: plan.page_number,
      content_version: plan.content_version,
      copy_version: plan.copy_version,
      visual_plan_version: plan.visual_plan_version,
      style_lock_version: request.style_lock.style_lock_version,
      renderer: "mock-renderer",
      renderer_version: "0.1.0",
      render_mode: "MOCK",
      input_assets: [request.background_asset],
      output_asset: null,
      canvas: request.canvas,
      safe_area: request.safe_area,
      font_resolution: [],
      layout_measurements: [],
      overflow_detected: false,
      missing_assets: [],
      font_fallbacks: [],
      clipping_detected: false,
      unsafe_regions: [],
      warnings: ["MOCK_ONLY: no PNG was rendered."],
      errors: errors.map((error) => error.code),
      render_status: errors.length ? "RENDER_FAILED" : "RENDER_PENDING",
      run_id: request.run_context.run_id,
      schema_version: "1.0.0",
      started_at: request.run_context.requested_at,
      completed_at: null,
      extensions: { implementationStatus: "MOCK_ONLY" },
    };
    return Promise.resolve({
      render_report: report,
      output_asset: null,
      layout_warnings: [...report.warnings],
      errors,
    });
  }

  async renderSet(requests: RenderRequest[]): Promise<RenderResponse[]> {
    return Promise.all(requests.map((request) => this.renderPage(request)));
  }

  async inspectRender(response: RenderResponse) {
    return Promise.resolve({
      valid:
        response.render_report.render_status === "RENDER_PENDING" && response.output_asset === null,
      warnings: [...response.layout_warnings],
    });
  }
}
