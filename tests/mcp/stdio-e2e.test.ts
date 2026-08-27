import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { describe, expect, it } from "vitest";
import { TOOL_NAMES } from "../../services/content-ops-mcp/src/tool-registry.js";

describe("bundled STDIO MCP SDK E2E", () => {
  it("initializes, lists tools, validates malformed input and exits cleanly", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-e2e-"));
    const bundle = path.resolve("plugins/content-ops-studio/runtime/dist/content-ops-mcp.mjs");
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [bundle],
      cwd: path.resolve("plugins/content-ops-studio"),
      env: {
        PATH: process.env.PATH ?? "",
        PLUGIN_ROOT: path.resolve("plugins/content-ops-studio"),
        PLUGIN_DATA: pluginData,
        CONTENT_OPS_HOME: path.join(pluginData, "content-ops-home"),
      },
      stderr: "pipe",
    });
    const client = new Client({ name: "content-ops-e2e", version: "0.1.0" });
    await client.connect(transport);
    expect(client.getInstructions()).toContain("Before any write");
    const catalog = await client.listTools();
    expect(catalog.tools.map((tool) => tool.name)).toEqual(TOOL_NAMES);
    expect(catalog.tools.every((tool) => tool.outputSchema)).toBe(true);

    const list = await client.callTool({ name: "content_ops_list_projects", arguments: {} });
    expect(list.isError).not.toBe(true);
    expect((list.structuredContent as Record<string, unknown> | undefined)?.status).toBe("SUCCESS");

    const representativeReads: Array<[string, Record<string, unknown>]> = [
      ["content_ops_doctor", {}],
      ["content_ops_check_feishu", {}],
      ["content_ops_get_project", { project_id: "PRJ-OFFLINE-TEST" }],
      ["content_ops_plan_project_initialization", { project_profile: {} }],
      ["content_ops_inspect_workspace", { project_id: "PRJ-OFFLINE-TEST" }],
      ["content_ops_verify_workspace", { project_id: "PRJ-OFFLINE-TEST" }],
      ["content_ops_plan_workspace_repair", { project_id: "PRJ-OFFLINE-TEST" }],
      [
        "content_ops_get_run_status",
        { project_id: "PRJ-OFFLINE-TEST", run_id: "RUN-OFFLINE-TEST" },
      ],
      ["content_ops_list_pending_approvals", { project_id: "PRJ-OFFLINE-TEST" }],
      ["content_ops_get_research_context", { project_id: "PRJ-OFFLINE-TEST" }],
      [
        "content_ops_plan_painpoint_research",
        { project_id: "PRJ-OFFLINE-TEST", run_id: "RUN-OFFLINE-TEST" },
      ],
      ["content_ops_list_painpoints", { project_id: "PRJ-OFFLINE-TEST" }],
      [
        "content_ops_get_painpoint",
        { project_id: "PRJ-OFFLINE-TEST", painpoint_id: "P-OFFLINE-TEST" },
      ],
      [
        "content_ops_verify_painpoint_batch",
        { project_id: "PRJ-OFFLINE-TEST", run_id: "RUN-OFFLINE-TEST" },
      ],
    ];
    for (const [name, argumentsValue] of representativeReads) {
      const result = await client.callTool({ name, arguments: argumentsValue });
      expect(result.structuredContent ?? result.content).toBeDefined();
    }

    for (const name of [
      "content_ops_start_feishu_setup",
      "content_ops_initialize_project",
      "content_ops_apply_workspace_repair",
      "content_ops_submit_approval",
      "content_ops_resume_run",
      "content_ops_submit_research_sources",
      "content_ops_submit_painpoint_candidates",
      "content_ops_finalize_painpoint_research",
    ]) {
      const missingConfirmation = await client.callTool({ name, arguments: {} });
      expect(missingConfirmation.isError).toBe(true);
    }

    const malformed = await client.callTool({
      name: "content_ops_get_project",
      arguments: { project_id: "../../etc/passwd", secret: "forbidden" },
    });
    expect(malformed.isError).toBe(true);

    const resumed = await client.callTool({
      name: "content_ops_resume_run",
      arguments: {
        project_id: "PRJ-OFFLINE-TEST",
        run_id: "RUN-OFFLINE-TEST",
        expected_version: "V1",
        request_id: "REQUEST-OFFLINE-0001",
        explicit_confirmation: true,
      },
    });
    expect(resumed.isError).toBe(true);
    expect(resumed.structuredContent).toBeDefined();
    await client.close();
  });
});
