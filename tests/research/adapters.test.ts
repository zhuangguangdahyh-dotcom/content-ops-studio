import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  FixtureResearchAdapter,
  HostNativeResearchAdapter,
  ManualSourceResearchAdapter,
} from "../../packages/research-adapters/src/index.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");
async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(path.join(fixtureRoot, name, "valid/complete.json"), "utf8"),
  ) as T;
}

describe("research adapters", () => {
  it("accepts an explicit Plugin schema root for bundled-runtime execution", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-adapter-schema-root-"));
    const adapter = new HostNativeResearchAdapter({
      sessionsRoot: root,
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const plan = await fixture<Record<string, unknown>>("painpoint-research-plan");
    await expect(adapter.createResearchSession(plan)).resolves.toMatchObject({ status: "CREATED" });
  });

  it("declares host/manual capabilities without network authority", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-adapter-"));
    await expect(
      new HostNativeResearchAdapter({ sessionsRoot: root }).probeCapabilities(),
    ).resolves.toMatchObject({
      external_network: false,
      accepts_host_sources: true,
      fixture_only: false,
    });
    await expect(
      new ManualSourceResearchAdapter({ sessionsRoot: root }).probeCapabilities(),
    ).resolves.toMatchObject({
      external_network: false,
      accepts_manual_sources: true,
      fixture_only: false,
    });
  });

  it("persists, verifies and resumes a complete host-mediated research session", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-session-"));
    const adapter = new HostNativeResearchAdapter({ sessionsRoot: root });
    const plan = await fixture<Record<string, unknown>>("painpoint-research-plan");
    const manifest = await fixture<Record<string, unknown>>("research-source-manifest");
    const report = await fixture<Record<string, unknown>>("painpoint-research-report");
    const batch = (report as { final_painpoint_batch: Record<string, unknown> })
      .final_painpoint_batch;
    const candidates = (report as { painpoint_candidates: unknown[] }).painpoint_candidates;

    await adapter.createResearchSession(plan);
    await adapter.ingestSources(String(plan.research_plan_id), manifest);
    await adapter.ingestPainpointCandidates(String(plan.research_plan_id), candidates);
    await adapter.buildResearchReport(String(plan.research_plan_id), report);
    const finalized = await adapter.finalizePainpointBatch(String(plan.research_plan_id), batch);
    expect(finalized.status).toBe("FINALIZED");
    await expect(adapter.resumeResearchSession(String(plan.research_plan_id))).resolves.toEqual(
      finalized,
    );
    await expect(adapter.createResearchSession(plan)).resolves.toEqual(finalized);
    const replayPlan = { ...plan, created_at: "2099-01-02T00:00:00.000Z" };
    await expect(adapter.createResearchSession(replayPlan)).resolves.toEqual(finalized);
  });

  it("forbids fixture mode in production and rejects empty evidence", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-fixture-"));
    const before = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    try {
      expect(() => new FixtureResearchAdapter({ sessionsRoot: root, testOnly: true })).toThrow(
        "FIXTURE_RESEARCH_ADAPTER_FORBIDDEN",
      );
    } finally {
      if (before === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = before;
    }
    await expect(
      new ManualSourceResearchAdapter({ sessionsRoot: root }).validateEvidence([]),
    ).rejects.toThrow("RESEARCH_EVIDENCE_REQUIRED");
  });
});
