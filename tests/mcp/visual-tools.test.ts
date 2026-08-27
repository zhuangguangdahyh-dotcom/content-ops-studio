import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMcpContext } from "../../services/content-ops-mcp/src/context.js";
import { TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/tool-registry.js";
import { VISUAL_TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/visual-tools.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");
const load = async (name: string) =>
  JSON.parse(await readFile(path.join(fixtureRoot, name, "valid/complete.json"), "utf8")) as Record<
    string,
    unknown
  >;

function tool(name: string) {
  const found = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!found) throw new Error(`Missing ${name}.`);
  return found;
}

describe("Phase 4A Visual Planning MCP tools", () => {
  it("registers eight bounded tools with six reads and two writes", () => {
    const visual = VISUAL_TOOL_DEFINITIONS;
    expect(visual).toHaveLength(8);
    expect(visual.filter((item) => item.annotations.readOnlyHint)).toHaveLength(6);
    expect(visual.filter((item) => !item.annotations.readOnlyHint)).toHaveLength(2);
    expect(tool("content_ops_submit_visual_plan").annotations.openWorldHint).toBe(false);
    expect(tool("content_ops_finalize_visual_plan").annotations.openWorldHint).toBe(true);
  });

  it("submits a schema-valid plan locally without a remote write", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-visual-tool-"));
    const context = createMcpContext({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
    });
    const projectId = "PRJ-20990101-DEMO";
    const runId = "RUN-20990101-010203-DEMO";
    const contentRunId = "RUN-20990101-010203-CONTENT";
    const [visualContext, decision, references, visualSystem, assets, layout, quality, handoff] =
      await Promise.all([
        load("visual-planning-context"),
        load("visual-direction-decision"),
        load("visual-reference-manifest"),
        load("visual-system"),
        load("asset-requirements-plan"),
        load("layout-feasibility-report"),
        load("visual-planning-quality-report"),
        load("visual-handoff-package"),
      ]);
    visualContext.content_package_ref = `projects/${projectId}/runs/${contentRunId}/content/content-package.json`;
    const pages = visualSystem.pages as Array<Record<string, unknown>>;
    await context.writeContentJson(projectId, contentRunId, "content-package.json", {
      pages: pages.map((page) => ({
        page_number: page.page_number,
        ...(page.copy_snapshot as object),
      })),
    });
    const result = await tool("content_ops_submit_visual_plan").handler(context, {
      project_id: projectId,
      content_id: "C-0001",
      run_id: runId,
      idempotency_key: "visual-demo-key-001",
      visual_context: visualContext,
      visual_direction_decision: decision,
      visual_reference_manifest: references,
      visual_system: visualSystem,
      page_visual_plans: pages,
      asset_requirements_plan: assets,
      layout_feasibility_report: layout,
      visual_quality_report: quality,
      visual_handoff_package: handoff,
    });
    expect(result.status).toBe("SUCCESS");
    expect(result.updated_records).toBe(0);
    expect(result.details).toMatchObject({ remote_write_attempted: false });
  });

  it("plans a visual-only revision as a zero-write dry run and routes page-count drift back", async () => {
    const visualOnly = await tool("content_ops_plan_visual_revision").handler({} as never, {
      project_id: "PRJ-20990101-DEMO",
      content_id: "C-0001",
      run_id: "RUN-20990101-010203-DEMO",
      from_visual_plan_version: "VV-1",
      revision_scope: "COLOR_SYSTEM",
      requested_changes: ["Use a darker muted blue-gray"],
      changes_copy: false,
      changes_page_count: false,
    });
    expect(visualOnly.status).toBe("SUCCESS");
    expect(visualOnly.details).toMatchObject({ remote_write_attempted: false });
    const pageCount = await tool("content_ops_plan_visual_revision").handler({} as never, {
      project_id: "PRJ-20990101-DEMO",
      content_id: "C-0001",
      run_id: "RUN-20990101-010203-DEMO",
      from_visual_plan_version: "VV-1",
      revision_scope: "PAGE_PLAN",
      requested_changes: ["Add one page"],
      changes_copy: false,
      changes_page_count: true,
    });
    expect(pageCount.status).toBe("BLOCKED");
  });
});
