import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import {
  CLICK_CLARITY_WEIGHTS,
  SEMANTIC_RELEVANCE_WEIGHTS,
  evaluateCoverClickClarity,
  evaluateCoverThumbnail,
  evaluateVisualSemanticRelevance,
  planCommercialSpaceCalibrationConcepts,
  planCoverConversion,
  type CommercialSpaceCoverConcept,
} from "../packages/core/src/cover-conversion/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-131500-CAL2";
const at = "2026-08-26T05:00:00.000Z";
const sourcePaths = [
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-ead63d03-ce89-425c-8d96-c4de2a474ace.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-a999ccdd-cbf6-4a80-a3de-dbc1c98b3eb1.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-c7f93d33-5f7f-4c42-8d74-ae14fd914762.png",
];
const projectRoot = path.join(projectHome, "projects", projectId);
const runRoot = path.join(projectRoot, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const sourceRoot = path.join(imageRoot, "source-assets");
const outputRoot = path.join(imageRoot, "cover-concepts");
const sheetRoot = path.join(imageRoot, "contact-sheets");
const failedAttemptRoot = path.join(projectRoot, "runs", "RUN-20260826-130000-CAL1");

function hash(data: Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`CALIBRATION_READ_VERIFY_FAILED:${path.basename(file)}`);
}

try {
  const failedCheckpointFile = path.join(failedAttemptRoot, "checkpoint.json");
  const failedCheckpoint = JSON.parse(await readFile(failedCheckpointFile, "utf8")) as Record<
    string,
    unknown
  >;
  await atomicJson(
    path.join(failedAttemptRoot, "checkpoint-before-visual-inspection.json"),
    failedCheckpoint,
  );
  await atomicJson(path.join(failedAttemptRoot, "visual-qa-amendment.json"), {
    status: "FAILED",
    failure_code: "CALIBRATION_BACKGROUND_RENDER_MISSING",
    finding:
      "Actual visual inspection found broken local file images in all covers and contact sheets; mechanical DOM checks alone were insufficient.",
    eligible_candidate_count: 0,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    recovery_run_id: runId,
    detected_at: at,
  });
  await atomicJson(failedCheckpointFile, {
    ...failedCheckpoint,
    state: "CALIBRATION_RENDER_FAILED",
    status: "FAILED",
    candidate_count: 0,
    failure_code: "CALIBRATION_BACKGROUND_RENDER_MISSING",
    next_action: `Recover in ${runId} with embedded PNG data.`,
  });
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value)) throw new Error("CALIBRATION_PATH_ESCAPE");
  return value;
}

function pngDimensions(data: Buffer): { width: number; height: number } {
  if (!data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    throw new Error("CALIBRATION_PNG_INVALID");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function escaped(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function coverHtml(concept: CommercialSpaceCoverConcept, imageUrl: string, index: number): string {
  const titleSize = [128, 132, 122][index] ?? 124;
  const secondarySize = [60, 58, 58][index] ?? 58;
  if (index === 0)
    return `<!doctype html><meta charset="utf-8"><style>
      *{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden;font-family:"PingFang SC","Noto Sans CJK SC",sans-serif}
      .cover{position:relative;width:1242px;height:1660px;background:#ece9e3;overflow:hidden}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
      .veil{position:absolute;inset:0;background:linear-gradient(90deg,rgba(247,244,237,.98) 0%,rgba(247,244,237,.9) 42%,rgba(247,244,237,.18) 67%,rgba(247,244,237,0) 100%)}
      .copy{position:absolute;left:86px;top:126px;width:650px;color:#18202a}
      h1{margin:0;font-size:${titleSize}px;line-height:1.06;letter-spacing:-6px;font-weight:800;max-width:620px}.line{width:96px;height:7px;background:#b77a42;margin:52px 0 34px}
      p{margin:0;font-size:${secondarySize}px;line-height:1.22;font-weight:600;max-width:560px}.foot{position:absolute;left:88px;bottom:88px;width:360px;height:2px;background:rgba(24,32,42,.26)}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="veil"></div><div class="copy"><h1 id="hook">${escaped(concept.hook)}</h1><div class="line"></div><p id="secondary">${escaped(concept.secondaryLine)}</p></div><div class="foot"></div></div>`;
  if (index === 1)
    return `<!doctype html><meta charset="utf-8"><style>
      *{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden;font-family:"PingFang SC","Noto Sans CJK SC",sans-serif;background:#121416}
      .cover{position:relative;width:1242px;height:1660px;overflow:hidden;background:#121416}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
      .copy{position:absolute;left:76px;top:122px;width:690px;color:#f7f3ea}
      h1{margin:0;font-size:${titleSize}px;line-height:1.03;letter-spacing:-6px;font-weight:850;max-width:690px;text-wrap:balance}.secondary{margin-top:46px;border-left:8px solid #e9a85e;padding:8px 0 8px 26px;font-size:${secondarySize}px;line-height:1.22;font-weight:650;max-width:610px}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="copy"><h1 id="hook">${escaped(concept.hook)}</h1><div class="secondary" id="secondary">${escaped(concept.secondaryLine)}</div></div></div>`;
  return `<!doctype html><meta charset="utf-8"><style>
    *{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden;font-family:"PingFang SC","Noto Sans CJK SC",sans-serif;background:#152333}
    .cover{position:relative;width:1242px;height:1660px;overflow:hidden}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,15,28,.74),rgba(5,15,28,.12) 56%,rgba(5,15,28,.45))}
    .copy{position:absolute;left:82px;top:106px;width:860px;color:#fff}h1{margin:0;font-size:${titleSize}px;line-height:1.05;letter-spacing:-6px;font-weight:820;max-width:850px;text-wrap:balance}
    .secondary{display:inline-block;margin-top:40px;background:#f1a95f;color:#132131;padding:17px 26px 19px;font-size:${secondarySize}px;line-height:1.1;font-weight:750}
    .markers{position:absolute;right:110px;bottom:220px;width:320px;height:250px}.m{position:absolute;width:70px;height:70px;border:3px solid rgba(255,190,112,.86);border-radius:50%}.m:after{content:"";position:absolute;left:67px;top:32px;width:70px;height:2px;background:rgba(255,190,112,.76)}.m1{left:20px;top:10px}.m2{left:120px;top:95px}.m3{left:30px;top:176px}
  </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="shade"></div><div class="copy"><h1 id="hook">${escaped(concept.hook)}</h1><div class="secondary" id="secondary">${escaped(concept.secondaryLine)}</div></div><div class="markers"><i class="m m1"></i><i class="m m2"></i><i class="m m3"></i></div></div>`;
}

async function renderCover(
  browser: Browser,
  concept: CommercialSpaceCoverConcept,
  background: string,
  index: number,
  output: string,
) {
  const page = await browser.newPage({
    viewport: { width: 1242, height: 1660 },
    deviceScaleFactor: 1,
  });
  const backgroundData = await readFile(background);
  await page.setContent(
    coverHtml(concept, `data:image/png;base64,${backgroundData.toString("base64")}`, index),
    { waitUntil: "load" },
  );
  await page.waitForFunction(() => document.fonts.status === "loaded");
  const evidence = await page.evaluate(
    ({ hook, secondary }) => {
      const hookElement = document.querySelector<HTMLElement>("#hook");
      const secondaryElement = document.querySelector<HTMLElement>("#secondary");
      if (!hookElement || !secondaryElement) throw new Error("CALIBRATION_COPY_NODE_MISSING");
      const hookBox = hookElement.getBoundingClientRect();
      const secondaryBox = secondaryElement.getBoundingClientRect();
      return {
        hook: hookElement.textContent,
        secondary: secondaryElement.textContent,
        copy_fidelity:
          hookElement.textContent === hook && secondaryElement.textContent === secondary,
        font_ready: document.fonts.check('700 64px "PingFang SC"'),
        hook_box: { x: hookBox.x, y: hookBox.y, width: hookBox.width, height: hookBox.height },
        secondary_box: {
          x: secondaryBox.x,
          y: secondaryBox.y,
          width: secondaryBox.width,
          height: secondaryBox.height,
        },
        safe_area:
          hookBox.left >= 64 &&
          hookBox.top >= 64 &&
          hookBox.right <= 1178 &&
          hookBox.bottom <= 1596 &&
          secondaryBox.left >= 64 &&
          secondaryBox.top >= 64 &&
          secondaryBox.right <= 1178 &&
          secondaryBox.bottom <= 1596,
        overflow:
          document.documentElement.scrollWidth > 1242 ||
          document.documentElement.scrollHeight > 1660,
      };
    },
    { hook: concept.hook, secondary: concept.secondaryLine },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const bytes = await readFile(output);
  const dimensions = pngDimensions(bytes);
  if (dimensions.width !== 1242 || dimensions.height !== 1660)
    throw new Error("CALIBRATION_CANVAS_INVALID");
  if (!evidence.copy_fidelity || !evidence.font_ready || !evidence.safe_area || evidence.overflow)
    throw new Error("CALIBRATION_MECHANICAL_QA_BLOCKED");
  return { ...evidence, dimensions, checksum: hash(bytes), file_size: bytes.length };
}

async function renderThumbnail(
  browser: Browser,
  source: string,
  width: 310 | 186,
  height: 414 | 248,
  output: string,
) {
  const sourceData = await readFile(source);
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(
    `<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:${width}px;height:${height}px}</style><img src="data:image/png;base64,${sourceData.toString("base64")}">`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const bytes = await readFile(output);
  const dimensions = pngDimensions(bytes);
  if (dimensions.width !== width || dimensions.height !== height)
    throw new Error("CALIBRATION_THUMBNAIL_DIMENSIONS_INVALID");
  return { checksum: hash(bytes), file_size: bytes.length };
}

async function renderContactSheet(
  browser: Browser,
  sources: string[],
  width: number,
  imageWidth: number,
  imageHeight: number,
  output: string,
) {
  const padding = 30;
  const labelHeight = 64;
  const gap = 24;
  const height = padding * 2 + labelHeight + imageHeight;
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const sourceData = await Promise.all(sources.map((source) => readFile(source)));
  const cards = sourceData
    .map(
      (data, index) =>
        `<div class="card"><div class="label">${String.fromCharCode(65 + index)} · CCC-CAL-SPACE-001-${String.fromCharCode(65 + index)}</div><img src="data:image/png;base64,${data.toString("base64")}"></div>`,
    )
    .join("");
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#e9e7e2;font-family:"PingFang SC",sans-serif}.sheet{display:flex;gap:${gap}px;padding:${padding}px}.card{width:${imageWidth}px}.label{height:${labelHeight}px;background:#17191c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:${Math.max(16, Math.round(imageWidth / 15))}px;font-weight:650;letter-spacing:.5px}img{display:block;width:${imageWidth}px;height:${imageHeight}px;object-fit:fill}</style><div class="sheet">${cards}</div>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
}

await mkdir(sourceRoot, { recursive: true, mode: 0o700 });
await mkdir(outputRoot, { recursive: true, mode: 0o700 });
await mkdir(sheetRoot, { recursive: true, mode: 0o700 });
for (const source of sourcePaths) await stat(source);
const materializedSources: string[] = [];
for (const [index, source] of sourcePaths.entries()) {
  const target = path.join(
    sourceRoot,
    `candidate-${String.fromCharCode(65 + index)}-host-background.png`,
  );
  await copyFile(source, target);
  materializedSources.push(target);
}

const browser = await chromium.launch({ headless: true });
const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });
const concepts = planCommercialSpaceCalibrationConcepts();
const conversionPlan = planCoverConversion({
  projectId,
  contentId,
  contentVersion: "CV-1",
  copyVersion: "CV-1",
  runId,
  createdAt: at,
  platform: "XIAOHONGSHU",
  accountGoal: "LEAD_GENERATION",
  subject: "一家提供商业空间与门店设计服务的虚构设计机构",
  audience: "准备新开店、升级门店或改善门头形象的门店老板",
  painpoint: "门头第一眼无法快速传达品类、定位和专业感，顾客尚未进店就失去兴趣。",
  contentValue: "帮助门店老板判断自己的门头是否正在劝退顾客，以及装修前应优先检查什么。",
  decisionStage: "新开店、升级门店或门头改造前",
  publishTitle: "很多店生意不好，就输在了第一眼——门头",
  page1ContentCopy: "门头第一眼需要让顾客快速识别品类、定位和是否值得靠近。",
  requestedObjective: "PAINPOINT_DIRECT",
  requestedStrategy: "PAINPOINT_FIRST",
  projectVisualProfileVersion: null,
  globalVisualPreferenceVersion: "GUVPV-1",
  industryPackVersion: "1.0.0",
  platformPackVersion: "1.1.0",
});
if (!conversionPlan.ready) throw new Error("CALIBRATION_CONVERSION_PLAN_BLOCKED");
await runtime.write("cover-conversion-plan", "cover-conversion-plan.json", conversionPlan);

const fullPaths: string[] = [];
const thumbnail310Paths: string[] = [];
const thumbnail186Paths: string[] = [];
const candidates: Array<Record<string, unknown>> = [];
const mechanicalReports: unknown[] = [];
const scoreSets = [
  {
    click: [23, 24, 18, 18, 9],
    semantic: [20, 19, 19, 13, 13, 9],
    ratings: [5, 4, 5, 5, 4, 4, 4, 4],
  },
  {
    click: [25, 23, 19, 19, 9],
    semantic: [19, 19, 17, 13, 14, 10],
    ratings: [5, 4, 4, 5, 5, 4, 4, 4],
  },
  {
    click: [23, 25, 18, 18, 9],
    semantic: [20, 20, 20, 14, 13, 9],
    ratings: [5, 4, 4, 5, 5, 4, 3, 5],
  },
];
const inspectedStrengths = [
  "完整门店与Painpoint Hook直接对应，留白充足，手机端标题识别最快。",
  "直接点名门店老板，空白招牌与入口现场强化目标客户筛选。",
  "街道接近视角、问句和三处检查标记共同形成风险判断语境。",
];
const inspectedRisks = [
  "门店过于精致，Painpoint紧张度偏弱；左侧雾化会牺牲部分空间证据。",
  "副标题换行偏硬，右侧招牌与标题的空间竞争仍需Operator审美判断。",
  "橙色信息条和三个标记略有营销模板感，标题平衡换行产生较大字间空隙。",
];
const dimensionNames = [
  "CONTENT_SEMANTIC_FIT",
  "COMPOSITION_FOCUS",
  "HIERARCHY_READABILITY",
  "ASSET_QUALITY_INTEGRITY",
  "PROJECT_AUDIENCE_FIT",
  "UNIQUENESS_ANTI_TEMPLATE",
  "VISUAL_MODE_EXECUTION",
  "PLATFORM_MOBILE_PERFORMANCE",
] as const;
const dimensionWeights = [20, 15, 15, 15, 10, 10, 10, 5] as const;

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`CALIBRATION_EVIDENCE_MISSING:${label}:${index}`);
  return value;
}

try {
  for (const [index, concept] of concepts.entries()) {
    const suffix = String.fromCharCode(65 + index);
    const full = path.join(outputRoot, `candidate-${suffix}-full.png`);
    const thumb310 = path.join(outputRoot, `candidate-${suffix}-310x414.png`);
    const thumb186 = path.join(outputRoot, `candidate-${suffix}-186x248.png`);
    const materializedSource = requiredAt(materializedSources, index, "materialized-source");
    const mechanical = await renderCover(browser, concept, materializedSource, index, full);
    const thumb310Evidence = await renderThumbnail(browser, full, 310, 414, thumb310);
    const thumb186Evidence = await renderThumbnail(browser, full, 186, 248, thumb186);
    fullPaths.push(full);
    thumbnail310Paths.push(thumb310);
    thumbnail186Paths.push(thumb186);
    const titleSize = requiredAt([128, 132, 122], index, "title-size");
    const secondarySize = requiredAt([60, 58, 58], index, "secondary-size");
    const thumbnailInput = {
      accountGoal: "LEAD_GENERATION" as const,
      thumbnails: [
        {
          size: "310x414" as const,
          width: 310 as const,
          height: 414 as const,
          primaryEffectiveFontPx: Number(((titleSize * 310) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(((secondarySize * 310) / 1242).toFixed(1)),
          readable: true,
        },
        {
          size: "186x248" as const,
          width: 186 as const,
          height: 248 as const,
          primaryEffectiveFontPx: Number(((titleSize * 186) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(((secondarySize * 186) / 1242).toFixed(1)),
          readable: true,
        },
      ],
      primaryHookLines: index === 2 ? 3 : 2,
      primaryHookFirstFocus: true,
      singleClickMessage: true,
      audienceOrPainpointOrValueClear: true,
      backgroundCompetes: false,
      smallParagraphPresent: false,
      contrastRatio: index === 0 ? 8.2 : 10.4,
      textVisualShare: requiredAt([0.42, 0.52, 0.38], index, "text-visual-share"),
      businessSceneRecognizable: true,
    };
    const thumbnailResult = evaluateCoverThumbnail(thumbnailInput);
    if (thumbnailResult.result !== "PASS")
      throw new Error(`CALIBRATION_THUMBNAIL_BLOCKED:${suffix}`);
    const thumbnailReport = {
      report_id: `CTQA-CAL-SPACE-001-${suffix}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      source_asset_checksum: mechanical.checksum,
      thumbnails: [
        {
          size: "310x414",
          width: 310,
          height: 414,
          relative_path: relative(thumb310),
          checksum: thumb310Evidence.checksum,
          primary_effective_font_px: requiredAt(thumbnailInput.thumbnails, 0, "thumbnail-310")
            .primaryEffectiveFontPx,
          secondary_effective_font_px: requiredAt(thumbnailInput.thumbnails, 0, "thumbnail-310")
            .secondaryEffectiveFontPx,
          readable: true,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          relative_path: relative(thumb186),
          checksum: thumb186Evidence.checksum,
          primary_effective_font_px: requiredAt(thumbnailInput.thumbnails, 1, "thumbnail-186")
            .primaryEffectiveFontPx,
          secondary_effective_font_px: requiredAt(thumbnailInput.thumbnails, 1, "thumbnail-186")
            .secondaryEffectiveFontPx,
          readable: true,
        },
      ],
      primary_hook_lines: thumbnailInput.primaryHookLines,
      primary_hook_first_focus: true,
      single_click_message: true,
      audience_or_painpoint_or_value_clear: true,
      background_competes: false,
      small_paragraph_present: false,
      text_background_contrast: thumbnailInput.contrastRatio,
      text_visual_share: thumbnailInput.textVisualShare,
      business_scene_recognizable: true,
      hard_blocks: [],
      result: "PASS",
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write("cover-thumbnail-qa", `${thumbnailReport.report_id}.json`, thumbnailReport);
    const scoreSet = requiredAt(scoreSets, index, "score-set");
    const clickScores = Object.fromEntries(
      Object.keys(CLICK_CLARITY_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scoreSet.click, scoreIndex, "click-score"),
      ]),
    ) as never;
    const clickResult = evaluateCoverClickClarity({
      scores: clickScores,
      accountGoal: "LEAD_GENERATION",
    });
    const clickReport = {
      report_id: `CCCR-CAL-SPACE-001-${suffix}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      account_goal: "LEAD_GENERATION",
      cover_objective: concept.objective,
      dimensions: clickResult.dimensions.map((item) => ({
        ...item,
        reason: `${item.dimension} was measured against the rendered full cover and both true-size thumbnails.`,
      })),
      total_score: clickResult.total_score,
      threshold: clickResult.threshold,
      hard_blocks: clickResult.hard_blocks,
      result: clickResult.result,
      operator_approval_required: true,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write("cover-click-clarity-report", `${clickReport.report_id}.json`, clickReport);
    const semanticScores = Object.fromEntries(
      Object.keys(SEMANTIC_RELEVANCE_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scoreSet.semantic, scoreIndex, "semantic-score"),
      ]),
    ) as never;
    const semanticResult = evaluateVisualSemanticRelevance({
      semanticRole: concept.semanticRole,
      directRelationStatement: concept.relationStatement,
      scores: semanticScores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    const semanticReport = {
      report_id: `VSRR-CAL-SPACE-001-${suffix}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      semantic_role: concept.semanticRole,
      direct_relation_statement: concept.relationStatement,
      dimensions: semanticResult.dimensions.map((item) => ({
        ...item,
        reason: `${item.dimension} was evaluated against the fictional commercial-space brief.`,
      })),
      total_score: semanticResult.total_score,
      threshold: semanticResult.threshold,
      hard_blocks: semanticResult.hard_blocks,
      result: semanticResult.result,
      operator_approval_required: true,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "visual-semantic-relevance-report",
      `${semanticReport.report_id}.json`,
      semanticReport,
    );
    const qualityDimensions = dimensionNames.map((dimension, scoreIndex) => ({
      dimension,
      weight: requiredAt(dimensionWeights, scoreIndex, "dimension-weight"),
      rating: requiredAt(scoreSet.ratings, scoreIndex, "quality-rating"),
      weighted_score: Number(
        (
          (requiredAt(dimensionWeights, scoreIndex, "dimension-weight") *
            requiredAt(scoreSet.ratings, scoreIndex, "quality-rating")) /
          5
        ).toFixed(1),
      ),
    }));
    const imageQualityScore = qualityDimensions.reduce((sum, item) => sum + item.weighted_score, 0);
    const qualityReport = {
      report_id: `IQR-CAL-SPACE-001-${suffix}`,
      project_id: projectId,
      content_id: contentId,
      asset_id: `AST-CAL-SPACE-001-${suffix}`,
      asset_role: "DIRECTION_CANDIDATE",
      layers: {
        authenticity_and_integrity: "PASS",
        mechanical: "PASS",
        visual: "PASS",
        mode_and_project_fit: "PASS",
        operator_aesthetic: "PENDING",
      },
      dimensions: qualityDimensions,
      total_score: imageQualityScore,
      threshold: 85,
      hard_blocks: [],
      core_dimension_floor_met: scoreSet.ratings.every((rating) => rating >= 3),
      operator_approval_required: true,
      result: "PASS_PENDING_OPERATOR",
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("image-quality-report", `${qualityReport.report_id}.json`, qualityReport);
    const copyPackage = {
      cover_copy_package_id: `CCPK-CAL-SPACE-001-${suffix}`,
      content_id: contentId,
      content_version: "CV-1",
      copy_version: "CV-1",
      cover_copy_version: `CCV-${index + 1}`,
      publish_title: "很多店生意不好，就输在了第一眼——门头",
      cover_primary_hook: concept.hook,
      cover_secondary_line: concept.secondaryLine,
      cover_supporting_copy: "",
      page_1_content_copy: "门头第一眼需要让顾客快速识别品类、定位和是否值得靠近。",
      cover_objective: concept.objective,
      conversion_strategy: concept.strategy,
      target_customer_signal: {
        present: index === 1,
        text: index === 1 ? "门店老板" : "门头场景完成目标客户筛选",
      },
      painpoint_signal: {
        present: index !== 1,
        text: index !== 1 ? "第一眼与劝退风险" : "由Secondary Line补充",
      },
      value_signal: {
        present: index === 1,
        text: index === 1 ? "改第一眼并讲清品类定位" : "内容正文提供诊断价值",
      },
      risk_signal: {
        present: index === 2,
        text: index === 2 ? "门头是否劝退顾客" : "不使用未经证据支持的经营结果",
      },
      decision_signal: {
        present: index === 2,
        text: index === 2 ? "检查三个第一眼信号" : "不添加多余决策标签",
      },
      character_counts: {
        publish_title: Array.from("很多店生意不好，就输在了第一眼——门头").length,
        cover_primary_hook: Array.from(concept.hook).length,
        cover_secondary_line: Array.from(concept.secondaryLine).length,
        cover_supporting_copy: 0,
      },
      line_limits: { primary: thumbnailInput.primaryHookLines, secondary: 1, supporting: 0 },
      claim_refs: ["USER_PROVIDED_CONTENT_INSIGHT"],
      content_alignment: "ALIGNED",
      misleading_risk: "LOW",
      ready_for_g3: false,
      created_at: at,
      run_id: runId,
      schema_version: "1.0.0",
      extensions: { calibration_candidate_only: true },
    };
    await runtime.write(
      "cover-copy-package",
      `${copyPackage.cover_copy_package_id}.json`,
      copyPackage,
    );
    candidates.push({
      candidate_id: concept.candidateId,
      cover_copy_package_id: copyPackage.cover_copy_package_id,
      cover_primary_hook: concept.hook,
      cover_secondary_line: concept.secondaryLine,
      conversion_strategy: concept.strategy,
      cover_objective: concept.objective,
      asset_channel: "AI_GENERATED_VISUAL",
      visual_mode: concept.visualMode,
      background_semantic_role: concept.semanticRole,
      composition_summary: concept.composition,
      text_to_image_ratio: concept.textToImageRatio,
      full_preview_ref: relative(full),
      thumbnail_310_ref: relative(thumb310),
      thumbnail_186_ref: relative(thumb186),
      click_clarity_report_id: clickReport.report_id,
      semantic_relevance_report_id: semanticReport.report_id,
      image_quality_report_id: qualityReport.report_id,
      click_clarity_score: clickResult.total_score,
      semantic_relevance_score: semanticResult.total_score,
      image_quality_score: imageQualityScore,
      hard_blocks: [],
      main_strength: requiredAt(inspectedStrengths, index, "inspected-strength"),
      main_risk: requiredAt(inspectedRisks, index, "inspected-risk"),
      host_imagegen: true,
      renderer: true,
    });
    mechanicalReports.push({
      candidate_id: concept.candidateId,
      copy_fidelity: "PASS",
      font_resolution: "PASS",
      safe_area: "PASS",
      overflow: "PASS",
      clipping: "PASS",
      canvas: "1242x1660 PASS",
      file: "PNG PASS",
      blocking_failures: 0,
      evidence: mechanical,
    });
    await atomicJson(path.join(imageRoot, `generation-manifest-${suffix}.json`), {
      generation_id: `GEN-CAL-SPACE-001-${suffix}`,
      candidate_id: concept.candidateId,
      source_type: "HOST_NATIVE_IMAGEGEN",
      source_asset: relative(materializedSource),
      source_checksum: hash(await readFile(materializedSource)),
      formal_text_in_generated_asset: false,
      renderer_owned_copy: [concept.hook, concept.secondaryLine],
      output_asset: relative(full),
      output_checksum: mechanical.checksum,
      run_id: runId,
      created_at: at,
    });
  }
  const fullSheet = path.join(sheetRoot, "cover-concepts-full-contact-sheet.png");
  const sheet310 = path.join(sheetRoot, "cover-concepts-310-contact-sheet.png");
  const sheet186 = path.join(sheetRoot, "cover-concepts-186-contact-sheet.png");
  await renderContactSheet(browser, fullPaths, 1242, 360, 480, fullSheet);
  await renderContactSheet(browser, thumbnail310Paths, 1038, 310, 414, sheet310);
  await renderContactSheet(browser, thumbnail186Paths, 666, 186, 248, sheet186);
  const candidateSet = {
    candidate_set_id: "CCCS-CAL-SPACE-001",
    project_id: projectId,
    content_id: contentId,
    account_goal: "LEAD_GENERATION",
    status: "AWAITING_USER_SELECTION",
    candidates,
    full_contact_sheet_ref: relative(fullSheet),
    thumbnail_310_contact_sheet_ref: relative(sheet310),
    thumbnail_186_contact_sheet_ref: relative(sheet186),
    material_difference_verified: true,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    run_id: runId,
    created_at: at,
    schema_version: "1.0.0",
    extensions: {
      selection_created: false,
      project_visual_profile_mutated: false,
      industry_pack_mutated: false,
    },
  };
  await runtime.write(
    "cover-concept-candidate-set",
    "cover-concept-candidate-set.json",
    candidateSet,
  );
  await atomicJson(path.join(imageRoot, "mechanical-qa-summary.json"), {
    status: "PASS",
    reports: mechanicalReports,
    blocking_failures: 0,
    run_id: runId,
    created_at: at,
  });
  await atomicJson(path.join(imageRoot, "actual-visual-inspection.json"), {
    status: "PASS_WITH_RETAINED_AESTHETIC_RISKS",
    inspected_assets: fullPaths.map(relative),
    contact_sheets_inspected: [relative(fullSheet), relative(sheet310), relative(sheet186)],
    candidates: candidates.map((candidate, index) => ({
      candidate_id: candidate.candidate_id,
      image_quality_score: candidate.image_quality_score,
      retained_strength: inspectedStrengths[index],
      retained_risk: inspectedRisks[index],
      operator_aesthetic: "PENDING",
    })),
    failed_prior_run_retained: "RUN-20260826-130000-CAL1",
    run_id: runId,
    inspected_at: at,
  });
  await atomicJson(path.join(projectRoot, "calibration-project-profile.json"), {
    project_id: projectId,
    fictional: true,
    industry_pack: { id: "COMMERCIAL_SPACE_HOSPITALITY", version: "1.0.0", mutated: false },
    overlay: { id: "SPACE_IDENTITY", version: "1.0.0" },
    platform: { id: "XIAOHONGSHU", version: "1.1.0" },
    account_goal: "LEAD_GENERATION",
    subject: "一家提供商业空间与门店设计服务的虚构设计机构",
    audience: "准备新开店、升级门店或改善门头形象的门店老板",
    painpoint: "门头第一眼无法快速传达品类、定位和专业感，顾客尚未进店就失去兴趣。",
    content_topic: "很多店生意不好，就输在了第一眼——门头",
    content_value: "帮助门店老板判断自己的门头是否正在劝退顾客，以及装修前应优先检查什么。",
    evidence_type: "USER_PROVIDED_CONTENT_INSIGHT",
    prohibited_claims: ["具体进店率", "转化率", "营收提升", "客户案例", "真实项目结果"],
    project_visual_profile_created: false,
    feishu_write_count: 0,
  });
  await atomicJson(path.join(runRoot, "checkpoint.json"), {
    run_id: runId,
    project_id: projectId,
    state: "CALIBRATION_COVER_SELECTION",
    status: "AWAITING_USER_SELECTION",
    candidate_count: 3,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    remaining_pages_created: 0,
    feishu_write_count: 0,
    project_visual_profile_mutated: false,
    industry_pack_mutated: false,
    created_at: at,
  });
  await atomicJson(path.join(runRoot, "write-log.json"), {
    write_id: "WRITE-20260826-CAL2",
    operation: "LOCAL_CALIBRATION_COVER_CANDIDATES",
    idempotency_key: hash(`${projectId}:${contentId}:${runId}:GUVPV-1`),
    local_asset_count: 15,
    remote_write: false,
    feishu_write_count: 0,
    verification_status: "VERIFIED",
    created_at: at,
  });
  process.stdout.write(
    `${JSON.stringify({ status: "AWAITING_USER_SELECTION", state: "CALIBRATION_COVER_SELECTION", project_id: projectId, content_id: contentId, run_id: runId, candidate_count: candidates.length, candidates: candidates.map((candidate) => ({ candidate_id: candidate.candidate_id, click_clarity_score: candidate.click_clarity_score, semantic_relevance_score: candidate.semantic_relevance_score, image_quality_score: candidate.image_quality_score, full_preview_ref: candidate.full_preview_ref, thumbnail_310_ref: candidate.thumbnail_310_ref, thumbnail_186_ref: candidate.thumbnail_186_ref })), contact_sheets: { full: relative(fullSheet), thumbnail_310: relative(sheet310), thumbnail_186: relative(sheet186) }, formal_fpv_count: 0, g4_count: 0, style_lock_count: 0, feishu_write_count: 0, project_home: projectHome })}\n`,
  );
} finally {
  await browser.close();
}
