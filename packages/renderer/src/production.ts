import { createHash } from "node:crypto";
import { access, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright-core";
import { captureDeterministicReplay } from "./production-reliability.js";

export const PLAYWRIGHT_VERSION = "1.62.1";
export const RENDERER_VERSION = "1.0.0";
export const CANVAS = { width: 1242, height: 1660 } as const;
// T96/R84/B96/L84 is the immutable safe area carried by the approved VV-1
// first-page handoff. The template regions below are expressed from the same
// handoff percentages; they are not renderer-authored replacement layout data.
export const SAFE_AREA = { x: 84, y: 96, width: 1074, height: 1468 } as const;

export interface FirstPageText {
  headline: string;
  body: string;
  pageNumber: string;
}

export interface ProductionRenderRequest {
  projectId: string;
  contentId: string;
  contentVersion: string;
  copyVersion: string;
  visualPlanVersion: string;
  firstPageVersion: string;
  runId: string;
  outputDirectory: string;
  text: FirstPageText;
}

export interface LayoutMeasurement {
  layer_id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scroll_width: number;
  client_width: number;
  scroll_height: number;
  client_height: number;
  computed_font_family: string;
  computed_font_size: string;
  computed_line_height: string;
  line_count: number;
  z_index: string;
  visible: boolean;
}

export interface ProductionRenderResult {
  outputPath: string;
  backgroundPath: string;
  htmlPath: string;
  checksum: string;
  secondPassChecksum: string;
  byteLength: number;
  width: number;
  height: number;
  chromiumVersion: string;
  resolvedFonts: Array<{ role: string; family: string }>;
  measurements: LayoutMeasurement[];
  networkRequestsAttempted: number;
  networkRequestsBlocked: number;
  copyFidelity: boolean;
  safeAreaValid: boolean;
  overflowDetected: boolean;
  clippingDetected: boolean;
  unexpectedScroll: boolean;
  deterministic: boolean;
  htmlHash: string;
  cssHash: string;
  graphicHash: string;
  domHash: string;
}

const sha256 = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");

function rendererError(
  code: string,
  message: string,
  recommendedAction: string,
  retryable = false,
) {
  return Object.assign(new Error(message), {
    code,
    retryable,
    scope: "FIRST_PAGE_RENDERER",
    recommended_action: recommendedAction,
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function assertSafeText(text: FirstPageText): void {
  for (const value of [text.headline, text.body, text.pageNumber]) {
    if (!value.trim() || /<(script|style|iframe|object|embed)|onload\s*=|onclick\s*=/iu.test(value))
      throw rendererError(
        "RENDER_HTML_INJECTION_BLOCKED",
        "A first-page text layer was empty or contained forbidden markup.",
        "Use the exact plain-text layers from the approved visual handoff.",
      );
  }
}

export class ProgrammaticGraphicCompiler {
  compile(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1242" height="1660" viewBox="0 0 1242 1660" role="presentation" aria-hidden="true">
  <rect width="1242" height="1660" fill="#F5F2EB"/>
  <g fill="none" stroke="#66717A" stroke-width="2">
    <rect x="704" y="204" width="370" height="270" rx="20" opacity=".34"/>
    <rect x="764" y="548" width="310" height="270" rx="20" opacity=".56"/>
    <rect x="704" y="892" width="370" height="270" rx="20" opacity=".78"/>
    <path d="M1074 339h54v688h-54" opacity=".72"/>
    <path d="M739 474v74M919 818v74" opacity=".48"/>
  </g>
  <g font-family="Arial, sans-serif" font-size="24" font-weight="700" text-anchor="middle">
    <circle cx="744" cy="244" r="24" fill="#40566C"/><text x="744" y="252" fill="#F5F2EB">1</text>
    <circle cx="804" cy="588" r="24" fill="#40566C"/><text x="804" y="596" fill="#F5F2EB">2</text>
    <circle cx="744" cy="932" r="24" fill="#40566C"/><text x="744" y="940" fill="#F5F2EB">3</text>
  </g>
  <g fill="#40566C">
    <rect x="798" y="280" width="212" height="12" rx="6" opacity=".2"/><rect x="798" y="316" width="154" height="12" rx="6" opacity=".13"/>
    <rect x="858" y="624" width="152" height="12" rx="6" opacity=".28"/><rect x="858" y="660" width="104" height="12" rx="6" opacity=".18"/>
    <rect x="798" y="968" width="212" height="12" rx="6" opacity=".38"/><rect x="798" y="1004" width="174" height="12" rx="6" opacity=".22"/>
  </g>
  <rect x="84" y="1440" width="1074" height="2" fill="#24282D" opacity=".18"/>
</svg>`;
  }
}

export class SafeCssCompiler {
  compile(): string {
    return `*{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden;background:#F5F2EB}body{font-family:"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;color:#24282D}.canvas{position:relative;width:1242px;height:1660px;overflow:hidden;background:#F5F2EB}.graphic{position:absolute;inset:0;width:1242px;height:1660px;z-index:1}.title{position:absolute;left:7%;top:8%;width:86%;height:18%;padding-right:500px;color:#24282D;font-size:76px;font-weight:700;line-height:1.12;letter-spacing:0;z-index:3}.body{position:absolute;left:7%;top:30%;width:86%;height:42%;padding-right:548px;color:#24282D;font-size:40px;font-weight:400;line-height:1.45;letter-spacing:0;z-index:3}.number{position:absolute;left:86%;top:91%;width:7%;height:3%;color:#66717A;font-size:24px;font-weight:500;line-height:1.2;letter-spacing:0;text-align:right;z-index:3}.mark{position:absolute;left:7%;top:6%;width:62px;height:7px;background:#40566C;z-index:3}`;
  }
}

export class HtmlDocumentCompiler {
  compile(text: FirstPageText, svg: string, css: string): string {
    assertSafeText(text);
    const encodedSvg = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
    return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"><meta name="viewport" content="width=1242,height=1660,initial-scale=1"><style>${css}</style></head><body><main class="canvas" id="canvas"><img class="graphic" alt="" src="${encodedSvg}"><div class="mark"></div><div class="title text-layer" data-role="TITLE">${escapeHtml(text.headline)}</div><div class="body text-layer" data-role="BODY">${escapeHtml(text.body)}</div><div class="number text-layer" data-role="PAGE_NUMBER">${escapeHtml(text.pageNumber)}</div></main></body></html>`;
  }
}

async function atomicWrite(file: string, data: string | Uint8Array): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, data, { mode: 0o600 });
  await rename(temporary, file);
}

async function writeOnceOrReuse(file: string, data: string | Uint8Array): Promise<void> {
  try {
    const existing = await readFile(file);
    const proposed = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
    if (!existing.equals(proposed))
      throw rendererError(
        "FIRST_PAGE_PRODUCTION_CONFLICT",
        "The first-page version already exists with different bytes.",
        "Create the next FPV version; do not overwrite historical output.",
      );
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await atomicWrite(file, data);
}

function inspectPng(buffer: Buffer): { width: number; height: number } {
  if (
    buffer.length < 24 ||
    !buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    throw rendererError(
      "FIRST_PAGE_OUTPUT_INVALID",
      "Renderer output was not a valid PNG.",
      "Re-run renderer doctor and render again.",
    );
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function inspectPage(page: Page, text: FirstPageText) {
  return page.evaluate((expected) => {
    const canvas = document.querySelector<HTMLElement>("#canvas");
    const layers = [...document.querySelectorAll<HTMLElement>(".text-layer")];
    const measurements = layers.map((layer) => {
      const rect = layer.getBoundingClientRect();
      const style = getComputedStyle(layer);
      const range = document.createRange();
      range.selectNodeContents(layer);
      const textLineTops = [
        ...new Set(
          [...range.getClientRects()]
            .filter((line) => line.width > 0 && line.height > 0)
            .map((line) => Math.round(line.top * 100) / 100),
        ),
      ];
      return {
        layer_id: layer.dataset.role ?? "UNKNOWN",
        text: layer.textContent ?? "",
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        scroll_width: layer.scrollWidth,
        client_width: layer.clientWidth,
        scroll_height: layer.scrollHeight,
        client_height: layer.clientHeight,
        computed_font_family: style.fontFamily,
        computed_font_size: style.fontSize,
        computed_line_height: style.lineHeight,
        line_count: textLineTops.length,
        z_index: style.zIndex,
        visible:
          style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0,
      };
    });
    const safe = { left: 84, top: 96, right: 1158, bottom: 1564 };
    const safeAreaValid = measurements.every(
      (m) =>
        m.x >= safe.left &&
        m.y >= safe.top &&
        m.x + m.width <= safe.right &&
        m.y + m.height <= safe.bottom,
    );
    const overflowDetected = measurements.some(
      (m) => m.scroll_width > m.client_width || m.scroll_height > m.client_height,
    );
    const clippingDetected = measurements.some((m) => !m.visible || m.width <= 0 || m.height <= 0);
    const unexpectedScroll =
      document.documentElement.scrollWidth !== 1242 ||
      document.documentElement.scrollHeight !== 1660 ||
      document.body.scrollWidth !== 1242 ||
      document.body.scrollHeight !== 1660;
    const actual = Object.fromEntries(measurements.map((m) => [m.layer_id, m.text]));
    const copyFidelity =
      actual.TITLE === expected.headline &&
      actual.BODY === expected.body &&
      actual.PAGE_NUMBER === expected.pageNumber;
    return {
      measurements,
      safeAreaValid,
      overflowDetected,
      clippingDetected,
      unexpectedScroll,
      copyFidelity,
      dom: canvas?.outerHTML ?? "",
    };
  }, text);
}

async function resolvePlatformFonts(page: Page): Promise<Array<{ role: string; family: string }>> {
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const document = await session.send("DOM.getDocument", { depth: 1 });
    const resolved: Array<{ role: string; family: string }> = [];
    for (const role of ["TITLE", "BODY", "PAGE_NUMBER"] as const) {
      const node = await session.send("DOM.querySelector", {
        nodeId: document.root.nodeId,
        selector: `[data-role="${role}"]`,
      });
      if (!node.nodeId)
        throw rendererError(
          "RENDERER_FONT_UNAVAILABLE",
          `The required ${role} text layer was not available for font inspection.`,
          "Recompile the exact first-page handoff before rendering.",
        );
      const platform = await session.send("CSS.getPlatformFontsForNode", { nodeId: node.nodeId });
      const family = [...platform.fonts]
        .sort((left, right) => right.glyphCount - left.glyphCount)
        .find((font) => font.glyphCount > 0)?.familyName;
      if (!family)
        throw rendererError(
          "RENDERER_FONT_UNAVAILABLE",
          `Chromium did not resolve a platform font for ${role}.`,
          "Install or enable a local Chinese system font and run renderer doctor.",
        );
      resolved.push({ role, family });
    }
    return resolved;
  } finally {
    await session.detach();
  }
}

export class RendererCapabilityProbe {
  async probe() {
    const executable = chromium.executablePath();
    try {
      await access(executable);
    } catch {
      return {
        ready: false as const,
        code: "RENDERER_BROWSER_NOT_INSTALLED",
        browserVersion: null,
        executableHash: null,
      };
    }
    let browser: Browser | undefined;
    try {
      browser = await chromium.launch({ headless: true });
      return {
        ready: true as const,
        code: null,
        browserVersion: browser.version(),
        executableHash: sha256(await readFile(executable)),
      };
    } catch {
      return {
        ready: false as const,
        code: "RENDERER_BROWSER_LAUNCH_FAILED",
        browserVersion: null,
        executableHash: null,
      };
    } finally {
      await browser?.close();
    }
  }
}

export class RendererSetupService {
  readonly packageName = "playwright";
  readonly packageVersion = PLAYWRIGHT_VERSION;
  readonly browserName = "chromium";
  setupPlan(explicitConfirmation: boolean) {
    if (!explicitConfirmation)
      throw rendererError(
        "RENDERER_NOT_CONFIGURED",
        "Renderer setup requires explicit confirmation.",
        "Confirm the fixed Chromium setup operation.",
      );
    return {
      executable: process.execPath,
      argv: ["playwright-cli", "install", "chromium"],
      shell: false,
      version: PLAYWRIGHT_VERSION,
    };
  }
}

export class PlaywrightHtmlCssRendererAdapter {
  async probeCapabilities() {
    return new RendererCapabilityProbe().probe();
  }

  validateLayout(request: ProductionRenderRequest) {
    assertSafeText(request.text);
    if (!/^FPV-[1-9][0-9]*$/.test(request.firstPageVersion))
      throw rendererError(
        "RENDER_INPUT_UNSAFE",
        "First-page version is invalid.",
        "Use a stable FPV-n version.",
      );
    return [];
  }

  async renderPage(request: ProductionRenderRequest): Promise<ProductionRenderResult> {
    this.validateLayout(request);
    const capability = await this.probeCapabilities();
    if (!capability.ready)
      throw rendererError(
        capability.code,
        "The pinned Playwright Chromium is unavailable.",
        "Run content-ops renderer setup, then doctor.",
        true,
      );
    const svg = new ProgrammaticGraphicCompiler().compile();
    const css = new SafeCssCompiler().compile();
    const html = new HtmlDocumentCompiler().compile(request.text, svg, css);
    const backgroundPath = path.join(request.outputDirectory, "01-cover-background_v001.svg");
    const htmlPath = path.join(request.outputDirectory, "01-cover_v001.html");
    const outputPath = path.join(request.outputDirectory, "01-cover_v001.png");
    await writeOnceOrReuse(backgroundPath, svg);
    await writeOnceOrReuse(htmlPath, html);
    let browser: Browser | undefined;
    let attempted = 0;
    let blocked = 0;
    try {
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: CANVAS,
        deviceScaleFactor: 1,
        locale: "zh-CN",
        timezoneId: "Asia/Shanghai",
        colorScheme: "light",
        reducedMotion: "reduce",
        acceptDownloads: false,
        serviceWorkers: "block",
      });
      await context.route("**/*", async (route) => {
        attempted += 1;
        blocked += 1;
        await route.abort("blockedbyclient");
      });
      const page = await context.newPage();
      await page.setContent(html, { waitUntil: "load", timeout: 30_000 });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
      });
      const inspected = await inspectPage(page, request.text);
      const resolvedFonts = await resolvePlatformFonts(page);
      if (!inspected.copyFidelity)
        throw rendererError(
          "FIRST_PAGE_COPY_DRIFT",
          "Rendered text differs from the handoff.",
          "Recompile from the current handoff.",
        );
      if (inspected.overflowDetected)
        throw rendererError(
          "FIRST_PAGE_LAYOUT_OVERFLOW",
          `A text layer overflowed its box: ${inspected.measurements
            .filter(
              (measurement) =>
                measurement.scroll_width > measurement.client_width ||
                measurement.scroll_height > measurement.client_height,
            )
            .map(
              (measurement) =>
                `${measurement.layer_id}(${measurement.scroll_width}/${measurement.client_width},${measurement.scroll_height}/${measurement.client_height})`,
            )
            .join(",")}.`,
          "Create a render-only revision without changing copy.",
        );
      if (!inspected.safeAreaValid)
        throw rendererError(
          "FIRST_PAGE_SAFE_AREA_VIOLATION",
          "A text layer crossed the safe area.",
          "Create a render-only layout revision.",
        );
      if (inspected.clippingDetected || inspected.unexpectedScroll)
        throw rendererError(
          "FIRST_PAGE_OUTPUT_INVALID",
          "The rendered page clipped content or scrolled.",
          "Inspect layout measurements and revise layout.",
        );
      const capture = await captureDeterministicReplay({
        browser,
        html,
        selectors: ["#canvas", ".text-layer"],
        seedInput: {
          contentVersion: request.contentVersion,
          copyVersion: request.copyVersion,
          visualVersion: `${request.visualPlanVersion}:${request.firstPageVersion}`,
          pageNumber: 1,
          assetIds: [sha256(svg), sha256(css)],
        },
        browserVersion: browser.version(),
      });
      const first = capture.first_png;
      const second = capture.replay_png;
      const dimensions = inspectPng(first);
      inspectPng(second);
      if (dimensions.width !== CANVAS.width || dimensions.height !== CANVAS.height)
        throw rendererError(
          "FIRST_PAGE_OUTPUT_INVALID",
          "PNG dimensions differ from the 1242 by 1660 contract.",
          "Verify renderer context and screenshot scale.",
        );
      const checksum = sha256(first);
      const secondPassChecksum = sha256(second);
      if (checksum !== secondPassChecksum)
        throw rendererError(
          "FIRST_PAGE_CHECKSUM_MISMATCH",
          "Two same-environment screenshots differed.",
          "Preserve evidence and inspect renderer nondeterminism.",
        );
      await writeOnceOrReuse(outputPath, first);
      const persisted = await readFile(outputPath);
      const persistedStat = await stat(outputPath);
      if (sha256(persisted) !== checksum || persistedStat.size === 0)
        throw rendererError(
          "FIRST_PAGE_CHECKSUM_MISMATCH",
          "Persisted PNG failed read-after-write verification.",
          "Retry the controlled atomic write.",
        );
      await page.close();
      await context.close();
      return {
        outputPath,
        backgroundPath,
        htmlPath,
        checksum,
        secondPassChecksum,
        byteLength: persistedStat.size,
        width: dimensions.width,
        height: dimensions.height,
        chromiumVersion: capability.browserVersion,
        resolvedFonts,
        measurements: inspected.measurements,
        networkRequestsAttempted: attempted,
        networkRequestsBlocked: blocked,
        copyFidelity: inspected.copyFidelity,
        safeAreaValid: inspected.safeAreaValid,
        overflowDetected: inspected.overflowDetected,
        clippingDetected: inspected.clippingDetected,
        unexpectedScroll: inspected.unexpectedScroll,
        deterministic: checksum === secondPassChecksum,
        htmlHash: sha256(html),
        cssHash: sha256(css),
        graphicHash: sha256(svg),
        domHash: sha256(inspected.dom),
      };
    } finally {
      await browser?.close();
    }
  }

  renderSet(): Promise<never> {
    return Promise.reject(
      rendererError(
        "REMAINING_PAGE_PRODUCTION_DEFERRED",
        "Render set is deferred to Phase 4C.",
        "Approve G4 and create Style Lock before Phase 4C.",
      ),
    );
  }

  inspectRender(result: ProductionRenderResult) {
    return {
      valid:
        result.copyFidelity &&
        result.safeAreaValid &&
        !result.overflowDetected &&
        !result.clippingDetected &&
        !result.unexpectedScroll &&
        result.deterministic,
      warnings: [] as string[],
    };
  }
}
