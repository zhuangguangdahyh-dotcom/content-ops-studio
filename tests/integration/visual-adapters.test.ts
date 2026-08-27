import { readFile } from "node:fs/promises";
import path from "node:path";
import { beforeAll, describe, expect, it } from "vitest";
import type {
  PageVisualPlan,
  StyleLock,
} from "../../packages/contracts/src/generated/1.0/index.js";
import {
  MockImageGenerationAdapter,
  PromptOnlyImageGenerationAdapter,
} from "../../packages/image-adapters/src/index.js";
import { MockRendererAdapter } from "../../packages/renderer/src/index.js";

interface WorkflowFixture {
  page_visual_plans: PageVisualPlan[];
  style_lock: StyleLock;
}
let fixture: WorkflowFixture;

beforeAll(async () => {
  fixture = JSON.parse(
    await readFile(
      path.resolve(
        "tests/fixtures/contracts/1.0/visual-workflow/valid/full-visual-finalization.json",
      ),
      "utf8",
    ),
  ) as WorkflowFixture;
});

function imageRequest(page: PageVisualPlan, lock: StyleLock | null) {
  return {
    page_visual_plan: page,
    style_lock: lock,
    reference_assets: [],
    generation_constraints: ["No informational text"],
    requested_output: {
      asset_role: "BACKGROUND" as const,
      mime_type: "image/png",
      canvas: fixture.style_lock.locked_canvas,
      relative_path: `projects/demo/backgrounds/${page.page_number}.png`,
    },
    run_context: {
      run_id: "RUN-20990101-010203-DEMO",
      generation_id: `GEN-ADAPTER-${page.page_number}`,
      requested_at: "2099-01-01T01:02:03.000Z",
    },
  };
}

describe("image generation Adapter contracts", () => {
  it("marks the mock as network-free and never fabricates an image path", async () => {
    const page = fixture.page_visual_plans[0];
    if (!page) throw new Error("Missing first page.");
    const adapter = new MockImageGenerationAdapter();
    await expect(adapter.probeCapabilities()).resolves.toMatchObject({
      implementationStatus: "MOCK_ONLY",
      networkAccess: false,
      producesImageBytes: false,
    });
    const result = await adapter.generateAsset(imageRequest(page, null));
    expect(result.generation_manifest.generation_status).toBe("GENERATION_PENDING");
    expect(result.asset_references).toEqual([]);
    expect(result.generation_manifest.output_assets).toEqual([]);
  });

  it("produces only a structured prompt and blocks remaining pages without Style Lock", async () => {
    const page = fixture.page_visual_plans[1];
    if (!page) throw new Error("Missing second page.");
    const adapter = new PromptOnlyImageGenerationAdapter();
    const blocked = await adapter.generateAsset(imageRequest(page, null));
    expect(blocked.errors[0]?.code).toBe("STYLE_LOCK_REQUIRED");
    const result = await adapter.generateAsset(imageRequest(page, fixture.style_lock));
    expect(result.prompt_artifact).toContain(page.background_direction);
    expect(result.capability_warnings).toContain(
      "Awaiting external execution; no image asset exists.",
    );
    expect(result.asset_references).toEqual([]);
  });
});

describe("Renderer Adapter contract", () => {
  it("is MOCK_ONLY, browser-free, and returns no PNG or output path", async () => {
    const page = fixture.page_visual_plans[0];
    if (!page) throw new Error("Missing first page.");
    const adapter = new MockRendererAdapter();
    await expect(adapter.probeCapabilities()).resolves.toEqual({
      implementationStatus: "MOCK_ONLY",
      producesImageBytes: false,
      browserInstalled: false,
      deterministicLayoutContract: true,
    });
    const result = await adapter.renderPage({
      page_visual_plan: page,
      style_lock: fixture.style_lock,
      background_asset: fixture.style_lock.source_first_page_asset,
      text_layers: page.text_layers,
      canvas: fixture.style_lock.locked_canvas,
      safe_area: fixture.style_lock.locked_safe_area,
      run_context: {
        run_id: "RUN-20990101-010203-DEMO",
        render_report_id: "RPT-RENDER-ADAPTER-01",
        generation_id: "GEN-ADAPTER-1",
        requested_at: "2099-01-01T01:02:03.000Z",
      },
    });
    expect(result.render_report.render_status).toBe("RENDER_PENDING");
    expect(result.output_asset).toBeNull();
    expect(result.render_report.extensions).toEqual({ implementationStatus: "MOCK_ONLY" });
  });
});
