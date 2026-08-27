import { createHash } from "node:crypto";
import type { Browser, BrowserContext, Page } from "playwright-core";

export const DETERMINISTIC_RENDER_CONTEXT_V1 = {
  version: "DETERMINISTIC_RENDER_CONTEXT_V1",
  viewport: { width: 1242, height: 1660 },
  deviceScaleFactor: 1,
  locale: "zh-CN",
  timezoneId: "Asia/Shanghai",
  colorScheme: "light",
  reducedMotion: "reduce",
  serviceWorkers: "block",
  acceptDownloads: false,
  stableGeometrySamples: 3,
  maximumGeometrySamples: 12,
} as const;

export const FORMAL_ASSET_REQUIRED_GATES = [
  "MECHANICAL",
  "COPY_FIDELITY",
  "TEXT_LAYOUT",
  "TYPOGRAPHY_SPATIAL_INTEGRITY",
  "TYPOGRAPHY_BREATHING_ROOM",
  "RASTER_CONTRAST",
  "BACKGROUND_COMPLEXITY",
  "DETERMINISM",
  "SEMANTIC_RELEVANCE",
  "PAGE_DUTY_FIT",
  "IMAGE_TEXT_INTEGRATION",
  "IMAGE_QUALITY",
  "ACTUAL_PIXEL_INSPECTION",
] as const;

export type FormalAssetGate = (typeof FORMAL_ASSET_REQUIRED_GATES)[number];
export type GateStatus = "PASS" | "FAIL" | "NOT_RUN";
type RecoveryCategory = "TEXT_LAYOUT" | "RASTER_CONTRAST" | "DETERMINISM";

export type TextLayoutHardBlock =
  | "TEXT_LAYOUT_PREFLIGHT_BLOCKED"
  | "OVERFLOW"
  | "CLIPPING"
  | "TEXT_COLLISION"
  | "TEXT_GRAPHIC_COLLISION"
  | "SAFE_AREA"
  | "BREATHING_ROOM"
  | "ORPHAN_CHARACTER"
  | "ORPHAN_PUNCTUATION"
  | "SEMANTIC_UNIT_SPLIT"
  | "FORCED_UNNATURAL_BREAK"
  | "EXCESSIVE_SHRINK"
  | "FONT_NOT_READY"
  | "IMAGE_NOT_DECODED"
  | "ANIMATION_ACTIVE";

export interface DeterministicSeedInput {
  contentVersion: string;
  copyVersion: string;
  visualVersion: string;
  pageNumber: number;
  assetIds: string[];
}

export interface RenderInputAudit {
  input_hash: string;
  stable_asset_ids: string[];
  render_seed: string;
  findings: string[];
  result: "PASS" | "FAIL";
}

export interface GeometrySample {
  selector: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
  fontFamily: string;
  fontSize: string;
  lineHeight: string;
}

export interface StablePageEvidence {
  font_ready: true;
  image_count: number;
  decoded_image_count: number;
  animation_count: 0;
  transition_count: 0;
  geometry_hash: string;
  geometry_samples_required: number;
  geometry_samples_observed: number;
  geometry: GeometrySample[];
}

export interface TextLayoutLayerSpec {
  layerId: string;
  selector: string;
  approvedText: string;
  minimumFontSizePx: number;
  semanticUnits?: string[];
  core?: boolean;
}

export interface GraphicCollisionSpec {
  graphicId: string;
  selector: string;
  occludesTextLayerIds: string[];
}

export interface TextLayoutMeasurement {
  layer_id: string;
  text: string;
  lines: string[];
  rect: { x: number; y: number; width: number; height: number };
  scroll_width: number;
  scroll_height: number;
  client_width: number;
  client_height: number;
  font_family: string;
  font_size_px: number;
  line_height_px: number;
  letter_spacing_px: number;
  z_index: number;
}

export interface TextLayoutPreflightResult {
  measurements: TextLayoutMeasurement[];
  hard_blocks: TextLayoutHardBlock[];
  result: "PASS" | "FAIL";
  real_font_metrics_used: true;
  copy_changed: false;
}

export interface LayoutRecoveryCandidate<T> {
  id: string;
  recoveryStep:
    | "SEMANTIC_LINE_BREAK"
    | "TEXT_REGION_EXPANSION"
    | "COMPOSITION_LOCAL_ADJUSTMENT"
    | "FONT_SIZE_REDUCTION"
    | "LINE_HEIGHT_ADJUSTMENT"
    | "TRACKING_ADJUSTMENT"
    | "PAGE_COMPOSITION_REVISION";
  value: T;
}

export interface CopyGraphicSeparationInput {
  approvedContentLayers: Array<{ layerId: string; text: string }>;
  renderedContentLayers: Array<{ layerId: string; text: string }>;
  graphicMarkers: Array<{
    markerId: string;
    text: string;
    graphicFunction: string;
    addsSemanticContent: boolean;
    functionalLabelApproved: boolean;
  }>;
}

const sha256 = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stableValue(item)]),
    );
  return value;
}

export function stableSerialize(value: unknown): string {
  return JSON.stringify(stableValue(value));
}

export function stableRenderAssetOrder(assetIds: string[]): string[] {
  return [...new Set(assetIds)].sort((left, right) => left.localeCompare(right));
}

export function deriveRenderSeed(input: DeterministicSeedInput): string {
  return sha256(
    stableSerialize({
      ...input,
      assetIds: stableRenderAssetOrder(input.assetIds),
    }),
  ).slice(0, 24);
}

export function auditRenderInput(html: string, input: DeterministicSeedInput): RenderInputAudit {
  const findings: string[] = [];
  const checks: Array<[RegExp, string]> = [
    [/Date\.now\s*\(/u, "NONDETERMINISTIC_DATE_NOW"],
    [/new\s+Date\s*\(/u, "NONDETERMINISTIC_DATE_CONSTRUCTOR"],
    [/Math\.random\s*\(/u, "NONDETERMINISTIC_MATH_RANDOM"],
    [/randomUUID\s*\(/u, "NONDETERMINISTIC_UUID"],
    [/<(?:script|iframe|object|embed)\b/iu, "EXECUTABLE_RENDER_DOM_BLOCKED"],
    [/animation\s*:\s*(?!none)/iu, "ACTIVE_CSS_ANIMATION_DECLARED"],
    [/transition\s*:\s*(?!none)/iu, "ACTIVE_CSS_TRANSITION_DECLARED"],
  ];
  for (const [pattern, code] of checks) if (pattern.test(html)) findings.push(code);
  const stableAssetIds = stableRenderAssetOrder(input.assetIds);
  return {
    input_hash: sha256(html),
    stable_asset_ids: stableAssetIds,
    render_seed: deriveRenderSeed({ ...input, assetIds: stableAssetIds }),
    findings,
    result: findings.length === 0 ? "PASS" : "FAIL",
  };
}

export async function createDeterministicRenderContext(browser: Browser): Promise<BrowserContext> {
  const policy = DETERMINISTIC_RENDER_CONTEXT_V1;
  const context = await browser.newContext({
    viewport: policy.viewport,
    deviceScaleFactor: policy.deviceScaleFactor,
    locale: policy.locale,
    timezoneId: policy.timezoneId,
    colorScheme: policy.colorScheme,
    reducedMotion: policy.reducedMotion,
    acceptDownloads: policy.acceptDownloads,
    serviceWorkers: policy.serviceWorkers,
  });
  await context.route("**/*", async (route) => {
    const url = route.request().url();
    if (url === "about:blank" || url.startsWith("data:")) return route.continue();
    return route.abort("blockedbyclient");
  });
  return context;
}

async function disableMotion(page: Page): Promise<void> {
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}",
  });
}

async function awaitFontAndImageReadiness(page: Page): Promise<{
  fontReady: boolean;
  imageCount: number;
  decodedImageCount: number;
  activeAnimationCount: number;
  activeTransitionCount: number;
}> {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const images = [...document.images];
    let decoded = 0;
    for (const image of images) {
      if (!image.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) continue;
      await image.decode();
      decoded += 1;
    }
    const styled = [...document.querySelectorAll<HTMLElement>("*")];
    const activeTransitionCount = styled.filter((element) => {
      const style = getComputedStyle(element);
      return style.transitionDuration
        .split(",")
        .some((duration) => Number.parseFloat(duration) > 0);
    }).length;
    return {
      fontReady: document.fonts.status === "loaded",
      imageCount: images.length,
      decodedImageCount: decoded,
      activeAnimationCount: document.getAnimations().filter((item) => item.playState === "running")
        .length,
      activeTransitionCount,
    };
  });
}

async function measureGeometry(page: Page, selectors: string[]): Promise<GeometrySample[]> {
  return page.evaluate((requestedSelectors) => {
    return requestedSelectors.map((selector) => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`RENDER_GEOMETRY_SELECTOR_MISSING:${selector}`);
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        selector,
        x: Number(rect.x.toFixed(3)),
        y: Number(rect.y.toFixed(3)),
        width: Number(rect.width.toFixed(3)),
        height: Number(rect.height.toFixed(3)),
        scrollWidth: element.scrollWidth,
        scrollHeight: element.scrollHeight,
        clientWidth: element.clientWidth,
        clientHeight: element.clientHeight,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
      };
    });
  }, selectors);
}

export async function stabilizeRenderPage(
  page: Page,
  selectors: string[],
): Promise<StablePageEvidence> {
  await disableMotion(page);
  const readiness = await awaitFontAndImageReadiness(page);
  if (!readiness.fontReady) throw new Error("FONT_NOT_READY");
  if (readiness.decodedImageCount !== readiness.imageCount) throw new Error("IMAGE_NOT_DECODED");
  if (readiness.activeAnimationCount > 0 || readiness.activeTransitionCount > 0)
    throw new Error("ANIMATION_ACTIVE");
  const required = DETERMINISTIC_RENDER_CONTEXT_V1.stableGeometrySamples;
  let consecutive = 0;
  let previousHash: string | null = null;
  let observed = 0;
  while (observed < DETERMINISTIC_RENDER_CONTEXT_V1.maximumGeometrySamples) {
    const latest = await measureGeometry(page, selectors);
    const currentHash = sha256(stableSerialize(latest));
    consecutive = currentHash === previousHash ? consecutive + 1 : 1;
    previousHash = currentHash;
    observed += 1;
    if (consecutive >= required)
      return {
        font_ready: true,
        image_count: readiness.imageCount,
        decoded_image_count: readiness.decodedImageCount,
        animation_count: 0,
        transition_count: 0,
        geometry_hash: currentHash,
        geometry_samples_required: required,
        geometry_samples_observed: observed,
        geometry: latest,
      };
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
    );
  }
  throw new Error("DOM_GEOMETRY_NOT_STABLE");
}

async function prepareDeterministicPage(input: {
  browser: Browser;
  html: string;
  selectors: string[];
  seed: string;
}) {
  const context = await createDeterministicRenderContext(input.browser);
  const page = await context.newPage();
  await page.setContent(input.html, { waitUntil: "load", timeout: 30_000 });
  await page.locator("html").evaluate((element, seed) => {
    element.dataset.renderSeed = seed;
  }, input.seed);
  const stability = await stabilizeRenderPage(page, input.selectors);
  const png = await page.screenshot({
    type: "png",
    animations: "disabled",
    caret: "hide",
    scale: "css",
    omitBackground: false,
    timeout: 30_000,
  });
  await page.close();
  await context.close();
  return { png, stability };
}

export async function captureDeterministicReplay(input: {
  browser: Browser;
  html: string;
  selectors: string[];
  seedInput: DeterministicSeedInput;
  browserVersion: string;
}) {
  const audit = auditRenderInput(input.html, input.seedInput);
  if (audit.result !== "PASS")
    throw new Error(`RENDER_INPUT_NONDETERMINISTIC:${audit.findings.join(",")}`);
  const first = await prepareDeterministicPage({
    browser: input.browser,
    html: input.html,
    selectors: input.selectors,
    seed: audit.render_seed,
  });
  const second = await prepareDeterministicPage({
    browser: input.browser,
    html: input.html,
    selectors: input.selectors,
    seed: audit.render_seed,
  });
  const inputDeterministic = audit.result === "PASS";
  const geometryDeterministic = first.stability.geometry_hash === second.stability.geometry_hash;
  const byteDeterministic = first.png.equals(second.png);
  return {
    input_determinism: inputDeterministic ? ("PASS" as const) : ("FAIL" as const),
    dom_geometry_determinism: geometryDeterministic ? ("PASS" as const) : ("FAIL" as const),
    pixel_determinism: byteDeterministic ? ("PASS" as const) : ("FAIL" as const),
    file_byte_determinism: byteDeterministic ? ("PASS" as const) : ("FAIL" as const),
    first_png: first.png,
    replay_png: second.png,
    first_checksum: sha256(first.png),
    replay_checksum: sha256(second.png),
    first_geometry_hash: first.stability.geometry_hash,
    replay_geometry_hash: second.stability.geometry_hash,
    deterministic: inputDeterministic && geometryDeterministic && byteDeterministic,
    context: {
      ...DETERMINISTIC_RENDER_CONTEXT_V1,
      browserVersion: input.browserVersion,
      renderSeed: audit.render_seed,
      stableAssetIds: audit.stable_asset_ids,
    },
    stability: [first.stability, second.stability],
  };
}

function normalizedCopy(value: string): string {
  return value.replace(/\s+/gu, "");
}

function normalizedHan(value: string): string {
  return value.replace(/[^\p{Script=Han}]/gu, "");
}

function rectanglesOverlap(
  left: { x: number; y: number; width: number; height: number },
  right: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

export function evaluateSemanticLineBreak(input: {
  approvedText: string;
  renderedLines: string[];
  semanticUnits?: string[];
}) {
  const blocks = new Set<TextLayoutHardBlock>();
  if (normalizedCopy(input.renderedLines.join("")) !== normalizedCopy(input.approvedText))
    blocks.add("FORCED_UNNATURAL_BREAK");
  const punctuationAtStart = /^[，。！？、；：,.!?;：；）》】]/u;
  const weakEnding = /[和与或而在对把被]$/u;
  for (const line of input.renderedLines) {
    if (normalizedHan(line).length === 1) blocks.add("ORPHAN_CHARACTER");
    if (punctuationAtStart.test(line.trim())) blocks.add("ORPHAN_PUNCTUATION");
    if (weakEnding.test(line.trim()) && input.renderedLines.length > 1)
      blocks.add("FORCED_UNNATURAL_BREAK");
  }
  for (const unit of input.semanticUnits ?? [])
    if (!input.renderedLines.some((line) => normalizedCopy(line).includes(normalizedCopy(unit))))
      blocks.add("SEMANTIC_UNIT_SPLIT");
  return {
    hard_blocks: [...blocks],
    result: blocks.size === 0 ? ("PASS" as const) : ("FAIL" as const),
  };
}

export async function runTextLayoutPreflight(input: {
  page: Page;
  layers: TextLayoutLayerSpec[];
  graphics?: GraphicCollisionSpec[];
  safeArea?: { left: number; top: number; right: number; bottom: number };
}): Promise<TextLayoutPreflightResult> {
  const safe = input.safeArea ?? { left: 48, top: 48, right: 1194, bottom: 1612 };
  // tsx annotates nested functions passed to Playwright with this harmless helper.
  await input.page.evaluate("globalThis.__name = globalThis.__name || ((target) => target)");
  const measured = await input.page.evaluate(
    ({ layerSpecs, graphicSpecs }) => {
      const collectTextMetrics = (element: HTMLElement) => {
        const elementStyle = getComputedStyle(element);
        const fallbackLineHeight =
          Number.parseFloat(elementStyle.lineHeight) ||
          Number.parseFloat(elementStyle.fontSize) * 1.2;
        const groups: Array<{ top: number; glyphs: string[] }> = [];
        const fontSizes: number[] = [];
        const fontFamilies: string[] = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode() as Text | null;
        while (node) {
          const parent = node.parentElement ?? element;
          const parentStyle = getComputedStyle(parent);
          if (node.data.trim()) {
            fontSizes.push(Number.parseFloat(parentStyle.fontSize));
            fontFamilies.push(parentStyle.fontFamily);
          }
          let offset = 0;
          for (const glyph of [...node.data]) {
            const range = document.createRange();
            range.setStart(node, offset);
            offset += glyph.length;
            range.setEnd(node, offset);
            const rect = range.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              const row = groups.find(
                (group) => Math.abs(group.top - rect.top) < fallbackLineHeight * 0.45,
              );
              if (row) row.glyphs.push(glyph);
              else groups.push({ top: rect.top, glyphs: [glyph] });
            }
          }
          node = walker.nextNode() as Text | null;
        }
        return {
          lines: groups
            .sort((left, right) => left.top - right.top)
            .map((group) => group.glyphs.join("")),
          fontSize: fontSizes.length
            ? Math.min(...fontSizes.filter((value) => Number.isFinite(value)))
            : Number.parseFloat(elementStyle.fontSize),
          fontFamily: fontFamilies[0] ?? elementStyle.fontFamily,
        };
      };
      const layers = layerSpecs.map((spec) => {
        const element = document.querySelector<HTMLElement>(spec.selector);
        if (!element) throw new Error(`TEXT_LAYOUT_LAYER_MISSING:${spec.layerId}`);
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const textMetrics = collectTextMetrics(element);
        return {
          layer_id: spec.layerId,
          text: element.textContent ?? "",
          lines: textMetrics.lines,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          scroll_width: element.scrollWidth,
          scroll_height: element.scrollHeight,
          client_width: element.clientWidth,
          client_height: element.clientHeight,
          font_family: textMetrics.fontFamily,
          font_size_px: textMetrics.fontSize,
          line_height_px: Number.parseFloat(style.lineHeight),
          letter_spacing_px: Number.parseFloat(style.letterSpacing) || 0,
          z_index: Number.parseInt(style.zIndex, 10) || 0,
        };
      });
      const graphics = graphicSpecs.map((spec) => {
        const element = document.querySelector<HTMLElement>(spec.selector);
        if (!element) throw new Error(`GRAPHIC_LAYER_MISSING:${spec.graphicId}`);
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          graphic_id: spec.graphicId,
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          z_index: Number.parseInt(style.zIndex, 10) || 0,
          occludes_text_layer_ids: spec.occludesTextLayerIds,
        };
      });
      return { layers, graphics };
    },
    { layerSpecs: input.layers, graphicSpecs: input.graphics ?? [] },
  );
  const blocks = new Set<TextLayoutHardBlock>();
  for (const layer of measured.layers) {
    const spec = input.layers.find((item) => item.layerId === layer.layer_id);
    if (!spec) continue;
    if (
      layer.scroll_width > layer.client_width + 1 ||
      layer.scroll_height > layer.client_height + 1
    )
      blocks.add("OVERFLOW");
    if (layer.rect.width <= 0 || layer.rect.height <= 0) blocks.add("CLIPPING");
    if (
      layer.rect.x < safe.left ||
      layer.rect.y < safe.top ||
      layer.rect.x + layer.rect.width > safe.right ||
      layer.rect.y + layer.rect.height > safe.bottom
    )
      blocks.add("SAFE_AREA");
    if (layer.font_size_px < spec.minimumFontSizePx) blocks.add("EXCESSIVE_SHRINK");
    const semantic = evaluateSemanticLineBreak({
      approvedText: spec.approvedText,
      renderedLines: layer.lines,
      ...(spec.semanticUnits ? { semanticUnits: spec.semanticUnits } : {}),
    });
    for (const block of semantic.hard_blocks) blocks.add(block);
  }
  for (let leftIndex = 0; leftIndex < measured.layers.length; leftIndex += 1) {
    const left = measured.layers[leftIndex];
    if (!left) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < measured.layers.length; rightIndex += 1) {
      const right = measured.layers[rightIndex];
      if (!right) continue;
      if (rectanglesOverlap(left.rect, right.rect)) blocks.add("TEXT_COLLISION");
      const horizontalOverlap =
        left.rect.x < right.rect.x + right.rect.width &&
        left.rect.x + left.rect.width > right.rect.x;
      const gap = Math.max(
        0,
        Math.max(left.rect.y, right.rect.y) -
          Math.min(left.rect.y + left.rect.height, right.rect.y + right.rect.height),
      );
      if (horizontalOverlap && gap < Math.min(left.line_height_px, right.line_height_px) * 0.35)
        blocks.add("BREATHING_ROOM");
    }
  }
  for (const graphic of measured.graphics)
    for (const layerId of graphic.occludes_text_layer_ids) {
      const text = measured.layers.find((item) => item.layer_id === layerId);
      if (text && graphic.z_index >= text.z_index && rectanglesOverlap(text.rect, graphic.rect))
        blocks.add("TEXT_GRAPHIC_COLLISION");
    }
  if (blocks.size > 0) blocks.add("TEXT_LAYOUT_PREFLIGHT_BLOCKED");
  return {
    measurements: measured.layers,
    hard_blocks: [...blocks],
    result: blocks.size === 0 ? "PASS" : "FAIL",
    real_font_metrics_used: true,
    copy_changed: false,
  };
}

export async function resolveTextLayoutWithCandidates<T>(input: {
  candidates: LayoutRecoveryCandidate<T>[];
  maximumAttempts?: number;
  applyAndMeasure: (candidate: LayoutRecoveryCandidate<T>) => Promise<TextLayoutPreflightResult>;
}) {
  const order = [
    "SEMANTIC_LINE_BREAK",
    "TEXT_REGION_EXPANSION",
    "COMPOSITION_LOCAL_ADJUSTMENT",
    "FONT_SIZE_REDUCTION",
    "LINE_HEIGHT_ADJUSTMENT",
    "TRACKING_ADJUSTMENT",
    "PAGE_COMPOSITION_REVISION",
  ];
  const candidates = [...input.candidates].sort(
    (left, right) => order.indexOf(left.recoveryStep) - order.indexOf(right.recoveryStep),
  );
  const budget = input.maximumAttempts ?? 3;
  const attempts: Array<{
    candidate_id: string;
    recovery_step: LayoutRecoveryCandidate<T>["recoveryStep"];
    result: "PASS" | "FAIL";
    hard_blocks: TextLayoutHardBlock[];
  }> = [];
  for (const candidate of candidates.slice(0, budget)) {
    const result = await input.applyAndMeasure(candidate);
    attempts.push({
      candidate_id: candidate.id,
      recovery_step: candidate.recoveryStep,
      result: result.result,
      hard_blocks: result.hard_blocks,
    });
    if (result.result === "PASS")
      return { result: "PASS" as const, selected: candidate, attempts, budget_exhausted: false };
  }
  return {
    result: "BLOCKED" as const,
    selected: null,
    attempts,
    budget_exhausted: attempts.length >= budget,
    next_action: "MANUAL_OR_UPSTREAM_REVISION_REQUIRED" as const,
  };
}

export function evaluateCopyGraphicSeparation(input: CopyGraphicSeparationInput) {
  const blocks = new Set<string>();
  const approved = new Map(
    input.approvedContentLayers.map((layer) => [layer.layerId, normalizedCopy(layer.text)]),
  );
  const rendered = new Map(
    input.renderedContentLayers.map((layer) => [layer.layerId, normalizedCopy(layer.text)]),
  );
  if (approved.size !== rendered.size) blocks.add("CONTENT_TEXT_LAYER_SET_MISMATCH");
  for (const [layerId, text] of approved)
    if (rendered.get(layerId) !== text) blocks.add("CONTENT_COPY_FIDELITY_FAILED");
  for (const layerId of rendered.keys())
    if (!approved.has(layerId)) blocks.add("UNAPPROVED_CONTENT_TEXT_LAYER");
  for (const marker of input.graphicMarkers) {
    if (!marker.graphicFunction.trim()) blocks.add("GRAPHIC_MARKER_FUNCTION_REQUIRED");
    if (marker.addsSemanticContent && !marker.functionalLabelApproved)
      blocks.add("COPY_CHANGE_REQUIRED");
  }
  return {
    content_copy_exact: !blocks.has("CONTENT_COPY_FIDELITY_FAILED"),
    graphic_marker_count: input.graphicMarkers.length,
    graphic_markers_excluded_from_copy_fidelity: true as const,
    hard_blocks: [...blocks],
    result: blocks.size === 0 ? ("PASS" as const) : ("FAIL" as const),
  };
}

export function evaluateContrastRecoveryStylePreservation(input: {
  beforeVisualSystemKey: string;
  afterVisualSystemKey: string;
  changedVariables: string[];
}) {
  const allowed = new Set([
    "TEXT_REGION",
    "FOREGROUND_COLOR",
    "GRAPHIC_POSITION",
    "LOCAL_VALUE",
    "CROP",
    "COMPOSITION_LOCAL_ADJUSTMENT",
  ]);
  const hardBlocks: string[] = [];
  if (input.beforeVisualSystemKey !== input.afterVisualSystemKey)
    hardBlocks.push("CONTRAST_RECOVERY_STYLE_DRIFT");
  if (input.changedVariables.some((variable) => !allowed.has(variable)))
    hardBlocks.push("CONTRAST_RECOVERY_SCOPE_EXCEEDED");
  return {
    hard_blocks: hardBlocks,
    result: hardBlocks.length === 0 ? ("PASS" as const) : ("FAIL" as const),
  };
}

export function evaluateFormalAssetPromotionGate(input: {
  attemptId: string;
  gates: Record<FormalAssetGate, GateStatus>;
  hardBlocks: string[];
}) {
  const failedGates = FORMAL_ASSET_REQUIRED_GATES.filter((gate) => input.gates[gate] !== "PASS");
  const hardBlocks = [
    ...new Set([...input.hardBlocks, ...failedGates.map((gate) => `GATE_${gate}`)]),
  ];
  const promoted = hardBlocks.length === 0;
  return {
    attempt_id: input.attemptId,
    required_gates: [...FORMAL_ASSET_REQUIRED_GATES],
    failed_gates: failedGates,
    hard_blocks: hardBlocks,
    formal_asset: promoted,
    promotion_status: promoted ? ("PROMOTED" as const) : ("ATTEMPT_ONLY" as const),
    result: promoted ? ("PASS" as const) : ("BLOCKED" as const),
  };
}

export class ProductionRecoveryBudget {
  readonly limits = { TEXT_LAYOUT: 3, RASTER_CONTRAST: 3, DETERMINISM: 2 } as const;
  private readonly attempts = new Map<RecoveryCategory, number>();
  private readonly evidence: Array<{
    category: RecoveryCategory;
    attempt: number;
    changed_variable: string;
    reason: string;
  }> = [];

  consume(category: RecoveryCategory, changedVariable: string, reason: string) {
    if (!changedVariable.trim() || !reason.trim()) throw new Error("RECOVERY_EVIDENCE_REQUIRED");
    const next = (this.attempts.get(category) ?? 0) + 1;
    const limit = this.limits[category];
    if (next > limit)
      return {
        allowed: false as const,
        category,
        attempts_used: next - 1,
        limit,
        next_action: "MANUAL_OR_UPSTREAM_REVISION_REQUIRED" as const,
      };
    this.attempts.set(category, next);
    this.evidence.push({
      category,
      attempt: next,
      changed_variable: changedVariable,
      reason,
    });
    return { allowed: true as const, category, attempt: next, limit };
  }

  report() {
    return {
      limits: this.limits,
      attempts: Object.fromEntries(this.attempts),
      evidence: [...this.evidence],
    };
  }
}
