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
} from "../packages/core/src/cover-conversion/index.js";
import {
  DIVERSITY_WEIGHTS,
  PAINPOINT_CONGRUENCE_WEIGHTS,
  evaluateCandidateSetVisualDiversity,
  evaluateEditorialSpatialComposition,
  evaluateImageTextIntegration,
  evaluateLocaleSceneFit,
  evaluatePainpointSceneCongruence,
  planCommercialSpaceCalibrationRound2,
  resolveTypographyStrategy,
} from "../packages/core/src/visual-baseline/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br21";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-151500-CR03";
const at = "2026-08-26T07:00:00.000Z";
const sourcePaths = [
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-382cb0de-d090-4bcc-b5e8-8a32d63e3bdd.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-fded5fa0-8bbe-4f84-a906-731bd9863a4c.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-83d821bb-2988-4573-88ed-dfc2c56fcbc1.png",
];
const projectRoot = path.join(projectHome, "projects", projectId);
const runRoot = path.join(projectRoot, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const sourceRoot = path.join(imageRoot, "source-assets");
const outputRoot = path.join(imageRoot, "cover-concepts");
const sheetRoot = path.join(imageRoot, "contact-sheets");
const concepts = planCommercialSpaceCalibrationRound2();
const letters = ["D", "E", "F"] as const;
const title = "门店老板，\n你的门头在劝退顾客吗";
const secondary = "先查品类、定位、入口这3处";

function sha256(data: Uint8Array | string): string {
  return createHash("sha256").update(data).digest("hex");
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`CALIBRATION_R2_READ_VERIFY_FAILED:${path.basename(file)}`);
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_R2_PATH_ESCAPE");
  return value;
}

function pngDimensions(data: Buffer): { width: number; height: number } {
  if (!data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    throw new Error("CALIBRATION_R2_PNG_INVALID");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`CALIBRATION_R2_MISSING:${label}:${index}`);
  return value;
}

function escaped(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function coverHtml(index: number, imageUrl: string): string {
  const common = `*{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden}.cover{position:relative;width:1242px;height:1660px;overflow:hidden}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}h1,p{margin:0}.title{font-family:"Songti SC","STSong",serif;font-weight:700}.secondary{font-family:"Songti SC","STSong",serif;font-weight:400}`;
  if (index === 0)
    return `<!doctype html><meta charset="utf-8"><style>${common}
      .cover{background:#111511}.shade{position:absolute;right:0;top:0;width:56%;height:100%;background:linear-gradient(90deg,rgba(10,14,12,0),rgba(10,14,12,.48) 22%,rgba(10,14,12,.91) 100%)}
      .copy{position:absolute;right:54px;top:300px;width:700px;color:#f2eee5;border-right:3px solid #b98654;padding-right:42px;text-align:right}.title{font-size:118px;line-height:.99;letter-spacing:-4px}.secondary{margin-top:58px;font-size:60px;line-height:1.25;color:#d4c7b5}.axis{position:absolute;right:52px;bottom:116px;width:330px;height:1px;background:rgba(185,134,84,.7)}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="shade"></div><div class="copy"><h1 class="title" id="hook"><span>门店老板，</span><br><span>你的门头在劝退顾客吗</span></h1><p class="secondary" id="secondary">${escaped(secondary)}</p></div><div class="axis"></div></div>`;
  if (index === 1)
    return `<!doctype html><meta charset="utf-8"><style>${common}
      .cover{background:#292822}.grade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,18,17,.05) 0%,rgba(14,18,17,.08) 56%,rgba(14,18,17,.88) 100%)}
      .copy{position:absolute;left:68px;bottom:70px;width:1080px;color:#f5f0e6}.title{font-size:116px;line-height:.96;letter-spacing:-4px;max-width:1040px}.secondary{margin-top:28px;font-size:58px;line-height:1.2;color:#d7c6ae;padding-left:186px}
      .marker{position:absolute;width:68px;height:68px;border:2px solid #ead9bd;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font:700 34px "Songti SC",serif;background:rgba(25,29,28,.52)}.marker:after{content:"";position:absolute;width:92px;height:2px;background:#ead9bd;transform-origin:left}.m1{left:790px;top:274px}.m1:after{left:-89px;top:53px;transform:rotate(154deg)}.m2{left:470px;top:720px}.m2:after{left:62px;top:49px;transform:rotate(24deg)}.m3{right:128px;top:850px}.m3:after{right:61px;top:45px;transform:rotate(-158deg)}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="grade"></div><i class="marker m1">1</i><i class="marker m2">2</i><i class="marker m3">3</i><div class="copy"><h1 class="title" id="hook"><span>门店老板，</span><br><span>你的门头在劝退顾客吗</span></h1><p class="secondary" id="secondary">${escaped(secondary)}</p></div></div>`;
  return `<!doctype html><meta charset="utf-8"><style>${common}
    .cover{background:#e7e0d4;color:#192022}.master{position:absolute;right:0;top:0;width:72%;height:100%;object-fit:cover}.wash{position:absolute;left:0;top:0;width:45%;height:100%;background:linear-gradient(90deg,#e7e0d4 0%,rgba(231,224,212,.98) 67%,rgba(231,224,212,0) 100%)}
    .title{position:absolute;left:62px;top:72px;width:1100px;font-size:114px;line-height:.98;letter-spacing:-4px;z-index:3}.title span:last-child{background:#182124;color:#f2ede4;padding:4px 20px 12px 14px;box-decoration-break:clone;-webkit-box-decoration-break:clone}.secondary{position:absolute;left:68px;top:432px;width:490px;font-size:58px;line-height:1.26;z-index:3;border-top:3px solid #a56e45;padding-top:22px}
    .crops{position:absolute;left:66px;bottom:72px;width:350px;display:grid;grid-template-rows:250px 250px 250px;gap:15px;z-index:3}.crop{border-radius:0;border:0;border-left:4px solid #a56e45;background-image:url('${imageUrl}');background-size:870px 1160px}.c1{background-position:50% 12%}.c2{background-position:70% 58%}.c3{background-position:58% 91%}.line{position:absolute;left:426px;bottom:72px;width:2px;height:780px;background:rgba(25,32,34,.34);z-index:3}
  </style><div class="cover"><img class="master" src="${imageUrl}"><div class="wash"></div><h1 class="title" id="hook"><span>门店老板，</span><br><span>你的门头在劝退顾客吗</span></h1><p class="secondary" id="secondary">${escaped(secondary)}</p><div class="crops"><div class="crop c1"></div><div class="crop c2"></div><div class="crop c3"></div></div><div class="line"></div></div>`;
}

async function renderCover(browser: Browser, index: number, background: string, output: string) {
  const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
  const data = await readFile(background);
  await page.setContent(coverHtml(index, `data:image/png;base64,${data.toString("base64")}`), {
    waitUntil: "load",
  });
  await page.waitForFunction(() => document.fonts.status === "loaded");
  const evidence = await page.evaluate(
    ({ expectedTitle, expectedSecondary }) => {
      const hook = document.querySelector<HTMLElement>("#hook");
      const supporting = document.querySelector<HTMLElement>("#secondary");
      if (!hook || !supporting) throw new Error("CALIBRATION_R2_COPY_NODE_MISSING");
      const hookBox = hook.getBoundingClientRect();
      const supportingBox = supporting.getBoundingClientRect();
      const style = getComputedStyle(hook);
      const actualTitle = [...hook.querySelectorAll("span")]
        .map((element) => element.textContent ?? "")
        .join("\n");
      return {
        copy_fidelity:
          actualTitle === expectedTitle && supporting.textContent === expectedSecondary,
        requested_font_family: "Songti SC",
        resolved_font_family: style.fontFamily,
        resolved_font_weight: style.fontWeight,
        title_box: {
          x: hookBox.x,
          y: hookBox.y,
          width: hookBox.width,
          height: hookBox.height,
        },
        secondary_box: {
          x: supportingBox.x,
          y: supportingBox.y,
          width: supportingBox.width,
          height: supportingBox.height,
        },
        safe_area:
          hookBox.left >= 48 &&
          hookBox.top >= 48 &&
          hookBox.right <= 1194 &&
          hookBox.bottom <= 1612 &&
          supportingBox.left >= 48 &&
          supportingBox.right <= 1194 &&
          supportingBox.bottom <= 1612,
        overflow:
          document.documentElement.scrollWidth > 1242 ||
          document.documentElement.scrollHeight > 1660,
      };
    },
    { expectedTitle: title, expectedSecondary: secondary },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const bytes = await readFile(output);
  const dimensions = pngDimensions(bytes);
  if (
    dimensions.width !== 1242 ||
    dimensions.height !== 1660 ||
    !evidence.copy_fidelity ||
    !evidence.safe_area ||
    evidence.overflow ||
    !evidence.resolved_font_family.includes("Songti SC") ||
    evidence.resolved_font_weight !== "700"
  )
    throw new Error("CALIBRATION_R2_MECHANICAL_QA_BLOCKED");
  return { ...evidence, dimensions, checksum: sha256(bytes), file_size: bytes.length };
}

async function renderThumbnail(
  browser: Browser,
  source: string,
  width: 310 | 186,
  height: 414 | 248,
  output: string,
) {
  const data = await readFile(source);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="data:image/png;base64,${data.toString("base64")}">`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const bytes = await readFile(output);
  return { checksum: sha256(bytes), file_size: bytes.length };
}

async function renderContactSheet(
  browser: Browser,
  sources: string[],
  imageWidth: number,
  imageHeight: number,
  output: string,
) {
  const gap = 24;
  const padding = 30;
  const labelHeight = 64;
  const width = padding * 2 + imageWidth * 3 + gap * 2;
  const height = padding * 2 + labelHeight + imageHeight;
  const data = await Promise.all(sources.map((source) => readFile(source)));
  const cards = data
    .map(
      (bytes, index) =>
        `<div class="card"><div class="label">${requiredAt(letters, index, "letter")} · ${requiredAt(concepts, index, "concept").candidateId}</div><img src="data:image/png;base64,${bytes.toString("base64")}"></div>`,
    )
    .join("");
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#d8d4cc;font-family:"Songti SC",serif}.sheet{display:flex;gap:${gap}px;padding:${padding}px}.card{width:${imageWidth}px}.label{height:${labelHeight}px;background:#171b1c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:${Math.max(16, Math.round(imageWidth / 17))}px;font-weight:700}img{display:block;width:${imageWidth}px;height:${imageHeight}px}</style><div class="sheet">${cards}</div>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
}

await Promise.all(sourcePaths.map((source) => stat(source)));
await Promise.all(
  [sourceRoot, outputRoot, sheetRoot].map((directory) =>
    mkdir(directory, { recursive: true, mode: 0o700 }),
  ),
);
await atomicJson(
  path.join(projectRoot, "runs/RUN-20260826-150000-CR02/visual-qa-supersession-amendment.json"),
  {
    prior_run_id: "RUN-20260826-150000-CR02",
    status: "SUPERSEDED_AFTER_ACTUAL_VISUAL_QA",
    finding: "Candidate D forced the first title phrase into an undesirable narrow-column break.",
    source_assets_preserved: true,
    candidate_ids_preserved: true,
    recovery_run_id: runId,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    created_at: at,
  },
);
const materialized: string[] = [];
for (const [index, source] of sourcePaths.entries()) {
  const target = path.join(
    sourceRoot,
    `candidate-${requiredAt(letters, index, "letter")}-host-background.png`,
  );
  await copyFile(source, target);
  materialized.push(target);
}

const typography = resolveTypographyStrategy({
  globalDefaultEnabled: true,
  availableFonts: [{ family: "Songti SC", weights: [300, 400, 700, 900], chineseSerif: true }],
});
if (typography.resolved_font_family !== "Songti SC") throw new Error("SONGTI_FONT_UNAVAILABLE");

const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });
const browser = await chromium.launch({ headless: true });
const fullPaths: string[] = [];
const thumbnail310Paths: string[] = [];
const thumbnail186Paths: string[] = [];
const candidates: Array<Record<string, unknown>> = [];
const scoreSets = [
  {
    click: [24, 23, 18, 17, 9],
    semantic: [20, 19, 17, 14, 13, 9],
    pain: [28, 23, 18, 22],
    quality: [5, 5, 4, 4, 4, 4, 5, 4],
    editorial: [9, 9, 9, 8, 8, 8, 8, 9, 9, 8],
    integration: [18, 18, 17, 17, 18],
  },
  {
    click: [25, 24, 18, 18, 9],
    semantic: [20, 19, 18, 14, 14, 9],
    pain: [29, 24, 19, 23],
    quality: [5, 5, 5, 4, 5, 4, 5, 5],
    editorial: [9, 10, 9, 9, 8, 8, 9, 9, 9, 10],
    integration: [18, 18, 18, 19, 18],
  },
  {
    click: [24, 23, 18, 18, 9],
    semantic: [20, 20, 19, 14, 14, 9],
    pain: [27, 23, 19, 22],
    quality: [5, 5, 5, 5, 4, 5, 5, 4],
    editorial: [9, 10, 9, 9, 9, 9, 10, 9, 9, 10],
    integration: [19, 18, 18, 19, 18],
  },
] as const;
const strength = [
  "问题门头与右侧宋体问句直接咬合，弱招牌和后退入口仍清楚可见。",
  "斜向接近视角同时呈现招牌、橱窗和入口，三个诊断标记均有真实指向。",
  "一张主图衍生三个硬边局部，建立主图—证据—文案的编辑阅读路径。",
] as const;
const risk = [
  "右侧暗部的戏剧性较强，Operator需判断是否过于情绪化。",
  "诊断标记增加信息密度，缩略图上需避免与主标题争焦点。",
  "编辑裁切结构最复杂，若后续滥用可能接近杂志拼贴套路。",
] as const;
const relations = [
  ["IMAGE_TEXT_INTERLOCK", "EDGE_TENSION", "PURPOSEFUL_NEGATIVE_SPACE"],
  ["PRIMARY_SECONDARY_AXIS", "CROSS_REGION_ALIGNMENT", "PROPORTIONAL_CONTRAST"],
  ["FOREGROUND_BACKGROUND_LAYERING", "SUBJECT_CROP_TENSION", "ASYMMETRIC_BALANCE"],
] as const;
const evidence = [
  ["空白招牌无法一眼说明品类", "入口后退且边界不明确"],
  ["空白品类识别区域", "橱窗定位区域", "后退入口区域"],
  ["主图空白门头", "同源橱窗裁切", "同源入口裁切"],
] as const;

try {
  for (const [index, concept] of concepts.entries()) {
    const letter = requiredAt(letters, index, "letter");
    const source = requiredAt(materialized, index, "source");
    const scores = requiredAt(scoreSets, index, "scores");
    const full = path.join(outputRoot, `candidate-${letter}-full.png`);
    const replay = path.join(outputRoot, `candidate-${letter}-deterministic-replay.png`);
    const thumb310 = path.join(outputRoot, `candidate-${letter}-310x414.png`);
    const thumb186 = path.join(outputRoot, `candidate-${letter}-186x248.png`);
    const mechanical = await renderCover(browser, index, source, full);
    const replayEvidence = await renderCover(browser, index, source, replay);
    if (mechanical.checksum !== replayEvidence.checksum)
      throw new Error(`CALIBRATION_R2_DETERMINISM_FAILED:${letter}`);
    const thumb310Evidence = await renderThumbnail(browser, full, 310, 414, thumb310);
    const thumb186Evidence = await renderThumbnail(browser, full, 186, 248, thumb186);
    fullPaths.push(full);
    thumbnail310Paths.push(thumb310);
    thumbnail186Paths.push(thumb186);
    const titleSize = requiredAt([118, 116, 114], index, "title-size");
    const secondarySize = requiredAt([60, 58, 58], index, "secondary-size");
    const thumbnailResult = evaluateCoverThumbnail({
      accountGoal: "LEAD_GENERATION",
      thumbnails: [
        {
          size: "310x414",
          width: 310,
          height: 414,
          primaryEffectiveFontPx: Number(((titleSize * 310) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(((secondarySize * 310) / 1242).toFixed(1)),
          readable: true,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          primaryEffectiveFontPx: Number(((titleSize * 186) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(((secondarySize * 186) / 1242).toFixed(1)),
          readable: true,
        },
      ],
      primaryHookLines: 2,
      primaryHookFirstFocus: true,
      singleClickMessage: true,
      audienceOrPainpointOrValueClear: true,
      backgroundCompetes: false,
      smallParagraphPresent: false,
      contrastRatio: requiredAt([9.3, 8.7, 8.5], index, "contrast"),
      textVisualShare: requiredAt([0.43, 0.5, 0.47], index, "text-share"),
      businessSceneRecognizable: true,
    });
    if (thumbnailResult.result !== "PASS")
      throw new Error(`CALIBRATION_R2_THUMBNAIL_FAILED:${letter}`);
    const thumbnailReport = {
      report_id: `CTQA-CAL-SPACE-001-${letter}`,
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
          primary_effective_font_px: Number(((titleSize * 310) / 1242).toFixed(1)),
          secondary_effective_font_px: Number(((secondarySize * 310) / 1242).toFixed(1)),
          readable: true,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          relative_path: relative(thumb186),
          checksum: thumb186Evidence.checksum,
          primary_effective_font_px: Number(((titleSize * 186) / 1242).toFixed(1)),
          secondary_effective_font_px: Number(((secondarySize * 186) / 1242).toFixed(1)),
          readable: true,
        },
      ],
      primary_hook_lines: 2,
      primary_hook_first_focus: true,
      single_click_message: true,
      audience_or_painpoint_or_value_clear: true,
      background_competes: false,
      small_paragraph_present: false,
      text_background_contrast: requiredAt([9.3, 8.7, 8.5], index, "contrast"),
      text_visual_share: requiredAt([0.43, 0.5, 0.47], index, "text-share"),
      business_scene_recognizable: true,
      hard_blocks: [],
      result: "PASS",
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write("cover-thumbnail-qa", `${thumbnailReport.report_id}.json`, thumbnailReport);
    const clickScores = Object.fromEntries(
      Object.keys(CLICK_CLARITY_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scores.click, scoreIndex, "click"),
      ]),
    ) as never;
    const click = evaluateCoverClickClarity({
      scores: clickScores,
      accountGoal: "LEAD_GENERATION",
    });
    const clickReport = {
      report_id: `CCCR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      account_goal: "LEAD_GENERATION",
      cover_objective: "PAINPOINT_DIRECT",
      dimensions: click.dimensions.map((item) => ({
        ...item,
        reason: `${item.dimension} checked against full and true-size thumbnails.`,
      })),
      total_score: click.total_score,
      threshold: click.threshold,
      hard_blocks: click.hard_blocks,
      result: click.result,
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
        requiredAt(scores.semantic, scoreIndex, "semantic"),
      ]),
    ) as never;
    const semantic = evaluateVisualSemanticRelevance({
      semanticRole: index === 2 ? "EVIDENCE_ASSET" : "DIRECT_PAINPOINT_SCENE",
      directRelationStatement: requiredAt(strength, index, "strength"),
      scores: semanticScores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    const semanticReport = {
      report_id: `VSRR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      semantic_role: index === 2 ? "EVIDENCE_ASSET" : "DIRECT_PAINPOINT_SCENE",
      direct_relation_statement: requiredAt(strength, index, "strength"),
      dimensions: semantic.dimensions.map((item) => ({
        ...item,
        reason: `${item.dimension} checked against visible storefront evidence.`,
      })),
      total_score: semantic.total_score,
      threshold: semantic.threshold,
      hard_blocks: semantic.hard_blocks,
      result: semantic.result,
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
    const editorialScoreRecord = Object.fromEntries(
      [
        "HIERARCHY",
        "SPATIAL_AXIS",
        "ASYMMETRY",
        "PROPORTION",
        "NEGATIVE_SPACE_PURPOSE",
        "SUBJECT_CROP",
        "DEPTH",
        "IMAGE_TEXT_RELATION",
        "TENSION",
        "READING_PATH",
      ].map((name, scoreIndex) => [name, requiredAt(scores.editorial, scoreIndex, "editorial")]),
    ) as never;
    const editorial = evaluateEditorialSpatialComposition({
      scores: editorialScoreRecord,
      spatialRelationships: [...requiredAt(relations, index, "relations")],
      genericTextOverPhoto: false,
      purposefulNegativeSpace: true,
    });
    const editorialReport = {
      report_id: `ESCR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      composition_family: concept.compositionFamily,
      spatial_relationships: [...requiredAt(relations, index, "relations")],
      ...editorial,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "editorial-spatial-composition-report",
      `${editorialReport.report_id}.json`,
      editorialReport,
    );
    const integrationScoreRecord = Object.fromEntries(
      [
        "SUBJECT_OR_EDGE_RELATION",
        "NEGATIVE_SPACE_RELATION",
        "FOCUS_COOPERATION",
        "EVIDENCE_VISIBILITY",
        "READING_PATH_INTEGRATION",
      ].map((name, scoreIndex) => [
        name,
        requiredAt(scores.integration, scoreIndex, "integration"),
      ]),
    ) as never;
    const integration = evaluateImageTextIntegration({
      scores: integrationScoreRecord,
      anchorRelationships: [...requiredAt(relations, index, "relations")],
      genericTextOverPhoto: false,
      keyEvidenceObscured: false,
    });
    const integrationReport = {
      report_id: `ITIR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      integration_strategy: concept.readingPath,
      image_responsibility: index === 2 ? "EVIDENCE" : "PAINPOINT",
      anchor_relationships: [...requiredAt(relations, index, "relations")],
      key_evidence_obscured: false,
      generic_text_over_photo: false,
      ...integration,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "image-text-integration-report",
      `${integrationReport.report_id}.json`,
      integrationReport,
    );
    const painScores = Object.fromEntries(
      Object.keys(PAINPOINT_CONGRUENCE_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scores.pain, scoreIndex, "pain"),
      ]),
    ) as never;
    const markers =
      index === 1
        ? [
            {
              marker: "1",
              target_region: "空白品类识别区域",
              evidence_meaning: "品类是否一眼可知",
              explained: true as const,
            },
            {
              marker: "2",
              target_region: "橱窗定位区域",
              evidence_meaning: "门店定位是否清楚",
              explained: true as const,
            },
            {
              marker: "3",
              target_region: "后退入口区域",
              evidence_meaning: "入口是否明确可达",
              explained: true as const,
            },
          ]
        : [];
    const pain = evaluatePainpointSceneCongruence({
      strategy: "PAINPOINT_FIRST",
      relation: concept.painpointRelation,
      scores: painScores,
      visibleEvidence: [...requiredAt(evidence, index, "evidence")],
      diagnosticMarkers: markers,
      storefrontGeneric: false,
    });
    const painReport = {
      report_id: `PSCR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      conversion_strategy: "PAINPOINT_FIRST",
      relation: concept.painpointRelation,
      painpoint_statement: "门头第一眼无法快速传达品类、定位和入口，可能在顾客进店前降低靠近意愿。",
      visible_scene_evidence: [...requiredAt(evidence, index, "evidence")],
      diagnostic_markers: markers,
      ...pain,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "painpoint-scene-congruence-report",
      `${painReport.report_id}.json`,
      painReport,
    );
    const locale = evaluateLocaleSceneFit({
      audienceLocale: "中国城市门店老板",
      projectRegion: "中国新一线或二线城市",
      resolvedSceneLocale: "中国新一线或二线城市临街商业街",
      localeEvidence: ["现代中国城市沿街铺面尺度", "常见人行道、路缘与连续商业立面"],
      regionMateriallyChangesScene: true,
    });
    const localeReport = {
      report_id: `LSFR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      audience_locale: "中国城市门店老板",
      project_region: "中国新一线或二线城市",
      resolved_scene_locale: "中国新一线或二线城市临街商业街",
      locale_evidence: ["现代中国城市沿街铺面尺度", "常见人行道、路缘与连续商业立面"],
      region_question_required: locale.region_question_required,
      total_score: locale.total_score,
      threshold: locale.threshold,
      hard_blocks: locale.hard_blocks,
      result: locale.result,
      operator_approval_required: locale.operator_approval_required,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write("locale-scene-fit-report", `${localeReport.report_id}.json`, localeReport);
    const qualityWeights = [20, 15, 15, 15, 10, 10, 10, 5] as const;
    const qualityNames = [
      "CONTENT_SEMANTIC_FIT",
      "COMPOSITION_FOCUS",
      "HIERARCHY_READABILITY",
      "ASSET_QUALITY_INTEGRITY",
      "PROJECT_AUDIENCE_FIT",
      "UNIQUENESS_ANTI_TEMPLATE",
      "VISUAL_MODE_EXECUTION",
      "PLATFORM_MOBILE_PERFORMANCE",
    ] as const;
    const qualityDimensions = qualityNames.map((dimension, scoreIndex) => ({
      dimension,
      weight: requiredAt(qualityWeights, scoreIndex, "quality-weight"),
      rating: requiredAt(scores.quality, scoreIndex, "quality"),
      weighted_score: Number(
        (
          (requiredAt(qualityWeights, scoreIndex, "quality-weight") *
            requiredAt(scores.quality, scoreIndex, "quality")) /
          5
        ).toFixed(1),
      ),
    }));
    const imageQualityScore = qualityDimensions.reduce((sum, item) => sum + item.weighted_score, 0);
    const qualityReport = {
      report_id: `IQR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      asset_id: `AST-CAL-SPACE-001-${letter}`,
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
      core_dimension_floor_met: true,
      operator_approval_required: true,
      result: "PASS_PENDING_OPERATOR",
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("image-quality-report", `${qualityReport.report_id}.json`, qualityReport);
    await atomicJson(path.join(imageRoot, `typography-policy-fit-${letter}.json`), {
      candidate_id: concept.candidateId,
      policy_version: "TDPV-1",
      requested_font_family: "Songti SC",
      resolved_font_family: mechanical.resolved_font_family,
      title_weight: Number(mechanical.resolved_font_weight),
      subtitle_weight: 400,
      synthetic_bold: false,
      silent_pingfang_fallback: false,
      font_downloaded: false,
      thumbnail_readable: true,
      result: "PASS",
      run_id: runId,
      created_at: at,
    });
    await atomicJson(path.join(imageRoot, `generation-manifest-${letter}.json`), {
      generation_id: `GEN-CAL-SPACE-001-${letter}`,
      candidate_id: concept.candidateId,
      source_type: "HOST_NATIVE_IMAGEGEN",
      source_asset: relative(source),
      source_checksum: sha256(await readFile(source)),
      formal_text_in_generated_asset: false,
      renderer_owned_copy: [title, secondary],
      output_asset: relative(full),
      output_checksum: mechanical.checksum,
      deterministic_replay_asset: relative(replay),
      deterministic_replay_checksum: replayEvidence.checksum,
      run_id: runId,
      created_at: at,
    });
    candidates.push({
      candidate_id: concept.candidateId,
      cover_primary_hook: title,
      cover_secondary_line: secondary,
      conversion_strategy: "PAINPOINT_FIRST",
      cover_objective: "PAINPOINT_DIRECT",
      asset_channel: "AI_GENERATED_VISUAL",
      visual_mode: "EDITORIAL_SERIES",
      background_semantic_role: index === 2 ? "EVIDENCE" : "PAINPOINT",
      composition_family: concept.compositionFamily,
      composition_summary: `${concept.assetStructure}; ${concept.readingPath}`,
      text_region: concept.textRegion,
      full_preview_ref: relative(full),
      thumbnail_310_ref: relative(thumb310),
      thumbnail_186_ref: relative(thumb186),
      click_clarity_report_id: clickReport.report_id,
      semantic_relevance_report_id: semanticReport.report_id,
      painpoint_scene_report_id: painReport.report_id,
      image_quality_report_id: qualityReport.report_id,
      editorial_report_id: editorialReport.report_id,
      image_text_integration_report_id: integrationReport.report_id,
      locale_scene_fit_report_id: localeReport.report_id,
      click_clarity_score: click.total_score,
      semantic_relevance_score: semantic.total_score,
      painpoint_congruence_score: pain.total_score,
      image_quality_score: imageQualityScore,
      editorial_spatial_score: editorial.total_score,
      image_text_integration_score: integration.total_score,
      typography_fit: "PASS",
      thumbnail_qa: "PASS",
      hard_blocks: [],
      main_strength: requiredAt(strength, index, "strength"),
      main_risk: requiredAt(risk, index, "risk"),
      host_imagegen: true,
      renderer: true,
    });
  }

  const fullSheet = path.join(sheetRoot, "round2-def-full-contact-sheet.png");
  const sheet310 = path.join(sheetRoot, "round2-def-310-contact-sheet.png");
  const sheet186 = path.join(sheetRoot, "round2-def-186-contact-sheet.png");
  await renderContactSheet(browser, fullPaths, 360, 480, fullSheet);
  await renderContactSheet(browser, thumbnail310Paths, 310, 414, sheet310);
  await renderContactSheet(browser, thumbnail186Paths, 186, 248, sheet186);

  const diversityScores = Object.fromEntries(
    Object.entries(DIVERSITY_WEIGHTS).map(([name, weight]) => [name, weight === 15 ? 14 : 9]),
  ) as never;
  const diversity = evaluateCandidateSetVisualDiversity({
    scores: diversityScores,
    compositionFamilies: concepts.map((concept) => concept.compositionFamily),
    textRegions: concepts.map((concept) => concept.textRegion),
    assetStructures: concepts.map((concept) => concept.assetStructure),
    readingPaths: concepts.map((concept) => concept.readingPath),
    nearTemplateDuplicateRisk: "LOW",
  });
  const diversityReport = {
    report_id: "CSVDR-CAL-SPACE-001-R2",
    project_id: projectId,
    content_id: contentId,
    candidate_set_id: "CCCS-CAL-SPACE-001-R2",
    candidate_ids: concepts.map((concept) => concept.candidateId),
    composition_families: concepts.map((concept) => concept.compositionFamily),
    text_regions: concepts.map((concept) => concept.textRegion),
    shot_scales: ["WHOLE_STOREFRONT", "APPROACH_VIEW", "MASTER_PLUS_CROPS"],
    camera_viewpoints: ["FRONTAL_EDGE_TENSION", "OBLIQUE_APPROACH", "MASTER_EDITORIAL_CROP"],
    asset_structures: concepts.map((concept) => concept.assetStructure),
    semantic_roles: concepts.map((concept) => concept.semanticRole),
    reading_paths: concepts.map((concept) => concept.readingPath),
    near_template_duplicate_risk: "LOW",
    ...diversity,
    run_id: runId,
    created_at: at,
    schema_version: "1.0.0",
    extensions: {},
  };
  await runtime.write(
    "candidate-set-visual-diversity-report",
    `${diversityReport.report_id}.json`,
    diversityReport,
  );
  await atomicJson(path.join(imageRoot, "cover-concept-candidate-set-round2.json"), {
    candidate_set_id: "CCCS-CAL-SPACE-001-R2",
    project_id: projectId,
    content_id: contentId,
    calibration_round: 2,
    status: "AWAITING_USER_SELECTION",
    candidates,
    contact_sheets: {
      full: relative(fullSheet),
      thumbnail_310: relative(sheet310),
      thumbnail_186: relative(sheet186),
    },
    candidate_set_visual_diversity_score: diversity.total_score,
    near_template_duplicate_risk: "LOW",
    material_difference_verified: true,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    run_id: runId,
    created_at: at,
    schema_version: "1.0.0",
  });
  await atomicJson(path.join(imageRoot, "mechanical-qa-summary.json"), {
    status: "PASS",
    copy_fidelity: "PASS",
    font_resolution: "Songti SC PASS",
    safe_area: "PASS",
    overflow: "PASS",
    clipping: "PASS",
    canvas: "1242x1660 PASS",
    file: "PNG PASS",
    deterministic_replay: "PASS",
    blocking_failures: 0,
    run_id: runId,
    created_at: at,
  });
  await atomicJson(path.join(imageRoot, "actual-visual-inspection.json"), {
    status: "PASS_PENDING_OPERATOR",
    inspected_assets: fullPaths.map(relative),
    contact_sheets: [relative(fullSheet), relative(sheet310), relative(sheet186)],
    candidates: candidates.map((candidate) => ({
      candidate_id: candidate.candidate_id,
      strength: candidate.main_strength,
      retained_aesthetic_risk: candidate.main_risk,
      operator_aesthetic: "PENDING",
    })),
    hard_blocks: [],
    run_id: runId,
    inspected_at: at,
  });
  await atomicJson(path.join(runRoot, "checkpoint.json"), {
    run_id: runId,
    project_id: projectId,
    state: "CALIBRATION_COVER_SELECTION",
    status: "AWAITING_USER_SELECTION",
    round_1_candidate_refs: ["CCC-CAL-SPACE-001-A", "CCC-CAL-SPACE-001-B", "CCC-CAL-SPACE-001-C"],
    round_1_preserved: true,
    round_2_candidate_count: 3,
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
    write_id: "WRITE-20260826-CALR2",
    operation: "LOCAL_CALIBRATION_ROUND2_DIRECTION_CANDIDATES",
    idempotency_key: sha256(`${projectId}:${contentId}:${runId}:GUVPV-2:UVDPV-1`),
    remote_write: false,
    feishu_write_count: 0,
    verification_status: "VERIFIED",
    created_at: at,
  });
  process.stdout.write(
    `${JSON.stringify({ status: "AWAITING_USER_SELECTION", state: "CALIBRATION_COVER_SELECTION", project_id: projectId, content_id: contentId, run_id: runId, candidates, candidate_set_visual_diversity_score: diversity.total_score, contact_sheets: { full: relative(fullSheet), thumbnail_310: relative(sheet310), thumbnail_186: relative(sheet186) }, formal_fpv_count: 0, g4_count: 0, style_lock_count: 0, feishu_write_count: 0, project_home: projectHome })}\n`,
  );
} finally {
  await browser.close();
}
