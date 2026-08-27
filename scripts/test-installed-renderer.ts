import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, readdir, stat, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { buildMcp } from "./build-mcp.js";

async function treeHash(root: string): Promise<string> {
  const entries: string[] = [];
  const walk = async (directory: string) => {
    for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const absolute = path.join(directory, item.name);
      if (item.isDirectory()) await walk(absolute);
      else {
        entries.push(
          `${path.relative(root, absolute)}:${createHash("sha256")
            .update(await readFile(absolute))
            .digest("hex")}`,
        );
      }
    }
  };
  await walk(root);
  return createHash("sha256").update(entries.join("\n")).digest("hex");
}

await buildMcp();
const sourceBrowserCache = process.env.PLAYWRIGHT_BROWSERS_PATH;
if (!sourceBrowserCache) throw new Error("PLAYWRIGHT_BROWSERS_PATH is required.");
await stat(sourceBrowserCache);
const temporary = await mkdtemp(path.join(os.tmpdir(), "content-ops-installed-renderer-"));
const installedRoot = path.join(temporary, "installed", "content-ops-studio");
const pluginData = path.join(temporary, "plugin-data");
const browserCache = path.join(pluginData, "playwright-browsers");
const projectHome = path.join(temporary, "project-home");
await cp(path.resolve("plugins/content-ops-studio"), installedRoot, {
  recursive: true,
  filter(source) {
    const relative = path.relative(path.resolve("plugins/content-ops-studio"), source);
    return !relative.split(path.sep).some((part) => part === "node_modules" || part === "tests");
  },
});
await mkdir(pluginData, { recursive: true, mode: 0o700 });
await symlink(path.resolve(sourceBrowserCache), browserCache, "dir");
const before = await treeHash(installedRoot);
const bundle = path.join(installedRoot, "runtime/dist/content-ops-mcp.mjs");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [bundle],
  cwd: temporary,
  env: {
    PATH: process.env.PATH ?? "",
    PLUGIN_ROOT: installedRoot,
    PLUGIN_DATA: pluginData,
    CONTENT_OPS_HOME: projectHome,
    CONTENT_OPS_RENDERER: "playwright-html-css",
    CONTENT_OPS_PLAYWRIGHT_BROWSERS_PATH: browserCache,
    PLAYWRIGHT_BROWSERS_PATH: browserCache,
  },
  stderr: "pipe",
});
const client = new Client({ name: "installed-renderer-test", version: "0.1.0" });
await client.connect(transport);
const tools = await client.listTools();
const input = {
  project_id: "PRJ-20990101-INST",
  content_id: "C-0001",
  run_id: "RUN-20990101-010203-INST",
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  first_page_version: "FPV-1",
  copy_snapshot_hash: "a".repeat(64),
  visual_handoff_ref:
    "projects/PRJ-20990101-INST/runs/RUN-20990101-010203-HAND/visual-planning/visual-handoff-package.json",
  visual_handoff_hash: "b".repeat(64),
  page_visual_plan_id: "PVP-C0001-01",
  text: {
    headline: "先别急着相信“专业”",
    body: "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。",
    page_number: "01",
  },
  idempotency_key: "FIRST-PAGE-INSTALLED-C0001-FPV1",
  created_at: "2099-01-01T01:02:03.000Z",
};
const planResult = await client.callTool({
  name: "content_ops_plan_first_page_production",
  arguments: input,
});
const planEnvelope = planResult.structuredContent as Record<string, unknown>;
const planDetails = planEnvelope.details as Record<string, unknown>;
if (!planDetails || typeof planDetails.plan_hash !== "string")
  throw new Error(
    `Installed Renderer plan failed: ${JSON.stringify({ status: planEnvelope.status, errors: planEnvelope.errors })}`,
  );
const renderResult = await client.callTool({
  name: "content_ops_render_first_page",
  arguments: {
    ...input,
    plan_hash: planDetails.plan_hash,
    renderer_environment_id: "RENV-20990101-INSTALLED",
    explicit_confirmation: true,
  },
});
await client.close();
const renderEnvelope = renderResult.structuredContent as Record<string, unknown>;
const renderDetails = renderEnvelope.details as Record<string, unknown>;
const outputPath = String(renderDetails.output_path);
const png = await readFile(outputPath);
const after = await treeHash(installedRoot);
const installedToolNames = tools.tools.map((tool) => tool.name);
if (
  new Set(installedToolNames).size !== installedToolNames.length ||
  !installedToolNames.includes("content_ops_plan_cover_conversion") ||
  !installedToolNames.includes("content_ops_render_first_page") ||
  planEnvelope.status !== "SUCCESS" ||
  renderEnvelope.status !== "AWAITING_APPROVAL" ||
  !png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
  png.readUInt32BE(16) !== 1242 ||
  png.readUInt32BE(20) !== 1660 ||
  before !== after ||
  !path.resolve(outputPath).startsWith(`${path.resolve(projectHome)}${path.sep}`)
)
  throw new Error("Installed Plugin Renderer validation failed.");
process.stdout.write(
  `${JSON.stringify({
    status: "PASSED",
    installed_copy: true,
    tool_count: tools.tools.length,
    rendered_png: true,
    dimensions: { width: 1242, height: 1660 },
    plugin_root_unchanged: true,
    browser_cache_in_plugin_data: true,
    output_outside_plugin_root: true,
    repository_cwd_required: false,
    repository_node_modules_required: false,
  })}\n`,
);
