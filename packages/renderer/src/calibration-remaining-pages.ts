import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright-core";
import {
  analyzeRasterTextBackgroundContrast,
  type RasterContrastMeasurement,
} from "./raster-text-contrast.js";
import {
  captureDeterministicReplay,
  createDeterministicRenderContext,
  stabilizeRenderPage,
} from "./production-reliability.js";

const WIDTH = 1242;
const HEIGHT = 1660;
const SAFE = 56;
const FONT_STACK = '"Songti SC","STSong","Noto Serif CJK SC",serif';

const sha256 = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function lines(value: string): string {
  return value
    .split("\n")
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
}

async function writeOnceOrReuse(file: string, value: string | Buffer): Promise<void> {
  const proposed = typeof value === "string" ? Buffer.from(value) : value;
  try {
    const existing = await readFile(file);
    if (!existing.equals(proposed)) throw new Error("CALIBRATION_REMAINING_PAGE_VERSION_CONFLICT");
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, proposed, { mode: 0o600 });
  await rename(temporary, file);
}

export type CalibrationRemainingPageSpec = {
  pageNumber: 2 | 3 | 4 | 5 | 6;
  pageRole: "PROBLEM" | "ANALYSIS" | "SUMMARY";
  pageIntent: "CONTENT_EDITORIAL" | "DIAGNOSTIC_PAGE" | "SUMMARY_PAGE";
  compositionFamily:
    | "EDITORIAL_SPLIT"
    | "DIAGNOSTIC_COMPOSITION"
    | "EVIDENCE_DOMINANT"
    | "IMAGE_DOMINANT"
    | "MULTI_EVIDENCE_EDITORIAL";
  section: string;
  primary: string;
  supporting: string;
  core: string[];
};

export type CalibrationRemainingPageRenderResult = {
  pageNumber: number;
  outputPath: string;
  replayPath: string;
  htmlPath: string;
  backgroundAnalysisPath: string;
  thumbnail310Path: string;
  thumbnail186Path: string;
  checksum: string;
  replayChecksum: string;
  thumbnail310Checksum: string;
  thumbnail186Checksum: string;
  backgroundAnalysisChecksum: string;
  deterministic: boolean;
  copyFidelity: boolean;
  safeAreaValid: boolean;
  overflowDetected: boolean;
  clippingDetected: boolean;
  unexpectedScroll: boolean;
  fontAvailable: boolean;
  width: number;
  height: number;
  byteLength: number;
  networkRequestsAttempted: number;
  networkRequestsBlocked: number;
  chromiumVersion: string;
  rasterContrast: RasterContrastMeasurement[];
  measurements: Array<{
    role: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    color: string;
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
  }>;
};

function textLayer(role: string, className: string, value: string): string {
  if (!value) return "";
  return `<div class="${className} text-layer" data-role="${role}">${lines(value)}</div>`;
}

function commonHead(): string {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"><meta name="viewport" content="width=${WIDTH},height=${HEIGHT},initial-scale=1"><style>
*{box-sizing:border-box}html,body{width:${WIDTH}px;height:${HEIGHT}px;margin:0;overflow:hidden}body{font-family:${FONT_STACK};-webkit-font-smoothing:antialiased}.canvas{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}.source{position:absolute;display:block}.text-layer span{display:block}.text-layer{position:absolute;font-family:${FONT_STACK};z-index:10;padding-bottom:8px}.accent{position:absolute;background:#9b6a3a;z-index:8}.hairline{position:absolute;background:rgba(28,30,29,.3);z-index:8}
</style></head><body><main id="canvas" class="canvas">`;
}

function compilePage2(encoded: string, spec: CalibrationRemainingPageSpec): string {
  return `${commonHead()}<style>
.canvas{background:#e8e2d7}.photo{left:0;top:0;width:645px;height:1660px;object-fit:cover;object-position:66% 50%;filter:saturate(.76) contrast(.98)}.paper{position:absolute;right:0;top:0;width:650px;height:1660px;background:#e8e2d7;clip-path:polygon(8% 0,100% 0,100% 100%,0 100%)}.section{left:710px;top:112px;width:420px;color:#865b33;font:400 38px/1.3 ${FONT_STACK};letter-spacing:.08em}.primary{left:650px;top:300px;width:522px;color:#161817;font:700 68px/1.22 ${FONT_STACK};letter-spacing:-.08em}.supporting{left:700px;top:760px;width:464px;color:#2e302f;font:400 44px/1.62 ${FONT_STACK};letter-spacing:-.02em}.accent{left:650px;top:214px;width:92px;height:7px}.hairline{left:650px;top:1520px;width:522px;height:2px}
</style><img class="source photo" alt="" src="data:image/png;base64,${encoded}"><div class="paper"></div><div class="accent"></div><div class="hairline"></div>${textLayer("SECTION", "section", spec.section)}${textLayer("PRIMARY", "primary", spec.primary)}${textLayer("SUPPORTING", "supporting", spec.supporting)}</main></body></html>`;
}

function compilePage3(encoded: string, spec: CalibrationRemainingPageSpec): string {
  return `${commonHead()}<style>
.canvas{background:#192124}.photo{left:430px;top:0;width:812px;height:1660px;object-fit:cover;object-position:60% 34%;filter:saturate(.66) brightness(.78) contrast(1.06)}.field{position:absolute;left:0;top:0;width:520px;height:1660px;background:#192124}.focus{position:absolute;left:528px;top:206px;width:608px;height:424px;border:6px solid rgba(180,127,73,.92);z-index:7}.connector{position:absolute;left:360px;top:414px;width:206px;height:4px;background:#b47f49;z-index:8}.section{left:68px;top:106px;width:360px;color:#d4a66f;font:400 42px/1.3 ${FONT_STACK};letter-spacing:.08em}.primary{left:68px;top:276px;width:384px;color:#f0eadf;font:700 78px/1.22 ${FONT_STACK};letter-spacing:-.045em}.supporting{left:68px;top:920px;width:388px;color:#d6d2c9;font:400 44px/1.62 ${FONT_STACK};letter-spacing:-.01em}
</style><img class="source photo" alt="" src="data:image/png;base64,${encoded}"><div class="field"></div><div class="focus"></div><div class="connector"></div>${textLayer("SECTION", "section", spec.section)}${textLayer("PRIMARY", "primary", spec.primary)}${textLayer("SUPPORTING", "supporting", spec.supporting)}</main></body></html>`;
}

function compilePage4(encoded: string, spec: CalibrationRemainingPageSpec): string {
  return `${commonHead()}<style>
.canvas{background:#e5ded2}.crop-a{left:0;top:0;width:690px;height:830px;object-fit:cover;object-position:28% 54%;filter:saturate(.72)}.crop-b{left:690px;top:0;width:552px;height:510px;object-fit:cover;object-position:76% 48%;filter:saturate(.65) contrast(1.05)}.crop-c{left:690px;top:510px;width:552px;height:320px;object-fit:cover;object-position:52% 82%;filter:saturate(.58) brightness(.88)}.copyfield{position:absolute;left:0;top:830px;width:1242px;height:830px;background:#e5ded2}.section{left:74px;top:892px;width:330px;color:#80562f;font:400 40px/1.3 ${FONT_STACK};letter-spacing:.08em}.primary{left:72px;top:1030px;width:566px;color:#171918;font:700 78px/1.2 ${FONT_STACK};letter-spacing:-.045em}.supporting{left:704px;top:1000px;width:456px;color:#303230;font:400 48px/1.58 ${FONT_STACK};letter-spacing:-.015em}.accent{left:704px;top:932px;width:132px;height:7px}
</style><img class="source crop-a" alt="" src="data:image/png;base64,${encoded}"><img class="source crop-b" alt="" src="data:image/png;base64,${encoded}"><img class="source crop-c" alt="" src="data:image/png;base64,${encoded}"><div class="copyfield"></div><div class="accent"></div>${textLayer("SECTION", "section", spec.section)}${textLayer("PRIMARY", "primary", spec.primary)}${textLayer("SUPPORTING", "supporting", spec.supporting)}</main></body></html>`;
}

function compilePage5(encoded: string, spec: CalibrationRemainingPageSpec): string {
  return `${commonHead()}<style>
.canvas{background:#181b1b}.photo{left:0;top:0;width:1242px;height:1660px;object-fit:cover;object-position:69% 60%;filter:saturate(.72) brightness(.68) contrast(1.08)}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,15,15,.90) 0%,rgba(12,15,15,.34) 24%,rgba(12,15,15,.08) 42%,rgba(12,15,15,.72) 72%,rgba(12,15,15,.94) 100%)}.entrance{position:absolute;left:648px;top:618px;width:374px;height:666px;border:5px solid rgba(199,151,95,.9);z-index:7}.section{left:72px;top:82px;width:350px;color:#d3a067;font:400 40px/1.3 ${FONT_STACK};letter-spacing:.08em}.primary{left:72px;top:1010px;width:790px;color:#f4eee5;font:700 76px/1.18 ${FONT_STACK};letter-spacing:-.045em}.supporting{left:72px;top:1320px;width:1040px;color:#e0d9cf;font:400 43px/1.5 ${FONT_STACK};letter-spacing:-.012em}
</style><img class="source photo" alt="" src="data:image/png;base64,${encoded}"><div class="shade"></div><div class="entrance"></div>${textLayer("SECTION", "section", spec.section)}${textLayer("PRIMARY", "primary", spec.primary)}${textLayer("SUPPORTING", "supporting", spec.supporting)}</main></body></html>`;
}

function compilePage6(encoded: string, spec: CalibrationRemainingPageSpec): string {
  const core = spec.core.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  return `${commonHead()}<style>
.canvas{background:#171918}.crop-a{left:0;top:0;width:414px;height:700px;object-fit:cover;object-position:18% 42%;filter:saturate(.65)}.crop-b{left:414px;top:0;width:414px;height:700px;object-fit:cover;object-position:57% 48%;filter:saturate(.65)}.crop-c{left:828px;top:0;width:414px;height:700px;object-fit:cover;object-position:85% 62%;filter:saturate(.65)}.copyfield{position:absolute;left:0;top:700px;width:1242px;height:960px;background:#171918}.primary{left:72px;top:770px;width:820px;color:#f1eadf;font:700 82px/1.18 ${FONT_STACK};letter-spacing:-.045em}.core{left:72px;top:1000px;width:1098px;color:#f1eadf;font:400 54px/1.5 ${FONT_STACK};display:flex;gap:42px}.core span{display:flex;align-items:baseline;white-space:nowrap}.supporting{left:72px;top:1298px;width:1050px;color:#cbc6bd;font:400 43px/1.52 ${FONT_STACK};letter-spacing:-.012em}.accent{left:72px;top:944px;width:1098px;height:3px;background:#8b6039}
</style><img class="source crop-a" alt="" src="data:image/png;base64,${encoded}"><img class="source crop-b" alt="" src="data:image/png;base64,${encoded}"><img class="source crop-c" alt="" src="data:image/png;base64,${encoded}"><div class="copyfield"></div><div class="accent"></div>${textLayer("PRIMARY", "primary", spec.primary)}<div class="core text-layer" data-role="CORE">${core}</div>${textLayer("SUPPORTING", "supporting", spec.supporting)}</main></body></html>`;
}

export function compileCalibrationRemainingPageHtml(
  spec: CalibrationRemainingPageSpec,
  sourceBytes: Buffer,
): string {
  const encoded = sourceBytes.toString("base64");
  switch (spec.pageNumber) {
    case 2:
      return compilePage2(encoded, spec);
    case 3:
      return compilePage3(encoded, spec);
    case 4:
      return compilePage4(encoded, spec);
    case 5:
      return compilePage5(encoded, spec);
    case 6:
      return compilePage6(encoded, spec);
  }
}

function inspectPng(bytes: Buffer, width: number, height: number): void {
  const signature = "89504e470d0a1a0a";
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== signature ||
    bytes.readUInt32BE(16) !== width ||
    bytes.readUInt32BE(20) !== height
  )
    throw new Error("CALIBRATION_REMAINING_PAGE_PNG_INVALID");
}

function inspectSourcePng(bytes: Buffer): void {
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    bytes.subarray(12, 16).toString("ascii") !== "IHDR" ||
    bytes.readUInt32BE(16) < 1 ||
    bytes.readUInt32BE(20) < 1
  )
    throw new Error("CALIBRATION_REMAINING_PAGE_SOURCE_PNG_INVALID");
}

function normalizeComputedColor(value: string): string {
  const channels = value
    .match(/\d+(?:\.\d+)?/gu)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) throw new Error(`RENDERER_COLOR_INVALID:${value}`);
  return channels
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
}

function mapContrastRole(role: string): "PRIMARY_HOOK" | "SECONDARY_SIGNAL" | "BODY" | "LABEL" {
  if (role === "PRIMARY") return "PRIMARY_HOOK";
  if (role === "SUPPORTING") return "SECONDARY_SIGNAL";
  if (role === "SECTION") return "LABEL";
  return "BODY";
}

async function inspectPage(page: Page, spec: CalibrationRemainingPageSpec) {
  // tsx can annotate nested functions passed into Playwright with this helper.
  await page.evaluate("globalThis.__name = globalThis.__name || ((target) => target)");
  return page.evaluate(
    ({ expected, safe, width, height }) => {
      const normalize = (value: string) => value.replace(/\s+/gu, "");
      const expectedText = [
        expected.section,
        expected.primary,
        ...expected.core,
        expected.supporting,
      ]
        .join("")
        .replace(/\s+/gu, "");
      const layers = [...document.querySelectorAll<HTMLElement>(".text-layer")];
      const measurements = layers.map((layer) => {
        const rect = layer.getBoundingClientRect();
        const style = getComputedStyle(layer);
        return {
          role: layer.dataset.role ?? "UNKNOWN",
          text: layer.textContent ?? "",
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          scrollWidth: layer.scrollWidth,
          scrollHeight: layer.scrollHeight,
          clientWidth: layer.clientWidth,
          clientHeight: layer.clientHeight,
          fontSize: Number.parseFloat(style.fontSize),
          color: style.color,
          visible:
            style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0,
        };
      });
      const actualText = normalize(measurements.map((item) => item.text).join(""));
      return {
        measurements,
        copyFidelity: actualText === expectedText,
        safeAreaValid: measurements.every(
          (item) =>
            item.x >= safe &&
            item.y >= safe &&
            item.x + item.width <= width - safe &&
            item.y + item.height <= height - safe,
        ),
        overflowDetected: measurements.some(
          (item) =>
            item.scrollWidth > item.clientWidth + 3 || item.scrollHeight > item.clientHeight + 3,
        ),
        clippingDetected: measurements.some(
          (item) => !item.visible || item.width <= 0 || item.height <= 0,
        ),
        unexpectedScroll:
          document.documentElement.scrollWidth !== width ||
          document.documentElement.scrollHeight !== height ||
          document.body.scrollWidth !== width ||
          document.body.scrollHeight !== height,
        fontAvailable: document.fonts.check('16px "Songti SC"'),
      };
    },
    { expected: spec, safe: SAFE, width: WIDTH, height: HEIGHT },
  );
}

async function downscale(
  page: Page,
  bytes: Buffer,
  width: number,
  height: number,
): Promise<Buffer> {
  await page.setViewportSize({ width, height });
  await page.setContent(
    `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:${width}px;height:${height}px}</style></head><body><img src="data:image/png;base64,${bytes.toString("base64")}"></body></html>`,
    { waitUntil: "load" },
  );
  const output = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
  inspectPng(output, width, height);
  return output;
}

export async function renderCalibrationRemainingPage(input: {
  sourcePath: string;
  outputDirectory: string;
  spec: CalibrationRemainingPageSpec;
}): Promise<CalibrationRemainingPageRenderResult> {
  const sourceBytes = await readFile(input.sourcePath);
  inspectSourcePng(sourceBytes);
  const html = compileCalibrationRemainingPageHtml(input.spec, sourceBytes);
  await mkdir(input.outputDirectory, { recursive: true, mode: 0o700 });
  const stem = `page-${String(input.spec.pageNumber).padStart(2, "0")}`;
  const htmlPath = path.join(input.outputDirectory, `${stem}.html`);
  const outputPath = path.join(input.outputDirectory, `${stem}.png`);
  const replayPath = path.join(input.outputDirectory, `${stem}-deterministic-replay.png`);
  const backgroundAnalysisPath = path.join(
    input.outputDirectory,
    `${stem}-background-analysis.png`,
  );
  const thumbnail310Path = path.join(input.outputDirectory, `${stem}-310x414.png`);
  const thumbnail186Path = path.join(input.outputDirectory, `${stem}-186x248.png`);
  await writeOnceOrReuse(htmlPath, html);
  const browser = await chromium.launch({ headless: true });
  try {
    const stabilitySelectors = [
      "#canvas",
      ".source",
      ...(input.spec.section ? ['[data-role="SECTION"]'] : []),
      ...(input.spec.primary ? ['[data-role="PRIMARY"]'] : []),
      ...(input.spec.supporting ? ['[data-role="SUPPORTING"]'] : []),
      ...(input.spec.core.length > 0 ? ['[data-role="CORE"]'] : []),
    ];
    const capture = await captureDeterministicReplay({
      browser,
      html,
      selectors: stabilitySelectors,
      seedInput: {
        contentVersion: sha256(JSON.stringify(input.spec)),
        copyVersion: sha256(
          [input.spec.section, input.spec.primary, ...input.spec.core, input.spec.supporting].join(
            "\n",
          ),
        ),
        visualVersion: sha256(html),
        pageNumber: input.spec.pageNumber,
        assetIds: [sha256(sourceBytes)],
      },
      browserVersion: browser.version(),
    });
    const first = capture.first_png;
    const second = capture.replay_png;
    inspectPng(first, WIDTH, HEIGHT);
    inspectPng(second, WIDTH, HEIGHT);
    if (!capture.deterministic) throw new Error("CALIBRATION_REMAINING_PAGE_DETERMINISM_FAILED");

    // Contrast analysis is intentionally isolated from both formal screenshot pages. Hiding
    // text forces Chromium to rebuild compositing layers and must never occur between the
    // formal capture and its deterministic replay.
    const qaContext = await createDeterministicRenderContext(browser);
    const qaPage = await qaContext.newPage();
    await qaPage.setContent(html, { waitUntil: "load" });
    await stabilizeRenderPage(qaPage, stabilitySelectors);
    const inspection = await inspectPage(qaPage, input.spec);
    await qaPage.evaluate(() => {
      document
        .querySelectorAll<HTMLElement>(".text-layer")
        .forEach((element) => (element.style.visibility = "hidden"));
    });
    const background = await qaPage.screenshot({
      type: "png",
      animations: "disabled",
      caret: "hide",
    });
    const rasterContrast = await analyzeRasterTextBackgroundContrast(
      qaPage,
      background,
      inspection.measurements.map((item) => ({
        text_layer_id: item.role,
        role: mapContrastRole(item.role),
        foreground_color: normalizeComputedColor(item.color),
        foreground_opacity: 1,
        text_bbox: { x: item.x, y: item.y, width: item.width, height: item.height },
        resolved_font: "Songti SC",
        resolved_weight: item.role === "PRIMARY" ? 700 : 400,
      })),
    );
    const thumbnail310 = await downscale(qaPage, first, 310, 414);
    const thumbnail186 = await downscale(qaPage, first, 186, 248);
    await qaPage.close();
    await qaContext.close();
    await Promise.all([
      writeOnceOrReuse(outputPath, first),
      writeOnceOrReuse(replayPath, second),
      writeOnceOrReuse(backgroundAnalysisPath, background),
      writeOnceOrReuse(thumbnail310Path, thumbnail310),
      writeOnceOrReuse(thumbnail186Path, thumbnail186),
    ]);
    return {
      pageNumber: input.spec.pageNumber,
      outputPath,
      replayPath,
      htmlPath,
      backgroundAnalysisPath,
      thumbnail310Path,
      thumbnail186Path,
      checksum: sha256(first),
      replayChecksum: sha256(second),
      thumbnail310Checksum: sha256(thumbnail310),
      thumbnail186Checksum: sha256(thumbnail186),
      backgroundAnalysisChecksum: sha256(background),
      deterministic: true,
      copyFidelity: inspection.copyFidelity,
      safeAreaValid: inspection.safeAreaValid,
      overflowDetected: inspection.overflowDetected,
      clippingDetected: inspection.clippingDetected,
      unexpectedScroll: inspection.unexpectedScroll,
      fontAvailable: inspection.fontAvailable,
      width: WIDTH,
      height: HEIGHT,
      byteLength: first.length,
      networkRequestsAttempted: 0,
      networkRequestsBlocked: 0,
      chromiumVersion: browser.version(),
      rasterContrast,
      measurements: inspection.measurements.map((item) => ({
        role: item.role,
        text: item.text,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
        fontSize: item.fontSize,
        color: item.color,
        scrollWidth: item.scrollWidth,
        scrollHeight: item.scrollHeight,
        clientWidth: item.clientWidth,
        clientHeight: item.clientHeight,
      })),
    };
  } finally {
    await browser.close();
  }
}

export async function renderCalibrationContactSheet(input: {
  pagePaths: string[];
  outputPath: string;
  pageWidth: number;
  pageHeight: number;
  columns: number;
  gap: number;
}): Promise<{ outputPath: string; checksum: string; width: number; height: number }> {
  if (input.pagePaths.length !== 6) throw new Error("CALIBRATION_CONTACT_SHEET_PAGE_COUNT_INVALID");
  const rows = Math.ceil(input.pagePaths.length / input.columns);
  const labelHeight = Math.max(28, Math.round(input.pageHeight * 0.08));
  const width = input.columns * input.pageWidth + (input.columns + 1) * input.gap;
  const height = rows * (input.pageHeight + labelHeight) + (rows + 1) * input.gap;
  const images = await Promise.all(input.pagePaths.map((file) => readFile(file)));
  const cells = images
    .map(
      (bytes, index) =>
        `<figure><img src="data:image/png;base64,${bytes.toString("base64")}"><figcaption>P${index + 1}</figcaption></figure>`,
    )
    .join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#d8d3ca}main{display:grid;grid-template-columns:repeat(${input.columns},${input.pageWidth}px);grid-auto-rows:${input.pageHeight + labelHeight}px;gap:${input.gap}px;padding:${input.gap}px}figure{margin:0;width:${input.pageWidth}px;height:${input.pageHeight + labelHeight}px}img{display:block;width:${input.pageWidth}px;height:${input.pageHeight}px}figcaption{height:${labelHeight}px;padding-top:6px;font:600 ${Math.max(16, Math.round(labelHeight * 0.48))}px/1.2 -apple-system,BlinkMacSystemFont,sans-serif;color:#272725;text-align:center;letter-spacing:.08em}</style></head><body><main>${cells}</main></body></html>`;
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(html, { waitUntil: "load" });
    const first = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
    await page.setContent(html, { waitUntil: "load" });
    const second = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
    if (!first.equals(second)) throw new Error("CALIBRATION_CONTACT_SHEET_DETERMINISM_FAILED");
    inspectPng(first, width, height);
    await writeOnceOrReuse(input.outputPath, first);
    return { outputPath: input.outputPath, checksum: sha256(first), width, height };
  } finally {
    await browser.close();
  }
}
