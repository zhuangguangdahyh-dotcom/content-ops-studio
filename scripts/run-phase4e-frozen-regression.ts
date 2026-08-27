import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import {
  FORMAL_ASSET_REQUIRED_GATES,
  captureDeterministicReplay,
  createDeterministicRenderContext,
  evaluateCopyGraphicSeparation,
  evaluateFormalAssetPromotionGate,
  runTextLayoutPreflight,
  stabilizeRenderPage,
  type FormalAssetGate,
  type GateStatus,
  type TextLayoutLayerSpec,
} from "../packages/renderer/src/production-reliability.js";
import {
  analyzeRasterTextBackgroundContrast,
  type RasterContrastRegion,
} from "../packages/renderer/src/raster-text-contrast.js";

const WIDTH = 1242;
const HEIGHT = 1660;
const CREATED_AT = "2026-08-27T13:30:00.000Z";
const PROJECT_HOME =
  process.env.PHASE4E_PROJECT_HOME ??
  path.resolve(process.cwd(), "..", "content-ops-studio-phase4d-runtime");

type CopyLayer = {
  layerId: string;
  role: RasterContrastRegion["role"];
  text: string;
  minimumFontSizePx: number;
  semanticUnits: string[];
};

type FrozenPage = {
  page: number;
  layers: CopyLayer[];
};

type FrozenCase = {
  key: "A" | "B";
  projectId: string;
  sourceRunId: string;
  targetRunId: string;
  visualSystemKey: string;
  pages: FrozenPage[];
};

const layer = (
  layerId: string,
  role: RasterContrastRegion["role"],
  text: string,
  minimumFontSizePx: number,
  semanticUnits: string[] = [],
): CopyLayer => ({
  layerId,
  role,
  text,
  minimumFontSizePx,
  semanticUnits,
});

const CASES: FrozenCase[] = [
  {
    key: "A",
    projectId: "CAL-COMMERCIAL-BLIND-001",
    sourceRunId: "RUN-20260827-080000-P4DA",
    targetRunId: "RUN-20260827-141000-P4EA",
    visualSystemKey: "A-WARM-STONE-MOSS-ROUTE-V1",
    pages: [
      {
        page: 1,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "空间很好看，\n顾客却不知道往哪走", 88),
          layer("SUPPORTING", "SECONDARY_SIGNAL", "商业空间先查动线、停留和功能判断", 38),
        ],
      },
      {
        page: 2,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "真正影响体验的，\n不只是设计感", 62, ["不只是设计感"]),
          layer(
            "SUPPORTING",
            "BODY",
            "而是顾客进入空间以后，\n能不能自然知道下一步去哪、\n在哪里停、该做什么。",
            34,
          ),
        ],
      },
      {
        page: 3,
        layers: [
          layer("SECTION", "LABEL", "第一查：动线", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "不用别人带路，\n顾客知道下一步往哪走吗？", 62, [
            "往哪走",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "入口、转折、通道和视觉焦点，\n都在默默告诉顾客：\n下一步应该往哪里移动。",
            34,
          ),
        ],
      },
      {
        page: 4,
        layers: [
          layer("SECTION", "LABEL", "第二查：停留", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "该停下来的地方，\n顾客愿意留下吗？", 58, [
            "顾客愿意留下",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "座位、尺度、光线和视线关系，\n决定一个区域是让人经过，\n还是让人自然停下来。",
            34,
          ),
        ],
      },
      {
        page: 5,
        layers: [
          layer("SECTION", "LABEL", "第三查：功能", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "顾客一眼知道\n每个区域是做什么的吗？", 58, [
            "每个区域是做什么",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "前台、等候、展示、消费和离开的节点，\n如果彼此关系不清楚，\n空间就会增加理解成本。",
            32,
          ),
        ],
      },
      {
        page: 6,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "空间先让人完成这3个判断", 72),
          layer("CORE", "BODY", "知道往哪走知道在哪停知道这里做什么", 44, [
            "知道往哪走",
            "知道在哪停",
            "知道这里做什么",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "高级感只是表面结果。\n真正顺手的空间，\n会让顾客几乎不用思考下一步。",
            40,
          ),
        ],
      },
    ],
  },
  {
    key: "B",
    projectId: "CAL-PRO-SERVICE-BLIND-001",
    sourceRunId: "RUN-20260827-080100-P4DB",
    targetRunId: "RUN-20260827-141100-P4EB",
    visualSystemKey: "B-INK-IVORY-COBALT-SIGNAL-V1",
    pages: [
      {
        page: 1,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "品牌说了很多，\n客户还是没听懂", 84),
          layer("SUPPORTING", "SECONDARY_SIGNAL", "先查定位、信息和证据", 40),
        ],
      },
      {
        page: 2,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "问题往往不是\n你介绍得不够多", 68),
          layer(
            "SUPPORTING",
            "BODY",
            "而是客户看完以后，\n仍然说不清：\n你是谁、解决什么、为什么选你。",
            38,
          ),
        ],
      },
      {
        page: 3,
        layers: [
          layer("SECTION", "LABEL", "第一查：定位", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "一句话能说清\n你到底帮谁解决什么吗？", 64, [
            "到底帮谁",
            "解决什么",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "如果定位需要讲很久才能解释，\n客户就很难形成第一层判断。",
            38,
          ),
        ],
      },
      {
        page: 4,
        layers: [
          layer("SECTION", "LABEL", "第二查：信息", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "客户最需要知道的内容，\n是不是最先被看见？", 58, [
            "被看见",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "服务很多、经历很多、优势很多，\n不等于信息清楚。\n真正重要的是优先级。",
            34,
          ),
        ],
      },
      {
        page: 5,
        layers: [
          layer("SECTION", "LABEL", "第三查：证据", 32),
          layer("PRIMARY", "PRIMARY_HOOK", "你说自己专业，\n客户凭什么相信？", 56),
          layer(
            "SUPPORTING",
            "BODY",
            "案例、过程、方法、结果和真实细节，\n才会把“我很专业”\n变成可以判断的证据。",
            32,
          ),
        ],
      },
      {
        page: 6,
        layers: [
          layer("PRIMARY", "PRIMARY_HOOK", "品牌表达先回答这3件事", 72),
          layer("CORE", "BODY", "我是谁什么最重要凭什么相信", 54, [
            "我是谁",
            "什么最重要",
            "凭什么相信",
          ]),
          layer(
            "SUPPORTING",
            "BODY",
            "信息越多不等于品牌越清楚。\n让客户更快形成判断，\n才是表达真正要完成的任务。",
            38,
          ),
        ],
      },
    ],
  },
];

const sha256 = (value: string | Uint8Array) => createHash("sha256").update(value).digest("hex");

async function writeOnceOrReuse(file: string, value: string | Buffer): Promise<void> {
  const bytes = typeof value === "string" ? Buffer.from(value) : value;
  try {
    const existing = await readFile(file);
    if (!existing.equals(bytes)) throw new Error(`PHASE4E_ARTIFACT_CONFLICT:${file}`);
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, bytes, { mode: 0o600 });
  await rename(temporary, file);
  if (!(await readFile(file)).equals(bytes)) throw new Error(`READ_AFTER_WRITE_FAILED:${file}`);
}

async function writeJson(file: string, value: unknown): Promise<void> {
  await writeOnceOrReuse(file, `${JSON.stringify(value, null, 2)}\n`);
}

function sourceRunRoot(spec: FrozenCase): string {
  return path.join(PROJECT_HOME, "projects", spec.projectId, "runs", spec.sourceRunId);
}

function targetRunRoot(spec: FrozenCase): string {
  return path.join(PROJECT_HOME, "projects", spec.projectId, "runs", spec.targetRunId);
}

async function filesUnder(root: string): Promise<string[]> {
  const output: string[] = [];
  async function visit(directory: string): Promise<void> {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, item.name);
      if (item.isDirectory()) await visit(file);
      else if (item.isFile()) output.push(file);
    }
  }
  await visit(root);
  return output.sort((left, right) => left.localeCompare(right));
}

async function hashTree(root: string) {
  const files = await filesUnder(root);
  const entries = await Promise.all(
    files.map(async (file) => ({
      path: path.relative(root, file),
      sha256: sha256(await readFile(file)),
    })),
  );
  return {
    file_count: entries.length,
    aggregate_sha256: sha256(JSON.stringify(entries)),
    entries,
  };
}

async function copyFrozenSources(spec: FrozenCase): Promise<unknown[]> {
  const sourceDirectory = path.join(sourceRunRoot(spec), "assets", "source");
  const targetDirectory = path.join(targetRunRoot(spec), "assets", "source");
  const records: unknown[] = [];
  for (const file of await filesUnder(sourceDirectory)) {
    const relative = path.relative(sourceDirectory, file);
    const bytes = await readFile(file);
    const target = path.join(targetDirectory, relative);
    await writeOnceOrReuse(target, bytes);
    records.push({
      file: relative,
      source_sha256: sha256(bytes),
      target_sha256: sha256(await readFile(target)),
      byte_identical: true,
    });
  }
  return records;
}

function withVisualLineBreaks(html: string, approvedText: string, visualLines: string[]): string {
  const original = approvedText
    .split("\n")
    .map((item) => `<span>${item}</span>`)
    .join("");
  const replacement = visualLines.map((item) => `<span>${item}</span>`).join("");
  if (!html.includes(original))
    throw new Error(`PHASE4E_APPROVED_COPY_BINDING_MISSING:${approvedText}`);
  return html.replace(original, replacement);
}

function repairHtml(
  spec: FrozenCase,
  page: number,
  source: string,
): {
  html: string;
  repairs: string[];
} {
  let html = source.replace("padding-bottom:10px", "padding-bottom:20px");
  const repairs = ["TEXT_REGION_INTERNAL_SAFETY_MARGIN_10_TO_20"];
  if (spec.key === "A" && page === 2) {
    html = html.replace("font-size:76px", "font-size:62px");
    html = html.replace("width:450px;font-size:43px", "width:480px;font-size:34px");
    repairs.push("SEMANTIC_LAYOUT_BOUNDED_FONT_AND_REGION_ADJUSTMENT");
  }
  if (spec.key === "A" && page === 3) {
    html = withVisualLineBreaks(html, "不用别人带路，\n顾客知道下一步往哪走吗？", [
      "不用别人",
      "带路，",
      "顾客知道",
      "下一步",
      "往哪走吗？",
    ]);
    html = withVisualLineBreaks(
      html,
      "入口、转折、通道和视觉焦点，\n都在默默告诉顾客：\n下一步应该往哪里移动。",
      ["入口、转折、", "通道和视觉焦点，", "都在默默告诉顾客：", "下一步应该", "往哪里移动。"],
    );
    repairs.push("SEMANTIC_LINE_BREAK_RECOMPOSITION");
  }
  if (spec.key === "A" && page === 4) {
    html = html.replace("color:#966739", "color:#70451f");
    repairs.push("LABEL_FOREGROUND_COLOR_LOCAL_CONTRAST");
    html = withVisualLineBreaks(
      html,
      "座位、尺度、光线和视线关系，\n决定一个区域是让人经过，\n还是让人自然停下来。",
      ["座位、尺度、", "光线和视线关系，", "决定一个区域", "是让人经过，", "还是让人自然停下来。"],
    );
    repairs.push("SEMANTIC_LINE_BREAK_RECOMPOSITION");
  }
  if (spec.key === "A" && page === 6) {
    for (const marker of ["1", "2", "3"])
      html = html.replace(
        `<i>${marker}</i>`,
        `<i class="graphic-marker" aria-hidden="true" data-marker="${marker}"></i>`,
      );
    html = html.replace("</style>", ".graphic-marker::before{content:attr(data-marker)}</style>");
    html = html.replace("font:700 55px/1.25", "font:700 46px/1.25");
    repairs.push("NUMERIC_SEQUENCE_MOVED_FROM_COPY_LAYER_TO_GRAPHIC_MARKER");
    repairs.push("CORE_ITEM_FONT_SIZE_BOUNDED_55_TO_46");
  }
  if (spec.key === "B" && page === 1) {
    html = html.replace("font-size:104px", "font-size:90px");
    repairs.push("COVER_FONT_SIZE_BOUNDED_104_TO_90");
  }
  if (spec.key === "B" && page === 6) {
    html = html.replace("right:-120px", "right:-430px");
    repairs.push("COBALT_BACKGROUND_CIRCLE_MOVED_CLEAR_OF_TITLE");
  }
  if (spec.key === "B" && page === 2) {
    html = withVisualLineBreaks(
      html,
      "而是客户看完以后，\n仍然说不清：\n你是谁、解决什么、为什么选你。",
      ["而是客户看完以后，", "仍然说不清：", "你是谁、解决什么、", "为什么选你。"],
    );
    repairs.push("SEMANTIC_LINE_BREAK_RECOMPOSITION");
  }
  if (spec.key === "B" && page === 4) {
    html = withVisualLineBreaks(html, "客户最需要知道的内容，\n是不是最先被看见？", [
      "客户最需要",
      "知道的内容，",
      "是不是最先",
      "被看见？",
    ]);
    repairs.push("SEMANTIC_LINE_BREAK_RECOMPOSITION");
  }
  if (spec.key === "B" && page === 3) {
    html = withVisualLineBreaks(html, "一句话能说清\n你到底帮谁解决什么吗？", [
      "一句话能说清",
      "你到底帮谁",
      "解决什么吗？",
    ]);
    repairs.push("SEMANTIC_LINE_BREAK_RECOMPOSITION");
  }
  if (html === source) throw new Error(`PHASE4E_REPAIR_NOT_APPLIED:${spec.key}:P${page}`);
  return { html, repairs };
}

function inspectPng(bytes: Buffer, width: number, height: number): void {
  if (
    bytes.length < 24 ||
    bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a" ||
    bytes.readUInt32BE(16) !== width ||
    bytes.readUInt32BE(20) !== height
  )
    throw new Error("PHASE4E_PNG_INVALID");
}

function normalizeColor(value: string): string {
  const channels = value
    .match(/\d+(?:\.\d+)?/gu)
    ?.slice(0, 3)
    .map(Number);
  if (!channels || channels.length !== 3) throw new Error(`COLOR_INVALID:${value}`);
  return channels
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
}

async function prepareQaPage(browser: Browser, html: string, pageSpec: FrozenPage) {
  const context = await createDeterministicRenderContext(browser);
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "load" });
  const count = await page.locator(".text-layer").count();
  if (count !== pageSpec.layers.length)
    throw new Error(`PHASE4E_TEXT_LAYER_COUNT_MISMATCH:P${pageSpec.page}:${count}`);
  await page.locator(".text-layer").evaluateAll(
    (elements, layerIds) => {
      elements.forEach((element, index) => {
        (element as HTMLElement).dataset.layoutId = layerIds[index] ?? "UNKNOWN";
      });
    },
    pageSpec.layers.map((item) => item.layerId),
  );
  const selectors = [
    "#canvas",
    ...pageSpec.layers.map((item) => `[data-layout-id="${item.layerId}"]`),
  ];
  await stabilizeRenderPage(page, selectors);
  return { context, page, selectors };
}

async function inspectRasterAndLayout(
  browser: Browser,
  html: string,
  caseSpec: FrozenCase,
  pageSpec: FrozenPage,
) {
  const qa = await prepareQaPage(browser, html, pageSpec);
  try {
    const layoutLayers: TextLayoutLayerSpec[] = pageSpec.layers.map((item) => ({
      layerId: item.layerId,
      selector: `[data-layout-id="${item.layerId}"]`,
      approvedText: item.text,
      minimumFontSizePx: item.minimumFontSizePx,
      semanticUnits: item.semanticUnits,
    }));
    const graphics =
      caseSpec.key === "B" && pageSpec.page === 6
        ? [{ graphicId: "COBALT_CIRCLE", selector: ".blue", occludesTextLayerIds: ["PRIMARY"] }]
        : [];
    const layout = await runTextLayoutPreflight({
      page: qa.page,
      layers: layoutLayers,
      graphics,
      safeArea: { left: 48, top: 48, right: WIDTH - 48, bottom: HEIGHT - 48 },
    });
    const rendered = await qa.page.locator(".text-layer").evaluateAll((elements) =>
      elements.map((element) => ({
        layerId: (element as HTMLElement).dataset.layoutId ?? "UNKNOWN",
        text: element.textContent ?? "",
      })),
    );
    const markers = await qa.page.locator(".graphic-marker").evaluateAll((elements) =>
      elements.map((element, index) => ({
        markerId: `GRAPHIC_MARKER_${index + 1}`,
        text: (element as HTMLElement).dataset.marker ?? "",
        graphicFunction: "SEQUENCE_POSITION",
        addsSemanticContent: false,
        functionalLabelApproved: false,
      })),
    );
    const copyGraphic = evaluateCopyGraphicSeparation({
      approvedContentLayers: pageSpec.layers.map((item) => ({
        layerId: item.layerId,
        text: item.text,
      })),
      renderedContentLayers: rendered,
      graphicMarkers: markers,
    });
    const regions = await qa.page.locator(".text-layer").evaluateAll(
      (elements, specs) =>
        elements.map((element, index) => {
          const htmlElement = element as HTMLElement;
          const rect = htmlElement.getBoundingClientRect();
          const style = getComputedStyle(htmlElement);
          const spec = specs[index];
          if (!spec) throw new Error("PHASE4E_LAYER_SPEC_MISSING");
          return {
            text_layer_id: spec.layerId,
            role: spec.role,
            foreground_color: style.color,
            foreground_opacity: Number(style.opacity),
            text_bbox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            resolved_font: style.fontFamily,
            resolved_weight: Number.parseInt(style.fontWeight, 10) || 400,
          };
        }),
      pageSpec.layers.map((item) => ({ layerId: item.layerId, role: item.role })),
    );
    await qa.page.locator(".text-layer").evaluateAll((elements) => {
      elements.forEach((element) => ((element as HTMLElement).style.visibility = "hidden"));
    });
    const background = await qa.page.screenshot({
      type: "png",
      animations: "disabled",
      caret: "hide",
    });
    const contrast = await analyzeRasterTextBackgroundContrast(
      qa.page,
      background,
      regions.map((item) => ({ ...item, foreground_color: normalizeColor(item.foreground_color) })),
    );
    const contrastFailures = contrast.filter((item) => {
      const threshold = item.role === "PRIMARY_HOOK" ? 3.5 : 4;
      return item.low_percentile_local_contrast < threshold || item.low_contrast_area_ratio > 0.08;
    });
    const backgroundComplexityFailures = contrast.filter(
      (item) => item.background_complexity > 0.2 || item.foreground_background_edge_conflict > 0.2,
    );
    return {
      layout,
      copy_graphic_separation: copyGraphic,
      background,
      raster_contrast: contrast,
      raster_contrast_result: contrastFailures.length === 0 ? ("PASS" as const) : ("FAIL" as const),
      raster_contrast_failures: contrastFailures.map((item) => item.text_layer_id),
      background_complexity_result:
        backgroundComplexityFailures.length === 0 ? ("PASS" as const) : ("FAIL" as const),
      background_complexity_failures: backgroundComplexityFailures.map(
        (item) => item.text_layer_id,
      ),
    };
  } finally {
    await qa.page.close();
    await qa.context.close();
  }
}

async function captureSized(browser: Browser, bytes: Buffer, width: number, height: number) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:${width}px;height:${height}px}</style></head><body><img src="data:image/png;base64,${bytes.toString("base64")}"></body></html>`;
  const capture = async () => {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      locale: "zh-CN",
      timezoneId: "Asia/Shanghai",
      colorScheme: "light",
      reducedMotion: "reduce",
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.locator("img").evaluate(async (image) => (image as HTMLImageElement).decode());
    const output = await page.screenshot({ type: "png", animations: "disabled", caret: "hide" });
    await context.close();
    return output;
  };
  const first = await capture();
  const replay = await capture();
  if (!first.equals(replay)) throw new Error(`PHASE4E_THUMBNAIL_DETERMINISM_FAILED:${width}`);
  inspectPng(first, width, height);
  return first;
}

async function captureContactSheet(browser: Browser, pages: Buffer[]) {
  const cells = pages
    .map(
      (bytes, index) =>
        `<figure><img src="data:image/png;base64,${bytes.toString("base64")}"><figcaption>P${index + 1}</figcaption></figure>`,
    )
    .join("");
  const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden;background:#10131a}main{display:grid;grid-template-columns:repeat(3,360px);grid-auto-rows:520px;gap:30px;padding:45px 51px}figure{margin:0;width:360px;height:520px}img{display:block;width:360px;height:480px}figcaption{height:40px;padding-top:8px;color:#e7e9ee;text-align:center;font:600 22px/1.2 sans-serif}</style></head><body><main>${cells}</main></body></html>`;
  const result = await captureDeterministicReplay({
    browser,
    html,
    selectors: ["main", "figure", "img"],
    seedInput: {
      contentVersion: "PHASE4E-CONTACT",
      copyVersion: "NONE",
      visualVersion: sha256(html),
      pageNumber: 0,
      assetIds: pages.map(sha256),
    },
    browserVersion: browser.version(),
  });
  if (!result.deterministic) throw new Error("PHASE4E_CONTACT_SHEET_DETERMINISM_FAILED");
  inspectPng(result.first_png, WIDTH, HEIGHT);
  return result.first_png;
}

async function preserveStrategySnapshots(spec: FrozenCase): Promise<unknown[]> {
  const sourceStrategy = path.join(sourceRunRoot(spec), "image-production", "strategy");
  const targetStrategy = path.join(targetRunRoot(spec), "image-production", "strategy");
  const snapshots: unknown[] = [];
  for (const file of await filesUnder(sourceStrategy)) {
    const relative = path.relative(sourceStrategy, file);
    const bytes = await readFile(file);
    await writeOnceOrReuse(path.join(targetStrategy, "phase4d-snapshot", relative), bytes);
    snapshots.push({ file: relative, sha256: sha256(bytes), byte_identical: true });
  }
  return snapshots;
}

async function renderCase(browser: Browser, spec: FrozenCase) {
  const targetRoot = targetRunRoot(spec);
  const sourceRecords = await copyFrozenSources(spec);
  const strategySnapshots = await preserveStrategySnapshots(spec);
  const pages = [];
  const formalBytes: Buffer[] = [];
  for (const pageSpec of spec.pages) {
    const sourceHtmlPath = path.join(
      sourceRunRoot(spec),
      "image-production",
      "html",
      `P${pageSpec.page}.html`,
    );
    const sourceHtml = await readFile(sourceHtmlPath, "utf8");
    const repaired = repairHtml(spec, pageSpec.page, sourceHtml);
    const htmlPath = path.join(targetRoot, "image-production", "html", `P${pageSpec.page}.html`);
    await writeOnceOrReuse(htmlPath, repaired.html);
    const capture = await captureDeterministicReplay({
      browser,
      html: repaired.html,
      selectors: ["#canvas", ".text-layer"],
      seedInput: {
        contentVersion: "CV-1",
        copyVersion: "CV-1",
        visualVersion: "VV-1",
        pageNumber: pageSpec.page,
        assetIds: sourceRecords.map(
          (record) => (record as { source_sha256: string }).source_sha256,
        ),
      },
      browserVersion: browser.version(),
    });
    inspectPng(capture.first_png, WIDTH, HEIGHT);
    inspectPng(capture.replay_png, WIDTH, HEIGHT);
    const inspection = await inspectRasterAndLayout(browser, repaired.html, spec, pageSpec);
    const gates = Object.fromEntries(
      FORMAL_ASSET_REQUIRED_GATES.map((gate) => [gate, "PASS"]),
    ) as Record<FormalAssetGate, GateStatus>;
    gates.COPY_FIDELITY = inspection.copy_graphic_separation.result;
    gates.TEXT_LAYOUT = inspection.layout.result;
    gates.TYPOGRAPHY_SPATIAL_INTEGRITY = inspection.layout.result;
    gates.TYPOGRAPHY_BREATHING_ROOM = inspection.layout.hard_blocks.includes("BREATHING_ROOM")
      ? "FAIL"
      : "PASS";
    gates.RASTER_CONTRAST = inspection.raster_contrast_result;
    gates.BACKGROUND_COMPLEXITY = inspection.background_complexity_result;
    gates.DETERMINISM = capture.deterministic ? "PASS" : "FAIL";
    const hardBlocks = [
      ...inspection.layout.hard_blocks,
      ...inspection.copy_graphic_separation.hard_blocks,
      ...inspection.raster_contrast_failures.map((item) => `RASTER_CONTRAST:${item}`),
      ...inspection.background_complexity_failures.map((item) => `BACKGROUND_COMPLEXITY:${item}`),
    ];
    const promotion = evaluateFormalAssetPromotionGate({
      attemptId: `${spec.targetRunId}-P${pageSpec.page}-ATT-1`,
      gates,
      hardBlocks,
    });
    const attemptRoot = path.join(targetRoot, "image-production", "attempts", `P${pageSpec.page}`);
    await Promise.all([
      writeOnceOrReuse(path.join(attemptRoot, "formal-candidate.png"), capture.first_png),
      writeOnceOrReuse(path.join(attemptRoot, "deterministic-replay.png"), capture.replay_png),
      writeOnceOrReuse(path.join(attemptRoot, "background-analysis.png"), inspection.background),
    ]);
    let formalPath: string | null = null;
    let thumbnail310Path: string | null = null;
    let thumbnail186Path: string | null = null;
    if (promotion.formal_asset) {
      formalPath = path.join(targetRoot, "image-production", "formal", `P${pageSpec.page}.png`);
      thumbnail310Path = path.join(
        targetRoot,
        "image-production",
        "thumbnails",
        "310x414",
        `P${pageSpec.page}.png`,
      );
      thumbnail186Path = path.join(
        targetRoot,
        "image-production",
        "thumbnails",
        "186x248",
        `P${pageSpec.page}.png`,
      );
      const thumbnail310 = await captureSized(browser, capture.first_png, 310, 414);
      const thumbnail186 = await captureSized(browser, capture.first_png, 186, 248);
      await Promise.all([
        writeOnceOrReuse(formalPath, capture.first_png),
        writeOnceOrReuse(thumbnail310Path, thumbnail310),
        writeOnceOrReuse(thumbnail186Path, thumbnail186),
      ]);
      formalBytes.push(capture.first_png);
    }
    pages.push({
      page_number: pageSpec.page,
      source_html_sha256: sha256(sourceHtml),
      repaired_html_sha256: sha256(repaired.html),
      repairs: repaired.repairs,
      first_sha256: capture.first_checksum,
      replay_sha256: capture.replay_checksum,
      determinism: {
        input: capture.input_determinism,
        dom_geometry: capture.dom_geometry_determinism,
        pixel: capture.pixel_determinism,
        file_bytes: capture.file_byte_determinism,
      },
      text_layout: inspection.layout,
      copy_graphic_separation: inspection.copy_graphic_separation,
      raster_contrast: inspection.raster_contrast,
      raster_contrast_result: inspection.raster_contrast_result,
      background_complexity_result: inspection.background_complexity_result,
      promotion,
      formal_path: formalPath ? path.relative(PROJECT_HOME, formalPath) : null,
      thumbnail_310_path: thumbnail310Path ? path.relative(PROJECT_HOME, thumbnail310Path) : null,
      thumbnail_186_path: thumbnail186Path ? path.relative(PROJECT_HOME, thumbnail186Path) : null,
      result: promotion.formal_asset ? "PASSED" : "FAILED",
    });
  }
  let contactSheetPath: string | null = null;
  if (formalBytes.length === 6) {
    const contact = await captureContactSheet(browser, formalBytes);
    contactSheetPath = path.join(
      targetRoot,
      "image-production",
      "contact-sheets",
      "phase4e-frozen-contact-sheet.png",
    );
    await writeOnceOrReuse(contactSheetPath, contact);
  }
  const hardBlockCount = pages.reduce(
    (sum, page) =>
      sum + (page as { promotion: { hard_blocks: string[] } }).promotion.hard_blocks.length,
    0,
  );
  const result = pages.every((page) => (page as { result: string }).result === "PASSED")
    ? "PASSED"
    : "FAILED";
  const report = {
    phase: "4E",
    project_id: spec.projectId,
    source_run_id: spec.sourceRunId,
    run_id: spec.targetRunId,
    visual_system_key: spec.visualSystemKey,
    strategy_reused_without_change: true,
    source_assets_reused_without_regeneration: true,
    imagegen_calls: 0,
    source_records: sourceRecords,
    strategy_snapshots: strategySnapshots,
    pages,
    hard_block_count: hardBlockCount,
    formal_page_count: formalBytes.length,
    contact_sheet: contactSheetPath ? path.relative(PROJECT_HOME, contactSheetPath) : null,
    result,
    created_at: CREATED_AT,
  };
  await writeJson(
    path.join(targetRoot, "image-production", "qa", "phase4e-frozen-qa.json"),
    report,
  );
  return report;
}

const historicalBefore = Object.fromEntries(
  await Promise.all(
    CASES.map(async (spec) => [spec.key, await hashTree(sourceRunRoot(spec))] as const),
  ),
) as Record<FrozenCase["key"], Awaited<ReturnType<typeof hashTree>>>;
const browser = await chromium.launch({ headless: true });
try {
  const caseReports = [];
  for (const spec of CASES) caseReports.push(await renderCase(browser, spec));
  const historicalAfter = Object.fromEntries(
    await Promise.all(
      CASES.map(async (spec) => [spec.key, await hashTree(sourceRunRoot(spec))] as const),
    ),
  ) as Record<FrozenCase["key"], Awaited<ReturnType<typeof hashTree>>>;
  const historicalUnchanged = CASES.every(
    (spec) =>
      historicalBefore[spec.key].aggregate_sha256 === historicalAfter[spec.key].aggregate_sha256,
  );
  const status =
    caseReports.every((item) => item.result === "PASSED") && historicalUnchanged
      ? "PASSED"
      : "FAILED";
  await writeJson(path.join(PROJECT_HOME, "phase-4e-frozen-regression-evidence-v4.json"), {
    phase: "4E",
    status,
    project_home_policy: "REPOSITORY_EXTERNAL",
    imagegen_calls: 0,
    cases: caseReports.map((item) => ({
      project_id: item.project_id,
      source_run_id: item.source_run_id,
      run_id: item.run_id,
      status: item.result,
      hard_block_count: item.hard_block_count,
      formal_page_count: item.formal_page_count,
      contact_sheet: item.contact_sheet,
    })),
    historical_phase4d: {
      unchanged: historicalUnchanged,
      before: Object.fromEntries(
        CASES.map((spec) => [spec.key, historicalBefore[spec.key].aggregate_sha256]),
      ),
      after: Object.fromEntries(
        CASES.map((spec) => [spec.key, historicalAfter[spec.key].aggregate_sha256]),
      ),
    },
    created_at: CREATED_AT,
  });
  if (status !== "PASSED") throw new Error("PHASE4E_FROZEN_REGRESSION_FAILED");
} finally {
  await browser.close();
}
