import { access, readFile } from "node:fs/promises";
import path from "node:path";

const pluginRoot = path.resolve("plugins/content-ops-studio");
const manifest = JSON.parse(
  await readFile(path.join(pluginRoot, ".codex-plugin/plugin.json"), "utf8"),
) as Record<string, unknown>;
const config = JSON.parse(await readFile(path.join(pluginRoot, ".mcp.json"), "utf8")) as {
  mcpServers?: Record<string, Record<string, unknown>>;
};
if (manifest.mcpServers !== "./.mcp.json")
  throw new Error("Plugin manifest must declare .mcp.json.");
const servers = config.mcpServers ?? {};
if (Object.keys(servers).join(",") !== "content-ops")
  throw new Error("Exactly one content-ops MCP server is required.");
const server = servers["content-ops"] ?? {};
if (server.type !== "stdio" || server.command !== "node")
  throw new Error("MCP must use local node stdio.");
const args = server.args as unknown[];
if (
  !Array.isArray(args) ||
  args.length !== 1 ||
  args[0] !== "${PLUGIN_ROOT}/runtime/dist/content-ops-mcp.mjs"
)
  throw new Error("MCP bundle argument must be Plugin-relative.");
if (server.cwd !== "${PLUGIN_ROOT}") throw new Error("MCP cwd must be Plugin Root.");
const env = server.env as Record<string, unknown>;
if (env?.CONTENT_OPS_HOME !== "${PLUGIN_DATA}/content-ops-home")
  throw new Error("Default Home must be below Plugin Data.");
const serialized = JSON.stringify(config);
if (
  serialized.includes("..") ||
  serialized.includes("/Users/") ||
  /secret|token|authorization/i.test(serialized)
)
  throw new Error("MCP config contains a forbidden path or credential key.");
await access(path.join(pluginRoot, "runtime/dist/content-ops-mcp.mjs"));
process.stdout.write("MCP Plugin configuration passed.\n");
