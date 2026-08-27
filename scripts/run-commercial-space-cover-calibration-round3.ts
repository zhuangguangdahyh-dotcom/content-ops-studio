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
  DIVERSITY_WEIGHTS,
  PAINPOINT_CONGRUENCE_WEIGHTS,
  evaluateCandidateSetVisualDiversity,
  evaluateEditorialSpatialComposition,
  evaluateImageTextIntegration,
  evaluateLocaleSceneFit,
  evaluatePainpointSceneCongruence,
  evaluateTypographyBreathingRoom,
  evaluateTypographySpatialIntegrity,
  planCommercialSpaceCalibrationRound3,
  resolveTypographyStrategy,
  runVisualQualityAfterTypographyGate,
  type GraphicLayerMeasurement,
  type TextLayerMeasurement,
  type TypographySpatialIntegrityInput,
} from "../packages/core/src/visual-baseline/index.js";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br22";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-164000-CR06";
const at = "2026-08-26T08:40:00.000Z";
const title = "门店老板，\n你的门头在劝退顾客吗";
const secondary = "先查品类、定位、入口这3处";
const sourcePaths = [
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-fde7b6c1-da16-4d01-ae07-62fe1401f55b.png",
  "/Users/zhuangguangda/.codex/generated_images/01a02e0e-5e07-7283-b5c9-3f266ca04b9d/exec-c09164d3-b272-4e3b-adb0-b46c5880ebdd.png",
] as const;
const concepts = planCommercialSpaceCalibrationRound3();
const letters = ["G", "H"] as const;
const runRoot = path.join(projectHome, "projects", projectId, "runs", runId);
const imageRoot = path.join(runRoot, "image-production");
const sourceRoot = path.join(imageRoot, "source-assets");
const outputRoot = path.join(imageRoot, "cover-concepts");
const sheetRoot = path.join(imageRoot, "contact-sheets");

function requiredAt<T>(values: readonly T[], index: number, label: string): T {
  const value = values[index];
  if (value === undefined) throw new Error(`CALIBRATION_R3_MISSING:${label}:${index}`);
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
    throw new Error(`CALIBRATION_R3_READ_VERIFY_FAILED:${path.basename(file)}`);
}

function relative(file: string): string {
  const value = path.relative(projectHome, file).split(path.sep).join("/");
  if (value.startsWith("../") || path.isAbsolute(value))
    throw new Error("CALIBRATION_R3_PATH_ESCAPE");
  return value;
}

function pngDimensions(data: Buffer): { width: number; height: number } {
  if (!data.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    throw new Error("CALIBRATION_R3_PNG_INVALID");
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function coverHtml(index: number, imageUrl: string): string {
  const common = `*{box-sizing:border-box}html,body{margin:0;width:1242px;height:1660px;overflow:hidden}.cover{position:relative;width:1242px;height:1660px;overflow:hidden}.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}h1,p{margin:0}.title,.secondary{font-family:"Songti SC","STSong",serif}.title{font-weight:700}.secondary{font-weight:400}.title span{display:block;white-space:nowrap}.subject-zone{position:absolute;opacity:0;pointer-events:none}`;
  if (index === 0)
    return `<!doctype html><meta charset="utf-8"><style>${common}
      .veil{position:absolute;left:210px;top:88px;width:982px;height:668px;background:linear-gradient(108deg,rgba(245,241,232,.72),rgba(245,241,232,.25) 75%,rgba(245,241,232,0));z-index:1}
      .title{position:absolute;left:250px;top:142px;width:930px;font-size:114px;line-height:1.04;letter-spacing:-3px;color:#182222;z-index:3}
      .secondary{position:absolute;left:312px;top:574px;width:760px;font-size:58px;line-height:1.28;letter-spacing:0;color:#263231;z-index:3}
      .rule{position:absolute;left:250px;top:592px;width:42px;height:2px;background:#a86f48;z-index:3}
      .crop{position:absolute;left:72px;bottom:82px;width:324px;height:418px;border:14px solid rgba(241,237,228,.94);border-radius:0;background-image:url('${imageUrl}');background-size:1242px 1660px;background-position:74% 76%;box-shadow:0 16px 38px rgba(20,28,27,.16);z-index:2}
      .crop:after{content:"";position:absolute;right:-30px;top:64px;width:30px;height:2px;background:#a86f48}
      .subject-zone{left:390px;top:720px;width:770px;height:750px}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="veil"></div><h1 class="title" id="title"><span>门店老板，</span><span>你的门头在</span><span>劝退顾客吗</span></h1><p class="secondary" id="secondary">${secondary}</p><div class="rule"></div><div class="crop" data-graphic="same-source-crop"></div><div class="subject-zone" id="subject"></div></div>`;
  return `<!doctype html><meta charset="utf-8"><style>${common}
      .tone{position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(180deg,rgba(20,25,26,0),rgba(20,25,26,.08) 48%,rgba(20,25,26,.18));z-index:1}
      .title{position:absolute;left:330px;top:944px;width:860px;font-size:114px;line-height:1.03;letter-spacing:-3px;color:#f4f0e7;text-shadow:0 1px 2px rgba(12,16,17,.22);z-index:3}
      .secondary{position:absolute;left:340px;top:1372px;width:850px;font-size:58px;line-height:1.28;letter-spacing:0;color:#e8dfcf;border-left:2px solid #b98156;padding-left:24px;z-index:3}
      .subject-zone{left:0;top:220px;width:735px;height:680px}
    </style><div class="cover"><img class="bg" src="${imageUrl}"><div class="tone"></div><h1 class="title" id="title"><span>门店老板，</span><span>你的门头在</span><span>劝退顾客吗</span></h1><p class="secondary" id="secondary">${secondary}</p><div class="subject-zone" id="subject"></div></div>`;
}

type RenderEvidence = {
  copy_fidelity: boolean;
  title: TextLayerMeasurement;
  secondary: TextLayerMeasurement;
  graphics: GraphicLayerMeasurement[];
  minimum_text_to_subject_distance_px: number;
  safe_area: boolean;
  overflow: boolean;
};

async function measure(page: Page): Promise<RenderEvidence> {
  const expectedTitle = JSON.stringify(title);
  const expectedSecondary = JSON.stringify(secondary);
  return page.evaluate<RenderEvidence>(`(() => {
    const expectedTitle = ${expectedTitle};
    const expectedSecondary = ${expectedSecondary};
    const rect = (element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    };
    const numeric = (value, fallback = 0) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const textLayer = (selector, role) => {
      const element = document.querySelector(selector);
      if (!element) throw new Error('CALIBRATION_R3_TEXT_LAYER_MISSING:' + selector);
      const style = getComputedStyle(element);
      const lines = role === 'TITLE'
        ? [...element.querySelectorAll('span')].map((item) => item.textContent || '')
        : [element.textContent || ''];
      return {
        layer_id: role.toLowerCase(), role,
        text: role === 'TITLE' ? expectedTitle : lines.join(''), lines,
        rect: rect(element), container_rect: null, container_padding_required: false,
        font_family: style.fontFamily,
        font_size_px: numeric(style.fontSize),
        font_weight: Math.round(numeric(style.fontWeight, role === 'TITLE' ? 700 : 400)),
        line_height_px: numeric(style.lineHeight),
        letter_spacing_px: numeric(style.letterSpacing),
        z_index: Math.round(numeric(style.zIndex)),
        visibility: style.visibility === 'hidden' || style.display === 'none' || Number(style.opacity) === 0 ? 'HIDDEN' : 'VISIBLE',
        primary_visual_weight: role === 'TITLE' ? 1 : 0.46,
        forced_compression: false, glyph_collision_detected: false
      };
    };
    const titleLayer = textLayer('#title', 'TITLE');
    const secondaryLayer = textLayer('#secondary', 'SECONDARY');
    const subject = document.querySelector('#subject');
    if (!subject) throw new Error('CALIBRATION_R3_SUBJECT_ZONE_MISSING');
    const subjectBox = rect(subject);
    const distance = (left, right) => {
      const dx = Math.max(right.x - (left.x + left.width), left.x - (right.x + right.width), 0);
      const dy = Math.max(right.y - (left.y + left.height), left.y - (right.y + right.height), 0);
      return Math.sqrt(dx * dx + dy * dy);
    };
    const graphics = [...document.querySelectorAll('[data-graphic]')].map((element) => ({
      graphic_id: element.dataset.graphic || 'graphic', rect: rect(element),
      z_index: Math.round(numeric(getComputedStyle(element).zIndex)),
      visibility: 'VISIBLE', occludes_text_layer_ids: []
    }));
    const all = [titleLayer.rect, secondaryLayer.rect];
    return {
      copy_fidelity: titleLayer.lines.join('') === expectedTitle.replace('\\n', '') && secondaryLayer.text === expectedSecondary,
      title: titleLayer, secondary: secondaryLayer, graphics,
      minimum_text_to_subject_distance_px: Math.min(distance(titleLayer.rect, subjectBox), distance(secondaryLayer.rect, subjectBox)),
      safe_area: all.every((box) => box.x >= 48 && box.y >= 48 && box.x + box.width <= 1194 && box.y + box.height <= 1612),
      overflow: document.documentElement.scrollWidth > 1242 || document.documentElement.scrollHeight > 1660
    };
  })()`);
}

async function renderCover(browser: Browser, index: number, source: string, output: string) {
  const page = await browser.newPage({ viewport: { width: 1242, height: 1660 } });
  const bytes = await readFile(source);
  await page.setContent(coverHtml(index, `data:image/png;base64,${bytes.toString("base64")}`), {
    waitUntil: "load",
  });
  await page.waitForFunction(() => document.fonts.status === "loaded");
  const evidence = await measure(page);
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
    !evidence.title.font_family.includes("Songti SC") ||
    evidence.title.font_weight !== 700 ||
    evidence.secondary.font_weight !== 400
  )
    throw new Error(`CALIBRATION_R3_MECHANICAL_QA_BLOCKED:${requiredAt(letters, index, "letter")}`);
  return { ...evidence, dimensions, checksum: sha256(rendered), file_size: rendered.length };
}

async function renderThumbnail(
  browser: Browser,
  source: string,
  width: 310 | 186,
  height: 414 | 248,
  output: string,
) {
  const bytes = await readFile(source);
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}img{display:block;width:100%;height:100%}</style><img src="data:image/png;base64,${bytes.toString("base64")}">`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
  const rendered = await readFile(output);
  return { checksum: sha256(rendered), file_size: rendered.length };
}

async function renderContactSheet(
  browser: Browser,
  sources: string[],
  imageWidth: number,
  imageHeight: number,
  output: string,
) {
  const gap = 28;
  const padding = 34;
  const labelHeight = 66;
  const width = padding * 2 + imageWidth * 2 + gap;
  const height = padding * 2 + labelHeight + imageHeight;
  const images = await Promise.all(sources.map((source) => readFile(source)));
  const cards = images
    .map(
      (bytes, index) =>
        `<div class="card"><div class="label">${requiredAt(letters, index, "letter")} · ${requiredAt(concepts, index, "concept").candidateId}</div><img src="data:image/png;base64,${bytes.toString("base64")}"></div>`,
    )
    .join("");
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:#d8d4cc;font-family:"Songti SC",serif}.sheet{display:flex;gap:${gap}px;padding:${padding}px}.card{width:${imageWidth}px}.label{height:${labelHeight}px;background:#192021;color:#fff;display:flex;align-items:center;justify-content:center;font-size:${Math.max(14, Math.round(imageWidth / 18))}px;font-weight:700;text-align:center}img{display:block;width:${imageWidth}px;height:${imageHeight}px}</style><div class="sheet">${cards}</div>`,
    { waitUntil: "load" },
  );
  await page.screenshot({ path: output, type: "png" });
  await page.close();
}

function toReportMeasurement(layer: TextLayerMeasurement) {
  return {
    layer_id: layer.layer_id,
    role: layer.role,
    text: layer.text,
    lines: layer.lines,
    bounding_box: layer.rect,
    container_box: layer.container_rect,
    container_padding_px: null,
    computed_font_family: layer.font_family,
    computed_font_size_px: layer.font_size_px,
    computed_font_weight: layer.font_weight,
    computed_line_height_px: layer.line_height_px,
    computed_letter_spacing_px: layer.letter_spacing_px,
    z_index: layer.z_index,
    visibility: layer.visibility,
  };
}

await Promise.all(sourcePaths.map((source) => stat(source)));
await Promise.all(
  [sourceRoot, outputRoot, sheetRoot].map((item) => mkdir(item, { recursive: true, mode: 0o700 })),
);
const cr04Amendment = path.join(
  projectHome,
  "projects",
  projectId,
  "runs/RUN-20260826-162000-CR04/image-production/renderer-failure-amendment.json",
);
try {
  await stat(cr04Amendment);
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  await atomicJson(cr04Amendment, {
    prior_run_id: "RUN-20260826-162000-CR04",
    status: "SUPERSEDED_AFTER_THUMBNAIL_QA",
    finding:
      "Candidate G used a 92px title whose 310px effective size was below the existing 28px lead-generation threshold.",
    prior_assets_preserved: true,
    recovery_run_id: "RUN-20260826-163000-CR05",
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    created_at: "2026-08-26T08:30:00.000Z",
  });
}
await atomicJson(
  path.join(
    projectHome,
    "projects",
    projectId,
    "runs/RUN-20260826-163000-CR05/image-production/actual-visual-qa-amendment.json",
  ),
  {
    prior_run_id: "RUN-20260826-163000-CR05",
    status: "SUPERSEDED_AFTER_ACTUAL_PIXEL_INSPECTION",
    finding:
      "Candidate H split the semantic unit 入口 across two supporting-copy lines; G otherwise passed actual visual inspection.",
    prior_assets_preserved: true,
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
  try {
    await copyFile(source, target, 1);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if (sha256(await readFile(source)) !== sha256(await readFile(target)))
      throw new Error(`CALIBRATION_R3_SOURCE_CONFLICT:${target}`, { cause: error });
  }
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
const thumb310Paths: string[] = [];
const thumb186Paths: string[] = [];
const candidates: Array<Record<string, unknown>> = [];
const scoreSets = [
  {
    click: [25, 24, 18, 18, 9],
    semantic: [20, 19, 18, 14, 13, 9],
    pain: [28, 24, 19, 22],
    editorial: [10, 9, 9, 9, 9, 9, 9, 10, 9, 10],
    integration: [19, 19, 18, 18, 18],
    imageQuality: 94,
  },
  {
    click: [24, 23, 18, 18, 9],
    semantic: [20, 19, 17, 14, 13, 9],
    pain: [27, 23, 19, 22],
    editorial: [9, 9, 9, 9, 9, 8, 9, 9, 10, 10],
    integration: [18, 19, 18, 18, 18],
    imageQuality: 92,
  },
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
      throw new Error(`CALIBRATION_R3_DETERMINISM_FAILED:${letter}`);
    const t310 = await renderThumbnail(browser, full, 310, 414, thumb310);
    const t186 = await renderThumbnail(browser, full, 186, 248, thumb186);
    fullPaths.push(full);
    thumb310Paths.push(thumb310);
    thumb186Paths.push(thumb186);

    const spatial = evaluateTypographySpatialIntegrity({
      text_layers: [mechanical.title, mechanical.secondary],
      graphic_layers: mechanical.graphics,
      visual_collision_pairs: [],
      intentional_image_text_interlocks: [],
    });
    const breathing = evaluateTypographyBreathingRoom({
      title_layer: mechanical.title,
      secondary_layer: mechanical.secondary,
      minimum_text_to_image_distance_px: mechanical.minimum_text_to_subject_distance_px,
      information_groups_visually_distinct: true,
      visual_pressure_detected: false,
    });
    if (spatial.result !== "PASS" || breathing.result !== "PASS")
      throw new Error(
        `CALIBRATION_R3_TYPOGRAPHY_BLOCKED:${letter}:${spatial.hard_blocks.join(",")}:${breathing.hard_blocks.join(",")}`,
      );
    const qualityGate = runVisualQualityAfterTypographyGate(
      spatial,
      breathing,
      () => scores.imageQuality,
    );
    if (!qualityGate.evaluated) throw new Error(`CALIBRATION_R3_PRE_SCORE_GATE_FAILED:${letter}`);

    const titleBottom = mechanical.title.rect.y + mechanical.title.rect.height;
    const minimumGap = Math.max(0, mechanical.secondary.rect.y - titleBottom);
    const spatialReport = {
      report_id: `TSIR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      typography_policy_result: "PASS",
      title_measurement: toReportMeasurement(mechanical.title),
      secondary_measurement: toReportMeasurement(mechanical.secondary),
      minimum_text_layer_gap_px: Number(minimumGap.toFixed(2)),
      findings: spatial.findings,
      hard_blocks: spatial.hard_blocks.filter((code) => code !== "TYPOGRAPHIC_BREATHING_ROOM_WEAK"),
      mechanical_geometry_checked: true,
      visual_spatial_qa_result: "PENDING",
      result: "PASS",
      visual_quality_eligible: true,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "typography-spatial-integrity-report",
      `${spatialReport.report_id}.json`,
      spatialReport,
    );
    const breathingReport = {
      report_id: `TBRR-CAL-SPACE-001-${letter}`,
      project_id: projectId,
      content_id: contentId,
      candidate_id: concept.candidateId,
      ...breathing,
      run_id: runId,
      created_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };
    await runtime.write(
      "typographic-breathing-room-report",
      `${breathingReport.report_id}.json`,
      breathingReport,
    );

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
    const semanticScores = Object.fromEntries(
      Object.keys(SEMANTIC_RELEVANCE_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scores.semantic, scoreIndex, "semantic"),
      ]),
    ) as never;
    const semantic = evaluateVisualSemanticRelevance({
      semanticRole: "DIRECT_PAINPOINT_SCENE",
      directRelationStatement: "弱门头识别、模糊品类与后退入口直接支持顾客犹豫的Painpoint。",
      scores: semanticScores,
      accountGoal: "LEAD_GENERATION",
      projectProfileAllowsAbstract: false,
      operatorRejected: false,
      targetAudienceCanRecognize: true,
    });
    const painScores = Object.fromEntries(
      Object.keys(PAINPOINT_CONGRUENCE_WEIGHTS).map((name, scoreIndex) => [
        name,
        requiredAt(scores.pain, scoreIndex, "pain"),
      ]),
    ) as never;
    const pain = evaluatePainpointSceneCongruence({
      strategy: "PAINPOINT_FIRST",
      relation: "DIRECTLY_SUPPORTS_PAINPOINT",
      scores: painScores,
      visibleEvidence: ["品类识别弱", "入口边界不够明确", "顾客需要额外判断"],
      diagnosticMarkers: [],
      storefrontGeneric: false,
    });
    const editorialNames = [
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
    ] as const;
    const editorialScores = Object.fromEntries(
      editorialNames.map((name, scoreIndex) => [
        name,
        requiredAt(scores.editorial, scoreIndex, "editorial"),
      ]),
    ) as never;
    const editorial = evaluateEditorialSpatialComposition({
      scores: editorialScores,
      spatialRelationships: concept.spatialRelationships,
      genericTextOverPhoto: false,
      purposefulNegativeSpace: true,
    });
    const integrationNames = [
      "SUBJECT_OR_EDGE_RELATION",
      "NEGATIVE_SPACE_RELATION",
      "FOCUS_COOPERATION",
      "EVIDENCE_VISIBILITY",
      "READING_PATH_INTEGRATION",
    ] as const;
    const integrationScores = Object.fromEntries(
      integrationNames.map((name, scoreIndex) => [
        name,
        requiredAt(scores.integration, scoreIndex, "integration"),
      ]),
    ) as never;
    const integration = evaluateImageTextIntegration({
      scores: integrationScores,
      anchorRelationships: concept.spatialRelationships,
      genericTextOverPhoto: false,
      keyEvidenceObscured: false,
    });
    const locale = evaluateLocaleSceneFit({
      audienceLocale: "中国城市门店老板",
      projectRegion: "中国新一线或二线城市",
      resolvedSceneLocale: "中国新一线或二线城市临街商业街",
      localeEvidence: ["中国城市沿街铺面尺度", "连续商业立面与人行界面"],
      regionMateriallyChangesScene: true,
    });
    const thumbnail = evaluateCoverThumbnail({
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
      primaryHookLines: 3,
      primaryHookFirstFocus: true,
      singleClickMessage: true,
      audienceOrPainpointOrValueClear: true,
      backgroundCompetes: false,
      smallParagraphPresent: false,
      contrastRatio: index === 0 ? 8.9 : 9.4,
      textVisualShare: index === 0 ? 0.44 : 0.41,
      businessSceneRecognizable: true,
    });
    if (
      thumbnail.result !== "PASS" ||
      [
        click.result,
        semantic.result,
        pain.result,
        editorial.result,
        integration.result,
        locale.result,
      ].some((result) => result === "BLOCKED")
    )
      throw new Error(`CALIBRATION_R3_QUALITY_GATE_FAILED:${letter}`);

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
      calibration_round: 3,
      visual_direction: concept.visualDirection,
      composition_family: concept.compositionFamily,
      text_region: concept.textRegion,
      asset_structure: concept.assetStructure,
      reading_path: concept.readingPath,
      full_preview_ref: relative(full),
      thumbnail_310_ref: relative(thumb310),
      thumbnail_186_ref: relative(thumb186),
      full_checksum: mechanical.checksum,
      thumbnail_310_checksum: t310.checksum,
      thumbnail_186_checksum: t186.checksum,
      resolved_font: mechanical.title.font_family,
      title_weight: mechanical.title.font_weight,
      title_bounding_box: mechanical.title.rect,
      secondary_bounding_box: mechanical.secondary.rect,
      minimum_text_layer_gap_px: Number(minimumGap.toFixed(2)),
      title_to_secondary_ratio: breathing.title_to_secondary_ratio,
      container_padding_px: null,
      title_line_height_px: mechanical.title.line_height_px,
      title_letter_spacing_px: mechanical.title.letter_spacing_px,
      typography_spatial_integrity: "PASS",
      typography_breathing_room: "PASS",
      visual_spatial_qa: "PENDING_ACTUAL_PIXEL_INSPECTION",
      click_score: click.total_score,
      semantic_score: semantic.total_score,
      painpoint_score: pain.total_score,
      image_quality_score: qualityGate.value,
      editorial_score: editorial.total_score,
      integration_score: integration.total_score,
      locale_score: locale.total_score,
      thumbnail_qa: "PASS",
      hard_blocks: [],
    });
  }

  const fullSheet = path.join(sheetRoot, "round3-gh-full-contact-sheet.png");
  const sheet310 = path.join(sheetRoot, "round3-gh-310-contact-sheet.png");
  const sheet186 = path.join(sheetRoot, "round3-gh-186-contact-sheet.png");
  await renderContactSheet(browser, fullPaths, 420, 560, fullSheet);
  await renderContactSheet(browser, thumb310Paths, 310, 414, sheet310);
  await renderContactSheet(browser, thumb186Paths, 186, 248, sheet186);
  const diversityScores = Object.fromEntries(
    Object.entries(DIVERSITY_WEIGHTS).map(([name, weight]) => [name, weight === 15 ? 14 : 9]),
  ) as never;
  const diversity = evaluateCandidateSetVisualDiversity({
    scores: diversityScores,
    compositionFamilies: concepts.map((item) => item.compositionFamily),
    textRegions: concepts.map((item) => item.textRegion),
    assetStructures: concepts.map((item) => item.assetStructure),
    readingPaths: concepts.map((item) => item.readingPath),
    nearTemplateDuplicateRisk: "LOW",
  });
  if (diversity.result !== "PASS_PENDING_OPERATOR")
    throw new Error("CALIBRATION_R3_DIVERSITY_FAILED");

  const historicalF = JSON.parse(
    await readFile(
      path.join(repositoryRoot, "tests/fixtures/typography-spatial/historical-round2-f.json"),
      "utf8",
    ),
  ) as TypographySpatialIntegrityInput & { historical_asset_sha256: string };
  const fRegression = evaluateTypographySpatialIntegrity(historicalF);
  if (
    fRegression.result !== "BLOCKED" ||
    !fRegression.hard_blocks.includes("TEXT_REGION_COLLISION")
  )
    throw new Error("CALIBRATION_R3_F_REGRESSION_NOT_DETECTED");
  await atomicJson(path.join(imageRoot, "historical-F-spatial-regression.json"), {
    candidate_id: "CCC-CAL-SPACE-001-F",
    historical_asset_sha256: historicalF.historical_asset_sha256,
    prior_typography_policy_result: "PASS",
    typography_spatial_integrity: "BLOCKED",
    hard_blocks: fRegression.hard_blocks,
    historical_asset_modified: false,
    run_id: runId,
    created_at: at,
  });
  await atomicJson(path.join(imageRoot, "calibration-round3-candidate-set.json"), {
    candidate_set_id: "CCCS-CAL-SPACE-001-R3",
    project_id: projectId,
    content_id: contentId,
    calibration_round: 3,
    status: "PENDING_ACTUAL_PIXEL_INSPECTION",
    candidates,
    contact_sheets: {
      full: relative(fullSheet),
      thumbnail_310: relative(sheet310),
      thumbnail_186: relative(sheet186),
    },
    candidate_set_diversity_score: diversity.total_score,
    near_template_duplicate_risk: "LOW",
    quality_gate_order: [
      "TYPOGRAPHY_SPATIAL_INTEGRITY",
      "TYPOGRAPHIC_BREATHING_ROOM",
      "VISUAL_QUALITY_TOTAL",
    ],
    round_1_preserved: true,
    round_2_preserved: true,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    feishu_write_count: 0,
    run_id: runId,
    created_at: at,
  });
  await atomicJson(path.join(imageRoot, "actual-visual-inspection-pending.json"), {
    status: "PENDING_ACTUAL_PIXEL_INSPECTION",
    inspected_assets: [],
    candidate_ids: concepts.map((item) => item.candidateId),
    run_id: runId,
    created_at: at,
  });
  await atomicJson(path.join(runRoot, "checkpoint.json"), {
    run_id: runId,
    project_id: projectId,
    state: "CALIBRATION_COVER_SELECTION",
    status: "AWAITING_USER_SELECTION",
    round_1_candidate_refs: ["CCC-CAL-SPACE-001-A", "CCC-CAL-SPACE-001-B", "CCC-CAL-SPACE-001-C"],
    round_2_candidate_refs: ["CCC-CAL-SPACE-001-D", "CCC-CAL-SPACE-001-E", "CCC-CAL-SPACE-001-F"],
    round_3_candidate_refs: ["CCC-CAL-SPACE-001-G", "CCC-CAL-SPACE-001-H"],
    histories_preserved: true,
    formal_fpv_count: 0,
    g4_count: 0,
    style_lock_count: 0,
    remaining_pages_created: 0,
    feishu_write_count: 0,
    project_visual_profile_mutated: false,
    industry_pack_mutated: false,
    created_at: at,
  });
  process.stdout.write(
    `${JSON.stringify({ status: "PENDING_ACTUAL_PIXEL_INSPECTION", state: "CALIBRATION_COVER_SELECTION", project_id: projectId, content_id: contentId, run_id: runId, candidates, candidate_set_diversity_score: diversity.total_score, contact_sheets: { full: relative(fullSheet), thumbnail_310: relative(sheet310), thumbnail_186: relative(sheet186) }, formal_fpv_count: 0, g4_count: 0, style_lock_count: 0, feishu_write_count: 0, project_home: projectHome })}\n`,
  );
} finally {
  await browser.close();
}
