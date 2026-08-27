import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright-core";
import {
  analyzeRasterTextBackgroundContrast,
  type RasterContrastMeasurement,
} from "./raster-text-contrast.js";
import { captureDeterministicReplay } from "./production-reliability.js";

const WIDTH = 1242;
const HEIGHT = 1660;
const SAFE = { top: 72, right: 70, bottom: 72, left: 70 } as const;
const PRIMARY_COPY = "门头没说清，顾客就走了";
const SUPPORTING_COPY = "门店老板先查品类、定位和入口";

const sha256 = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

async function writeOnceOrReuse(file: string, value: string | Buffer): Promise<void> {
  const proposed = typeof value === "string" ? Buffer.from(value) : value;
  try {
    const existing = await readFile(file);
    if (!existing.equals(proposed)) throw new Error("FORMAL_CALIBRATION_VERSION_CONFLICT");
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, proposed, { mode: 0o600 });
  await rename(temporary, file);
}

export interface FormalCalibrationCoverRequest {
  backgroundPath: string;
  outputDirectory: string;
  primaryCopy: string;
  supportingCopy: string;
}

export interface FormalCalibrationCoverResult {
  outputPath: string;
  replayPath: string;
  htmlPath: string;
  thumbnail310Path: string;
  thumbnail186Path: string;
  checksum: string;
  secondPassChecksum: string;
  thumbnail310Checksum: string;
  thumbnail186Checksum: string;
  deterministic: boolean;
  width: number;
  height: number;
  byteLength: number;
  copyFidelity: boolean;
  safeAreaValid: boolean;
  overflowDetected: boolean;
  clippingDetected: boolean;
  unexpectedScroll: boolean;
  networkRequestsAttempted: number;
  networkRequestsBlocked: number;
  chromiumVersion: string;
  resolvedFonts: Array<{ role: string; family: string }>;
  measurements: Array<{
    layer_id: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    line_count: number;
    font_size: number;
  }>;
  htmlHash: string;
  domHash: string;
}

export interface ContrastRevisedFormalCalibrationCoverResult extends FormalCalibrationCoverResult {
  backgroundAnalysisPath: string;
  rasterContrast: RasterContrastMeasurement[];
}

export function compileFormalCalibrationCoverHtml(input: {
  backgroundBytes: Buffer;
  primaryCopy: string;
  supportingCopy: string;
}): string {
  if (input.primaryCopy !== PRIMARY_COPY) throw new Error("FORMAL_CALIBRATION_PRIMARY_COPY_DRIFT");
  if (input.supportingCopy !== SUPPORTING_COPY)
    throw new Error("FORMAL_CALIBRATION_SUPPORTING_COPY_DRIFT");
  const encoded = input.backgroundBytes.toString("base64");
  const primary = ["门头没说清，", "顾客就走了"]
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  const supporting = ["门店老板先查品类、", "定位和入口"]
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"><meta name="viewport" content="width=${WIDTH},height=${HEIGHT},initial-scale=1"><style>
*{box-sizing:border-box}html,body{width:${WIDTH}px;height:${HEIGHT}px;margin:0;overflow:hidden}body{font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;-webkit-font-smoothing:antialiased}.canvas{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#e9ecec}.background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.copy{position:absolute;left:70px;top:78px;width:1092px;color:#151515}.title{width:1092px;padding:6px 0 30px;font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;font-size:190px;line-height:1.1;letter-spacing:-.075em;font-weight:700}.title span,.supporting span{display:block;white-space:nowrap}.supporting{margin-top:8px;width:920px;padding:3px 0 12px;font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;font-size:96px;line-height:1.24;letter-spacing:-.035em;font-weight:400;color:#303234}.calibration-rule{position:absolute;left:72px;top:854px;width:94px;height:6px;background:#262626}.calibration-index{position:absolute;left:180px;top:854px;width:248px;height:6px;background:rgba(38,38,38,.18)}
</style></head><body><main class="canvas" id="canvas"><img class="background" alt="" src="data:image/png;base64,${encoded}"><section class="copy"><div class="title text-layer" data-role="PRIMARY">${primary}</div><div class="supporting text-layer" data-role="SUPPORTING">${supporting}</div></section><div class="calibration-rule" aria-hidden="true"></div><div class="calibration-index" aria-hidden="true"></div></main></body></html>`;
}

export function compileContrastRevisedFormalCalibrationCoverHtml(input: {
  backgroundBytes: Buffer;
  primaryCopy: string;
  supportingCopy: string;
}): string {
  if (input.primaryCopy !== PRIMARY_COPY) throw new Error("FORMAL_CALIBRATION_PRIMARY_COPY_DRIFT");
  if (input.supportingCopy !== SUPPORTING_COPY)
    throw new Error("FORMAL_CALIBRATION_SUPPORTING_COPY_DRIFT");
  const encoded = input.backgroundBytes.toString("base64");
  const primary = ["门头没说清，", "顾客就走了"]
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  const supporting = ["门店老板先查品类、", "定位和入口"]
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"><meta name="viewport" content="width=${WIDTH},height=${HEIGHT},initial-scale=1"><style>
*{box-sizing:border-box}html,body{width:${WIDTH}px;height:${HEIGHT}px;margin:0;overflow:hidden}body{font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;-webkit-font-smoothing:antialiased}.canvas{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#e9ecec}.background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.local-value-correction{position:absolute;right:-24px;top:-18px;width:690px;height:520px;background:radial-gradient(ellipse at 72% 18%,rgba(235,244,250,.96) 0%,rgba(235,244,250,.90) 34%,rgba(235,244,250,.52) 56%,rgba(235,244,250,0) 78%)}.copy{position:absolute;left:70px;top:72px;width:1060px;color:#101010}.title{width:1060px;height:396px;padding:0 0 20px;font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;font-size:172px;line-height:1.06;letter-spacing:-.075em;font-weight:700}.title span,.supporting span{display:block;white-space:nowrap}.supporting{position:absolute;left:40px;top:490px;width:880px;padding:4px 0 14px;font-family:"Songti SC","STSong","Noto Serif CJK SC",serif;font-size:96px;line-height:1.24;letter-spacing:-.035em;font-weight:400;color:#111111;opacity:1}.calibration-rule{position:absolute;left:112px;top:868px;width:94px;height:6px;background:#181818}.calibration-index{position:absolute;left:220px;top:868px;width:248px;height:6px;background:rgba(24,24,24,.34)}
</style></head><body><main class="canvas" id="canvas"><img class="background" alt="" src="data:image/png;base64,${encoded}"><div class="local-value-correction" aria-hidden="true"></div><section class="copy"><div class="title text-layer" data-role="PRIMARY">${primary}</div><div class="supporting text-layer" data-role="SUPPORTING">${supporting}</div></section><div class="calibration-rule" aria-hidden="true"></div><div class="calibration-index" aria-hidden="true"></div></main></body></html>`;
}

export async function measureHistoricalFormalCalibrationCoverRasterContrast(
  request: Omit<FormalCalibrationCoverRequest, "outputDirectory">,
): Promise<RasterContrastMeasurement[]> {
  const backgroundBytes = await readFile(request.backgroundPath);
  if (backgroundBytes.length < 24) throw new Error("FORMAL_CALIBRATION_BACKGROUND_INVALID");
  const html = compileFormalCalibrationCoverHtml({
    backgroundBytes,
    primaryCopy: request.primaryCopy,
    supportingCopy: request.supportingCopy,
  });
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url === "about:blank" || url.startsWith("data:")) return route.continue();
      return route.abort("blockedbyclient");
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const inspection = await inspect(page, {
      primaryCopy: request.primaryCopy,
      supportingCopy: request.supportingCopy,
    });
    const fonts = await resolveFonts(page);
    await page.evaluate(() => {
      document
        .querySelectorAll<HTMLElement>(".text-layer,.calibration-rule,.calibration-index")
        .forEach((element) => (element.style.visibility = "hidden"));
    });
    const backgroundAnalysis = await page.screenshot({
      type: "png",
      animations: "disabled",
      caret: "hide",
    });
    return await analyzeRasterTextBackgroundContrast(
      page,
      backgroundAnalysis,
      inspection.measurements.map((item) => ({
        text_layer_id: item.layer_id === "PRIMARY" ? "PRIMARY_HOOK" : "SECONDARY_SIGNAL",
        role: item.layer_id === "PRIMARY" ? "PRIMARY_HOOK" : "SECONDARY_SIGNAL",
        foreground_color: item.layer_id === "PRIMARY" ? "#151515" : "#303234",
        foreground_opacity: 1,
        text_bbox: { x: item.x, y: item.y, width: item.width, height: item.height },
        resolved_font: fonts.find((font) => font.role === item.layer_id)?.family ?? "UNKNOWN",
        resolved_weight: item.layer_id === "PRIMARY" ? 700 : 400,
      })),
    );
  } finally {
    await browser.close();
  }
}

async function inspect(page: Page, expected: { primaryCopy: string; supportingCopy: string }) {
  return page.evaluate(
    ({ expectedCopy, safe, width, height }) => {
      const layers = [...document.querySelectorAll<HTMLElement>(".text-layer")];
      const measurements = layers.map((layer) => {
        const rect = layer.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(layer);
        const lineTops = [
          ...new Set(
            [...range.getClientRects()]
              .filter((line) => line.width > 0 && line.height > 0)
              .map((line) => Math.round(line.top * 100) / 100),
          ),
        ];
        const style = getComputedStyle(layer);
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
          line_count: lineTops.length,
          font_size: Number.parseFloat(style.fontSize),
          visible:
            style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0,
        };
      });
      const actual = Object.fromEntries(measurements.map((item) => [item.layer_id, item.text]));
      return {
        measurements,
        copyFidelity:
          actual.PRIMARY === expectedCopy.primaryCopy &&
          actual.SUPPORTING === expectedCopy.supportingCopy,
        safeAreaValid: measurements.every(
          (item) =>
            item.x >= safe.left &&
            item.y >= safe.top &&
            item.x + item.width <= width - safe.right &&
            item.y + item.height <= height - safe.bottom,
        ),
        overflowDetected: measurements.some(
          (item) =>
            item.scroll_width > item.client_width + 3 ||
            item.scroll_height > item.client_height + 3,
        ),
        clippingDetected: measurements.some(
          (item) => !item.visible || item.width <= 0 || item.height <= 0,
        ),
        unexpectedScroll:
          document.documentElement.scrollWidth !== width ||
          document.documentElement.scrollHeight !== height ||
          document.body.scrollWidth !== width ||
          document.body.scrollHeight !== height,
        dom: document.querySelector("#canvas")?.outerHTML ?? "",
      };
    },
    { expectedCopy: expected, safe: SAFE, width: WIDTH, height: HEIGHT },
  );
}

async function resolveFonts(page: Page) {
  const session = await page.context().newCDPSession(page);
  try {
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const document = await session.send("DOM.getDocument", { depth: 1 });
    const resolved: Array<{ role: string; family: string }> = [];
    for (const role of ["PRIMARY", "SUPPORTING"] as const) {
      const node = await session.send("DOM.querySelector", {
        nodeId: document.root.nodeId,
        selector: `[data-role="${role}"]`,
      });
      if (!node.nodeId) throw new Error(`FORMAL_CALIBRATION_FONT_NODE_MISSING:${role}`);
      const platform = await session.send("CSS.getPlatformFontsForNode", { nodeId: node.nodeId });
      const family = [...platform.fonts]
        .sort((left, right) => right.glyphCount - left.glyphCount)
        .find((font) => font.glyphCount > 0)?.familyName;
      if (!family) throw new Error(`FORMAL_CALIBRATION_FONT_UNAVAILABLE:${role}`);
      resolved.push({ role, family });
    }
    return resolved;
  } finally {
    await session.detach();
  }
}

function inspectPng(bytes: Buffer, expectedWidth: number, expectedHeight: number) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature))
    throw new Error("FORMAL_CALIBRATION_PNG_INVALID");
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== expectedWidth || height !== expectedHeight)
    throw new Error(`FORMAL_CALIBRATION_DIMENSION_INVALID:${width}x${height}`);
  return { width, height };
}

async function downscalePng(page: Page, png: Buffer, width: number, height: number) {
  await page.setViewportSize({ width, height });
  const encoded = png.toString("base64");
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#fff}img{display:block;width:${width}px;height:${height}px}</style></head><body><img src="data:image/png;base64,${encoded}"></body></html>`,
    { waitUntil: "load" },
  );
  const result = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
  inspectPng(result, width, height);
  return result;
}

export async function renderFormalCalibrationCover(
  request: FormalCalibrationCoverRequest,
): Promise<FormalCalibrationCoverResult> {
  const backgroundBytes = await readFile(request.backgroundPath);
  if (backgroundBytes.length < 24) throw new Error("FORMAL_CALIBRATION_BACKGROUND_INVALID");
  const html = compileFormalCalibrationCoverHtml({
    backgroundBytes,
    primaryCopy: request.primaryCopy,
    supportingCopy: request.supportingCopy,
  });
  await mkdir(request.outputDirectory, { recursive: true, mode: 0o700 });
  const htmlPath = path.join(request.outputDirectory, "formal-calibration-cover-fpv1.html");
  const outputPath = path.join(request.outputDirectory, "formal-calibration-cover-fpv1.png");
  const replayPath = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv1-deterministic-replay.png",
  );
  const thumbnail310Path = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv1-310x414.png",
  );
  const thumbnail186Path = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv1-186x248.png",
  );
  await writeOnceOrReuse(htmlPath, html);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    let attempts = 0;
    let blocked = 0;
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url === "about:blank" || url.startsWith("data:")) return route.continue();
      attempts += 1;
      blocked += 1;
      return route.abort("blockedbyclient");
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const inspection = await inspect(page, {
      primaryCopy: request.primaryCopy,
      supportingCopy: request.supportingCopy,
    });
    const fonts = await resolveFonts(page);
    const capture = await captureDeterministicReplay({
      browser,
      html,
      selectors: ["#canvas", ".text-layer"],
      seedInput: {
        contentVersion: sha256(request.primaryCopy),
        copyVersion: sha256(request.supportingCopy),
        visualVersion: "FORMAL_CALIBRATION_COVER_V1",
        pageNumber: 1,
        assetIds: [sha256(backgroundBytes)],
      },
      browserVersion: browser.version(),
    });
    const first = capture.first_png;
    const second = capture.replay_png;
    const dimensions = inspectPng(first, WIDTH, HEIGHT);
    inspectPng(second, WIDTH, HEIGHT);
    const thumbnail310 = await downscalePng(page, first, 310, 414);
    const thumbnail186 = await downscalePng(page, first, 186, 248);
    await writeOnceOrReuse(outputPath, first);
    await writeOnceOrReuse(replayPath, second);
    await writeOnceOrReuse(thumbnail310Path, thumbnail310);
    await writeOnceOrReuse(thumbnail186Path, thumbnail186);
    const firstChecksum = sha256(first);
    const secondChecksum = sha256(second);
    if (firstChecksum !== secondChecksum)
      throw new Error("FORMAL_CALIBRATION_DETERMINISTIC_REPLAY_MISMATCH");
    if (
      !inspection.copyFidelity ||
      !inspection.safeAreaValid ||
      inspection.overflowDetected ||
      inspection.clippingDetected ||
      inspection.unexpectedScroll
    )
      throw new Error(
        `FORMAL_CALIBRATION_MECHANICAL_QA_FAILED:${JSON.stringify({
          copyFidelity: inspection.copyFidelity,
          safeAreaValid: inspection.safeAreaValid,
          overflowDetected: inspection.overflowDetected,
          clippingDetected: inspection.clippingDetected,
          unexpectedScroll: inspection.unexpectedScroll,
          measurements: inspection.measurements,
        })}`,
      );
    return {
      outputPath,
      replayPath,
      htmlPath,
      thumbnail310Path,
      thumbnail186Path,
      checksum: firstChecksum,
      secondPassChecksum: secondChecksum,
      thumbnail310Checksum: sha256(thumbnail310),
      thumbnail186Checksum: sha256(thumbnail186),
      deterministic: true,
      ...dimensions,
      byteLength: (await stat(outputPath)).size,
      copyFidelity: inspection.copyFidelity,
      safeAreaValid: inspection.safeAreaValid,
      overflowDetected: inspection.overflowDetected,
      clippingDetected: inspection.clippingDetected,
      unexpectedScroll: inspection.unexpectedScroll,
      networkRequestsAttempted: attempts,
      networkRequestsBlocked: blocked,
      chromiumVersion: browser.version(),
      resolvedFonts: fonts,
      measurements: inspection.measurements.map((item) => ({
        layer_id: item.layer_id,
        text: item.text,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        line_count: item.line_count,
        font_size: item.font_size,
      })),
      htmlHash: sha256(html),
      domHash: sha256(inspection.dom),
    };
  } finally {
    await browser.close();
  }
}

export async function renderContrastRevisedFormalCalibrationCover(
  request: FormalCalibrationCoverRequest,
): Promise<ContrastRevisedFormalCalibrationCoverResult> {
  const backgroundBytes = await readFile(request.backgroundPath);
  if (backgroundBytes.length < 24) throw new Error("FORMAL_CALIBRATION_BACKGROUND_INVALID");
  const html = compileContrastRevisedFormalCalibrationCoverHtml({
    backgroundBytes,
    primaryCopy: request.primaryCopy,
    supportingCopy: request.supportingCopy,
  });
  await mkdir(request.outputDirectory, { recursive: true, mode: 0o700 });
  const htmlPath = path.join(request.outputDirectory, "formal-calibration-cover-fpv2.html");
  const outputPath = path.join(request.outputDirectory, "formal-calibration-cover-fpv2.png");
  const replayPath = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv2-deterministic-replay.png",
  );
  const thumbnail310Path = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv2-310x414.png",
  );
  const thumbnail186Path = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv2-186x248.png",
  );
  const backgroundAnalysisPath = path.join(
    request.outputDirectory,
    "formal-calibration-cover-fpv2-background-analysis.png",
  );
  await writeOnceOrReuse(htmlPath, html);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
    let attempts = 0;
    let blocked = 0;
    await page.route("**/*", async (route) => {
      const url = route.request().url();
      if (url === "about:blank" || url.startsWith("data:")) return route.continue();
      attempts += 1;
      blocked += 1;
      return route.abort("blockedbyclient");
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const inspection = await inspect(page, {
      primaryCopy: request.primaryCopy,
      supportingCopy: request.supportingCopy,
    });
    const fonts = await resolveFonts(page);
    await page.evaluate(() => {
      document
        .querySelectorAll<HTMLElement>(".text-layer,.calibration-rule,.calibration-index")
        .forEach((element) => (element.style.visibility = "hidden"));
    });
    const backgroundAnalysis = await page.screenshot({
      type: "png",
      animations: "disabled",
      caret: "hide",
    });
    await page.evaluate(() => {
      document
        .querySelectorAll<HTMLElement>(".text-layer,.calibration-rule,.calibration-index")
        .forEach((element) => (element.style.visibility = "visible"));
    });
    const rasterContrast = await analyzeRasterTextBackgroundContrast(
      page,
      backgroundAnalysis,
      inspection.measurements.map((item) => ({
        text_layer_id: item.layer_id === "PRIMARY" ? "PRIMARY_HOOK" : "SECONDARY_SIGNAL",
        role: item.layer_id === "PRIMARY" ? "PRIMARY_HOOK" : "SECONDARY_SIGNAL",
        foreground_color: item.layer_id === "PRIMARY" ? "#101010" : "#111111",
        foreground_opacity: 1,
        text_bbox: { x: item.x, y: item.y, width: item.width, height: item.height },
        resolved_font: fonts.find((font) => font.role === item.layer_id)?.family ?? "UNKNOWN",
        resolved_weight: item.layer_id === "PRIMARY" ? 700 : 400,
      })),
    );
    const capture = await captureDeterministicReplay({
      browser,
      html,
      selectors: ["#canvas", ".text-layer"],
      seedInput: {
        contentVersion: sha256(request.primaryCopy),
        copyVersion: sha256(request.supportingCopy),
        visualVersion: "FORMAL_CALIBRATION_COVER_CONTRAST_REVISED_V1",
        pageNumber: 1,
        assetIds: [sha256(backgroundBytes)],
      },
      browserVersion: browser.version(),
    });
    const first = capture.first_png;
    const second = capture.replay_png;
    const dimensions = inspectPng(first, WIDTH, HEIGHT);
    inspectPng(second, WIDTH, HEIGHT);
    const thumbnail310 = await downscalePng(page, first, 310, 414);
    const thumbnail186 = await downscalePng(page, first, 186, 248);
    await writeOnceOrReuse(outputPath, first);
    await writeOnceOrReuse(replayPath, second);
    await writeOnceOrReuse(thumbnail310Path, thumbnail310);
    await writeOnceOrReuse(thumbnail186Path, thumbnail186);
    await writeOnceOrReuse(backgroundAnalysisPath, backgroundAnalysis);
    const firstChecksum = sha256(first);
    const secondChecksum = sha256(second);
    if (firstChecksum !== secondChecksum)
      throw new Error("FORMAL_CALIBRATION_DETERMINISTIC_REPLAY_MISMATCH");
    if (
      !inspection.copyFidelity ||
      !inspection.safeAreaValid ||
      inspection.overflowDetected ||
      inspection.clippingDetected ||
      inspection.unexpectedScroll
    )
      throw new Error(
        `FORMAL_CALIBRATION_MECHANICAL_QA_FAILED:${JSON.stringify({
          copyFidelity: inspection.copyFidelity,
          safeAreaValid: inspection.safeAreaValid,
          overflowDetected: inspection.overflowDetected,
          clippingDetected: inspection.clippingDetected,
          unexpectedScroll: inspection.unexpectedScroll,
          measurements: inspection.measurements,
        })}`,
      );
    return {
      outputPath,
      replayPath,
      htmlPath,
      thumbnail310Path,
      thumbnail186Path,
      backgroundAnalysisPath,
      rasterContrast,
      checksum: firstChecksum,
      secondPassChecksum: secondChecksum,
      thumbnail310Checksum: sha256(thumbnail310),
      thumbnail186Checksum: sha256(thumbnail186),
      deterministic: true,
      ...dimensions,
      byteLength: (await stat(outputPath)).size,
      copyFidelity: inspection.copyFidelity,
      safeAreaValid: inspection.safeAreaValid,
      overflowDetected: inspection.overflowDetected,
      clippingDetected: inspection.clippingDetected,
      unexpectedScroll: inspection.unexpectedScroll,
      networkRequestsAttempted: attempts,
      networkRequestsBlocked: blocked,
      chromiumVersion: browser.version(),
      resolvedFonts: fonts,
      measurements: inspection.measurements.map((item) => ({
        layer_id: item.layer_id,
        text: item.text,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        line_count: item.line_count,
        font_size: item.font_size,
      })),
      htmlHash: sha256(html),
      domHash: sha256(inspection.dom),
    };
  } finally {
    await browser.close();
  }
}
