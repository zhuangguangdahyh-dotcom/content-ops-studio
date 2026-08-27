import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createContentOpsMcpServer } from "../../services/content-ops-mcp/src/server.js";
import { SERVER_INSTRUCTIONS } from "../../services/content-ops-mcp/src/instructions.js";
import { resultEnvelopeSchema } from "../../services/content-ops-mcp/src/result-envelope.js";
import { TOOL_DEFINITIONS, TOOL_NAMES } from "../../services/content-ops-mcp/src/tool-registry.js";

const readTools = new Set([
  "content_ops_doctor",
  "content_ops_check_feishu",
  "content_ops_list_projects",
  "content_ops_get_project",
  "content_ops_plan_project_initialization",
  "content_ops_inspect_workspace",
  "content_ops_verify_workspace",
  "content_ops_plan_workspace_repair",
  "content_ops_get_run_status",
  "content_ops_list_pending_approvals",
  "content_ops_get_research_context",
  "content_ops_plan_painpoint_research",
  "content_ops_list_painpoints",
  "content_ops_get_painpoint",
  "content_ops_verify_painpoint_batch",
  "content_ops_get_content_context",
  "content_ops_plan_content_creation",
  "content_ops_list_contents",
  "content_ops_get_content",
  "content_ops_verify_content",
  "content_ops_plan_content_revision",
  "content_ops_get_visual_context",
  "content_ops_plan_visual_direction",
  "content_ops_get_visual_plan",
  "content_ops_verify_visual_plan",
  "content_ops_plan_visual_revision",
  "content_ops_get_first_page_handoff",
  "content_ops_get_renderer_status",
  "content_ops_plan_first_page_production",
  "content_ops_get_first_page_asset",
  "content_ops_verify_first_page",
  "content_ops_plan_first_page_revision",
  "content_ops_get_image_production_context",
  "content_ops_plan_cover_conversion",
  "content_ops_evaluate_cover_click_clarity",
  "content_ops_evaluate_visual_semantic_relevance",
  "content_ops_get_cover_concept_candidates",
  "content_ops_plan_asset_routing",
  "content_ops_plan_visual_direction_candidates",
  "content_ops_get_visual_direction_candidates",
  "content_ops_list_visual_rules",
  "content_ops_plan_full_set_production",
  "content_ops_plan_finalization",
  "content_ops_get_finalization_status",
  "content_ops_verify_final_delivery",
]);

const openWorldWriteTools = new Set([
  "content_ops_start_feishu_setup",
  "content_ops_initialize_project",
  "content_ops_apply_workspace_repair",
  "content_ops_submit_approval",
  "content_ops_resume_run",
  "content_ops_submit_research_sources",
  "content_ops_finalize_painpoint_research",
  "content_ops_finalize_content_copy",
  "content_ops_finalize_visual_plan",
  "content_ops_setup_renderer",
  "content_ops_render_first_page",
]);

describe("Phase 4A MCP server", () => {
  it("has stable initialization metadata and safety instructions", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-unit-"));
    const created = createContentOpsMcpServer({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
    });
    expect(created.server).toBeDefined();
    expect(created.context.runtimeMode).toBe("PRODUCTION");
    expect(created.context.workspaceAdapter).toBe("LARK_CLI");
    expect(SERVER_INSTRUCTIONS.length).toBeGreaterThan(512);
    expect(SERVER_INSTRUCTIONS.slice(0, 512)).toContain("Before any write");
    expect(SERVER_INSTRUCTIONS.slice(0, 512)).toContain("Only content_ops_submit_approval");
    await created.server.close();
  });

  it("registers the computed unique user-goal tool catalog", () => {
    const expectedNames = [
      "content_ops_doctor",
      "content_ops_check_feishu",
      "content_ops_start_feishu_setup",
      "content_ops_list_projects",
      "content_ops_get_project",
      "content_ops_plan_project_initialization",
      "content_ops_initialize_project",
      "content_ops_inspect_workspace",
      "content_ops_verify_workspace",
      "content_ops_plan_workspace_repair",
      "content_ops_apply_workspace_repair",
      "content_ops_get_run_status",
      "content_ops_list_pending_approvals",
      "content_ops_submit_approval",
      "content_ops_resume_run",
      "content_ops_get_research_context",
      "content_ops_plan_painpoint_research",
      "content_ops_submit_research_sources",
      "content_ops_submit_painpoint_candidates",
      "content_ops_finalize_painpoint_research",
      "content_ops_list_painpoints",
      "content_ops_get_painpoint",
      "content_ops_verify_painpoint_batch",
      "content_ops_get_content_context",
      "content_ops_plan_content_creation",
      "content_ops_submit_content_draft",
      "content_ops_finalize_content_copy",
      "content_ops_list_contents",
      "content_ops_get_content",
      "content_ops_verify_content",
      "content_ops_plan_content_revision",
      "content_ops_get_visual_context",
      "content_ops_plan_visual_direction",
      "content_ops_submit_visual_plan",
      "content_ops_finalize_visual_plan",
      "content_ops_get_visual_plan",
      "content_ops_verify_visual_plan",
      "content_ops_plan_visual_revision",
      "content_ops_get_first_page_handoff",
      "content_ops_get_renderer_status",
      "content_ops_setup_renderer",
      "content_ops_plan_first_page_production",
      "content_ops_render_first_page",
      "content_ops_get_first_page_asset",
      "content_ops_verify_first_page",
      "content_ops_plan_first_page_revision",
      "content_ops_submit_first_page_review",
      "content_ops_plan_cover_conversion",
      "content_ops_submit_cover_copy_revision",
      "content_ops_evaluate_cover_thumbnail",
      "content_ops_evaluate_cover_click_clarity",
      "content_ops_evaluate_visual_semantic_relevance",
      "content_ops_get_cover_concept_candidates",
      "content_ops_get_image_production_context",
      "content_ops_plan_asset_routing",
      "content_ops_plan_visual_direction_candidates",
      "content_ops_submit_direction_candidate_assets",
      "content_ops_get_visual_direction_candidates",
      "content_ops_select_visual_direction",
      "content_ops_submit_generated_visual_asset",
      "content_ops_evaluate_image_quality",
      "content_ops_submit_visual_feedback",
      "content_ops_list_visual_rules",
      "content_ops_confirm_visual_rule",
      "content_ops_update_visual_rule",
      "content_ops_plan_full_set_production",
      "content_ops_evaluate_group_quality",
      "content_ops_plan_finalization",
      "content_ops_finalize_delivery",
      "content_ops_get_finalization_status",
      "content_ops_verify_final_delivery",
    ];
    expect(TOOL_NAMES).toHaveLength(expectedNames.length);
    expect(new Set(TOOL_NAMES).size).toBe(expectedNames.length);
    expect(TOOL_NAMES).toEqual(expectedNames);
  });

  it("publishes title, description, schemas and accurate annotations", () => {
    for (const tool of TOOL_DEFINITIONS) {
      expect(tool.title.length).toBeGreaterThan(0);
      expect(tool.description.length).toBeGreaterThan(20);
      expect(tool.inputSchema).toBeDefined();
      expect(tool.outputSchema).toBe(resultEnvelopeSchema);
      expect(tool.annotations.destructiveHint).toBe(false);
      expect(tool.annotations.readOnlyHint).toBe(readTools.has(tool.name));
      expect(tool.annotations.openWorldHint).toBe(openWorldWriteTools.has(tool.name));
    }
  });

  it("resumes a completed G3 Content Run as an idempotent no-op", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-g3-resume-"));
    const created = createContentOpsMcpServer({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
    });
    const projectId = "PRJ-20990101-CONTENT";
    const runId = "RUN-20990101-010203-CONTENT";
    await created.context.writeContentJson(projectId, runId, "checkpoint.json", {
      run_id: runId,
      gate: "CONTENT_COPY",
      target_type: "CONTENT_PACKAGE",
      target_id: "C-0001",
      target_version: "CV-1:CV-1",
      status: "AWAITING_APPROVAL",
    });
    await created.context.writeContentJson(projectId, runId, "result.json", {
      status: "SUCCESS",
      gate: "CONTENT_COPY",
      content_status: "COPY_APPROVED",
      eligible_for_visual_planning: true,
      visual_planning_started: false,
    });
    const resume = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_resume_run");
    if (!resume) throw new Error("Resume tool is missing.");
    const result = await resume.handler(created.context, {
      project_id: projectId,
      run_id: runId,
      expected_version: "CV-1:CV-1",
      request_id: "RESUME-CONTENT-0001",
      explicit_confirmation: true,
    });
    expect(result).toMatchObject({
      status: "SUCCESS",
      details: {
        resume_status: "PASSED_NO_OP",
        content_status: "COPY_APPROVED",
        eligible_for_visual_planning: true,
        visual_planning_started: false,
      },
    });
    await created.server.close();
  });

  it("keeps research boundaries strict and write annotations exact", () => {
    const sourceSubmit = TOOL_DEFINITIONS.find(
      (tool) => tool.name === "content_ops_submit_research_sources",
    );
    const candidateSubmit = TOOL_DEFINITIONS.find(
      (tool) => tool.name === "content_ops_submit_painpoint_candidates",
    );
    const finalize = TOOL_DEFINITIONS.find(
      (tool) => tool.name === "content_ops_finalize_painpoint_research",
    );
    expect(sourceSubmit?.annotations).toMatchObject({ readOnlyHint: false, openWorldHint: true });
    expect(candidateSubmit?.annotations).toMatchObject({
      readOnlyHint: false,
      openWorldHint: false,
    });
    expect(finalize?.annotations).toMatchObject({ readOnlyHint: false, openWorldHint: true });
    expect(
      sourceSubmit?.inputSchema.safeParse({
        project_id: "PRJ-OFFLINE-TEST",
        run_id: "RUN-OFFLINE-TEST",
        research_plan_id: "RPL-OFFLINE-TEST",
        sources: [{ source_id: "SRC-0001", source_type: "OFFICIAL_SOURCE", body: "full page" }],
      }).success,
    ).toBe(false);
  });

  it("rejects unknown fields and missing write confirmation", () => {
    const doctor = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_doctor");
    expect(doctor).toBeDefined();
    if (!doctor) throw new Error("Doctor tool is missing.");
    expect(doctor.inputSchema.safeParse({ secret: "forbidden" }).success).toBe(false);
    const initialize = TOOL_DEFINITIONS.find(
      (tool) => tool.name === "content_ops_initialize_project",
    );
    expect(initialize).toBeDefined();
    if (!initialize) throw new Error("Initialize tool is missing.");
    expect(
      initialize.inputSchema.safeParse({
        project_profile: {},
        plan_hash: "a".repeat(64),
        idempotency_key: "REQUEST-12345",
      }).success,
    ).toBe(false);
  });

  it("treats Node 24 as the installed Plugin runtime baseline", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-doctor-"));
    const created = createContentOpsMcpServer({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
    });
    expect(process.versions.node.split(".")[0]).toBe("24");
    expect(created.context.runtimeMode).toBe("PRODUCTION");
    await created.server.close();
  });
});
