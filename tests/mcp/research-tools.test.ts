import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createMcpContext } from "../../services/content-ops-mcp/src/context.js";
import { TOOL_DEFINITIONS } from "../../services/content-ops-mcp/src/tool-registry.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");
async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(path.join(fixtureRoot, name, "valid/complete.json"), "utf8"),
  ) as T;
}

function tool(name: string) {
  const definition = TOOL_DEFINITIONS.find((item) => item.name === name);
  if (!definition) throw new Error(`Missing tool ${name}`);
  return definition;
}

describe("Phase 3A research MCP local workflow", () => {
  it("plans, retains current-source evidence and scores candidates without a remote write", async () => {
    const pluginData = await mkdtemp(path.join(os.tmpdir(), "research-mcp-"));
    const home = path.join(pluginData, "content-ops-home");
    const profile = await fixture<Record<string, unknown>>("project-profile");
    const projectId = String(profile.project_id);
    const workspaceRunId = String(profile.last_run_id);
    const runId = "RUN-20990101-000001-P3A1";
    const state = await fixture<Record<string, unknown>>("feishu-provisioning-state");
    state.project_id = projectId;
    state.run_id = workspaceRunId;
    state.overall_status = "SUCCESS";
    const workspaceRoot = path.join(home, "projects", projectId, "workspace");
    await mkdir(workspaceRoot, { recursive: true });
    await writeFile(
      path.join(home, "project-profile.json"),
      `${JSON.stringify(profile)}\n`,
      "utf8",
    );
    await writeFile(
      path.join(workspaceRoot, "provisioning-state.json"),
      `${JSON.stringify(state)}\n`,
      "utf8",
    );
    const context = createMcpContext({
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      pluginData,
      home,
      env: {},
    });

    const researchContext = await tool("content_ops_get_research_context").handler(context, {
      project_id: projectId,
    });
    expect(researchContext.status).toBe("SUCCESS");

    const planResult = await tool("content_ops_plan_painpoint_research").handler(context, {
      project_id: projectId,
      run_id: runId,
      requested_count: 30,
      minimum_acceptable_count: 1,
      allow_hypothesis_candidates: false,
      research_objective: "Research fictional small service business trust decisions.",
      audience_segments: ["Fictional small service business operator"],
      decision_stages: ["ACTIVE_SEARCH", "SOLUTION_COMPARISON"],
      business_scenarios: ["Building trust with useful platform content"],
      region_scope: ["China"],
      date_from: "2025-01-01",
      date_to: "2099-01-01",
      language_scope: ["zh-CN"],
      query_plan: [
        {
          query_id: "Q-OFFLINE-001",
          query: "fictional platform trust research",
          purpose: "Find current evidence.",
          source_types: ["OFFICIAL_SOURCE"],
        },
      ],
    });
    expect(planResult.status).toBe("SUCCESS");
    const plan = (planResult.details as { research_plan: Record<string, unknown> }).research_plan;

    const sourceResult = await tool("content_ops_submit_research_sources").handler(context, {
      project_id: projectId,
      run_id: runId,
      research_plan_id: plan.research_plan_id,
      sources: [
        {
          source_id: "SRC-0001",
          source_type: "OFFICIAL_SOURCE",
          title: "Fictional official guide",
          publisher_or_owner: "Example",
          source_location: "https://example.com/guide?utm_source=test",
          source_date: "2099-01-01",
          retrieved_at: "2099-01-01T00:00:00.000Z",
          language: "zh-CN",
          summary: "A bounded fictional summary supports a trust-decision claim.",
          supported_claims: ["Clear professional identity supports trust decisions."],
          limitations: "Contract test only.",
          credibility_notes: "Official fixture source.",
          is_first_party: true,
          is_user_provided: false,
          is_current: true,
        },
      ],
    });
    expect(sourceResult).toMatchObject({ status: "SUCCESS", created_records: 1 });

    const candidateInput = {
      project_id: projectId,
      run_id: runId,
      research_plan_id: plan.research_plan_id,
      candidates: [
        {
          painpoint_id: "P-0001",
          painpoint_name: "Hard to prove professional trust before consultation",
          business_scenario: "A small service business publishes useful content.",
          audience_type: "Fictional small service business operator",
          decision_stage: "SOLUTION_COMPARISON",
          explicit_need: "Know which content proves expertise.",
          deep_anxiety: "Attention will not become qualified consultation.",
          trigger_events: ["Starting a professional account"],
          primary_barriers: ["Weak proof structure"],
          analysis_reason: "Trust affects service comparison.",
          commercial_loss_or_real_cost: "Time spent without qualified leads.",
          content_entry_angles: ["Expertise proof checklist"],
          subject_advantages_to_express: ["Transparent process"],
          evidence_refs: ["E-0001"],
          evidence_confidence: "A_DIRECT_STRONG",
          promotion_priority: "MEDIUM",
          duplication_risk: "LOW",
          score: {
            audience_relevance: 5,
            frequency: 4,
            urgency: 4,
            decision_impact: 5,
            real_cost: 4,
            subject_advantage_fit: 5,
            evidence_strength: 5,
            content_potential: 4,
            promotion_fit: 3,
          },
          score_explanations: ["The evidence directly supports a high-impact trust decision."],
          score_limitations: [],
          near_duplicate_reason: null,
        },
      ],
    };
    const candidateResult = await tool("content_ops_submit_painpoint_candidates").handler(
      context,
      candidateInput,
    );
    expect(candidateResult).toMatchObject({ status: "SUCCESS", created_records: 1 });
    expect(candidateResult.details).toMatchObject({ remote_write_attempted: false });
    const retainedBefore = (await context.readResearchJson(
      projectId,
      runId,
      "painpoint-candidates.json",
    )) as Array<Record<string, unknown>>;
    await tool("content_ops_submit_painpoint_candidates").handler(context, candidateInput);
    const retainedAfter = (await context.readResearchJson(
      projectId,
      runId,
      "painpoint-candidates.json",
    )) as Array<Record<string, unknown>>;
    expect(retainedAfter[0]?.created_at).toBe(retainedBefore[0]?.created_at);
    expect(retainedAfter[0]?.updated_at).toBe(retainedBefore[0]?.updated_at);

    await expect(
      tool("content_ops_finalize_painpoint_research").handler(context, {
        project_id: projectId,
        run_id: runId,
        research_plan_id: plan.research_plan_id,
        insufficiency_reason: "Only one candidate is needed for this offline test.",
        decision_chain_summary: "Search then compare.",
        business_scenario_summary: "Fictional professional service content.",
        audience_summary: "Fictional operator.",
        source_limitations: ["Offline contract test."],
        idempotency_key: "RESEARCH-OFFLINE-REQUEST-001",
        explicit_confirmation: true,
      }),
    ).rejects.toMatchObject({ code: "LIVE_WRITE_ENV_GATE_REQUIRED" });
  }, 15_000);
});
