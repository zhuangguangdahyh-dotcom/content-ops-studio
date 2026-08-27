import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { chromium, type Browser, type Page } from "playwright";
import {
  DETERMINISTIC_RENDER_CONTEXT_V1,
  FORMAL_ASSET_REQUIRED_GATES,
  ProductionRecoveryBudget,
  auditRenderInput,
  captureDeterministicReplay,
  createDeterministicRenderContext,
  deriveRenderSeed,
  evaluateContrastRecoveryStylePreservation,
  evaluateCopyGraphicSeparation,
  evaluateFormalAssetPromotionGate,
  evaluateSemanticLineBreak,
  resolveTextLayoutWithCandidates,
  runTextLayoutPreflight,
  stableRenderAssetOrder,
  stableSerialize,
  stabilizeRenderPage,
  type FormalAssetGate,
  type GateStatus,
  type TextLayoutPreflightResult,
} from "../../packages/renderer/src/production-reliability.js";

const seedInput = {
  contentVersion: "CV-1",
  copyVersion: "COPY-1",
  visualVersion: "VV-1",
  pageNumber: 2,
  assetIds: ["AST-B", "AST-A", "AST-A"],
};

const staticHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>
html,body{margin:0;width:1242px;height:1660px;overflow:hidden}.canvas{position:relative;width:1242px;height:1660px;background:#eee}.title{position:absolute;left:100px;top:120px;width:700px;font:700 72px/1.2 serif;color:#111}.graphic{position:absolute;left:900px;top:120px;width:100px;height:100px;background:#765;z-index:1}
</style></head><body><main class="canvas"><div class="title">稳定排版证据</div><div class="graphic"></div></main></body></html>`;

function passingPreflight(): TextLayoutPreflightResult {
  return {
    measurements: [],
    hard_blocks: [],
    result: "PASS",
    real_font_metrics_used: true,
    copy_changed: false,
  };
}

async function setPage(page: Page, html: string): Promise<void> {
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
}

describe("Production reliability hardening V1", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
  });

  afterAll(async () => {
    await browser.close();
  });

  it("rejects Date.now in render input", () => {
    expect(auditRenderInput("<div>Date.now()</div>", seedInput).findings).toContain(
      "NONDETERMINISTIC_DATE_NOW",
    );
  });

  it("rejects Math.random in render input", () => {
    expect(auditRenderInput("<div>Math.random()</div>", seedInput).findings).toContain(
      "NONDETERMINISTIC_MATH_RANDOM",
    );
  });

  it("rejects executable render DOM", () => {
    expect(auditRenderInput("<script>void 0</script>", seedInput).findings).toContain(
      "EXECUTABLE_RENDER_DOM_BLOCKED",
    );
  });

  it("rejects active CSS animation declarations", () => {
    expect(auditRenderInput("<style>.a{animation:pulse 1s}</style>", seedInput).findings).toContain(
      "ACTIVE_CSS_ANIMATION_DECLARED",
    );
  });

  it("canonicalizes object property ordering", () => {
    expect(stableSerialize({ b: 2, a: { d: 4, c: 3 } })).toBe(
      stableSerialize({ a: { c: 3, d: 4 }, b: 2 }),
    );
  });

  it("sorts and deduplicates stable asset identifiers", () => {
    expect(stableRenderAssetOrder(["B", "A", "B"])).toEqual(["A", "B"]);
  });

  it("derives the same seed regardless of asset order", () => {
    expect(deriveRenderSeed(seedInput)).toBe(
      deriveRenderSeed({ ...seedInput, assetIds: [...seedInput.assetIds].reverse() }),
    );
  });

  it("pins the deterministic context contract", async () => {
    const context = await createDeterministicRenderContext(browser);
    const page = await context.newPage();
    expect(page.viewportSize()).toEqual(DETERMINISTIC_RENDER_CONTEXT_V1.viewport);
    await context.close();
  });

  it("waits for real font readiness and stable DOM geometry", async () => {
    const context = await createDeterministicRenderContext(browser);
    const page = await context.newPage();
    await setPage(page, staticHtml);
    const evidence = await stabilizeRenderPage(page, [".canvas", ".title"]);
    expect(evidence.font_ready).toBe(true);
    expect(evidence.geometry_samples_observed).toBeGreaterThanOrEqual(3);
    await context.close();
  });

  it("waits for embedded image decode", async () => {
    const context = await createDeterministicRenderContext(browser);
    const page = await context.newPage();
    const pixel =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";
    await setPage(page, `<img class="asset" src="data:image/png;base64,${pixel}">`);
    const evidence = await stabilizeRenderPage(page, [".asset"]);
    expect(evidence.decoded_image_count).toBe(1);
    await context.close();
  });

  it("disables runtime animation before capture", async () => {
    const context = await createDeterministicRenderContext(browser);
    const page = await context.newPage();
    await setPage(
      page,
      "<style>@keyframes x{to{transform:translateX(1px)}}.a{animation:x 1s infinite}</style><div class='a'>A</div>",
    );
    const evidence = await stabilizeRenderPage(page, [".a"]);
    expect(evidence.animation_count).toBe(0);
    await context.close();
  });

  it("captures byte-identical formal and replay PNGs from fresh contexts", async () => {
    const result = await captureDeterministicReplay({
      browser,
      html: staticHtml,
      selectors: [".canvas", ".title", ".graphic"],
      seedInput,
      browserVersion: browser.version(),
    });
    expect(result.deterministic).toBe(true);
    expect(result.first_checksum).toBe(result.replay_checksum);
  });

  it("rejects punctuation orphaned at the start of a line", () => {
    expect(
      evaluateSemanticLineBreak({
        approvedText: "判断，才可靠",
        renderedLines: ["判断", "，才可靠"],
      }).hard_blocks,
    ).toContain("ORPHAN_PUNCTUATION");
  });

  it("rejects a one-Han-character line", () => {
    expect(
      evaluateSemanticLineBreak({ approvedText: "判断可靠", renderedLines: ["判", "断可靠"] })
        .hard_blocks,
    ).toContain("ORPHAN_CHARACTER");
  });

  it("rejects splitting a protected semantic unit", () => {
    expect(
      evaluateSemanticLineBreak({
        approvedText: "专业判断",
        renderedLines: ["专业", "判断"],
        semanticUnits: ["专业判断"],
      }).hard_blocks,
    ).toContain("SEMANTIC_UNIT_SPLIT");
  });

  it("detects overflow using actual browser font metrics", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(
      page,
      "<div class='t' style='position:absolute;left:100px;top:100px;width:80px;height:40px;overflow:hidden;white-space:nowrap;font-size:48px'>这是一段很长的文案</div>",
    );
    const result = await runTextLayoutPreflight({
      page,
      layers: [
        { layerId: "T", selector: ".t", approvedText: "这是一段很长的文案", minimumFontSizePx: 30 },
      ],
    });
    expect(result.hard_blocks).toContain("OVERFLOW");
    await page.close();
  });

  it("detects clipping", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(page, "<div class='t' style='display:none'>不可见</div>");
    const result = await runTextLayoutPreflight({
      page,
      layers: [{ layerId: "T", selector: ".t", approvedText: "不可见", minimumFontSizePx: 20 }],
    });
    expect(result.hard_blocks).toContain("CLIPPING");
    await page.close();
  });

  it("detects safe-area violations", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(
      page,
      "<div class='t' style='position:absolute;left:0;top:0;font-size:40px'>越界文字</div>",
    );
    const result = await runTextLayoutPreflight({
      page,
      layers: [{ layerId: "T", selector: ".t", approvedText: "越界文字", minimumFontSizePx: 20 }],
    });
    expect(result.hard_blocks).toContain("SAFE_AREA");
    await page.close();
  });

  it("detects excessive font-size shrink", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(page, "<div class='t' style='margin:100px;font-size:20px'>核心文字</div>");
    const result = await runTextLayoutPreflight({
      page,
      layers: [{ layerId: "T", selector: ".t", approvedText: "核心文字", minimumFontSizePx: 36 }],
    });
    expect(result.hard_blocks).toContain("EXCESSIVE_SHRINK");
    await page.close();
  });

  it("detects text-to-text collisions", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(
      page,
      "<div class='a' style='position:absolute;left:100px;top:100px;font-size:40px'>标题完整</div><div class='b' style='position:absolute;left:100px;top:100px;font-size:40px'>正文完整</div>",
    );
    const result = await runTextLayoutPreflight({
      page,
      layers: [
        { layerId: "A", selector: ".a", approvedText: "标题完整", minimumFontSizePx: 30 },
        { layerId: "B", selector: ".b", approvedText: "正文完整", minimumFontSizePx: 30 },
      ],
    });
    expect(result.hard_blocks).toContain("TEXT_COLLISION");
    await page.close();
  });

  it("detects foreground graphic occlusion of text", async () => {
    const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
    await setPage(
      page,
      "<div class='t' style='position:absolute;left:100px;top:100px;font-size:40px;z-index:1'>标题完整</div><div class='g' style='position:absolute;left:100px;top:100px;width:200px;height:60px;z-index:2'></div>",
    );
    const result = await runTextLayoutPreflight({
      page,
      layers: [{ layerId: "T", selector: ".t", approvedText: "标题完整", minimumFontSizePx: 30 }],
      graphics: [{ graphicId: "G", selector: ".g", occludesTextLayerIds: ["T"] }],
    });
    expect(result.hard_blocks).toContain("TEXT_GRAPHIC_COLLISION");
    await page.close();
  });

  it("uses the bounded recovery order and stops at the first passing candidate", async () => {
    const result = await resolveTextLayoutWithCandidates({
      candidates: [
        { id: "font", recoveryStep: "FONT_SIZE_REDUCTION", value: 2 },
        { id: "break", recoveryStep: "SEMANTIC_LINE_BREAK", value: 1 },
      ],
      applyAndMeasure: (candidate) =>
        Promise.resolve(
          candidate.id === "break"
            ? passingPreflight()
            : { ...passingPreflight(), result: "FAIL", hard_blocks: ["OVERFLOW"] },
        ),
    });
    expect(result.selected?.id).toBe("break");
    expect(result.attempts).toHaveLength(1);
  });

  it("blocks after the text-layout recovery budget is exhausted", async () => {
    const result = await resolveTextLayoutWithCandidates({
      candidates: [
        { id: "one", recoveryStep: "SEMANTIC_LINE_BREAK", value: 1 },
        { id: "two", recoveryStep: "TEXT_REGION_EXPANSION", value: 2 },
      ],
      maximumAttempts: 1,
      applyAndMeasure: () =>
        Promise.resolve({
          ...passingPreflight(),
          result: "FAIL",
          hard_blocks: ["OVERFLOW"],
        }),
    });
    expect(result.result).toBe("BLOCKED");
    expect(result.budget_exhausted).toBe(true);
  });

  it("excludes purely graphical markers from copy fidelity", () => {
    const result = evaluateCopyGraphicSeparation({
      approvedContentLayers: [{ layerId: "TITLE", text: "判断可靠" }],
      renderedContentLayers: [{ layerId: "TITLE", text: "判断可靠" }],
      graphicMarkers: [
        {
          markerId: "M1",
          text: "01",
          graphicFunction: "sequence marker",
          addsSemanticContent: false,
          functionalLabelApproved: false,
        },
      ],
    });
    expect(result.result).toBe("PASS");
    expect(result.graphic_markers_excluded_from_copy_fidelity).toBe(true);
  });

  it("blocks graphic markers that add unapproved meaning", () => {
    const result = evaluateCopyGraphicSeparation({
      approvedContentLayers: [{ layerId: "TITLE", text: "判断可靠" }],
      renderedContentLayers: [{ layerId: "TITLE", text: "判断可靠" }],
      graphicMarkers: [
        {
          markerId: "M1",
          text: "官方认证",
          graphicFunction: "badge",
          addsSemanticContent: true,
          functionalLabelApproved: false,
        },
      ],
    });
    expect(result.hard_blocks).toContain("COPY_CHANGE_REQUIRED");
  });

  it("allows bounded local contrast recovery without style drift", () => {
    expect(
      evaluateContrastRecoveryStylePreservation({
        beforeVisualSystemKey: "SYSTEM-A",
        afterVisualSystemKey: "SYSTEM-A",
        changedVariables: ["FOREGROUND_COLOR", "LOCAL_VALUE"],
      }).result,
    ).toBe("PASS");
  });

  it("blocks contrast recovery that changes the visual system", () => {
    expect(
      evaluateContrastRecoveryStylePreservation({
        beforeVisualSystemKey: "SYSTEM-A",
        afterVisualSystemKey: "SYSTEM-B",
        changedVariables: ["FOREGROUND_COLOR"],
      }).hard_blocks,
    ).toContain("CONTRAST_RECOVERY_STYLE_DRIFT");
  });

  it("keeps a failed formal asset as an attempt only", () => {
    const gates = Object.fromEntries(
      FORMAL_ASSET_REQUIRED_GATES.map((gate) => [gate, "PASS"]),
    ) as Record<FormalAssetGate, GateStatus>;
    gates.DETERMINISM = "FAIL";
    const result = evaluateFormalAssetPromotionGate({ attemptId: "ATT-1", gates, hardBlocks: [] });
    expect(result.formal_asset).toBe(false);
    expect(result.promotion_status).toBe("ATTEMPT_ONLY");
  });

  it("promotes only after every required gate passes", () => {
    const gates = Object.fromEntries(
      FORMAL_ASSET_REQUIRED_GATES.map((gate) => [gate, "PASS"]),
    ) as Record<FormalAssetGate, GateStatus>;
    expect(
      evaluateFormalAssetPromotionGate({ attemptId: "ATT-2", gates, hardBlocks: [] })
        .promotion_status,
    ).toBe("PROMOTED");
  });

  it("enforces per-category production recovery budgets with traceable evidence", () => {
    const budget = new ProductionRecoveryBudget();
    expect(budget.consume("DETERMINISM", "QA_PAGE_ISOLATION", "avoid DOM mutation").allowed).toBe(
      true,
    );
    expect(budget.consume("DETERMINISM", "FRESH_CONTEXT", "verify replay").allowed).toBe(true);
    expect(budget.consume("DETERMINISM", "EXTRA_RETRY", "should stop").allowed).toBe(false);
    expect(budget.report().evidence).toHaveLength(2);
  });
});
