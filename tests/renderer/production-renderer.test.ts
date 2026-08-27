import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  HtmlDocumentCompiler,
  PlaywrightHtmlCssRendererAdapter,
  ProgrammaticGraphicCompiler,
  SafeCssCompiler,
} from "../../packages/renderer/src/production.js";

describe("Phase 4B production renderer", () => {
  it("compiles fixed, text-free programmatic graphics and escapes handoff text", () => {
    const svg = new ProgrammaticGraphicCompiler().compile();
    expect(svg).not.toContain("先别急着");
    expect(svg).not.toMatch(/<image|<script/i);
    const html = new HtmlDocumentCompiler().compile(
      { headline: "<判断>", body: "核验 & 边界", pageNumber: "01" },
      svg,
      new SafeCssCompiler().compile(),
    );
    expect(html).toContain("&lt;判断&gt;");
    expect(html).toContain("核验 &amp; 边界");
    expect(html).toContain("default-src 'none'");
    expect(html).not.toContain("DECISION CHECK");
    expect(html.match(/class="[^"]*text-layer/g)).toHaveLength(3);
    expect(new SafeCssCompiler().compile()).toContain("left:7%;top:8%;width:86%;height:18%");
    expect(new SafeCssCompiler().compile()).toContain("font-size:76px");
  });

  it("renders a real deterministic 1242 by 1660 PNG with zero remote requests", async () => {
    const outputDirectory = await mkdtemp(path.join(os.tmpdir(), "content-ops-renderer-"));
    const result = await new PlaywrightHtmlCssRendererAdapter().renderPage({
      projectId: "PRJ-20990101-DEMO",
      contentId: "C-0001",
      contentVersion: "CV-1",
      copyVersion: "CV-1",
      visualPlanVersion: "VV-1",
      firstPageVersion: "FPV-1",
      runId: "RUN-20990101-010203-DEMO",
      outputDirectory,
      text: {
        headline: "先别急着相信“专业”",
        body: "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。",
        pageNumber: "01",
      },
    });
    expect(result).toMatchObject({
      width: 1242,
      height: 1660,
      copyFidelity: true,
      safeAreaValid: true,
      overflowDetected: false,
      deterministic: true,
      networkRequestsAttempted: 0,
    });
    expect((await readFile(result.outputPath)).subarray(1, 4).toString()).toBe("PNG");
  }, 60_000);

  it("refuses whole-set rendering before G4 and Style Lock", async () => {
    await expect(new PlaywrightHtmlCssRendererAdapter().renderSet()).rejects.toMatchObject({
      code: "REMAINING_PAGE_PRODUCTION_DEFERRED",
    });
  });
});
