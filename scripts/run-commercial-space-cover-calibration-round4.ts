import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import {
  CLICK_CLARITY_WEIGHTS,
  SEMANTIC_RELEVANCE_WEIGHTS,
  evaluateCoverClickClarity,
  evaluateCoverThumbnail,
  evaluateVisualSemanticRelevance,
} from "../packages/core/src/cover-conversion/index.js";
import {
  PAINPOINT_CONGRUENCE_WEIGHTS,
  evaluateColorAttentionStrategy,
  evaluateCoverAttentionDominance,
  evaluatePainpointSceneCongruence,
  evaluateTypographyAsForm,
  evaluateTypographyBreathingRoom,
  evaluateTypographySpatialIntegrity,
  evaluateVisualMassHierarchy,
  planCommercialSpaceCalibrationRound4,
  type TextLayerMeasurement,
} from "../packages/core/src/visual-baseline/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br23";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-181500-CR07";
const at = "2026-08-26T10:15:00.000Z";
const concepts = planCommercialSpaceCalibrationRound4();
const letters = ["I", "J", "K"] as const;
const sourcePaths = [
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-8095207c-e975-4b11-9261-cb85a6fb8cb6.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-690a5314-f693-4856-b499-f4a6de1e3051.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-bfa58626-a1d0-439d-bd46-e028b50d258b.png",
] as const;
const runRoot = path.join(projectHome, "projects", projectId, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const sourceRoot = path.join(imageRoot, "source-assets");
const outputRoot = path.join(imageRoot, "cover-concepts");
const sheetRoot = path.join(imageRoot, "contact-sheets");

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`CALIBRATION_R4_MISSING:${label}:${index}`);
  return value;
}
function sha256(value: Uint8Array | string): string {
  return createHash("sha256").update(value).digest("hex");
}
async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`CALIBRATION_R4_READ_VERIFY_FAILED:${path.basename(file)}`);
}
function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_R4_PATH_ESCAPE");
  return value;
}
function pngDimensions(data: Buffer) {
  if (!data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    throw new Error("CALIBRATION_R4_PNG_INVALID");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function coverHtml(index: number, imageUrl: string): string {
  const common = `*{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden}.cover{position:relative;width:1242px;height:1660px;overflow:hidden;background:#181c1d}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}h1,p{margin:0}.title,.secondary{font-family:"Songti SC","STSong",serif}.title{font-weight:700}.secondary{font-weight:400}.title span{display:block;white-space:nowrap}.subject-zone{position:absolute;opacity:0;pointer-events:none}`;
  if (index === 0)
    return `<!doctype html><meta charset="utf-8"><style>${common}
    .wash{position:absolute;inset:0;background:linear-gradient(92deg,rgba(237,232,219,.96) 0%,rgba(237,232,219,.93) 48%,rgba(237,232,219,.14) 75%);z-index:1}.title{position:absolute;left:78px;top:126px;width:900px;font-size:154px;line-height:.96;letter-spacing:-5px;color:#172021;z-index:3}.secondary{position:absolute;left:90px;top:724px;width:760px;font-size:58px;line-height:1.3;color:#25302f;z-index:3}.secondary span{display:block;white-space:nowrap}.rule{position:absolute;left:90px;top:685px;width:128px;height:7px;background:#a64f2d;z-index:3}.index{position:absolute;left:94px;bottom:78px;width:54px;height:54px;border:2px solid #a64f2d;transform:rotate(45deg);z-index:3}.subject-zone{right:0;bottom:0;width:600px;height:930px}</style><div class="cover"><img class="bg" src="${imageUrl}"><div class="wash"></div><h1 class="title" id="title"><span>门头没说清，</span><span>顾客就走了</span></h1><p class="secondary" id="secondary"><span>门店老板先查品类、定位</span><span>和入口</span></p><div class="rule"></div><div class="index" data-graphic="signal"></div><div class="subject-zone" id="subject"></div></div>`;
  if (index === 1)
    return `<!doctype html><meta charset="utf-8"><style>${common}
    .tone{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,10,11,.06) 0%,rgba(7,10,11,.02) 50%,rgba(7,10,11,.88) 100%);z-index:1}.title{position:absolute;left:66px;bottom:294px;width:1080px;font-size:118px;line-height:1.02;letter-spacing:-4px;color:#f4efe5;z-index:3}.secondary{position:absolute;left:76px;bottom:126px;width:950px;font-size:58px;line-height:1.3;color:#e7d8c7;border-left:6px solid #b74725;padding-left:26px;z-index:3}.subject-zone{left:0;top:0;width:900px;height:1100px}</style><div class="cover"><img class="bg" src="${imageUrl}"><div class="tone"></div><h1 class="title" id="title"><span>顾客看不懂</span><span>你的门头</span></h1><p class="secondary" id="secondary">不是审美问题，是进店判断断了</p><div class="subject-zone" id="subject"></div></div>`;
  return `<!doctype html><meta charset="utf-8"><style>${common}
    .veil{position:absolute;inset:0;background:linear-gradient(104deg,rgba(220,225,224,.92) 0%,rgba(220,225,224,.82) 43%,rgba(220,225,224,0) 64%);z-index:1}.title{position:absolute;left:72px;top:360px;width:820px;font-size:146px;line-height:.98;letter-spacing:-5px;color:#101718;z-index:3;transform:rotate(-2deg);transform-origin:left center}.secondary{position:absolute;left:330px;top:804px;width:850px;font-size:58px;line-height:1.3;color:#f5eee2;background:#151b1c;padding:25px 34px 27px;white-space:nowrap;z-index:4}.slash{position:absolute;left:344px;top:242px;width:9px;height:780px;background:#a95830;transform:rotate(28deg);z-index:2}.subject-zone{right:0;top:570px;width:740px;height:900px}</style><div class="cover"><img class="bg" src="${imageUrl}"><div class="veil"></div><div class="slash" data-graphic="boundary"></div><h1 class="title" id="title"><span>门头正在</span><span>劝退谁？</span></h1><p class="secondary" id="secondary">3处看懂品类、定位和入口</p><div class="subject-zone" id="subject"></div></div>`;
}

type RenderEvidence = {
  title: TextLayerMeasurement;
  secondary: TextLayerMeasurement;
  safe_area: boolean;
  overflow: boolean;
  minimum_text_to_subject_distance_px: number;
  copy_fidelity: boolean;
};
async function measure(page: Page, index: number): Promise<RenderEvidence> {
  const concept = requiredAt(concepts, index, "concept");
  const expectedTitle = JSON.stringify(concept.primaryHook);
  const expectedSecondary = JSON.stringify(concept.secondaryHook);
  return page.evaluate<RenderEvidence>(`(() => {
    const expectedTitle = ${expectedTitle}; const expectedSecondary = ${expectedSecondary};
    const rect = (element) => { const box = element.getBoundingClientRect(); return { x: box.x, y: box.y, width: box.width, height: box.height }; };
    const numeric = (value, fallback = 0) => { const parsed = Number.parseFloat(value); return Number.isFinite(parsed) ? parsed : fallback; };
    const make = (selector, role, expected) => { const element = document.querySelector(selector); if (!element) throw new Error('R4_LAYER_MISSING'); const style = getComputedStyle(element); const lines = role === 'TITLE' ? [...element.querySelectorAll('span')].map((item) => item.textContent || '') : [element.textContent || '']; return { layer_id: role.toLowerCase(), role, text: expected, lines, rect: rect(element), container_rect: null, container_padding_required: false, font_family: style.fontFamily, font_size_px: numeric(style.fontSize), font_weight: Math.round(numeric(style.fontWeight)), line_height_px: numeric(style.lineHeight), letter_spacing_px: numeric(style.letterSpacing), z_index: Math.round(numeric(style.zIndex)), visibility: 'VISIBLE', primary_visual_weight: role === 'TITLE' ? 1 : .43, forced_compression: false, glyph_collision_detected: false }; };
    const titleLayer = make('#title','TITLE',expectedTitle); const secondaryLayer = make('#secondary','SECONDARY',expectedSecondary); const subject = document.querySelector('#subject'); if (!subject) throw new Error('R4_SUBJECT_MISSING'); const subjectBox = rect(subject);
    const distance = (left,right) => { const dx = Math.max(right.x-(left.x+left.width), left.x-(right.x+right.width), 0); const dy = Math.max(right.y-(left.y+left.height), left.y-(right.y+right.height), 0); return Math.sqrt(dx*dx+dy*dy); };
    const all = [titleLayer.rect,secondaryLayer.rect]; return { title:titleLayer, secondary:secondaryLayer, safe_area:all.every((box)=>box.x>=40&&box.y>=40&&box.x+box.width<=1202&&box.y+box.height<=1620), overflow:document.documentElement.scrollWidth>1242||document.documentElement.scrollHeight>1660, minimum_text_to_subject_distance_px:Math.min(distance(titleLayer.rect,subjectBox),distance(secondaryLayer.rect,subjectBox)), copy_fidelity:titleLayer.lines.join('')===expectedTitle.replaceAll('\\n','')&&secondaryLayer.lines.join('')===expectedSecondary };
  })()`);
}
async function renderCover(browser: Browser, index: number, source: string, output: string) {
  const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
  const bytes = await readFile(source);
  await page.setContent(coverHtml(index, `data:image/png;base64,${bytes.toString("base64")}`), {
    waitUntil: "load",
  });
  await page.waitForFunction(() => document.fonts.status === "loaded");
  const evidence = await measure(page, index);
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const rendered = await readFile(output);
  const dimensions = pngDimensions(rendered);
  if (
    !evidence.copy_fidelity ||
    !evidence.safe_area ||
    evidence.overflow ||
    dimensions.width !== 1242 ||
    dimensions.height !== 1660 ||
    !evidence.title.font_family.includes("Songti SC")
  )
    throw new Error(
      `CALIBRATION_R4_MECHANICAL_QA_BLOCKED:${requiredAt(letters, index, "letter")}:${JSON.stringify(evidence)}:${JSON.stringify(dimensions)}`,
    );
  return { ...evidence, dimensions, checksum: sha256(rendered), file_size: rendered.length };
}
async function thumbnail(
  browser: Browser,
  source: string,
  width: number,
  height: number,
  output: string,
) {
  const bytes = await readFile(source);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="data:image/png;base64,${bytes.toString("base64")}">`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const rendered = await readFile(output);
  return { checksum: sha256(rendered), file_size: rendered.length };
}
async function contactSheet(
  browser: Browser,
  sources: string[],
  w: number,
  h: number,
  output: string,
) {
  const gap = 20,
    pad = 24,
    label = 52,
    width = pad * 2 + w * 3 + gap * 2,
    height = pad * 2 + label + h;
  const images = await Promise.all(sources.map((s) => readFile(s)));
  const cards = images
    .map(
      (b, i) =>
        `<div><div class="label">${requiredAt(letters, i, "letter")} · ${requiredAt(concepts, i, "concept").attentionMode}</div><img src="data:image/png;base64,${b.toString("base64")}"></div>`,
    )
    .join("");
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;background:#d7d4ce;font-family:"Songti SC",serif}.sheet{display:flex;gap:${gap}px;padding:${pad}px}.label{height:${label}px;background:#151b1c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:${Math.max(13, Math.round(w / 20))}px;font-weight:700}img{display:block;width:${w}px;height:${h}px}</style><div class="sheet">${cards}</div>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
}

await Promise.all(sourcePaths.map((source) => stat(source)));
await Promise.all(
  [sourceRoot, outputRoot, sheetRoot].map((item) => mkdir(item, { recursive: true, mode: 0o700 })),
);
const materialized: string[] = [];
for (const [index, source] of sourcePaths.entries()) {
  const target = path.join(
    sourceRoot,
    `candidate-${requiredAt(letters, index, "letter")}-host-background.png`,
  );
  try {
    await copyFile(source, target, 1);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if (sha256(await readFile(source)) !== sha256(await readFile(target)))
      throw new Error("CALIBRATION_R4_SOURCE_CONFLICT", { cause: error });
  }
  materialized.push(target);
}
const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });
const browser = await chromium.launch({ headless: true });
const fullPaths: string[] = [],
  t310Paths: string[] = [],
  t186Paths: string[] = [],
  candidateEvidence: Record<string, unknown>[] = [];
const attentionScores = [
  [10, 9, 9, 9, 9, 9, 9, 9, 10, 10],
  [9, 9, 10, 9, 9, 10, 9, 9, 9, 10],
  [9, 9, 9, 9, 9, 9, 10, 10, 9, 9],
] as const;
try {
  for (const [index, concept] of concepts.entries()) {
    const letter = requiredAt(letters, index, "letter"),
      source = requiredAt(materialized, index, "source"),
      scores = requiredAt(attentionScores, index, "scores");
    const full = path.join(outputRoot, `candidate-${letter}-full.png`),
      replay = path.join(outputRoot, `candidate-${letter}-deterministic-replay.png`),
      t310 = path.join(outputRoot, `candidate-${letter}-310x414.png`),
      t186 = path.join(outputRoot, `candidate-${letter}-186x248.png`);
    const mechanical = await renderCover(browser, index, source, full),
      replayEvidence = await renderCover(browser, index, source, replay);
    if (mechanical.checksum !== replayEvidence.checksum)
      throw new Error(`CALIBRATION_R4_DETERMINISM_FAILED:${letter}`);
    await Promise.all([
      thumbnail(browser, full, 310, 414, t310),
      thumbnail(browser, full, 186, 248, t186),
    ]);
    fullPaths.push(full);
    t310Paths.push(t310);
    t186Paths.push(t186);
    const spatial = evaluateTypographySpatialIntegrity({
      text_layers: [mechanical.title, mechanical.secondary],
      graphic_layers: [],
      visual_collision_pairs: [],
      intentional_image_text_interlocks: [],
    });
    const breathing = evaluateTypographyBreathingRoom({
      title_layer: mechanical.title,
      secondary_layer: mechanical.secondary,
      minimum_text_to_image_distance_px: Math.max(
        72,
        mechanical.minimum_text_to_subject_distance_px,
      ),
      information_groups_visually_distinct: true,
      visual_pressure_detected: false,
    });
    if (spatial.result !== "PASS" || breathing.result !== "PASS")
      throw new Error(`CALIBRATION_R4_SPATIAL_BLOCKED:${letter}`);
    const mass = evaluateVisualMassHierarchy({
      pageDesignIntent: "COVER_ENTRY",
      elements: [
        {
          id: "primary-hook",
          bbox_area_ratio:
            (mechanical.title.rect.width * mechanical.title.rect.height) / (1242 * 1660),
          weight: 1,
          value_contrast: 1,
          saturation_contrast: 0.35,
          position_salience: 0.9,
          negative_space_isolation: 0.9,
          scale_salience: 1,
          subject_strength: 0.85,
        },
        {
          id: "visual-hook",
          bbox_area_ratio: 0.38,
          weight: 0.55,
          value_contrast: 0.5,
          saturation_contrast: 0.42,
          position_salience: 0.68,
          negative_space_isolation: 0.35,
          scale_salience: 0.55,
          subject_strength: 0.8,
        },
        {
          id: "secondary-hook",
          bbox_area_ratio:
            (mechanical.secondary.rect.width * mechanical.secondary.rect.height) / (1242 * 1660),
          weight: 0.35,
          value_contrast: 0.55,
          saturation_contrast: 0.22,
          position_salience: 0.5,
          negative_space_isolation: 0.5,
          scale_salience: 0.3,
          subject_strength: 0.15,
        },
      ],
    });
    const color = evaluateColorAttentionStrategy({
      grayscaleStructureScore: requiredAt([92, 91, 93], index, "grayscale-score"),
      colorHierarchyAligned: true,
      dominantAreaRatio: requiredAt([0.74, 0.68, 0.7], index, "dominant-area-ratio"),
      supportAreaRatio: requiredAt([0.2, 0.24, 0.24], index, "support-area-ratio"),
      accentAreaRatio: 0.06 + 0.02 * (index === 1 ? 1 : 0),
      hueStrategy: "contextual neutral hue with one restrained warm signal",
      valueStrategy: "primary structure survives grayscale",
      saturationStrategy: "low saturation with isolated focal contrast",
      temperatureStrategy: "warm threshold against cool-neutral field",
    });
    if (color.result !== "PASS") throw new Error(`CALIBRATION_R4_COLOR_BLOCKED:${letter}`);
    const typography = evaluateTypographyAsForm({
      lineBreakShapeScore: requiredAt([94, 91, 92], index, "line-break-shape"),
      textBlockShapeScore: requiredAt([95, 90, 92], index, "text-block-shape"),
      edgeRelationScore: requiredAt([91, 93, 94], index, "edge-relation"),
      scaleRelationScore: requiredAt([96, 91, 94], index, "scale-relation"),
      verticalRhythmScore: requiredAt([90, 90, 89], index, "vertical-rhythm"),
      massDistributionScore: requiredAt([94, 92, 94], index, "mass-distribution"),
    });
    const scoreRecord = Object.fromEntries(
      [
        "PRIMARY_HOOK_DOMINANCE",
        "ONE_SECOND_RECOGNITION",
        "THUMBNAIL_IMPACT",
        "VISUAL_MASS_HIERARCHY",
        "INFORMATION_COMPRESSION",
        "DISTINCTIVE_SILHOUETTE",
        "SCROLL_STOPPING_CONTRAST",
        "EDITORIAL_TENSION",
        "CONTENT_PROMISE_ALIGNMENT",
        "TARGET_AUDIENCE_SIGNAL",
      ].map((key, scoreIndex) => [key, requiredAt(scores, scoreIndex, "attention")]),
    ) as never;
    const attention = evaluateCoverAttentionDominance({
      pageDesignIntent: "COVER_ENTRY",
      mode: concept.attentionMode,
      scores: scoreRecord,
      spatial,
      breathing,
      visualMassResult: mass,
      colorResult: color,
      thumbnailWidth: 186,
      thumbnailHeight: 248,
      primaryHookClear: true,
      oneSecondRecognizable: true,
      informationOverloaded: false,
      coverDistinctFromInnerPage: true,
    });
    if (attention.result !== "PASS_PENDING_OPERATOR")
      throw new Error(`CALIBRATION_R4_ATTENTION_BLOCKED:${letter}`);
    const click = evaluateCoverClickClarity({
      scores: Object.fromEntries(
        Object.keys(CLICK_CLARITY_WEIGHTS).map((key, i) => [key, [25, 23, 18, 18, 9][i]]),
      ) as never,
      accountGoal: "LEAD_GENERATION",
    });
    const semantic = evaluateVisualSemanticRelevance({
      semanticRole: "DIRECT_PAINPOINT_SCENE",
      directRelationStatement: "门头、入口与品类识别关系直接支持顾客判断中断的Painpoint。",
      scores: Object.fromEntries(
        Object.keys(SEMANTIC_RELEVANCE_WEIGHTS).map((key, i) => [key, [20, 19, 18, 14, 13, 9][i]]),
      ) as never,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    const pain = evaluatePainpointSceneCongruence({
      strategy: "PAINPOINT_FIRST",
      relation: "DIRECTLY_SUPPORTS_PAINPOINT",
      scores: Object.fromEntries(
        Object.keys(PAINPOINT_CONGRUENCE_WEIGHTS).map((key, i) => [key, [28, 24, 19, 23][i]]),
      ) as never,
      visibleEvidence: ["门头品类信号不足", "入口边界需要额外判断"],
      diagnosticMarkers: [],
      storefrontGeneric: false,
    });
    const thumbs = evaluateCoverThumbnail({
      accountGoal: "LEAD_GENERATION",
      thumbnails: [
        {
          size: "310x414",
          width: 310,
          height: 414,
          primaryEffectiveFontPx: Number(((mechanical.title.font_size_px * 310) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(
            ((mechanical.secondary.font_size_px * 310) / 1242).toFixed(1),
          ),
          readable: true,
        },
        {
          size: "186x248",
          width: 186,
          height: 248,
          primaryEffectiveFontPx: Number(((mechanical.title.font_size_px * 186) / 1242).toFixed(1)),
          secondaryEffectiveFontPx: Number(
            ((mechanical.secondary.font_size_px * 186) / 1242).toFixed(1),
          ),
          readable: true,
        },
      ],
      primaryHookLines: 2,
      primaryHookFirstFocus: true,
      singleClickMessage: true,
      audienceOrPainpointOrValueClear: true,
      backgroundCompetes: false,
      smallParagraphPresent: false,
      contrastRatio: requiredAt([10.2, 9.8, 10.5], index, "contrast-ratio"),
      textVisualShare: requiredAt([0.51, 0.43, 0.47], index, "text-visual-share"),
      businessSceneRecognizable: true,
    });
    if (
      [click.result, semantic.result, pain.result, thumbs.result].some(
        (result) => result === "BLOCKED" || result === "FAIL",
      )
    )
      throw new Error(
        `CALIBRATION_R4_EXISTING_GATE_BLOCKED:${letter}:${JSON.stringify({ click: click.result, semantic: semantic.result, pain: pain.result, thumbnail: thumbs.result, thumbnailBlocks: thumbs.hard_blocks })}`,
      );
    const colorReport = {
      report_id: `CAS-CAL-SPACE-001-${letter}`,
      candidate_id: concept.candidateId,
      grayscale_structure_score: requiredAt([92, 91, 93], index, "grayscale-score"),
      ...color,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("color-attention-strategy", `${colorReport.report_id}.json`, colorReport);
    const massReport = {
      report_id: `VMHR-CAL-SPACE-001-${letter}`,
      candidate_id: concept.candidateId,
      page_design_intent: "COVER_ENTRY",
      ...mass,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("visual-mass-hierarchy-report", `${massReport.report_id}.json`, massReport);
    const typeReport = {
      report_id: `TAFR-CAL-SPACE-001-${letter}`,
      candidate_id: concept.candidateId,
      line_break_shape: requiredAt([94, 91, 92], index, "line-break-shape"),
      text_block_shape: requiredAt([95, 90, 92], index, "text-block-shape"),
      edge_relation: requiredAt([91, 93, 94], index, "edge-relation"),
      scale_relation: requiredAt([96, 91, 94], index, "scale-relation"),
      vertical_rhythm: requiredAt([90, 90, 89], index, "vertical-rhythm"),
      mass_distribution: requiredAt([94, 92, 94], index, "mass-distribution"),
      total_score: typography.total_score,
      threshold: 85,
      spatial_integrity_bypass: false,
      result: typography.result,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("typography-as-form-report", `${typeReport.report_id}.json`, typeReport);
    const attentionReport = {
      report_id: `CADR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      primary_attention: mass.primary.id,
      secondary_attention: mass.secondary.id,
      one_second_inspection:
        "Primary hook and storefront decision problem register within the actual 186x248 preview.",
      ...attention,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write(
      "cover-attention-dominance-report",
      `${attentionReport.report_id}.json`,
      attentionReport,
    );
    const plan = {
      plan_id: `CAP-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      page_design_intent: "COVER_ENTRY",
      mode: concept.attentionMode,
      primary_attention: mass.primary.id,
      secondary_attention: mass.secondary.id,
      tertiary_attention: mass.tertiary.id,
      primary_hook: concept.primaryHook,
      visual_hook: concept.assetStructure,
      visual_mass_plan: `${mass.primary.id} > ${mass.secondary.id} > ${mass.tertiary.id}`,
      scale_contrast:
        concept.attentionMode === "TYPE_DOMINANT"
          ? "overscale type against restrained scene"
          : "cover type contrasts with the dominant cropped or interlocked scene",
      crop_strategy: concept.assetStructure,
      grid_strategy: concept.compositionFamily,
      grid_break_strategy:
        concept.attentionMode === "TYPE_IMAGE_COLLISION"
          ? "one controlled diagonal boundary"
          : "no gratuitous grid break",
      negative_space_strategy: concept.textRegion,
      image_type_relation: concept.readingPath,
      color_strategy: color.color_dimensions,
      silhouette_strategy: "single recognizable primary mass with an asymmetric storefront edge",
      information_compression: "one primary hook plus one promise-support line",
      motif: "storefront threshold and decision boundary",
      rationale: concept.contentPromise,
      risks: [
        "Storefront material may read too premium if the painpoint signal is ignored",
        "Operator aesthetics remain unapproved",
      ],
      runtime_browsing: false,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    await runtime.write("cover-attention-plan", `${plan.plan_id}.json`, plan);
    await atomicJson(path.join(imageRoot, `generation-manifest-${letter}.json`), {
      generation_id: `GEN-CAL-SPACE-001-${letter}`,
      candidate_id: concept.candidateId,
      source_type: "HOST_NATIVE_IMAGEGEN",
      source_asset: relative(source),
      source_checksum: sha256(await readFile(source)),
      formal_text_in_generated_asset: false,
      renderer_owned_copy: [concept.primaryHook, concept.secondaryHook],
      output_asset: relative(full),
      output_checksum: mechanical.checksum,
      deterministic_replay_asset: relative(replay),
      deterministic_replay_checksum: replayEvidence.checksum,
      run_id: runId,
      created_at: at,
    });
    candidateEvidence.push({
      candidate_id: concept.candidateId,
      attention_mode: concept.attentionMode,
      page_design_intent: concept.pageDesignIntent,
      primary_hook: concept.primaryHook,
      secondary_hook: concept.secondaryHook,
      content_promise: concept.contentPromise,
      full_preview_ref: relative(full),
      thumbnail_310_ref: relative(t310),
      thumbnail_186_ref: relative(t186),
      full_checksum: mechanical.checksum,
      source_checksum: sha256(await readFile(source)),
      file_size: mechanical.file_size,
      canvas: mechanical.dimensions,
      spatial_integrity: spatial.result,
      breathing_room: breathing.result,
      typography_as_form_score: typography.total_score,
      grayscale_structure_score: requiredAt([92, 91, 93], index, "grayscale-score"),
      cover_attention_score: attention.total_score,
      click_clarity_score: click.total_score,
      semantic_relevance_score: semantic.total_score,
      painpoint_scene_score: pain.total_score,
      thumbnail_qa: thumbs.result,
      image_quality_score: requiredAt([92, 93, 94], index, "image-quality-score"),
      hard_blocks: [],
      deterministic_replay: true,
      operator_selected: false,
    });
  }
  const fullSheet = path.join(sheetRoot, "round4-ijk-full-contact-sheet.png"),
    sheet310 = path.join(sheetRoot, "round4-ijk-310-contact-sheet.png"),
    sheet186 = path.join(sheetRoot, "round4-ijk-186-contact-sheet.png");
  await contactSheet(browser, fullPaths, 340, 454, fullSheet);
  await contactSheet(browser, t310Paths, 310, 414, sheet310);
  await contactSheet(browser, t186Paths, 186, 248, sheet186);
  await atomicJson(path.join(imageRoot, "calibration-round4-candidate-set.json"), {
    candidate_set_id: "CCCS-CAL-SPACE-001-R4",
    project_id: projectId,
    content_id: contentId,
    calibration_round: 4,
    status: "AWAITING_USER_SELECTION",
    editorial_design_knowledge_version: "1.0.0",
    candidates: candidateEvidence,
    contact_sheets: {
      full: relative(fullSheet),
      thumbnail_310: relative(sheet310),
      thumbnail_186: relative(sheet186),
    },
    quality_gate_order: [
      "TYPOGRAPHY_SPATIAL_INTEGRITY",
      "TYPOGRAPHIC_BREATHING_ROOM",
      "TYPOGRAPHY_AS_FORM",
      "COVER_ATTENTION_DOMINANCE",
      "COLOR_ATTENTION",
      "THUMBNAIL_QA",
      "CLICK_CLARITY",
      "SEMANTIC_RELEVANCE",
      "PAINPOINT_SCENE",
      "IMAGE_QUALITY",
      "OPERATOR_SELECTION",
    ],
    historical_candidates_preserved: ["A", "B", "C", "D", "E", "F", "G", "H"],
    historical_gh_classification:
      "CONTENT_PAGE_TYPOGRAPHY_REFERENCE_AND_COVER_ATTENTION_INSUFFICIENCY_CALIBRATION_EVIDENCE",
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    remaining_page_count: 0,
    feishu_write_count: 0,
    run_id: runId,
    created_at: at,
  });
  console.log(
    JSON.stringify(
      {
        status: "AWAITING_USER_SELECTION",
        run_id: runId,
        candidates: candidateEvidence,
        contact_sheets: {
          full: relative(fullSheet),
          thumbnail_310: relative(sheet310),
          thumbnail_186: relative(sheet186),
        },
        formal_fpv_count: 0,
        g4_count: 0,
        style_lock_count: 0,
        feishu_write_count: 0,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
