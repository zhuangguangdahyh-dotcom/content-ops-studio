import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
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
      "content_ops_export_sanitized_pngs",
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

  it("returns semantic Profile gaps instead of claiming placeholder data is complete", async () => {
    const profile = JSON.parse(
      await readFile(
        path.resolve("tests/fixtures/contracts/1.0/project-profile/valid/complete.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    profile.project_status = "PROJECT_PENDING_CONFIRMATION";
    profile.config_confirmation_status = "CONFIG_PENDING";
    profile.price_band = "待确认";
    profile.extensions = {
      unresolved_fields: ["price_band"],
      inferred_fields: ["content_style"],
    };
    const plan = TOOL_DEFINITIONS.find(
      (tool) => tool.name === "content_ops_plan_project_initialization",
    );
    if (!plan) throw new Error("Initialization plan tool is missing.");
    const context = {
      validateProjectProfile: () => Promise.resolve(),
      validateSchema: () => Promise.resolve(),
      invokeCli: () =>
        Promise.resolve({
          exitCode: 0,
          value: {
            plan: {
              expected: { tables: 4, fields: 141, relations: 5, views: 4 },
              conflicts: [],
              blueprintVersion: "1.0.0",
            },
          },
        }),
      hash: () => "a".repeat(64),
    } as unknown as Parameters<typeof plan.handler>[0];
    const result = await plan.handler(context, { project_profile: profile });
    expect(result).toMatchObject({
      status: "SUCCESS",
      warnings: ["Project Profile contains explicit gaps or unconfirmed inferences."],
      details: {
        profile_complete: false,
        ready_for_project_confirmation: true,
        missing_fields: ["price_band"],
        non_blocking_gaps: ["price_band"],
        inferred_fields: ["content_style"],
      },
    });
  });

  it("persists the confirmed canonical Profile after a read-verified G1 approval", async () => {
    const fixture = JSON.parse(
      await readFile(
        path.resolve("tests/fixtures/contracts/1.0/project-profile/valid/complete.json"),
        "utf8",
      ),
    ) as Record<string, unknown>;
    const projectId = String(fixture.project_id);
    const runId = String(fixture.last_run_id);
    const pendingProfile = {
      ...fixture,
      project_status: "PROJECT_PENDING_CONFIRMATION",
      config_confirmation_status: "CONFIG_PENDING",
      extensions: { inferred_fields: ["visual_preferences"], unresolved_fields: ["price_band"] },
    };
    const writes: Array<{ kind: string; key: string; value: unknown }> = [];
    const approval = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_submit_approval");
    if (!approval) throw new Error("Approval tool is missing.");
    const context = {
      writeControlledJson: (kind: string, key: string, value: unknown) => {
        writes.push({ kind, key, value });
        return Promise.resolve(`/controlled/${kind}/${key}.json`);
      },
      validateSchema: () => Promise.resolve(),
      validateProjectProfile: () => Promise.resolve(),
      readProjectProfile: () => Promise.resolve(pendingProfile),
      invokeCli: () => Promise.resolve({ exitCode: 0, value: { remote_update: "VERIFIED" } }),
    } as unknown as Parameters<typeof approval.handler>[0];
    const result = await approval.handler(context, {
      approval_id: "APR-20990101-G1TEST",
      gate: "PROJECT_PROFILE",
      target_type: "PROJECT",
      target_id: projectId,
      target_version: `PROJECT-PROFILE-V${String(fixture.configuration_version)}`,
      decision: "APPROVE",
      source_run_id: runId,
      project_id: projectId,
      project_name: String(fixture.project_name),
      comment: "Operator explicitly approved the current Project Profile.",
      expected_version: `PROJECT-PROFILE-V${String(fixture.configuration_version)}`,
      project_profile_confirmation: pendingProfile,
      request_id: "REQUEST-G1-PROFILE-0001",
      explicit_confirmation: true,
    });
    expect(result).toMatchObject({
      status: "SUCCESS",
      details: {
        remote_update: "VERIFIED",
        project_profile_snapshot: "CONFIRMED_AND_READ_VERIFIED",
      },
    });
    expect(writes.at(-1)).toMatchObject({
      kind: "profiles",
      key: projectId,
      value: {
        project_status: "PROJECT_ACTIVE",
        config_confirmation_status: "CONFIG_CONFIRMED",
        extensions: { inferred_fields: [], unresolved_fields: ["price_band"] },
      },
    });
  });

  it("validates an approval event before persisting it", async () => {
    const approval = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_submit_approval");
    if (!approval) throw new Error("Approval tool is missing.");
    let writes = 0;
    const context = {
      validateSchema: () =>
        Promise.reject(Object.assign(new Error("invalid"), { code: "SCHEMA_MISMATCH" })),
      writeControlledJson: () => {
        writes += 1;
        return Promise.resolve("/should-not-exist.json");
      },
    } as unknown as Parameters<typeof approval.handler>[0];
    await expect(
      approval.handler(context, {
        approval_id: "APR-20990101-TEST",
        gate: "PROJECT_PROFILE",
        target_type: "PROJECT",
        target_id: "PRJ-20990101-TEST",
        target_version: "PROJECT-PROFILE-V1",
        decision: "APPROVE",
        source_run_id: "RUN-20990101-010203-TEST",
        project_id: "PRJ-20990101-TEST",
        project_name: "Fictional project",
        comment: "Operator approval.",
        expected_version: "PROJECT-PROFILE-V1",
        request_id: "REQUEST-G1-VALIDATION-0001",
        explicit_confirmation: true,
      }),
    ).rejects.toMatchObject({ code: "SCHEMA_MISMATCH" });
    expect(writes).toBe(0);
  });

  it("propagates structured CLI stderr errors instead of replacing their code", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-cli-error-"));
    const created = createContentOpsMcpServer({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
    });
    await expect(created.context.invokeCli(["not-a-real-command"])).rejects.toMatchObject({
      code: "INVALID_INPUT",
    });
    await created.server.close();
  });

  it("does not report MATCH when remote Workspace verification is false", async () => {
    const verify = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_verify_workspace");
    if (!verify) throw new Error("Workspace verify tool is missing.");
    const context = {
      invokeCli: () =>
        Promise.resolve({
          exitCode: 0,
          value: {
            status: "SUCCESS",
            verification: {
              verified: false,
              plan: {
                tableOperations: [],
                fieldOperations: [{ operation: "CREATE", logicalKey: "missingField" }],
                relationOperations: [],
                viewOperations: [],
                conflicts: [],
              },
            },
          },
        }),
    } as unknown as Parameters<typeof verify.handler>[0];
    const result = await verify.handler(context, { project_id: "PRJ-20990101-DEMO" });
    expect(result).toMatchObject({
      status: "BLOCKED",
      details: {
        verification_status: "REPAIR_AVAILABLE",
        verified: false,
        pending_operation_count: 1,
        conflict_count: 0,
      },
    });
  });

  it("separates Blueprint mappings from platform-generated remote objects", async () => {
    const inspect = TOOL_DEFINITIONS.find((tool) => tool.name === "content_ops_inspect_workspace");
    if (!inspect) throw new Error("Workspace inspect tool is missing.");
    const context = {
      invokeCli: () =>
        Promise.resolve({
          exitCode: 0,
          value: {
            snapshot: {
              tables: [
                {
                  fields: [{ type: 1 }, { type: 18 }, { type: 21 }],
                  views: [{}, {}],
                },
              ],
            },
          },
        }),
      readProject: () =>
        Promise.resolve({
          run_id: "RUN-20990101-010203-DEMO",
          overall_status: "AWAITING_APPROVAL",
          current_phase: 12,
          remote_identifiers: {
            "table:projectConfig": "redacted",
            "view:projectConfig": "redacted",
            "record:projectConfig": "redacted",
          },
          extensions: {
            field_map: [{ fieldType: 1 }, { fieldType: 18 }],
          },
        }),
    } as unknown as Parameters<typeof inspect.handler>[0];
    const result = await inspect.handler(context, { project_id: "PRJ-20990101-DEMO" });
    expect(result).toMatchObject({
      status: "SUCCESS",
      details: {
        field_count: 3,
        relation_count: 2,
        view_count: 2,
        blueprint_table_count: 1,
        blueprint_mapped_field_count: 2,
        blueprint_relation_count: 1,
        blueprint_named_view_count: 1,
        platform_generated_or_default_field_count: 1,
        platform_generated_relation_count: 1,
        platform_default_or_extra_view_count: 1,
        project_record_reference_present: true,
      },
    });
  });

  it("counts array-backed field and relation states when listing projects", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "content-ops-mcp-project-list-"));
    const projectRoot = path.join(pluginData, "projects", "PRJ-20990101-DEMO", "workspace");
    await mkdir(projectRoot, { recursive: true });
    await writeFile(
      path.join(projectRoot, "provisioning-state.json"),
      JSON.stringify({
        run_id: "RUN-20990101-010203-DEMO",
        overall_status: "AWAITING_APPROVAL",
        current_phase: 12,
        field_states: [{}, {}],
        relation_states: [{}],
      }),
    );
    const created = createContentOpsMcpServer({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
      home: pluginData,
    });
    await expect(created.context.listProjects()).resolves.toEqual([
      expect.objectContaining({ field_count: 3 }),
    ]);
    await created.server.close();
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
