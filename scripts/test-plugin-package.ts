import { createHash } from "node:crypto";
import { cp, mkdtemp, readFile, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function treeHash(root: string): Promise<string> {
  const entries: string[] = [];
  const walk = async (directory: string) => {
    for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const absolute = path.join(directory, item.name);
      if (item.isDirectory()) await walk(absolute);
      else {
        const relative = path.relative(root, absolute);
        entries.push(
          `${relative}:${createHash("sha256")
            .update(await readFile(absolute))
            .digest("hex")}`,
        );
      }
    }
  };
  await walk(root);
  return createHash("sha256").update(entries.join("\n")).digest("hex");
}

const temporary = await mkdtemp(path.join(os.tmpdir(), "content-ops-plugin-package-"));
const installedRoot = path.join(temporary, "cache", "content-ops-studio");
const pluginData = path.join(temporary, "data");
await cp(path.resolve("plugins/content-ops-studio"), installedRoot, {
  recursive: true,
  filter(source) {
    const relative = path.relative(path.resolve("plugins/content-ops-studio"), source);
    return !relative.split(path.sep).some((part) => part === "node_modules" || part === "tests");
  },
});
const before = await treeHash(installedRoot);
const bundle = path.join(installedRoot, "runtime/dist/content-ops-mcp.mjs");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [bundle],
  cwd: installedRoot,
  env: {
    PATH: process.env.PATH ?? "",
    PLUGIN_ROOT: installedRoot,
    PLUGIN_DATA: pluginData,
    CONTENT_OPS_HOME: path.join(pluginData, "content-ops-home"),
  },
  stderr: "pipe",
});
const client = new Client({ name: "plugin-package-test", version: "0.1.0" });
await client.connect(transport);
const tools = await client.listTools();
const call = await client.callTool({ name: "content_ops_list_projects", arguments: {} });
await client.close();
const after = await treeHash(installedRoot);
const installedToolNames = tools.tools.map((tool) => tool.name);
if (
  new Set(installedToolNames).size !== installedToolNames.length ||
  !installedToolNames.includes("content_ops_plan_cover_conversion") ||
  !installedToolNames.includes("content_ops_list_projects") ||
  (call.structuredContent as Record<string, unknown> | undefined)?.status !== "SUCCESS" ||
  before !== after
)
  throw new Error("Installed Plugin package validation failed.");
process.stdout.write(
  JSON.stringify({
    status: "PASSED",
    installed_copy: true,
    tool_count: tools.tools.length,
    repository_node_modules_required: false,
    plugin_root_unchanged: true,
    runtime_data_in_plugin_data: true,
  }) + "\n",
);
