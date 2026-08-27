import { createHash } from "node:crypto";
import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildMcp, MCP_BUNDLE } from "./build-mcp.js";

const temporary = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-build-"));
const candidate = path.join(temporary, "content-ops-mcp.mjs");
await buildMcp(candidate);
const [committed, rebuilt] = await Promise.all([readFile(MCP_BUNDLE), readFile(candidate)]);
const hash = (value: Buffer) => createHash("sha256").update(value).digest("hex");
if (!committed.equals(rebuilt)) throw new Error("Bundled MCP is stale or non-deterministic.");
process.stdout.write(
  JSON.stringify({ status: "PASSED", sha256: hash(committed), bytes: committed.length }) + "\n",
);
