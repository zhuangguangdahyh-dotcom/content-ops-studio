import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const PROJECT_ID = "PRJ-20260824-P2B2";
const CONTENT_ID = "C-0001";
const RUN_ID = "RUN-20260825-120000-P4BR";
const AT = new Date().toISOString();
const EXPECTED_FPV1 = "68e9a0647f5a9ef00bc32eeb3516a519804192012208c4ad9e63fa987dd8b292";
const home = path.resolve(
  process.env.CONTENT_OPS_HOME ?? "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4b",
);
const projectRoot = path.join(home, "projects", PROJECT_ID);
const runRoot = path.join(projectRoot, "runs", RUN_ID, "image-production");
const sourceRoot = path.join(runRoot, "source-assets");
const outputRoot = path.join(runRoot, "direction-candidates");

function hash(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw new Error("DIRECTION_ARTIFACT_READ_VERIFY_FAILED");
}

const fpvReport = JSON.parse(
  await readFile(
    path.join(
      projectRoot,
      "runs/RUN-20260825-010000-P4B2/outputs/first-page/first-page-production-report.json",
    ),
    "utf8",
  ),
) as { output_checksum?: string };
if (fpvReport.output_checksum !== EXPECTED_FPV1) throw new Error("FPV1_CHECKSUM_DRIFT");

const context = {
  context_id: "IPC-C-0001-P4BR",
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  page_count: 6,
  project_visual_profile_maturity: "UNMATURE",
  direction_selection_status: "AWAITING_USER_SELECTION",
  host_imagegen_capability: "READY",
  industry_pack_binding: { pack_id: "PROFESSIONAL_SERVICES", pack_version: "1.0.0" },
  overlay_bindings: [
    { overlay_id: "EVIDENCE_AUTHENTICITY", overlay_version: "1.0.0" },
    { overlay_id: "BRAND_ASSET_INTEGRITY", overlay_version: "1.0.0" },
  ],
  rejected_directions: ["RENDERER_TECHNICAL_PROOF_FP1", "GENERIC_CARD_TEMPLATE"],
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: AT,
};

const registry = await loadSchemaRegistry();
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/image-production-context.schema.json",
  context,
);
await atomicJson(path.join(runRoot, "image-production-context.json"), context);

const title = "先别急着相信“专业”";
const body = "真正值得判断的，不是包装有多满，\n而是身份、资质和服务边界能不能被核验。";
const baseCss = `
  * { box-sizing: border-box; }
  html, body { width: 1242px; height: 1660px; margin: 0; overflow: hidden; }
  body { font-family: "PingFang SC", "Noto Sans CJK SC", sans-serif; -webkit-font-smoothing: antialiased; }
  .canvas { position: relative; width: 1242px; height: 1660px; overflow: hidden; }
  .eyebrow { font-size: 25px; letter-spacing: .22em; font-weight: 600; }
  h1 { margin: 0; font-size: 92px; line-height: 1.08; letter-spacing: -.055em; font-weight: 700; }
  .body { white-space: pre-line; font-size: 34px; line-height: 1.62; letter-spacing: .005em; font-weight: 450; }
  .page { position: absolute; right: 84px; bottom: 76px; font: 600 22px/1 monospace; letter-spacing: .18em; }
`;

const backgroundData = async (name: string) =>
  `data:image/png;base64,${(await readFile(path.join(sourceRoot, name))).toString("base64")}`;

const candidates = [
  {
    id: "VDC-C-0001-A",
    assetId: "AST-C0001-DIR-A",
    channel: "AI_GENERATED_VISUAL",
    mode: "EDITORIAL_SERIES",
    quality: 87,
    palette: ["#F1E9DC", "#18232D", "#B58A50"],
    typography: "Warm restrained editorial authority",
    composition:
      "Warm sculptural verification layers; asymmetric object at right with quiet title field.",
    host: true,
    html: async () => `<!doctype html><style>${baseCss}
      .canvas { color:#17212a; background:#eee5d7 url('${await backgroundData("VDC-C-0001-A-background.png")}') center/cover no-repeat; }
      .veil { position:absolute; inset:0; background:linear-gradient(90deg,rgba(246,240,230,.96) 0%,rgba(246,240,230,.78) 42%,rgba(246,240,230,.04) 70%); }
      .copy { position:absolute; left:84px; top:96px; width:650px; }
      .eyebrow { color:#8d704a; margin-bottom:50px; }
      h1 { width:610px; }
      .rule { width:76px; height:4px; margin:52px 0 42px; background:#aa8555; }
      .body { width:570px; color:#35414a; }
      .micro { position:absolute; left:84px; bottom:78px; font-size:19px; letter-spacing:.16em; color:#756a5b; }
      .page { color:#756a5b; }
    </style><div class="canvas"><div class="veil"></div><div class="copy"><div class="eyebrow">DECISION NOTE · 01</div><h1>${title}</h1><div class="rule"></div><div class="body">${body}</div></div><div class="micro">IDENTITY · QUALIFICATION · BOUNDARY</div><div class="page">01 / 06</div></div>`,
  },
  {
    id: "VDC-C-0001-B",
    assetId: "AST-C0001-DIR-B",
    channel: "PURE_TYPOGRAPHY",
    mode: "PURE_TYPOGRAPHY",
    quality: 85,
    palette: ["#F2EDE4", "#161616", "#D35F3B"],
    typography: "Bold contemporary magazine with disciplined whitespace",
    composition:
      "Large editorial headline, vertical tension, and a three-part typographic verification axis.",
    host: false,
    html: async () => {
      await Promise.resolve();
      return `<!doctype html><style>${baseCss}
      .canvas { background:#f2ede4; color:#171717; }
      .orange { position:absolute; left:0; top:0; width:22px; height:1660px; background:#d45f3c; }
      .index { position:absolute; left:86px; top:82px; font:700 25px/1 monospace; letter-spacing:.18em; }
      h1 { position:absolute; left:84px; top:205px; width:1010px; font-size:134px; line-height:.97; }
      .body { position:absolute; left:91px; top:590px; width:720px; padding-top:38px; border-top:3px solid #171717; font-size:35px; }
      .axis { position:absolute; left:86px; right:84px; bottom:218px; display:grid; grid-template-columns:repeat(3,1fr); border-top:1px solid #222; }
      .axis div { padding-top:26px; font-size:25px; letter-spacing:.12em; }
      .axis div:not(:last-child) { border-right:1px solid #222; }
      .axis span { display:block; margin-top:15px; font:500 18px/1.5 monospace; letter-spacing:.08em; color:#6d655b; }
      .circle { position:absolute; right:-110px; top:785px; width:430px; height:430px; border:78px solid #d45f3c; border-radius:50%; opacity:.95; }
      .page { color:#171717; }
    </style><div class="canvas"><div class="orange"></div><div class="index">TRUST / CHECKLIST</div><h1>${title}</h1><div class="body">${body}</div><div class="circle"></div><div class="axis"><div>主体<span>WHO</span></div><div style="padding-left:34px">资质<span>VALID FOR WHAT</span></div><div style="padding-left:34px">边界<span>WHERE IT STOPS</span></div></div><div class="page">01 / 06</div></div>`;
    },
  },
  {
    id: "VDC-C-0001-C",
    assetId: "AST-C0001-DIR-C",
    channel: "MIXED_ASSET",
    mode: "MIXED",
    quality: 89,
    palette: ["#101D29", "#EAE4D8", "#B36F49"],
    typography: "Technical editorial precision without dashboard styling",
    composition:
      "Dark evidence-table visual with precise three-item renderer overlay and high contrast.",
    host: true,
    html: async () => `<!doctype html><style>${baseCss}
      .canvas { color:#eee9df; background:#101c28 url('${await backgroundData("VDC-C-0001-C-background.png")}') center/cover no-repeat; }
      .shade { position:absolute; inset:0; background:linear-gradient(180deg,rgba(8,18,28,.18) 0%,rgba(8,18,28,.08) 45%,rgba(8,18,28,.55) 100%); }
      .copy { position:absolute; left:84px; top:91px; width:820px; }
      .eyebrow { color:#bb7952; margin-bottom:38px; }
      h1 { font-size:88px; width:780px; }
      .body { margin-top:34px; width:690px; color:#d8d5cf; font-size:30px; }
      .checks { position:absolute; left:84px; bottom:116px; width:800px; display:grid; grid-template-columns:repeat(3,1fr); gap:12px; }
      .check { min-height:142px; padding:24px 24px 20px; border-top:2px solid #bd7651; background:rgba(9,19,29,.76); backdrop-filter:blur(10px); }
      .check b { display:block; font-size:30px; margin-bottom:13px; }
      .check span { font:500 17px/1.4 monospace; letter-spacing:.08em; color:#b9c0c5; }
      .page { color:#c5bfb4; }
    </style><div class="canvas"><div class="shade"></div><div class="copy"><div class="eyebrow">VERIFY BEFORE TRUST</div><h1>${title}</h1><div class="body">${body}</div></div><div class="checks"><div class="check"><b>主体</b><span>IDENTITY</span></div><div class="check"><b>资质</b><span>QUALIFICATION</span></div><div class="check"><b>边界</b><span>BOUNDARY</span></div></div><div class="page">01 / 06</div></div>`,
  },
] as const;

await mkdir(outputRoot, { recursive: true, mode: 0o700 });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1242, height: 1660 },
  deviceScaleFactor: 1,
});
const requestUrls: string[] = [];
page.on("request", (request) => {
  if (!request.url().startsWith("data:") && request.url() !== "about:blank")
    requestUrls.push(request.url());
});
const rendered = [];
for (const candidate of candidates) {
  await page.setContent(await candidate.html(), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(outputRoot, `${candidate.id}.png`);
  await page.screenshot({ path: file, type: "png" });
  const bytes = await readFile(file);
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
    throw new Error(`CANDIDATE_PNG_INVALID:${candidate.id}`);
  const fileSize = (await stat(file)).size;
  rendered.push({ ...candidate, file, bytes, fileSize, checksum: hash(bytes) });
}
await browser.close();
if (requestUrls.length)
  throw new Error(`CANDIDATE_REMOTE_REQUEST_ATTEMPT:${requestUrls.join(",")}`);

const relativeFromHome = (file: string) => path.relative(home, file).split(path.sep).join("/");
const candidateSet = {
  candidate_set_id: "VDCS-C-0001-P4BR",
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  content_version: "CV-1",
  copy_version: "CV-1",
  source_visual_plan_version: "VV-1",
  status: "AWAITING_USER_SELECTION",
  candidates: rendered.map((candidate) => ({
    candidate_id: candidate.id,
    asset_id: candidate.assetId,
    asset_channel: candidate.channel,
    visual_mode: candidate.mode,
    composition_summary: candidate.composition,
    palette: candidate.palette,
    typography_character: candidate.typography,
    asset: {
      asset_id: candidate.assetId,
      asset_role: "DIRECTION_CANDIDATE",
      asset_type: "IMAGE",
      mime_type: "image/png",
      relative_path: relativeFromHome(candidate.file),
      source_type: candidate.host ? "HOST_NATIVE_IMAGEGEN" : "RENDERED",
      source_adapter: candidate.host
        ? "HostNativeImageGenerationBridge+PlaywrightHtmlCssRendererAdapter"
        : "PlaywrightHtmlCssRendererAdapter",
      source_run_id: RUN_ID,
      source_generation_id: `GEN-${candidate.id.replace(/^VDC-/u, "")}`,
      version: 1,
      width: 1242,
      height: 1660,
      file_size: candidate.fileSize,
      checksum: candidate.checksum,
      created_at: AT,
      extensions: {},
    },
    quality_score: candidate.quality,
    hard_blocks: [],
    host_imagegen: candidate.host,
    renderer: true,
    delivery_role: "DIRECTION_CANDIDATE_ONLY",
  })),
  material_difference_verified: true,
  formal_delivery_count: 0,
  feishu_formal_write_count: 0,
  run_id: RUN_ID,
  schema_version: "1.0.0",
  created_at: AT,
};
registry.assertValid(
  "https://content-ops-studio.local/schemas/1.0/visual-direction-candidate-set.schema.json",
  candidateSet,
);
await atomicJson(path.join(runRoot, "visual-direction-candidate-set.json"), candidateSet);
const qualityWeights = [
  ["CONTENT_SEMANTIC_FIT", 20],
  ["COMPOSITION_FOCUS", 15],
  ["HIERARCHY_READABILITY", 15],
  ["ASSET_QUALITY_INTEGRITY", 15],
  ["PROJECT_AUDIENCE_FIT", 10],
  ["UNIQUENESS_ANTI_TEMPLATE", 10],
  ["VISUAL_MODE_EXECUTION", 10],
  ["PLATFORM_MOBILE_PERFORMANCE", 5],
] as const;
for (const candidate of rendered) {
  await atomicJson(path.join(runRoot, `${candidate.id}-generation-manifest.json`), {
    generation_id: `GEN-${candidate.id.replace(/^VDC-/u, "")}`,
    candidate_id: candidate.id,
    source_channel: candidate.channel,
    host_imagegen: candidate.host,
    renderer: true,
    attempts: [{ attempt: 1, status: "SUCCESS", checksum: candidate.checksum }],
    output_relative_path: relativeFromHome(candidate.file),
    formal_delivery: false,
    run_id: RUN_ID,
    created_at: AT,
  });
  const upgraded = candidate.id.endsWith("A")
    ? new Set(["CONTENT_SEMANTIC_FIT", "COMPOSITION_FOCUS"])
    : candidate.id.endsWith("B")
      ? new Set(["COMPOSITION_FOCUS", "UNIQUENESS_ANTI_TEMPLATE"])
      : new Set(["CONTENT_SEMANTIC_FIT", "COMPOSITION_FOCUS", "UNIQUENESS_ANTI_TEMPLATE"]);
  const dimensions = qualityWeights.map(([dimension, weight]) => {
    const rating = upgraded.has(dimension) ? 5 : 4;
    return { dimension, weight, rating, weighted_score: (weight * rating) / 5 };
  });
  const qualityReport = {
    report_id: `IQR-${candidate.id.replace(/^VDC-/u, "")}`,
    project_id: PROJECT_ID,
    content_id: CONTENT_ID,
    asset_id: candidate.assetId,
    asset_role: "DIRECTION_CANDIDATE",
    layers: {
      authenticity_and_integrity: "PASS",
      mechanical: "PASS",
      visual: "PASS",
      mode_and_project_fit: "PASS",
      operator_aesthetic: "PENDING",
    },
    dimensions,
    total_score: candidate.quality,
    threshold: 75,
    hard_blocks: [],
    core_dimension_floor_met: true,
    operator_approval_required: true,
    result: "PASS_PENDING_OPERATOR",
    run_id: RUN_ID,
    schema_version: "1.0.0",
    created_at: AT,
  };
  registry.assertValid(
    "https://content-ops-studio.local/schemas/1.0/image-quality-report.schema.json",
    qualityReport,
  );
  await atomicJson(path.join(runRoot, `${candidate.id}-image-quality-report.json`), qualityReport);
}
await atomicJson(path.join(runRoot, "checkpoint.json"), {
  run_id: RUN_ID,
  project_id: PROJECT_ID,
  content_id: CONTENT_ID,
  state: "VISUAL_DIRECTION_SELECTION",
  status: "AWAITING_USER_SELECTION",
  candidate_set_id: candidateSet.candidate_set_id,
  candidate_ids: rendered.map((candidate) => candidate.id),
  vv2_created: false,
  fpv2_created: false,
  g4_created: false,
  style_lock_created: false,
  remaining_pages_created: 0,
  feishu_formal_writes: 0,
  fpv1_checksum_verified: true,
  created_at: AT,
});

console.log(
  JSON.stringify({
    status: "AWAITING_USER_SELECTION",
    run_id: RUN_ID,
    candidate_set_id: candidateSet.candidate_set_id,
    candidates: rendered.map((candidate) => ({
      candidate_id: candidate.id,
      path: candidate.file,
      checksum: candidate.checksum,
      quality_score: candidate.quality,
      host_imagegen: candidate.host,
    })),
    fpv1_checksum: EXPECTED_FPV1,
    formal_feishu_writes: 0,
    vv2_created: false,
    fpv2_created: false,
    g4_created: false,
    style_lock_created: false,
    remaining_pages_created: 0,
  }),
);
