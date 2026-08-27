import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type {
  ProjectProfile,
  TaskEnvelope,
} from "../../packages/contracts/src/generated/1.0/index.js";
import {
  approvalFor,
  ReferenceRuntimeEngine,
} from "../../packages/runtime/src/reference-runtime/index.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const pluginRoot = path.resolve("plugins/content-ops-studio");
const fixedClock = { now: () => new Date("2099-01-02T03:04:05.000Z") };

function envelope(runId: string, projectId: string, taskType: string): TaskEnvelope {
  return {
    contract_version: "1.0.0",
    schema_version: "1.0.0",
    run_id: runId,
    project_id: projectId,
    task_type: taskType,
    operation: "EXECUTE_FIXTURE",
    source: "mock",
    raw_instruction: "Execute the sanitized local fixture.",
    targets: { painpoint_ids: [], content_ids: [], page_numbers: [] },
    overrides: {},
    approval_event: null,
    resume: { from_run_id: null, from_step: null },
    dry_run: false,
  };
}

describe("Phase 2A reference runtime", () => {
  it("runs PROJECT_INITIALIZATION_LOCAL_V1 through G1 and recovery-safe completion", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "content-ops-project-e2e-"));
    roots.push(home);
    const runId = "RUN-20990102-030405-P001";
    const projectId = "PRJ-20990102-P001";
    const profile = JSON.parse(
      await readFile("tests/fixtures/contracts/1.0/project-profile/valid/complete.json", "utf8"),
    ) as ProjectProfile;
    Object.assign(profile, {
      project_id: projectId,
      project_name: "Fictional Runtime Project",
      project_status: "PROJECT_INITIALIZING",
      config_confirmation_status: "CONFIG_PENDING",
      platform_pack: "xiaohongshu",
      industry_pack: "generic",
      last_run_id: runId,
      created_at: fixedClock.now().toISOString(),
      updated_at: fixedClock.now().toISOString(),
    });
    const engine = new ReferenceRuntimeEngine({ home, pluginRoot, clock: fixedClock });
    const awaiting = await engine.startProjectInitialization({
      envelope: envelope(runId, projectId, "PROJECT_INITIALIZATION"),
      profile,
    });
    expect(awaiting.status).toBe("AWAITING_APPROVAL");
    expect(awaiting.approval_request?.gate).toBe("PROJECT_PROFILE");
    const staleApproval = approvalFor(awaiting, "APPROVE", fixedClock.now().toISOString());
    staleApproval.target_type = "CONTENT";
    await expect(engine.resume(profile.project_name, runId, staleApproval)).rejects.toMatchObject({
      code: "STALE_APPROVAL",
    });
    const completed = await engine.resume(
      profile.project_name,
      runId,
      approvalFor(awaiting, "APPROVE", fixedClock.now().toISOString()),
    );
    expect(completed.status).toBe("SUCCESS");
    const verified = await engine.verify(profile.project_name, projectId, runId);
    expect(verified.valid).toBe(true);
    expect(verified.writeCount).toBeGreaterThanOrEqual(4);
    const inspection = await engine.inspect(profile.project_name, projectId, runId);
    expect(inspection.plan.plan_status).toBe("RUN_SUCCEEDED");
    const registry = JSON.parse(
      await readFile(path.join(home, "registry/projects.json"), "utf8"),
    ) as {
      entries: Array<{ project_status: string }>;
    };
    expect(registry.entries[0]?.project_status).toBe("PROJECT_ACTIVE");
  });

  it("runs VISUAL_FINALIZATION_FIXTURE_V1 through independent G4 and G5 pauses", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "content-ops-visual-e2e-"));
    roots.push(home);
    const runId = "RUN-20990102-030405-V001";
    const projectId = "PRJ-20990102-V001";
    const projectName = "Fictional Visual Fixture";
    const fixture = JSON.parse(
      await readFile(
        "tests/fixtures/contracts/1.0/visual-workflow/valid/full-visual-finalization.json",
        "utf8",
      ),
    ) as Record<string, unknown>;
    const assets = [1, 2, 3, 4].map((page) =>
      path.resolve(`tests/fixtures/runtime-assets/page-0${page}.fixture`),
    ) as [string, string, string, string];
    const engine = new ReferenceRuntimeEngine({ home, pluginRoot, clock: fixedClock });
    const g4 = await engine.startVisualFinalization({
      envelope: envelope(runId, projectId, "VISUAL_FINALIZATION"),
      projectName,
      fixture,
      assetFiles: assets,
    });
    expect(g4.approval_request?.gate).toBe("FIRST_PAGE");
    const g5 = await engine.resume(
      projectName,
      runId,
      approvalFor(g4, "APPROVE", fixedClock.now().toISOString()),
    );
    expect(g5.status).toBe("AWAITING_APPROVAL");
    expect(g5.approval_request?.gate).toBe("FINAL_SET");
    const completed = await engine.resume(
      projectName,
      runId,
      approvalFor(g5, "APPROVE", fixedClock.now().toISOString()),
    );
    expect(completed.status).toBe("SUCCESS");
    expect((await engine.verify(projectName, projectId, runId)).valid).toBe(true);
    expect(
      (await engine.inspect(projectName, projectId, runId)).plan.completed_step_ids,
    ).toHaveLength(19);
  });
});
