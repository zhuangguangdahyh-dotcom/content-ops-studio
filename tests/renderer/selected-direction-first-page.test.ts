import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { describe, expect, it } from "vitest";
import {
  compileSelectedDirectionFirstPageHtml,
  renderSelectedDirectionFirstPage,
} from "../../packages/renderer/src/selected-direction-first-page.js";

const title = "先别急着相信“专业”";
const body = "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。";

describe("selected-direction formal first page", () => {
  it("keeps all formal copy Renderer-owned and adds no informational text", () => {
    const html = compileSelectedDirectionFirstPageHtml({
      backgroundBytes: Buffer.from("fixture"),
      headline: title,
      body,
    });
    expect(html).toContain("先别急着相信");
    expect(html).toContain("“专业”");
    expect(html).toContain("真正值得判断的，不是包装有多满，");
    expect(html).toContain("而是身份、资质和服务边界");
    expect(html).toContain("能不能被核验。");
    expect(html).not.toMatch(/>主体</u);
    expect(html).not.toMatch(/>资质</u);
    expect(html).not.toMatch(/>边界</u);
    expect(html).not.toContain("CTA");
    expect(html).not.toContain("01 / 06");
    expect(html).toContain("default-src 'none'");
  });

  it("renders and replays the raster-backed FPV deterministically", async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "content-ops-fpv2-"));
    const backgroundPath = path.join(directory, "background.png");
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
      await page.setContent('<div style="position:fixed;inset:0;background:#f1e9dc"></div>');
      await page.screenshot({ path: backgroundPath, type: "png" });
    } finally {
      await browser.close();
    }
    const result = await renderSelectedDirectionFirstPage({
      backgroundPath,
      outputDirectory: directory,
      headline: title,
      body,
    });
    expect(result).toMatchObject({
      width: 1242,
      height: 1660,
      copyFidelity: true,
      safeAreaValid: true,
      overflowDetected: false,
      clippingDetected: false,
      deterministic: true,
      networkRequestsAttempted: 0,
    });
    expect(result.checksum).toBe(result.secondPassChecksum);
  }, 60_000);
});
