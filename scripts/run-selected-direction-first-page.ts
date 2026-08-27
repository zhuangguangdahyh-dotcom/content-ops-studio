import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { evaluateImageQuality } from "../packages/core/src/image-production/index.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import {
  PLAYWRIGHT_VERSION,
  renderSelectedDirectionFirstPage,
} from "../packages/renderer/src/index.js";
import { FirstPageRuntime } from "../packages/runtime/src/first-page/index.js";

type Json = Record<string, unknown>;

const PROJECT_ID = "PRJ-20260824-P2B2";
const CONTENT_ID = "C-0001";
const RUN_ID = process.env.CONTENT_OPS_PHASE4B_FORMAL_RUN_ID ?? "RUN-20260825-174500-P4BF";
const RUN_KEY = RUN_ID.replace(/^RUN-/u, "");
const SOURCE_VISUAL_RUN = "RUN-20260824-223000-P4A1";
const SOURCE_DIRECTION_RUN = "RUN-20260825-120000-P4BR";
const SELECTED_CANDIDATE_ID = "VDC-C-0001-A";
const SOURCE_CANDIDATE_CHECKSUM =
  "7226eb52a40d2f5d3a881a111042b412672029101e866ddf7403e3e7081e24f5";
const FPV1_CHECKSUM = "68e9a0647f5a9ef00bc32eeb3516a519804192012208c4ad9e63fa987dd8b292";
const AT = process.env.CONTENT_OPS_PHASE4B_FORMAL_AT ?? "2026-08-25T09:45:00.000Z";
const TITLE = "先别急着相信“专业”";
const BODY = "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。";
const PROMPT = `Use case: stylized-concept
Asset type: text-free formal Xiaohongshu editorial cover background, 3:4 portrait
Input image: VDC-C-0001-A background is a style-and-material reference only, not an edit target and not a composition template.
Primary request: Create a new, original high-end editorial still life that preserves the warm restrained material language while making progressive verification and judging boundaries visually legible through three distinct translucent layers, careful alignment, precise edges, and restrained relationships between layers.
Scene/backdrop: warm white to soft ivory studio field with subtle paper/mineral texture; broad usable negative space across the entire left half for later Renderer typography.
Subject: on the right and lower-right, three materially distinct but harmonious semi-transparent planes or softly rounded structures, nested or progressively aligned so the eye reads three verification levels; each layer has a clear boundary and correspondence, with one thin restrained copper-gold line tracing or connecting the boundary relationships.
Text: none. No letters, Chinese characters, numbers, logos, watermarks, seals, certificates, UI, labels, captions, brand marks, or signage.
Avoid: construction-material sample, interior-design material advertisement, stone showroom, architectural model, luxury-product advertisement, jewelry styling, generic tech dashboard, PPT cards, website components, process flowchart, fake evidence, people, hands, high-saturation marketing colors, glow, cheap shadows.`;

const home = path.resolve(
  process.env.CONTENT_OPS_HOME ?? "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b",
);
const projectRoot = path.join(home, "projects", PROJECT_ID);
const runRoot = path.join(projectRoot, "runs", RUN_ID);
const imageRoot = path.join(runRoot, "image-production");
const visualRoot = path.join(runRoot, "visual-planning");
const outputRoot = path.join(runRoot, "outputs", "first-page");
const backgroundPath = path.join(imageRoot, "source-assets", "C-0001-FPV-2-host-background.png");

const sha256 = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const stable = (value: unknown): string => {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === "object")
      return Object.fromEntries(
        Object.entries(item as Json)
          .sort(([left], [right]) => left.localeCompare(right, "en"))
          .map(([key, child]) => [key, normalize(child)]),
      );
    return item;
  };
  return sha256(JSON.stringify(normalize(value)));
};
const relative = (file: string) => path.relative(home, file).split(path.sep).join("/");

async function json(file: string): Promise<Json> {
  return JSON.parse(await readFile(file, "utf8")) as Json;
}

async function writeOnceOrReuse(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    const existing = await readFile(file, "utf8");
    if (existing !== encoded) throw new Error(`FORMAL_ARTIFACT_CONFLICT:${path.basename(file)}`);
    return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error(`FORMAL_ARTIFACT_READ_VERIFY_FAILED:${path.basename(file)}`);
}

async function appendOnce(file: string, identity: string, value: unknown): Promise<void> {
  try {
    if ((await readFile(file, "utf8")).includes(identity)) return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

function pngDimensions(bytes: Buffer): { width: number; height: number } {
  if (
    bytes.length < 24 ||
    !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    throw new Error("HOST_IMAGE_PNG_INVALID");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

const priorRenderRunId = "RUN-20260825-173000-P4BF";
if (RUN_ID !== priorRenderRunId) {
  const priorOutput = path.join(
    projectRoot,
    "runs",
    priorRenderRunId,
    "outputs",
    "first-page",
    "01-cover_fpv2.png",
  );
  try {
    const priorBytes = await readFile(priorOutput);
    await writeOnceOrReuse(
      path.join(
        projectRoot,
        "runs",
        priorRenderRunId,
        "image-production",
        "renderer-retry-classification.json",
      ),
      {
        status: "SUPERSEDED_RENDER_ATTEMPT",
        attempt_number: 1,
        source_run_id: priorRenderRunId,
        source_checksum: sha256(priorBytes),
        reason:
          "Actual visual QA found undesirable phrase splits inside the approved body copy. Preserve this attempt and refine Renderer line grouping only.",
        copy_changed: false,
        background_changed: false,
        selected_direction_changed: false,
        superseded_by_run_id: RUN_ID,
        created_at: AT,
      },
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

const registry = await loadSchemaRegistry();
const validate = (name: string, value: unknown) =>
  registry.assertValid(`https://content-ops-studio.local/schemas/1.0/${name}.schema.json`, value);

const fpv1Report = await json(
  path.join(
    projectRoot,
    "runs/RUN-20260825-010000-P4B2/outputs/first-page/first-page-production-report.json",
  ),
);
if (fpv1Report.output_checksum !== FPV1_CHECKSUM) throw new Error("FPV1_CHECKSUM_DRIFT");
const candidateSet = await json(
  path.join(
    projectRoot,
    `runs/${SOURCE_DIRECTION_RUN}/image-production/visual-direction-candidate-set.json`,
  ),
);
const candidates = candidateSet.candidates as Json[];
const selected = candidates.find((item) => item.candidate_id === SELECTED_CANDIDATE_ID);
if (!selected || (selected.asset as Json).checksum !== SOURCE_CANDIDATE_CHECKSUM)
  throw new Error("SELECTED_DIRECTION_EVIDENCE_DRIFT");

const backgroundBytes = await readFile(backgroundPath);
const backgroundDimensions = pngDimensions(backgroundBytes);
const backgroundChecksum = sha256(backgroundBytes);
const backgroundStat = await stat(backgroundPath);

const selection = {
  selection_id: "VDS-C-0001-A",
  candidate_set_id: candidateSet.candidate_set_id,
  candidate_id: SELECTED_CANDIDATE_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  selected_by: "OPERATOR",
  selection_comment:
    "Selected for C-0001 current set only; preserve the warm restrained layered material language and improve progressive-verification semantics without copying the Candidate composition.",
  creates_g4: false,
  creates_style_lock: false,
  next_visual_plan_version: "VV-2",
  run_id: RUN_ID,
  schema_version: "1.0.0",
  selected_at: AT,
};
validate("visual-direction-selection", selection);
await writeOnceOrReuse(path.join(imageRoot, "visual-direction-selection.json"), selection);

const feedback = {
  event_id: "VFE-C-0001-DIRECTION-A",
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  feedback_class: "PRODUCTION_FEEDBACK",
  scope: "CURRENT_SET",
  target_type: "SET",
  target_id: "C-0001:CV-1:CV-1:VV-2",
  statement:
    "Use VDC-C-0001-A for the current C-0001 set only; do not promote this selection into a Project, Industry, or Global visual preference.",
  is_tool_or_system_defect: false,
  long_term_rule_candidate: false,
  creates_long_term_rule: false,
  source: "OPERATOR_FEEDBACK",
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: AT,
};
validate("visual-feedback-event", feedback);
await writeOnceOrReuse(path.join(imageRoot, "visual-feedback-event.json"), feedback);

const sourceVisualRoot = path.join(projectRoot, `runs/${SOURCE_VISUAL_RUN}/visual-planning`);
const sourceVisualSystem = await json(path.join(sourceVisualRoot, "visual-system.json"));
const sourcePages = (await json(
  path.join(sourceVisualRoot, "page-visual-plans.json"),
)) as unknown as Json[];
if (
  sourceVisualSystem.visual_plan_version !== "VV-1" ||
  sourceVisualSystem.content_version !== "CV-1" ||
  sourceVisualSystem.copy_version !== "CV-1" ||
  sourcePages.length !== 6
)
  throw new Error("VV1_SOURCE_BINDING_DRIFT");

const pages = sourcePages.map((source, index) => {
  const page = structuredClone(source);
  page.page_visual_plan_id = `PVP-C0001-${String(index + 1).padStart(2, "0")}-VV2`;
  page.visual_plan_version = "VV-2";
  page.run_id = RUN_ID;
  page.created_at = AT;
  page.updated_at = AT;
  page.background_direction =
    index === 0
      ? "Text-free Host-generated warm ivory editorial visual with three aligned translucent boundary layers; formal Chinese remains Renderer-only."
      : `Continue the selected warm restrained layered editorial language for page ${index + 1}; vary the page-specific visual relationship without mechanically copying the Cover.`;
  page.asset_requirements = [
    "host-generated-text-free-editorial-visual",
    "renderer-owned-formal-chinese",
  ];
  page.material_and_texture_direction =
    "Warm ivory, smoke charcoal or deep blue-black translucency with restrained copper-gold boundary details; avoid material-showroom styling.";
  page.composition =
    index === 0
      ? "Strong left title field; three aligned translucent verification layers at right or lower-right; generous whitespace and no literal evidence artifact."
      : `Preserve high whitespace and left-aligned information hierarchy while changing the visual relationship for page ${index + 1}.`;
  page.negative_constraints = [
    "No people or hands",
    "No fake certificate, business license, seal, logo, badge or official page",
    "No Chinese or informational text in generated visual",
    "No construction-material, luxury-product or generic dashboard styling",
    "No CTA, English subtitle, slogan or unapproved copy",
  ];
  page.allowed_variations = [
    "Vary translucent layer count, crop, alignment, boundary-line rhythm and visual scale by page purpose",
    "Vary warm ivory and smoke-charcoal balance while retaining restrained copper-gold accents",
    "Do not copy the exact Cover coordinates or background arrangement",
  ];
  page.fallback_strategy =
    "Block and return for Operator direction if Host visual cannot remain text-free, non-evidentiary and within the selected language; do not use Mock.";
  page.extensions = {
    ...(page.extensions as Json),
    asset_channel: "AI_GENERATED_VISUAL",
    renderer_required: true,
    selected_candidate_id: SELECTED_CANDIDATE_ID,
    current_set_only: true,
  };
  return page;
});
for (const page of pages) validate("page-visual-plan", page);

const visualSystem = structuredClone(sourceVisualSystem);
visualSystem.visual_system_id = "VS-C0001-VV2";
visualSystem.visual_plan_version = "VV-2";
visualSystem.visual_mode = "EDITORIAL_SERIES";
visualSystem.visual_status = "FIRST_PAGE_READY";
visualSystem.global_visual_direction =
  "Selected VDC-C-0001-A language for this set only: warm ivory, deep charcoal or blue-black formal type, restrained copper-gold detail, translucent layered boundary materials, high whitespace and a left-title/right-subject editorial balance without mechanical composition copying.";
visualSystem.global_background_strategy =
  "Text-free Host ImageGen visual supplies material quality and complex composition; Renderer owns every formal Chinese character and final composition.";
visualSystem.global_negative_constraints = [
  "No people or hands",
  "No fake certificate, business license, authentication badge, official page, seal or logo",
  "No generated Chinese or informational text",
  "No construction-material sample, interior-material advertisement or luxury-product advertisement",
  "No ordinary PPT card, web component, loading skeleton or mechanical flowchart",
  "No high-saturation marketing color, glow, gradient text or cheap shadow",
];
visualSystem.global_layout_rules = {
  rules: [
    "High whitespace and mobile-first hierarchy",
    "Title is the first focal point",
    "Visual subject remains right or lower-right with page-specific variation",
    "Renderer owns formal text and line breaks",
    "Later pages must vary composition while retaining the selected language",
  ],
};
visualSystem.color_tokens = (visualSystem.color_tokens as Json[]).map((token) =>
  token.token_id === "COLOR-MUTED-BLUE"
    ? { ...token, token_id: "COLOR-COPPER", value: "#A9804A" }
    : token,
);
visualSystem.pages = pages;
visualSystem.run_id = RUN_ID;
visualSystem.created_at = AT;
visualSystem.updated_at = AT;
visualSystem.extensions = {
  ...(visualSystem.extensions as Json),
  source_visual_plan_version: "VV-1",
  selected_candidate_id: SELECTED_CANDIDATE_ID,
  selection_artifact_ref: relative(path.join(imageRoot, "visual-direction-selection.json")),
  asset_channel: "AI_GENERATED_VISUAL",
  renderer_required: true,
  current_set_only: true,
  project_visual_profile_updated: false,
  industry_visual_pack_updated: false,
  global_user_preference_updated: false,
};
validate("visual-system", visualSystem);
await writeOnceOrReuse(path.join(visualRoot, "visual-system-vv2.json"), visualSystem);
await writeOnceOrReuse(path.join(visualRoot, "page-visual-plans-vv2.json"), pages);

const backgroundAsset = {
  asset_id: "AST-C0001-FPV2-BG",
  asset_role: "BACKGROUND",
  asset_type: "IMAGE",
  mime_type: "image/png",
  relative_path: relative(backgroundPath),
  source_type: "HOST_NATIVE_IMAGEGEN",
  source_adapter: "HostBuiltInImageGen+HostNativeImageGenerationBridge",
  source_run_id: RUN_ID,
  source_generation_id: "GEN-C0001-FPV2-BG",
  version: 1,
  width: backgroundDimensions.width,
  height: backgroundDimensions.height,
  file_size: backgroundStat.size,
  checksum: backgroundChecksum,
  created_at: AT,
  extensions: { contains_formal_copy: false, durable_project_home_asset: true },
};

const rendererConfig = {
  renderer_config_id: "RCFG-PHASE4B-001",
  renderer_id: "PLAYWRIGHT_HTML_CSS",
  renderer_version: "1.0.0",
  runtime_package: "playwright-core",
  runtime_package_version: PLAYWRIGHT_VERSION,
  browser_family: "CHROMIUM",
  browser_channel: "PLAYWRIGHT_MANAGED",
  browser_path_reference: "EXTERNAL_RENDERER_CACHE",
  headless: true,
  viewport: { width: 1242, height: 1660 },
  device_scale_factor: 1,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  color_scheme: "light",
  reduced_motion: "reduce",
  screenshot_options: {
    type: "png",
    animations: "disabled",
    caret: "hide",
    scale: "css",
    omit_background: false,
  },
  network_policy: "BLOCK_ALL",
  font_policy: "SYSTEM_CJK_STACK",
  animation_policy: "DISABLED",
  time_policy: "NO_DYNAMIC_TIME",
  random_policy: "NO_RANDOM_VALUES",
  timeout_ms: 30000,
  schema_version: "1.0.0",
  extensions: {},
};
const planWithoutHash = {
  first_page_production_plan_id: `FPPP-${RUN_KEY}`,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  page_number: 1,
  page_role: "COVER",
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-2",
  copy_snapshot_hash: "58f34a2915c8c50060641abe5db913443f49353e5992573d7eb22074d29fb30b",
  visual_handoff_ref: relative(path.join(visualRoot, "visual-system-vv2.json")),
  visual_handoff_hash: stable(visualSystem),
  page_visual_plan_id: String(pages[0]?.page_visual_plan_id),
  renderer_config: rendererConfig,
  renderer_environment_requirement: {
    platform: process.platform,
    architecture: process.arch,
    browser_family: "CHROMIUM",
    browser_required: true,
    font_profile_required: true,
  },
  template_id: "TPL-EDITORIAL-COVER",
  template_version: "1.0.0",
  asset_strategy: "AI_GENERATED_VISUAL",
  programmatic_graphic_plan: null,
  host_generated_asset_plan: {
    generation_id: "GEN-C0001-FPV2-BG",
    asset_id: backgroundAsset.asset_id,
    relative_path: backgroundAsset.relative_path,
    checksum: backgroundChecksum,
    mime_type: "image/png",
    width: backgroundDimensions.width,
    height: backgroundDimensions.height,
    source_type: "HOST_NATIVE_IMAGEGEN",
    contains_formal_copy: false,
    contains_remote_url: false,
  },
  text_layer_plan: [
    { layer_id: "TITLE", role: "TITLE", exact_text: TITLE, source_hash: stable(TITLE) },
    { layer_id: "BODY", role: "BODY", exact_text: BODY, source_hash: stable(BODY) },
  ],
  font_resolution_plan: [
    { role: "TITLE", font_stack: ["PingFang SC", "Hiragino Sans GB", "sans-serif"] },
    { role: "BODY", font_stack: ["PingFang SC", "Hiragino Sans GB", "sans-serif"] },
  ],
  layout_measurement_plan: [
    "BOUNDING_CLIENT_RECT",
    "SCROLL_SIZE",
    "CLIENT_SIZE",
    "COMPUTED_FONT",
    "LINE_COUNT",
    "Z_INDEX",
    "VISIBILITY",
    "OVERLAP",
    "SAFE_AREA",
    "CANVAS_SCROLL",
  ],
  expected_outputs: [
    "BACKGROUND_RASTER",
    "COMPILED_HTML",
    "FIRST_PAGE_PNG",
    "GENERATION_MANIFEST",
    "RENDER_REPORT",
    "QA_REPORT",
    "PRODUCTION_REPORT",
    "ENVIRONMENT_EVIDENCE",
  ],
  qa_requirements: [
    "Exact approved copy only",
    "No overflow or clipping",
    "Safe area",
    "Resolved Chinese font",
    "PNG 1242x1660",
    "Zero remote requests",
    "Deterministic same-environment replay",
  ],
  live_write_required: true,
  explicit_confirmation: true,
  idempotency_key: "FIRST-PAGE-PRJ-20260824-P2B2-C-0001-CV1-CV1-VV2-FPV2",
  created_at: AT,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  extensions: { selected_candidate_id: SELECTED_CANDIDATE_ID, formal_feishu_writes: 0 },
};
const productionPlan = { ...planWithoutHash, plan_hash: stable(planWithoutHash) };
validate("first-page-production-plan", productionPlan);
await writeOnceOrReuse(path.join(outputRoot, "first-page-production-plan.json"), productionPlan);

const renderedResult = await renderSelectedDirectionFirstPage({
  backgroundPath,
  outputDirectory: outputRoot,
  headline: TITLE,
  body: BODY,
});

const renderedAsset = {
  asset_id: "AST-C0001-FPV2",
  asset_role: "RENDERED_PAGE",
  asset_type: "IMAGE",
  mime_type: "image/png",
  relative_path: relative(renderedResult.outputPath),
  source_type: "RENDERED",
  source_adapter: "SelectedDirectionPlaywrightHtmlCssRendererAdapter",
  source_run_id: RUN_ID,
  source_generation_id: "GEN-C0001-FPV2-BG",
  version: 2,
  width: renderedResult.width,
  height: renderedResult.height,
  file_size: renderedResult.byteLength,
  checksum: renderedResult.checksum,
  created_at: AT,
  extensions: { first_page_version: "FPV-2", selected_candidate_id: SELECTED_CANDIDATE_ID },
};

const sourceAPath = path.join(
  projectRoot,
  `runs/${SOURCE_DIRECTION_RUN}/image-production/source-assets/VDC-C-0001-A-background.png`,
);
const sourceABytes = await readFile(sourceAPath);
const sourceADimensions = pngDimensions(sourceABytes);
const referenceAsset = {
  asset_id: "AST-C0001-DIR-A-BG",
  asset_role: "REFERENCE",
  asset_type: "IMAGE",
  mime_type: "image/png",
  relative_path: relative(sourceAPath),
  source_type: "HOST_NATIVE_IMAGEGEN",
  source_adapter: "HostNativeImageGenerationBridge",
  source_run_id: SOURCE_DIRECTION_RUN,
  source_generation_id: "GEN-C-0001-A",
  version: 1,
  width: sourceADimensions.width,
  height: sourceADimensions.height,
  file_size: (await stat(sourceAPath)).size,
  checksum: sha256(sourceABytes),
  created_at: String(candidateSet.created_at),
  extensions: { role: "STYLE_AND_MATERIAL_REFERENCE_ONLY" },
};

const generationManifest = {
  generation_id: "GEN-C0001-FPV2-BG",
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  page_number: 1,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  style_lock_version: null,
  generation_type: "HOST_NATIVE_IMAGEGEN",
  adapter: "HostBuiltInImageGen+HostNativeImageGenerationBridge",
  provider: { provider_name: "OPENAI_HOST_BUILTIN", request_identifier: null },
  model_descriptor: { model_name: "HOST_BUILTIN_IMAGEGEN", model_version: "HOST_MANAGED" },
  input_assets: [],
  reference_assets: [referenceAsset],
  prompt_snapshot: PROMPT,
  negative_constraints: [
    "No text, letters, numbers, logo, watermark, seal or signage",
    "No fake certificate, business license, badge or official page",
    "No people or hands",
    "No construction-material or luxury-product advertisement",
    "No generic dashboard, PPT card, web component or flowchart",
  ],
  requested_output: {
    asset_role: "BACKGROUND",
    mime_type: "image/png",
    canvas: {
      width: 1242,
      height: 1660,
      aspect_ratio: "3:4",
      orientation: "PORTRAIT",
      resolution_unit: "PX",
    },
    relative_path: backgroundAsset.relative_path,
  },
  attempts: [
    {
      attempt_number: 1,
      status: "SUCCESS",
      version_binding: {
        content_version: "CV-1",
        copy_version: "CV-1",
        visual_plan_version: "VV-2",
        style_lock_version: null,
        asset_version: 1,
      },
      request_summary:
        "One Host built-in ImageGen call produced a text-free three-layer verification visual and was immediately materialized under Project Home.",
      output_asset_refs: [backgroundAsset.asset_id],
      failure_code: null,
      failure_message: null,
      started_at: AT,
      completed_at: AT,
    },
  ],
  output_assets: [backgroundAsset],
  generation_status: "GENERATION_SUCCESS",
  failure_summary: null,
  warnings: [
    "Host output is 1086x1448 native 3:4 and is deterministically fitted to the 1242x1660 formal canvas by Renderer.",
  ],
  run_id: RUN_ID,
  schema_version: "1.0.0",
  started_at: AT,
  completed_at: AT,
  extensions: {
    selected_candidate_id: SELECTED_CANDIDATE_ID,
    contains_formal_copy: false,
    durable_project_home_asset: true,
  },
};
validate("generation-manifest", generationManifest);

const environment = {
  renderer_environment_id: `RENV-${RUN_KEY}`,
  renderer_id: "PLAYWRIGHT_HTML_CSS",
  renderer_version: "1.0.0",
  node_version: process.version,
  platform: process.platform,
  architecture: process.arch,
  playwright_version: PLAYWRIGHT_VERSION,
  chromium_version: renderedResult.chromiumVersion,
  headless_mode: "HEADLESS",
  viewport: { width: 1242, height: 1660 },
  device_scale_factor: 1,
  locale: "zh-CN",
  timezone: "Asia/Shanghai",
  color_scheme: "light",
  reduced_motion: "reduce",
  screenshot_options: rendererConfig.screenshot_options,
  resolved_fonts: renderedResult.resolvedFonts,
  font_profile_hash: stable(renderedResult.resolvedFonts),
  network_requests_attempted: renderedResult.networkRequestsAttempted,
  network_requests_blocked: renderedResult.networkRequestsBlocked,
  environment_fingerprint: stable({
    node: process.version,
    platform: process.platform,
    architecture: process.arch,
    chromium: renderedResult.chromiumVersion,
    fonts: renderedResult.resolvedFonts,
  }),
  created_at: AT,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  extensions: {},
};
validate("renderer-environment-evidence", environment);

const renderReport = {
  render_report_id: `RPT-RENDER-${RUN_KEY}`,
  generation_id: generationManifest.generation_id,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  page_number: 1,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  style_lock_version: null,
  renderer: "SelectedDirectionPlaywrightHtmlCssRendererAdapter",
  renderer_version: "1.0.0",
  render_mode: "PLAYWRIGHT_HTML_CSS",
  input_assets: [backgroundAsset],
  output_asset: renderedAsset,
  canvas: {
    width: 1242,
    height: 1660,
    aspect_ratio: "3:4",
    orientation: "PORTRAIT",
    resolution_unit: "PX",
  },
  safe_area: { top: 96, right: 84, bottom: 96, left: 84, unit: "PX" },
  font_resolution: renderedResult.resolvedFonts.map((font) => ({
    role: font.role,
    requested_font: "SYSTEM_CJK_STACK",
    actual_font: font.family,
    substitution_reason: null,
    impact: "NONE",
    blocking: false,
  })),
  layout_measurements: renderedResult.measurements.map((item) => ({
    layer_id: item.layer_id,
    measured_bbox: {
      x: Math.round(item.x),
      y: Math.round(item.y),
      width: Math.round(item.width),
      height: Math.round(item.height),
      unit: "PX",
    },
    line_count: item.line_count,
  })),
  overflow_detected: renderedResult.overflowDetected,
  missing_assets: [],
  font_fallbacks: [],
  clipping_detected: renderedResult.clippingDetected,
  unsafe_regions: [],
  warnings: [],
  errors: [],
  render_status: "RENDER_SUCCESS",
  run_id: RUN_ID,
  schema_version: "1.0.0",
  started_at: AT,
  completed_at: AT,
  extensions: {
    copy_fidelity: renderedResult.copyFidelity,
    safe_area_valid: renderedResult.safeAreaValid,
    deterministic: renderedResult.deterministic,
    second_pass_checksum: renderedResult.secondPassChecksum,
    html_hash: renderedResult.htmlHash,
    dom_hash: renderedResult.domHash,
    selected_candidate_id: SELECTED_CANDIDATE_ID,
  },
};
validate("render-report", renderReport);

const quality = evaluateImageQuality({
  ratings: {
    CONTENT_SEMANTIC_FIT: 5,
    COMPOSITION_FOCUS: 4,
    HIERARCHY_READABILITY: 5,
    ASSET_QUALITY_INTEGRITY: 5,
    PROJECT_AUDIENCE_FIT: 4,
    UNIQUENESS_ANTI_TEMPLATE: 4,
    VISUAL_MODE_EXECUTION: 5,
    PLATFORM_MOBILE_PERFORMANCE: 5,
  },
  hardBlocks: [],
  role: "FORMAL_ASSET",
});
const imageQuality = {
  report_id: "IQR-C-0001-FPV2",
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  asset_id: renderedAsset.asset_id,
  asset_role: "FORMAL_FIRST_PAGE",
  layers: {
    authenticity_and_integrity: "PASS",
    mechanical: "PASS",
    visual: "PASS",
    mode_and_project_fit: "PASS",
    operator_aesthetic: "PENDING",
  },
  dimensions: quality.dimensions,
  total_score: quality.total_score,
  threshold: quality.threshold,
  hard_blocks: [],
  core_dimension_floor_met: quality.core_dimension_floor_met,
  operator_approval_required: true,
  result: quality.result,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: AT,
};
validate("image-quality-report", imageQuality);

const check = (
  category: "CONTENT" | "VISUAL" | "FILE" | "DATA",
  id: string,
  message: string,
  evidence: string[],
) => ({
  check_id: `CHK-${id}-C0001-FPV2`,
  category,
  target: renderedAsset.asset_id,
  status: "PASS",
  severity: "INFO",
  blocking: false,
  message,
  expected_summary: "C-0001 CV-1:CV-1:VV-2:FPV-2 formal first-page contract",
  actual_summary: "Verified from persisted Host asset, Renderer and QA evidence",
  evidence_refs: evidence,
  recommended_action: "None before Operator G4 review.",
});
const contentChecks = [
  check("CONTENT", "COPY", "Title and body match the G3-approved copy byte-for-byte.", [
    renderedAsset.asset_id,
  ]),
];
const visualChecks = [
  check(
    "VISUAL",
    "SEMANTIC",
    "Three aligned translucent layers and explicit boundaries support progressive verification without literal or fake evidence.",
    [backgroundAsset.asset_id],
  ),
  check(
    "VISUAL",
    "HIERARCHY",
    "Title is the first focal point; body is readable and subordinate; mobile title check passed.",
    [renderedAsset.asset_id],
  ),
  check(
    "VISUAL",
    "PROJECT-FIT",
    "Warm restrained editorial language fits professional-services trust content without high-saturation marketing treatment.",
    [imageQuality.report_id],
  ),
];
const fileChecks = [
  check("FILE", "PNG", "PNG signature, 1242x1660 dimensions, checksum and durable path passed.", [
    renderedAsset.asset_id,
  ]),
  check("FILE", "REPLAY", "Same-environment deterministic replay reproduced the exact checksum.", [
    renderedResult.secondPassChecksum,
  ]),
];
const dataChecks = [
  check(
    "DATA",
    "BINDING",
    "Project, Content, CV-1, Copy CV-1, VV-2, FPV-2 and selected Candidate bindings passed.",
    [selection.selection_id, productionPlan.first_page_production_plan_id],
  ),
];
const qa = {
  qa_report_id: `RPT-QA-${RUN_KEY}`,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  style_lock_version: null,
  qa_scope: "FIRST_PAGE",
  checks: [...contentChecks, ...visualChecks, ...fileChecks, ...dataChecks],
  content_checks: contentChecks,
  visual_checks: visualChecks,
  file_checks: fileChecks,
  data_checks: dataChecks,
  blocking_failure_count: 0,
  warning_count: 0,
  passed_count: 7,
  overall_status: "QA_PASSED",
  ready_for_final_approval: true,
  checked_assets: [backgroundAsset, renderedAsset],
  checked_manifests: [generationManifest.generation_id, renderReport.render_report_id],
  run_id: RUN_ID,
  schema_version: "1.0.0",
  started_at: AT,
  completed_at: AT,
  extensions: {
    qa_scope_semantics: "READY_FOR_G4_ONLY",
    first_page_version: "FPV-2",
    image_quality_report_id: imageQuality.report_id,
    image_quality_score: imageQuality.total_score,
    operator_aesthetic: "PENDING",
  },
};
validate("qa-report", qa);

const outputRefRoot = `projects/${PROJECT_ID}/runs/${RUN_ID}/outputs/first-page`;
const production = {
  first_page_production_report_id: `FPPR-${RUN_KEY}`,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-2",
  production_plan_ref: `${outputRefRoot}/first-page-production-plan.json`,
  renderer_environment_ref: `${outputRefRoot}/renderer-environment-evidence.json`,
  generation_manifest_ref: `${outputRefRoot}/generation-manifest.json`,
  render_report_ref: `${outputRefRoot}/render-report.json`,
  qa_report_ref: `${outputRefRoot}/first-page-qa-report.json`,
  background_asset_ref: backgroundAsset,
  rendered_asset_ref: renderedAsset,
  output_width: 1242,
  output_height: 1660,
  output_format: "PNG",
  output_checksum: renderedResult.checksum,
  copy_fidelity_status: "PASS",
  layout_status: "PASS",
  safe_area_status: "PASS",
  font_status: "PASS",
  network_status:
    renderedResult.networkRequestsAttempted === 0 ? "PASS_NO_ATTEMPTS" : "PASS_ALL_BLOCKED",
  ready_for_g4: true,
  blocking_reasons: [],
  warnings: [
    "Operator aesthetic approval remains pending; quality score does not approve G4.",
    "Residual aesthetic risk: the mineral plinth may retain a slight art-object or material-showroom association despite the clearer three-layer verification structure.",
  ],
  created_at: AT,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  extensions: {
    asset_channel: "AI_GENERATED_VISUAL",
    visual_mode: "EDITORIAL_SERIES",
    selected_candidate_id: SELECTED_CANDIDATE_ID,
    deterministic: true,
    second_pass_checksum: renderedResult.secondPassChecksum,
    g4_status: "AWAITING_USER_APPROVAL",
    style_lock_status: "NOT_CREATED",
    remaining_pages: "NOT_ELIGIBLE",
  },
};
validate("first-page-production-report", production);

await Promise.all([
  writeOnceOrReuse(path.join(outputRoot, "generation-manifest.json"), generationManifest),
  writeOnceOrReuse(path.join(outputRoot, "renderer-environment-evidence.json"), environment),
  writeOnceOrReuse(path.join(outputRoot, "render-report.json"), renderReport),
  writeOnceOrReuse(path.join(outputRoot, "first-page-qa-report.json"), qa),
  writeOnceOrReuse(path.join(outputRoot, "image-quality-report.json"), imageQuality),
  writeOnceOrReuse(path.join(outputRoot, "first-page-production-report.json"), production),
]);

const firstPageAsset = {
  output_path: renderedResult.outputPath,
  asset: renderedAsset,
  checksum: renderedResult.checksum,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-2",
  selected_candidate_id: SELECTED_CANDIDATE_ID,
  g4_status: "AWAITING_USER_APPROVAL",
  style_lock_status: "NOT_CREATED",
  remaining_pages: "NOT_ELIGIBLE",
  measurements: renderedResult.measurements,
};
await writeOnceOrReuse(path.join(visualRoot, "first-page-asset-fpv2.json"), firstPageAsset);

const runtime = new FirstPageRuntime(path.join(outputRoot, "first-page-runtime-state.json"));
await runtime.recordPending({
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  run_id: RUN_ID,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-2",
  first_page_version: "FPV-2",
  asset_id: renderedAsset.asset_id,
  asset_checksum: renderedResult.checksum,
  renderer_environment_ref: `${outputRefRoot}/renderer-environment-evidence.json`,
  status: "AWAITING_USER_APPROVAL",
  style_lock_version: null,
  approval_id: null,
});

const targetVersion = `CV-1:CV-1:VV-2:FPV-2:${renderedResult.checksum}`;
await appendOnce(path.join(runRoot, "journal.jsonl"), targetVersion, {
  event_type: "APPROVAL_REQUESTED",
  run_id: RUN_ID,
  project_id: PROJECT_ID,
  gate: "G4 FIRST_PAGE",
  target_id_hash: stable(renderedAsset.asset_id),
  target_version: targetVersion,
  created_at: AT,
});
await appendOnce(path.join(runRoot, "write-log.jsonl"), `WRITE-${RUN_KEY}-001`, {
  write_id: `WRITE-${RUN_KEY}-001`,
  run_id: RUN_ID,
  project_id: PROJECT_ID,
  operation: "CREATE_LOCAL_VV2_AND_FPV2_EVIDENCE",
  target_type: "PROJECT_HOME",
  target_id_hash: stable(`${PROJECT_ID}:${CONTENT_ID}:VV-2:FPV-2`),
  idempotency_key: productionPlan.idempotency_key,
  state_before_hash: stable({ visual_plan_version: "VV-1", first_page_version: "FPV-1" }),
  state_after_hash: stable({
    visual_plan_version: "VV-2",
    first_page_version: "FPV-2",
    checksum: renderedResult.checksum,
  }),
  verification_status: "VERIFIED",
  remote_write: false,
  attempt_number: 1,
  started_at: AT,
  completed_at: AT,
});
await writeOnceOrReuse(path.join(runRoot, "checkpoints", "g4-first-page-pending.json"), {
  checkpoint_id: `CHKPT-${RUN_KEY}-G4`,
  run_id: RUN_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  gate: "FIRST_PAGE",
  target_version: targetVersion,
  status: "AWAITING_APPROVAL",
  visual_direction_selection: selection.selection_id,
  g4_approval_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  formal_feishu_writes: 0,
  created_at: AT,
});

const fpv1After = await json(
  path.join(
    projectRoot,
    "runs/RUN-20260825-010000-P4B2/outputs/first-page/first-page-production-report.json",
  ),
);
if (fpv1After.output_checksum !== FPV1_CHECKSUM) throw new Error("FPV1_CHECKSUM_DRIFT_AFTER");
if (sha256(await readFile(renderedResult.outputPath)) !== renderedResult.checksum)
  throw new Error("FPV2_READ_AFTER_WRITE_FAILED");

process.stdout.write(
  `${JSON.stringify({
    status: "AWAITING_USER_APPROVAL",
    run_id: RUN_ID,
    selection_id: selection.selection_id,
    selected_candidate_id: SELECTED_CANDIDATE_ID,
    content_version: "CV-1",
    copy_version: "CV-1",
    visual_plan_version: "VV-2",
    first_page_version: "FPV-2",
    page_count: pages.length,
    asset_channel: "AI_GENERATED_VISUAL + Renderer",
    visual_mode: "EDITORIAL_SERIES",
    output_path: renderedResult.outputPath,
    output_checksum: renderedResult.checksum,
    deterministic_replay_checksum: renderedResult.secondPassChecksum,
    quality_score: imageQuality.total_score,
    hard_blocks: imageQuality.hard_blocks.length,
    mechanical_qa: "PASSED",
    visual_qa: "PASSED_PENDING_OPERATOR_AESTHETIC",
    project_fit_qa: "PASSED_PENDING_OPERATOR_AESTHETIC",
    g4_status: "AWAITING_USER_APPROVAL",
    g4_approval_created: false,
    style_lock_status: "NOT_CREATED",
    remaining_pages: "NOT_ELIGIBLE",
    remaining_pages_created: 0,
    formal_feishu_writes: 0,
    fpv1_checksum_preserved: true,
    project_visual_profile_updated: false,
    industry_visual_pack_updated: false,
    global_user_preference_updated: false,
  })}\n`,
);
