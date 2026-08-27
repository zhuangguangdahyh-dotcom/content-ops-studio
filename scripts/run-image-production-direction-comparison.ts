import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import {
  evaluateImageQuality,
  type QualityRatings,
} from "../packages/core/src/image-production/index.js";
import {
  buildDirectionContactSheetHtml,
  buildDirectionPreviewHtml,
  DIRECTION_CONTACT_SHEET_CANVAS,
  DIRECTION_PREVIEW_CANVAS,
  type DirectionComparisonKey,
} from "../packages/renderer/src/direction-comparison.js";

const PROJECT_ID = "PRJ-20260824-P2B2";
const CONTENT_ID = "C-0001";
const SOURCE_RUN_ID = "RUN-20260825-120000-P4BR";
const PREVIOUS_COMPARISON_RUN_ID = "RUN-20260825-150000-P4RC";
const RUN_ID = "RUN-20260825-153000-P4RC";
const CANDIDATE_SET_ID = "VDCS-C-0001-P4BR";
const COMPARISON_SET_ID = "VDCPS-C-0001-P4RC2";
const FEEDBACK_EVENT_ID = "VFE-C-0001-COMPARISON-2";
const TITLE = "先别急着相信“专业”";
const BODY = "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。";
const EXPECTED_ORIGINALS = {
  A: "7226eb52a40d2f5d3a881a111042b412672029101e866ddf7403e3e7081e24f5",
  B: "f993498ba719c0d574ff1c038a3029ab0430022b5d15e70eb660570b7e7c81c1",
  C: "8fd4f1977b62819d80143c0bed37475ef1ad5bc40931b1819e297426fa9f87e9",
} as const;

const home = path.resolve(
  process.env.CONTENT_OPS_HOME ?? "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b",
);
const projectRoot = path.join(home, "projects", PROJECT_ID);
const sourceRoot = path.join(projectRoot, "runs", SOURCE_RUN_ID, "image-production");
const runRoot = path.join(projectRoot, "runs", RUN_ID, "image-production");
const previewRoot = path.join(runRoot, "direction-comparison", "complete-previews");
const contactSheetFile = path.join(
  runRoot,
  "direction-comparison",
  "VDCPS-C-0001-P4RC2-contact-sheet.png",
);

function sha256(value: Buffer | string): string {
  return createHash("sha256").update(value).digest("hex");
}

function stableHash(input: unknown): string {
  const normalize = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === "object")
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, normalize(child)]),
      );
    return value;
  };
  return sha256(JSON.stringify(normalize(input)));
}

async function optionalJson(file: string): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Record<string, unknown>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

async function writeBufferIdempotent(file: string, value: Buffer): Promise<"CREATED" | "REUSED"> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  try {
    const existing = await readFile(file);
    if (sha256(existing) !== sha256(value))
      throw new Error(`DIRECTION_COMPARISON_IDEMPOTENCY_CONFLICT:${path.basename(file)}`);
    return "REUSED";
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, value, { mode: 0o600 });
  await rename(temporary, file);
  if (sha256(await readFile(file)) !== sha256(value))
    throw new Error(`DIRECTION_COMPARISON_READ_VERIFY_FAILED:${path.basename(file)}`);
  return "CREATED";
}

async function writeJsonIdempotent(file: string, value: unknown): Promise<"CREATED" | "REUSED"> {
  const encoded = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
  return writeBufferIdempotent(file, encoded);
}

const relativeFromHome = (file: string) => path.relative(home, file).split(path.sep).join("/");
const asDataUri = (bytes: Buffer) => `data:image/png;base64,${bytes.toString("base64")}`;

const sourceCandidateSet = JSON.parse(
  await readFile(path.join(sourceRoot, "visual-direction-candidate-set.json"), "utf8"),
) as {
  candidate_set_id: string;
  status: string;
  candidates: Array<{
    candidate_id: string;
    asset_id: string;
    asset_channel: string;
    visual_mode: string;
    asset: { relative_path: string; checksum: string };
  }>;
};
if (
  sourceCandidateSet.candidate_set_id !== CANDIDATE_SET_ID ||
  sourceCandidateSet.status !== "AWAITING_USER_SELECTION"
)
  throw new Error("DIRECTION_COMPARISON_SOURCE_STATE_INVALID");

const sourceByKey = new Map<
  DirectionComparisonKey,
  (typeof sourceCandidateSet.candidates)[number]
>();
const originalEvidenceBefore = [];
for (const key of ["A", "B", "C"] as const) {
  const candidate = sourceCandidateSet.candidates.find(
    (item) => item.candidate_id === `VDC-C-0001-${key}`,
  );
  if (!candidate || candidate.asset.checksum !== EXPECTED_ORIGINALS[key])
    throw new Error(`DIRECTION_COMPARISON_ORIGINAL_IDENTITY_INVALID:${key}`);
  const candidateFile = path.join(home, candidate.asset.relative_path);
  const qualityFile = path.join(sourceRoot, `${candidate.candidate_id}-image-quality-report.json`);
  const [candidateBytes, qualityBytes] = await Promise.all([
    readFile(candidateFile),
    readFile(qualityFile),
  ]);
  if (sha256(candidateBytes) !== EXPECTED_ORIGINALS[key])
    throw new Error(`DIRECTION_COMPARISON_ORIGINAL_CHECKSUM_DRIFT:${key}`);
  originalEvidenceBefore.push({
    candidate_id: candidate.candidate_id,
    candidate_file: candidateFile,
    candidate_checksum: sha256(candidateBytes),
    quality_file: qualityFile,
    quality_report_checksum: sha256(qualityBytes),
  });
  sourceByKey.set(key, candidate);
}

const backgroundA = await readFile(
  path.join(sourceRoot, "source-assets", "VDC-C-0001-A-background.png"),
);
const backgroundC = await readFile(
  path.join(sourceRoot, "source-assets", "VDC-C-0001-C-background.png"),
);
const idempotencyKey = stableHash({
  source_candidate_set_id: CANDIDATE_SET_ID,
  originals: EXPECTED_ORIGINALS,
  approved_copy: { title: TITLE, body: BODY },
  renderer_contract: "DIRECTION_COMPARISON_V2_NONBREAKING_APPROVED_TERM",
  canvas: DIRECTION_PREVIEW_CANVAS,
});
const metadataFile = path.join(runRoot, "direction-comparison-run-metadata.json");
const existingMetadata = await optionalJson(metadataFile);
const createdAt =
  typeof existingMetadata?.created_at === "string"
    ? existingMetadata.created_at
    : new Date().toISOString();
const runMetadata = {
  run_id: RUN_ID,
  source_run_id: SOURCE_RUN_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  idempotency_key: idempotencyKey,
  intent: "COMPLETE_DIRECTION_COMPARISON_ONLY",
  previous_comparison_attempt_run_id: PREVIOUS_COMPARISON_RUN_ID,
  created_at: createdAt,
};
await writeJsonIdempotent(metadataFile, runMetadata);

const definitions: Array<{
  key: DirectionComparisonKey;
  backgroundDataUri?: string;
  host: boolean;
  ratings: QualityRatings;
  contentStrength: string;
  risk: string;
}> = [
  {
    key: "A",
    backgroundDataUri: asDataUri(backgroundA),
    host: true,
    ratings: {
      CONTENT_SEMANTIC_FIT: 5,
      COMPOSITION_FOCUS: 4,
      HIERARCHY_READABILITY: 5,
      ASSET_QUALITY_INTEGRITY: 5,
      PROJECT_AUDIENCE_FIT: 4,
      UNIQUENESS_ANTI_TEMPLATE: 4,
      VISUAL_MODE_EXECUTION: 5,
      PLATFORM_MOBILE_PERFORMANCE: 4,
    },
    contentStrength: "温和但清晰地承载核验主题，正文与抽象主体互不争抢。",
    risk: "暖色雕塑语言可能让专业核验显得偏柔和，仍需Operator判断行业权威感。",
  },
  {
    key: "B",
    host: false,
    ratings: {
      CONTENT_SEMANTIC_FIT: 4,
      COMPOSITION_FOCUS: 5,
      HIERARCHY_READABILITY: 5,
      ASSET_QUALITY_INTEGRITY: 5,
      PROJECT_AUDIENCE_FIT: 4,
      UNIQUENESS_ANTI_TEMPLATE: 5,
      VISUAL_MODE_EXECUTION: 5,
      PLATFORM_MOBILE_PERFORMANCE: 5,
    },
    contentStrength: "标题成为唯一强焦点，核验判断在移动端最先被读取。",
    risk: "纯排版气质更强硬，情绪温度和Subject联想主要依赖后续页面补足。",
  },
  {
    key: "C",
    backgroundDataUri: asDataUri(backgroundC),
    host: true,
    ratings: {
      CONTENT_SEMANTIC_FIT: 5,
      COMPOSITION_FOCUS: 4,
      HIERARCHY_READABILITY: 4,
      ASSET_QUALITY_INTEGRITY: 5,
      PROJECT_AUDIENCE_FIT: 5,
      UNIQUENESS_ANTI_TEMPLATE: 5,
      VISUAL_MODE_EXECUTION: 5,
      PLATFORM_MOBILE_PERFORMANCE: 4,
    },
    contentStrength: "深色证据感与核验语义一致，标题和正文形成明确的两段阅读路径。",
    risk: "深色技术气质偏冷，若后续结构控制不足可能滑向通用数据面板感。",
  },
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: DIRECTION_PREVIEW_CANVAS,
  deviceScaleFactor: 1,
});
const remoteRequests: string[] = [];
page.on("request", (request) => {
  if (!request.url().startsWith("data:") && request.url() !== "about:blank")
    remoteRequests.push(request.url());
});

const rendered: Array<{
  key: DirectionComparisonKey;
  file: string;
  bytes: Buffer;
  checksum: string;
  fileSize: number;
  quality: ReturnType<typeof evaluateImageQuality>;
  mobileTitleEffectivePx: number;
  host: boolean;
  contentStrength: string;
  risk: string;
}> = [];
for (const definition of definitions) {
  const html = buildDirectionPreviewHtml({
    candidate: definition.key,
    title: TITLE,
    body: BODY,
    ...(definition.backgroundDataUri ? { backgroundDataUri: definition.backgroundDataUri } : {}),
  });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const inspection = await page.evaluate(
    ({ expectedTitle, expectedBody }) => {
      const canvas = document.querySelector<HTMLElement>(".canvas");
      const titleNode = document.querySelector<HTMLElement>('[data-approved-copy="title"]');
      const bodyNode = document.querySelector<HTMLElement>('[data-approved-copy="body"]');
      if (!canvas || !titleNode || !bodyNode) throw new Error("DIRECTION_PREVIEW_DOM_MISSING");
      const canvasRect = canvas.getBoundingClientRect();
      const nodes = [titleNode, bodyNode];
      const measurements = nodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          role: node.dataset.approvedCopy,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          scrollWidth: node.scrollWidth,
          clientWidth: node.clientWidth,
          scrollHeight: node.scrollHeight,
          clientHeight: node.clientHeight,
        };
      });
      const overflow = nodes.some((node) => {
        const rect = node.getBoundingClientRect();
        return (
          rect.left < canvasRect.left ||
          rect.top < canvasRect.top ||
          rect.right > canvasRect.right ||
          rect.bottom > canvasRect.bottom ||
          node.scrollWidth > node.clientWidth + 3 ||
          node.scrollHeight > node.clientHeight + 3
        );
      });
      const allText = document.body.innerText.replaceAll(/\s+/gu, "");
      const expectedText = `${expectedTitle}${expectedBody}`.replaceAll(/\s+/gu, "");
      return {
        title: titleNode.textContent,
        body: bodyNode.textContent,
        approvedCopyOnly: allText === expectedText,
        overflow,
        titleFontPx: Number.parseFloat(getComputedStyle(titleNode).fontSize),
        fontReady: document.fonts.status === "loaded",
        measurements,
      };
    },
    { expectedTitle: TITLE, expectedBody: BODY },
  );
  if (
    inspection.title !== TITLE ||
    inspection.body !== BODY ||
    !inspection.approvedCopyOnly ||
    inspection.overflow ||
    !inspection.fontReady
  )
    throw new Error(
      `DIRECTION_PREVIEW_COPY_OR_LAYOUT_FAILED:${definition.key}:${JSON.stringify(inspection)}`,
    );
  const mobileTitleEffectivePx = inspection.titleFontPx * 0.25;
  if (mobileTitleEffectivePx < 16)
    throw new Error(`DIRECTION_PREVIEW_MOBILE_TITLE_FAILED:${definition.key}`);
  const bytes = await page.screenshot({ type: "png" });
  const file = path.join(previewRoot, `VDC-C-0001-${definition.key}-complete-preview.png`);
  await writeBufferIdempotent(file, bytes);
  const quality = evaluateImageQuality({
    ratings: definition.ratings,
    hardBlocks: [],
    role: "DIRECTION_CANDIDATE",
  });
  rendered.push({
    key: definition.key,
    file,
    bytes,
    checksum: sha256(bytes),
    fileSize: (await stat(file)).size,
    quality,
    mobileTitleEffectivePx,
    host: definition.host,
    contentStrength: definition.contentStrength,
    risk: definition.risk,
  });
}

await page.setViewportSize(DIRECTION_CONTACT_SHEET_CANVAS);
await page.setContent(
  buildDirectionContactSheetHtml({
    previews: rendered.map((item) => ({
      candidate: item.key,
      candidateId: `VDC-C-0001-${item.key}`,
      dataUri: asDataUri(item.bytes),
    })),
  }),
  { waitUntil: "load" },
);
await page.evaluate(() => document.fonts.ready);
const contactSheetInspection = await page.evaluate(() => {
  const images = [...document.querySelectorAll<HTMLImageElement>("img")];
  const labels = [...document.querySelectorAll<HTMLElement>(".label")];
  return {
    imageCount: images.length,
    labelCount: labels.length,
    equalSizes: images.every(
      (image) =>
        image.getBoundingClientRect().width === 675 && image.getBoundingClientRect().height === 900,
    ),
    labelsOutsideFrames: labels.every((label, index) => {
      const image = images[index];
      return Boolean(
        image && label.getBoundingClientRect().bottom <= image.getBoundingClientRect().top,
      );
    }),
  };
});
if (
  contactSheetInspection.imageCount !== 3 ||
  contactSheetInspection.labelCount !== 3 ||
  !contactSheetInspection.equalSizes ||
  !contactSheetInspection.labelsOutsideFrames
)
  throw new Error("DIRECTION_CONTACT_SHEET_LAYOUT_FAILED");
const contactSheetBytes = await page.screenshot({ type: "png" });
await browser.close();
if (remoteRequests.length)
  throw new Error(`DIRECTION_COMPARISON_REMOTE_REQUEST_ATTEMPT:${remoteRequests.join(",")}`);
await writeBufferIdempotent(contactSheetFile, contactSheetBytes);

const registry = await loadSchemaRegistry();
const feedbackEvent = {
  event_id: FEEDBACK_EVENT_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  feedback_class: "PRODUCTION_FEEDBACK",
  scope: "CURRENT_SET",
  target_type: "SET",
  target_id: CANDIDATE_SET_ID,
  statement:
    "Complete a fair Renderer-composed comparison using identical approved copy while preserving the original direction candidates.",
  is_tool_or_system_defect: false,
  long_term_rule_candidate: false,
  creates_long_term_rule: false,
  source: "OPERATOR_FEEDBACK",
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: createdAt,
};
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/visual-feedback-event.schema.json",
  feedbackEvent,
);
await writeJsonIdempotent(path.join(runRoot, `${FEEDBACK_EVENT_ID}.json`), feedbackEvent);

const qualityReports = [];
for (const item of rendered) {
  const report = {
    report_id: `IQR-C-0001-${item.key}-COMPLETE-PREVIEW`,
    project_id: PROJECT_ID,
    content_id: CONTENT_ID,
    asset_id: `AST-C0001-DIR-${item.key}-COMPLETE-PREVIEW`,
    asset_role: "DIRECTION_CANDIDATE",
    layers: {
      authenticity_and_integrity: "PASS",
      mechanical: "PASS",
      visual: "PASS",
      mode_and_project_fit: "PASS",
      operator_aesthetic: "PENDING",
    },
    dimensions: item.quality.dimensions,
    total_score: item.quality.total_score,
    threshold: item.quality.threshold,
    hard_blocks: [],
    core_dimension_floor_met: item.quality.core_dimension_floor_met,
    operator_approval_required: true,
    result: item.quality.result,
    run_id: RUN_ID,
    schema_version: "1.0.0",
    created_at: createdAt,
  };
  registry.assertValid(
    "https://content-ops-studio.local/schemas/1.0/image-quality-report.schema.json",
    report,
  );
  await writeJsonIdempotent(path.join(runRoot, `${report.report_id}.json`), report);
  qualityReports.push(report);
}

const channelByKey = {
  A: "AI_GENERATED_VISUAL",
  B: "PURE_TYPOGRAPHY",
  C: "MIXED_ASSET",
} as const;
const modeByKey = {
  A: "EDITORIAL_SERIES",
  B: "PURE_TYPOGRAPHY",
  C: "MIXED",
} as const;
const previewAsset = (item: (typeof rendered)[number]) => ({
  asset_id: `AST-C0001-DIR-${item.key}-COMPLETE-PREVIEW`,
  asset_role: "DIRECTION_CANDIDATE",
  asset_type: "IMAGE",
  mime_type: "image/png",
  relative_path: relativeFromHome(item.file),
  source_type: "RENDERED",
  source_adapter: "PlaywrightHtmlCssRendererAdapter",
  source_run_id: RUN_ID,
  source_generation_id: `CMP-C-0001-${item.key}`,
  version: 1,
  width: DIRECTION_PREVIEW_CANVAS.width,
  height: DIRECTION_PREVIEW_CANVAS.height,
  file_size: item.fileSize,
  checksum: item.checksum,
  created_at: createdAt,
  extensions: {
    comparison_only: true,
    approved_copy_only: true,
    original_candidate_preserved: true,
  },
});
const comparisonSet = {
  comparison_set_id: COMPARISON_SET_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  source_candidate_set_id: CANDIDATE_SET_ID,
  source_run_id: SOURCE_RUN_ID,
  feedback_event_id: FEEDBACK_EVENT_ID,
  status: "AWAITING_USER_SELECTION",
  approved_copy: {
    title: TITLE,
    body: BODY,
    approved_text_only: true,
    renderer_only: true,
  },
  preview_conditions: {
    width: 1242,
    height: 1660,
    aspect_ratio: "3:4",
    same_copy: true,
    same_scale_in_contact_sheet: true,
    candidate_labels_outside_frames: true,
    text_overflow_free: true,
    mobile_title_legible: true,
  },
  previews: rendered.map((item) => {
    const original = sourceByKey.get(item.key);
    if (!original) throw new Error(`DIRECTION_COMPARISON_SOURCE_MISSING:${item.key}`);
    return {
      candidate_id: original.candidate_id,
      original_asset_id: original.asset_id,
      original_checksum: original.asset.checksum,
      preview_asset: previewAsset(item),
      asset_channel: channelByKey[item.key],
      visual_mode: modeByKey[item.key],
      quality_report_id: `IQR-C-0001-${item.key}-COMPLETE-PREVIEW`,
      quality_score: item.quality.total_score,
      content_match_strength: item.contentStrength,
      aesthetic_risk: item.risk,
      mobile_thumbnail_performance: "PASS",
      host_imagegen_dependency: item.host,
      renderer_dependency: true,
    };
  }),
  contact_sheet_asset: {
    asset_id: "AST-C0001-DIRECTION-CONTACT-SHEET",
    asset_role: "REFERENCE",
    asset_type: "IMAGE",
    mime_type: "image/png",
    relative_path: relativeFromHome(contactSheetFile),
    source_type: "RENDERED",
    source_adapter: "PlaywrightHtmlCssRendererAdapter",
    source_run_id: RUN_ID,
    source_generation_id: "CMP-C-0001-CONTACT-SHEET",
    version: 1,
    width: DIRECTION_CONTACT_SHEET_CANVAS.width,
    height: DIRECTION_CONTACT_SHEET_CANVAS.height,
    file_size: (await stat(contactSheetFile)).size,
    checksum: sha256(contactSheetBytes),
    created_at: createdAt,
    extensions: { comparison_only: true, labels_outside_candidate_frames: true },
  },
  long_term_rule_candidate: false,
  formal_delivery_count: 0,
  feishu_formal_write_count: 0,
  vv2_created: false,
  fpv2_created: false,
  g4_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  idempotency_key: idempotencyKey,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: createdAt,
};
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/visual-direction-comparison-set.schema.json",
  comparisonSet,
);
await writeJsonIdempotent(
  path.join(runRoot, "visual-direction-comparison-set.json"),
  comparisonSet,
);

const originalEvidenceAfter = [];
for (const item of originalEvidenceBefore) {
  const [candidateBytes, qualityBytes] = await Promise.all([
    readFile(item.candidate_file),
    readFile(item.quality_file),
  ]);
  const after = {
    candidate_id: item.candidate_id,
    candidate_checksum: sha256(candidateBytes),
    quality_report_checksum: sha256(qualityBytes),
  };
  if (
    after.candidate_checksum !== item.candidate_checksum ||
    after.quality_report_checksum !== item.quality_report_checksum
  )
    throw new Error(`DIRECTION_COMPARISON_SOURCE_MUTATED:${item.candidate_id}`);
  originalEvidenceAfter.push(after);
}

const writeLog = {
  run_id: RUN_ID,
  idempotency_key: idempotencyKey,
  writes: [
    ...rendered.map((item) => ({
      operation: "WRITE_DIRECTION_COMPLETE_PREVIEW",
      target: relativeFromHome(item.file),
      checksum: item.checksum,
      read_after_write: "PASS",
    })),
    {
      operation: "WRITE_DIRECTION_CONTACT_SHEET",
      target: relativeFromHome(contactSheetFile),
      checksum: sha256(contactSheetBytes),
      read_after_write: "PASS",
    },
    {
      operation: "WRITE_LOCAL_COMPARISON_EVIDENCE",
      target: relativeFromHome(path.join(runRoot, "visual-direction-comparison-set.json")),
      checksum: sha256(await readFile(path.join(runRoot, "visual-direction-comparison-set.json"))),
      read_after_write: "PASS",
    },
  ],
  remote_writes: 0,
  formal_feishu_writes: 0,
  created_at: createdAt,
};
await writeJsonIdempotent(path.join(runRoot, "direction-comparison-write-log.json"), writeLog);
await writeJsonIdempotent(path.join(runRoot, "direction-comparison-journal.json"), {
  run_id: RUN_ID,
  idempotency_key: idempotencyKey,
  events: [
    "SOURCE_CANDIDATES_VERIFIED",
    "APPROVED_COPY_LOCKED",
    "RENDERER_PREVIEWS_CREATED",
    "CONTACT_SHEET_CREATED",
    "QUALITY_REEVALUATED",
    "SOURCE_CANDIDATES_REVERIFIED",
    "AWAITING_USER_SELECTION",
  ],
  errors: [],
  created_at: createdAt,
});
await writeJsonIdempotent(path.join(runRoot, "checkpoint.json"), {
  run_id: RUN_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  state: "VISUAL_DIRECTION_SELECTION",
  status: "AWAITING_USER_SELECTION",
  source_candidate_set_id: CANDIDATE_SET_ID,
  comparison_set_id: COMPARISON_SET_ID,
  candidate_ids: ["VDC-C-0001-A", "VDC-C-0001-B", "VDC-C-0001-C"],
  original_candidates_preserved: true,
  original_evidence_after: originalEvidenceAfter,
  feedback_class: "PRODUCTION_FEEDBACK",
  feedback_scope: "CURRENT_SET",
  long_term_rule_candidate: false,
  vv2_created: false,
  fpv2_created: false,
  formal_first_page: "NOT_STARTED",
  g4_state: "AWAITING_USER_APPROVAL",
  g4_artifact_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  formal_feishu_writes: 0,
  created_at: createdAt,
});

console.log(
  JSON.stringify({
    status: "AWAITING_USER_SELECTION",
    run_id: RUN_ID,
    comparison_set_id: COMPARISON_SET_ID,
    feedback: {
      feedback_class: "PRODUCTION_FEEDBACK",
      scope: "CURRENT_SET",
      long_term_rule_candidate: false,
    },
    previews: rendered.map((item) => ({
      candidate_id: `VDC-C-0001-${item.key}`,
      path: item.file,
      checksum: item.checksum,
      quality_score: item.quality.total_score,
      mobile_title_effective_px_at_quarter_scale: item.mobileTitleEffectivePx,
      host_imagegen_dependency: item.host,
      renderer_dependency: true,
    })),
    contact_sheet: {
      path: contactSheetFile,
      checksum: sha256(contactSheetBytes),
    },
    original_candidates_preserved: true,
    formal_feishu_writes: 0,
    vv2_created: false,
    fpv2_created: false,
    g4_created: false,
    style_lock_created: false,
    remaining_pages_created: 0,
  }),
);
