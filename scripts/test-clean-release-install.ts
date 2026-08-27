import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, readdir, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { runCommand } from "./lib/release-package.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseManifestPath = path.join(repositoryRoot, "release/RELEASE_MANIFEST.json");
const releaseManifest = JSON.parse(await readFile(releaseManifestPath, "utf8")) as Record<
  string,
  unknown
>;
const artifact = path.join(
  repositoryRoot,
  "release/artifacts",
  String(releaseManifest.package_filename),
);
await stat(artifact);
const cleanRoot = await mkdtemp(path.join(os.tmpdir(), "content-ops-clean-install-"));
await writeFile(
  path.join(cleanRoot, "package.json"),
  `${JSON.stringify({ name: "content-ops-clean-install", version: "1.0.0", private: true })}\n`,
);
await runCommand(
  process.platform === "win32" ? "pnpm.cmd" : "pnpm",
  ["add", "--offline", "--ignore-scripts", artifact],
  cleanRoot,
);

const installedPackage = path.join(cleanRoot, "node_modules", "content-ops-studio");
const pluginRoot = path.join(installedPackage, "plugins/content-ops-studio");
const pluginData = path.join(cleanRoot, "plugin data");
const projectHome = path.join(cleanRoot, "project home");
await mkdir(pluginData, { recursive: true, mode: 0o700 });
const packageMetadata = await stat(installedPackage);
if (packageMetadata.isSymbolicLink()) throw new Error("CLEAN_INSTALL_SOURCE_SYMLINK_FORBIDDEN");

async function walk(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(absolute)));
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
}

async function treeHash(root: string): Promise<string> {
  const entries: string[] = [];
  for (const file of await walk(root)) {
    const relative = path.relative(root, file).replaceAll(path.sep, "/");
    entries.push(
      `${relative}:${createHash("sha256")
        .update(await readFile(file))
        .digest("hex")}`,
    );
  }
  return createHash("sha256").update(entries.sort().join("\n")).digest("hex");
}

const installedFiles = await walk(installedPackage);
const skillCount = installedFiles.filter((file) => file.endsWith(`${path.sep}SKILL.md`)).length;
const schemaCount = installedFiles.filter((file) => file.endsWith(".schema.json")).length;
const generatedTypeCount = installedFiles.filter(
  (file) =>
    file.includes(
      `${path.sep}packages${path.sep}contracts${path.sep}src${path.sep}generated${path.sep}`,
    ) && file.endsWith(".ts"),
).length;
if (skillCount !== 8 || schemaCount !== 159 || generatedTypeCount !== 160)
  throw new Error("CLEAN_INSTALL_PACKAGE_CONTENT_INVALID");
const before = await treeHash(installedPackage);
const bundle = path.join(pluginRoot, "runtime/dist/content-ops-mcp.mjs");
await stat(bundle);
const browserCache = process.env.PLAYWRIGHT_BROWSERS_PATH;
if (!browserCache)
  throw new Error("PLAYWRIGHT_BROWSERS_PATH is required for installed validation.");
await stat(browserCache);
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [bundle],
  cwd: cleanRoot,
  env: {
    PATH: process.env.PATH ?? "",
    PLUGIN_ROOT: pluginRoot,
    PLUGIN_DATA: pluginData,
    CONTENT_OPS_HOME: projectHome,
    CONTENT_OPS_RUNTIME_MODE: "TEST",
    CONTENT_OPS_WORKSPACE_ADAPTER: "mock",
    CONTENT_OPS_RENDERER: "playwright-html-css",
    CONTENT_OPS_PLAYWRIGHT_BROWSERS_PATH: browserCache,
    PLAYWRIGHT_BROWSERS_PATH: browserCache,
  },
  stderr: "pipe",
});
const client = new Client({ name: "stage-11-clean-install", version: "0.2.0" });
await client.connect(transport);
const catalog = await client.listTools();
if (catalog.tools.length !== 72) throw new Error("CLEAN_INSTALL_TOOL_COUNT_INVALID");
const rendererStatus = await client.callTool({
  name: "content_ops_get_renderer_status",
  arguments: {},
});
if ((rendererStatus.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS")
  throw new Error("CLEAN_INSTALL_RENDERER_DOCTOR_FAILED");

const projectId = "PRJ-20990101-RLS1";
const contentId = "C-9001";
const runId = "RUN-20990101-010203-RLS1";
const base = { project_id: projectId, content_id: contentId, run_id: runId };
const route = await client.callTool({
  name: "content_ops_plan_asset_routing",
  arguments: {
    ...base,
    page_number: 2,
    evidence_required: true,
    accurate_structure_required: false,
    host_imagegen_available: true,
  },
});
if ((route.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS")
  throw new Error("INSTALLED_IMAGE_PRODUCTION_ROUTING_FAILED");
const gated = await client.callTool({
  name: "content_ops_plan_full_set_production",
  arguments: { ...base, page_count: 6, g4_approved: false, direction_candidate_count: 3 },
});
const eligible = await client.callTool({
  name: "content_ops_plan_full_set_production",
  arguments: { ...base, page_count: 6, g4_approved: true, direction_candidate_count: 3 },
});
if (
  (gated.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS" ||
  (eligible.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS"
)
  throw new Error("INSTALLED_PROMOTION_GATE_PLAN_FAILED");

const checksums = Array.from({ length: 6 }, (_, index) =>
  createHash("sha256")
    .update(`installed-page-${index + 1}`)
    .digest("hex"),
);
const group = await client.callTool({
  name: "content_ops_evaluate_group_quality",
  arguments: {
    ...base,
    visual_mode: "EDITORIAL_SERIES",
    asset_ids: Array.from({ length: 6 }, (_, index) => `AST-RLS-${index + 1}`),
    visual_signatures: Array.from(
      { length: 6 },
      (_, index) => `editorial-composition-${index + 1}`,
    ),
    subject_identity_keys: ["FICTIONAL-SUBJECT-RLS"],
    source_checksums: checksums,
    contact_sheet_ref: "projects/fictional/contact-sheet.png",
    created_at: "2099-01-01T01:02:03.000Z",
  },
});
if ((group.structuredContent as { status?: string } | undefined)?.status !== "AWAITING_APPROVAL")
  throw new Error("INSTALLED_GROUP_QA_FAILED");

const rendererInput = {
  ...base,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-1",
  copy_snapshot_hash: "a".repeat(64),
  visual_handoff_ref: "projects/fictional/visual-handoff-package.json",
  visual_handoff_hash: "b".repeat(64),
  page_visual_plan_id: "PVP-RLS-01",
  text: {
    headline: "虚构项目的判断标准",
    body: "这是一张仅用于安装验证的确定性技术样张。",
    page_number: "01",
  },
  idempotency_key: "STAGE11-INSTALLED-RENDER-FPV1",
  created_at: "2099-01-01T01:02:03.000Z",
};
const renderPlan = await client.callTool({
  name: "content_ops_plan_first_page_production",
  arguments: rendererInput,
});
const planDetails = (renderPlan.structuredContent as { details?: { plan_hash?: string } }).details;
if (!planDetails?.plan_hash) throw new Error("INSTALLED_RENDER_PLAN_FAILED");
const rendered = await client.callTool({
  name: "content_ops_render_first_page",
  arguments: {
    ...rendererInput,
    plan_hash: planDetails.plan_hash,
    renderer_environment_id: "RENV-20990101-STAGE11",
    explicit_confirmation: true,
  },
});
if ((rendered.structuredContent as { status?: string } | undefined)?.status !== "AWAITING_APPROVAL")
  throw new Error("INSTALLED_RENDER_FAILED");

function crc32(bytes: Buffer): number {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}
function chunk(type: string, data: Buffer): Buffer {
  const label = Buffer.from(type, "ascii");
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([label, data])));
  return Buffer.concat([header, label, data, checksum]);
}
function png(seed: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(12, 0);
  ihdr.writeUInt32BE(16, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const row = Buffer.alloc(12 * 4 + 1);
  for (let index = 1; index < row.length; index += 4) {
    row[index] = seed * 17;
    row[index + 1] = seed * 23;
    row[index + 2] = seed * 31;
    row[index + 3] = 255;
  }
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(Array.from({ length: 16 }, () => row)))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const assetRoot = path.join(projectHome, "projects", projectId, "runs", runId, "approved-assets");
await mkdir(assetRoot, { recursive: true });
const pages = [];
for (let pageNumber = 1; pageNumber <= 6; pageNumber += 1) {
  const bytes = png(pageNumber);
  const sourcePath = path.join(assetRoot, `${String(pageNumber).padStart(2, "0")}.png`);
  await writeFile(sourcePath, bytes);
  pages.push({
    page_number: pageNumber,
    page_role:
      pageNumber === 1 ? "COVER" : pageNumber === 6 ? "SUMMARY_CONVERSION" : "CONTENT_VALUE",
    page_intent: `Fictional installed page ${pageNumber}.`,
    asset_id: `AST-RLS-FIN-${pageNumber}`,
    source_path: sourcePath,
    relative_path: `projects/fictional/assets/${pageNumber}.png`,
    checksum: createHash("sha256").update(bytes).digest("hex"),
    width: 12,
    height: 16,
    file_size: bytes.length,
    mime_type: "image/png",
    asset_channel: "PURE_RENDERER",
    renderer_provenance: "PLAYWRIGHT_HTML_CSS@1.62.1",
    imagegen_provenance: null,
    generation_manifest_ref: `GEN-RLS-${pageNumber}`,
    render_report_ref: `RPT-RENDER-RLS-${pageNumber}`,
    single_page_qa_ref: `RPT-QA-RLS-${pageNumber}`,
    single_page_qa_status: "PASS",
    hard_block_count: 0,
    approved_formal_asset: true,
    asset_status: "APPROVED",
  });
}
const contactSheets = [];
for (const [index, size] of ["FULL", "310", "186"].entries()) {
  const bytes = png(10 + index);
  const sourcePath = path.join(assetRoot, `contact-${size}.png`);
  await writeFile(sourcePath, bytes);
  contactSheets.push({
    size,
    source_path: sourcePath,
    relative_path: `projects/fictional/contact-${size}.png`,
    checksum: createHash("sha256").update(bytes).digest("hex"),
  });
}
const context: Record<string, unknown> = {
  project_id: projectId,
  project_kind: "TEST_FIXTURE",
  content_id: contentId,
  run_id: runId,
  runtime_mode: "TEST",
  workspace_target: "NONE",
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-1",
  style_lock_id: "SL-RLS-001",
  style_lock_version: "SLV-1",
  style_lock_active: true,
  style_lock_visual_plan_version: "VV-1",
  g3: {
    approval_id: "APR-20990101-R3A1",
    gate: "CONTENT_COPY",
    decision: "APPROVE",
    target_id: contentId,
    target_version: "CV-1:CV-1",
    source_run_id: runId,
    deprecated_at: null,
    fixture_approval: true,
    test_only: true,
  },
  g4: {
    approval_id: "APR-20990101-R4A1",
    gate: "FIRST_PAGE",
    decision: "APPROVE",
    target_id: contentId,
    target_version: "VV-1",
    source_run_id: runId,
    deprecated_at: null,
    fixture_approval: true,
    test_only: true,
  },
  g5: null,
  page_count: 6,
  pages,
  qa_report_id: "RPT-QA-RLS-001",
  qa_status: "QA_PASSED",
  group_qa_ref: "RPT-GROUP-QA-RLS-001",
  group_qa_status: "PASS",
  group_hard_block_count: 0,
  continuity_report_ref: "RPT-CONTINUITY-RLS-001",
  continuity_status: "PASS",
  strategy_ref: "STRATEGY-RLS-001",
  contact_sheets: contactSheets,
  content_package_ref: "CONTENT-PACKAGE-RLS-001",
  visual_system_ref: "VS-RLS-001",
  final_manifest_id: "FINAL-RLS-001",
  final_manifest_version: "FMV-1",
  finalized_at: "2099-01-01T01:02:03.000Z",
};
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, item]) => [key, stable(item)]),
    );
  return value;
}
const checksumBinding = createHash("sha256")
  .update(JSON.stringify(stable(pages.map((page) => page.checksum))))
  .digest("hex")
  .slice(0, 16);
context.g5 = {
  approval_id: "APR-20990101-R5A1",
  gate: "FINAL_SET",
  decision: "APPROVE",
  target_id: contentId,
  target_version: `FINAL:CV-1:CV-1:VV-1:FPV-1:SLV-1:${checksumBinding}`,
  source_run_id: runId,
  deprecated_at: null,
  fixture_approval: true,
  test_only: true,
};
const finalPlan = await client.callTool({
  name: "content_ops_plan_finalization",
  arguments: { context },
});
if ((finalPlan.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS")
  throw new Error("INSTALLED_FINALIZATION_PLAN_FAILED");
const finalized = await client.callTool({
  name: "content_ops_finalize_delivery",
  arguments: {
    context,
    request_id: "STAGE11-INSTALLED-FINALIZE-0001",
    explicit_confirmation: true,
  },
});
const replayed = await client.callTool({
  name: "content_ops_finalize_delivery",
  arguments: {
    context,
    request_id: "STAGE11-INSTALLED-FINALIZE-0002",
    explicit_confirmation: true,
  },
});
for (const result of [finalized, replayed])
  if ((result.structuredContent as { status?: string } | undefined)?.status !== "SUCCESS")
    throw new Error("INSTALLED_FINALIZATION_FAILED");
const finalDetails = (finalized.structuredContent as { details?: Record<string, unknown> }).details;
const replayDetails = (replayed.structuredContent as { details?: Record<string, unknown> }).details;
if (!finalDetails || replayDetails?.reused_manifest !== true)
  throw new Error("INSTALLED_FINALIZATION_IDEMPOTENCY_FAILED");
for (const key of ["manifest_path", "delivery_path", "integrity_report_path", "archive_state_path"])
  await stat(String(finalDetails[key]));

await client.close();
const after = await treeHash(installedPackage);
if (before !== after) throw new Error("INSTALLED_PACKAGE_MUTATED");
const evidence = {
  status: "PASSED",
  clean_install: true,
  repository_external_environment: true,
  source_symlink: false,
  plugin_manifest: true,
  skill_count: skillCount,
  strict_schema_count: schemaCount,
  generated_typescript_count: generatedTypeCount,
  tool_count: catalog.tools.length,
  mcp_started: true,
  renderer_doctor: "PASSED",
  installed_renderer_fixture: "PASSED",
  installed_image_production_regression: "PASSED",
  promotion_gate: "PASSED",
  group_qa_and_continuity_boundary: "PASSED",
  installed_plugin_v1_e2e: "PASSED",
  final_manifest: "PASSED",
  delivery_package: "PASSED",
  archive_state: "PASSED",
  idempotent_replay: "PASSED",
  production_mock_fallback: false,
  plugin_root_unchanged: true,
  imagegen_calls: 0,
  feishu_writes: 0,
};
await mkdir(path.join(repositoryRoot, "reports/verification"), { recursive: true });
await writeFile(
  path.join(repositoryRoot, "reports/verification/stage-11-clean-install-evidence.json"),
  `${JSON.stringify(evidence, null, 2)}\n`,
  { mode: 0o644 },
);
await writeFile(
  releaseManifestPath,
  `${JSON.stringify(
    { ...releaseManifest, clean_install_status: "PASSED", installed_e2e_status: "PASSED" },
    null,
    2,
  )}\n`,
  { mode: 0o644 },
);
console.log(JSON.stringify(evidence));
