import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright-core";
import { captureDeterministicReplay } from "./production-reliability.js";

const WIDTH = 1242;
const HEIGHT = 1660;
const SAFE = { top: 96, right: 84, bottom: 96, left: 84 } as const;

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
    if (!existing.equals(proposed)) throw new Error("FORMAL_FIRST_PAGE_VERSION_CONFLICT");
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, proposed, { mode: 0o600 });
  await rename(temporary, file);
}

export interface SelectedDirectionFirstPageRequest {
  backgroundPath: string;
  outputDirectory: string;
  headline: string;
  body: string;
}

export interface SelectedDirectionFirstPageResult {
  outputPath: string;
  replayPath: string;
  htmlPath: string;
  checksum: string;
  secondPassChecksum: string;
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
  }>;
  htmlHash: string;
  domHash: string;
}

export function compileSelectedDirectionFirstPageHtml(input: {
  backgroundBytes: Buffer;
  headline: string;
  body: string;
}): string {
  if (input.headline !== "先别急着相信“专业”") throw new Error("FORMAL_COPY_TITLE_DRIFT");
  if (input.body !== "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。")
    throw new Error("FORMAL_COPY_BODY_DRIFT");
  const encoded = input.backgroundBytes.toString("base64");
  const title = `${escapeHtml("先别急着相信")}<span class="no-break">${escapeHtml("“专业”")}</span>`;
  const body = ["真正值得判断的，不是包装有多满，", "而是身份、资质和服务边界", "能不能被核验。"]
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'none'; font-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'"><meta name="viewport" content="width=${WIDTH},height=${HEIGHT},initial-scale=1"><style>
*{box-sizing:border-box}html,body{width:${WIDTH}px;height:${HEIGHT}px;margin:0;overflow:hidden}body{font-family:"PingFang SC","Hiragino Sans GB","Noto Sans CJK SC",sans-serif;-webkit-font-smoothing:antialiased}.canvas{position:relative;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#f1e9dc}.background{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.veil{position:absolute;left:0;top:0;width:63%;height:100%;background:linear-gradient(90deg,rgba(247,241,232,.94) 0%,rgba(247,241,232,.83) 70%,rgba(247,241,232,0) 100%)}.copy{position:absolute;left:84px;top:150px;width:650px;color:#18232d}.title{width:650px;padding-bottom:12px;font-size:94px;line-height:1.17;letter-spacing:-.055em;font-weight:700}.no-break{white-space:nowrap}.rule{width:78px;height:4px;margin-top:54px;background:#a9804a}.body{margin-top:38px;width:610px;font-size:32px;line-height:1.62;letter-spacing:.005em;font-weight:450;color:#35414a}.body span{display:block;white-space:nowrap}.boundary-marks{position:absolute;left:84px;bottom:104px;display:flex;gap:12px}.boundary-marks i{display:block;width:32px;height:3px;background:#a9804a;opacity:.82}.boundary-marks i:nth-child(2){width:52px;opacity:.58}.boundary-marks i:nth-child(3){width:72px;opacity:.36}
</style></head><body><main class="canvas" id="canvas"><img class="background" alt="" src="data:image/png;base64,${encoded}"><div class="veil"></div><section class="copy"><div class="title text-layer" data-role="TITLE">${title}</div><div class="rule"></div><div class="body text-layer" data-role="BODY">${body}</div></section><div class="boundary-marks" aria-hidden="true"><i></i><i></i><i></i></div></main></body></html>`;
}

async function inspect(page: Page, expected: { headline: string; body: string }) {
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
          visible:
            style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0,
        };
      });
      const actual = Object.fromEntries(measurements.map((item) => [item.layer_id, item.text]));
      return {
        measurements,
        copyFidelity: actual.TITLE === expectedCopy.headline && actual.BODY === expectedCopy.body,
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
    for (const role of ["TITLE", "BODY"] as const) {
      const node = await session.send("DOM.querySelector", {
        nodeId: document.root.nodeId,
        selector: `[data-role="${role}"]`,
      });
      if (!node.nodeId) throw new Error(`FORMAL_FONT_NODE_MISSING:${role}`);
      const platform = await session.send("CSS.getPlatformFontsForNode", { nodeId: node.nodeId });
      const family = [...platform.fonts]
        .sort((left, right) => right.glyphCount - left.glyphCount)
        .find((font) => font.glyphCount > 0)?.familyName;
      if (!family) throw new Error(`FORMAL_FONT_UNAVAILABLE:${role}`);
      resolved.push({ role, family });
    }
    return resolved;
  } finally {
    await session.detach();
  }
}

function inspectPng(bytes: Buffer, requireFormalCanvas = true) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(signature))
    throw new Error("FORMAL_FIRST_PAGE_PNG_INVALID");
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (requireFormalCanvas && (width !== WIDTH || height !== HEIGHT))
    throw new Error("FORMAL_FIRST_PAGE_DIMENSION_INVALID");
  if (!requireFormalCanvas && Math.abs(width / height - 3 / 4) > 0.003)
    throw new Error("FORMAL_BACKGROUND_ASPECT_RATIO_INVALID");
  return { width, height };
}

export async function renderSelectedDirectionFirstPage(
  request: SelectedDirectionFirstPageRequest,
): Promise<SelectedDirectionFirstPageResult> {
  const backgroundBytes = await readFile(request.backgroundPath);
  inspectPng(backgroundBytes, false);
  const html = compileSelectedDirectionFirstPageHtml({
    backgroundBytes,
    headline: request.headline,
    body: request.body,
  });
  await mkdir(request.outputDirectory, { recursive: true, mode: 0o700 });
  const htmlPath = path.join(request.outputDirectory, "01-cover_fpv2.html");
  const outputPath = path.join(request.outputDirectory, "01-cover_fpv2.png");
  const replayPath = path.join(request.outputDirectory, "01-cover_fpv2-deterministic-replay.png");
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
    const inspection = await inspect(page, { headline: request.headline, body: request.body });
    const fonts = await resolveFonts(page);
    const capture = await captureDeterministicReplay({
      browser,
      html,
      selectors: ["#canvas", ".text-layer"],
      seedInput: {
        contentVersion: sha256(request.headline),
        copyVersion: sha256(request.body),
        visualVersion: "SELECTED_DIRECTION_FIRST_PAGE_V1",
        pageNumber: 1,
        assetIds: [sha256(backgroundBytes)],
      },
      browserVersion: browser.version(),
    });
    const first = capture.first_png;
    const second = capture.replay_png;
    const dimensions = inspectPng(first);
    inspectPng(second);
    await writeOnceOrReuse(outputPath, first);
    await writeOnceOrReuse(replayPath, second);
    const firstChecksum = sha256(first);
    const secondChecksum = sha256(second);
    if (firstChecksum !== secondChecksum) throw new Error("FORMAL_FIRST_PAGE_REPLAY_MISMATCH");
    if (
      !inspection.copyFidelity ||
      !inspection.safeAreaValid ||
      inspection.overflowDetected ||
      inspection.clippingDetected ||
      inspection.unexpectedScroll
    )
      throw new Error(
        `FORMAL_FIRST_PAGE_MECHANICAL_QA_FAILED:${JSON.stringify({
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
      checksum: firstChecksum,
      secondPassChecksum: secondChecksum,
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
      })),
      htmlHash: sha256(html),
      domHash: sha256(inspection.dom),
    };
  } finally {
    await browser.close();
  }
}
