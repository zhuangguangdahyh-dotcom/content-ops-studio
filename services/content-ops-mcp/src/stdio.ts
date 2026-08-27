#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createContentOpsMcpServer } from "./server.js";

async function main(): Promise<void> {
  const { server } = createContentOpsMcpServer();
  await server.connect(new StdioServerTransport());
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown MCP server error.";
  process.stderr.write(`content-ops-mcp failed: ${message.slice(0, 300)}\n`);
  process.exitCode = 1;
});
