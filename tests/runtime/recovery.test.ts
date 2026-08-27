import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { CheckpointStore } from "../../packages/runtime/src/checkpoints/index.js";
import { RunJournal } from "../../packages/runtime/src/journal/index.js";
import { RecoveryManager } from "../../packages/runtime/src/recovery/index.js";
import { DeterministicIdFactory, nodeHashProvider } from "../../packages/runtime/src/types.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function setup() {
  const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-recovery-"));
  roots.push(root);
  const clock = { now: () => new Date("2099-01-01T00:00:00.000Z") };
  const ids = new DeterministicIdFactory("RECOVERY");
  const journal = new RunJournal(path.join(root, "events.jsonl"), clock, ids, nodeHashProvider);
  const checkpoints = new CheckpointStore(
    path.join(root, "checkpoint.json"),
    clock,
    ids,
    nodeHashProvider,
  );
  await journal.appendEvent({
    event_type: "RUN_CREATED",
    run_id: "RUN-20990101-000000-R001",
    project_id: "PRJ-20990101-R001",
    workflow_id: "PROJECT_INITIALIZATION_LOCAL_V1",
    step_id: null,
    status: "RECORDED",
  });
  await journal.appendEvent({
    event_type: "STEP_COMPLETED",
    run_id: "RUN-20990101-000000-R001",
    project_id: "PRJ-20990101-R001",
    workflow_id: "PROJECT_INITIALIZATION_LOCAL_V1",
    step_id: "PREFLIGHT",
    status: "SUCCESS",
  });
  return {
    root,
    journal,
    checkpoints,
    manager: new RecoveryManager(journal, checkpoints, nodeHashProvider),
  };
}

describe("RecoveryManager", () => {
  it("rebuilds a missing checkpoint from an intact Journal without retrying a verified step", async () => {
    const { manager } = await setup();
    expect((await manager.inspectRecoverability()).status).toBe("REBUILD_CHECKPOINT");
    const recovered = await manager.recoverInterruptedRun({
      runId: "RUN-20990101-000000-R001",
      projectId: "PRJ-20990101-R001",
      workflowId: "PROJECT_INITIALIZATION_LOCAL_V1",
      workflowVersion: "1.0.0",
      currentStepId: "RESOLVE_PACKS",
      pendingApproval: null,
    });
    expect(recovered.completedSteps).toContain("PREFLIGHT");
    expect(() => manager.resumeFailedStep("PREFLIGHT", recovered.completedSteps)).toThrow(
      expect.objectContaining({ code: "VERIFIED_STEP_NOT_RETRYABLE" }),
    );
    expect(manager.resumeFailedStep("RESOLVE_PACKS", recovered.completedSteps)).toBe(
      "RESOLVE_PACKS",
    );
  });

  it("blocks recovery for a partial Journal tail", async () => {
    const { root, manager } = await setup();
    const file = path.join(root, "events.jsonl");
    await writeFile(file, `${await readFile(file, "utf8")}{"partial":`);
    const report = await manager.inspectRecoverability();
    expect(report.status).toBe("BLOCKED");
    expect(report.issues).toContain("JSONL_PARTIAL_LINE");
  });

  it("blocks recovery when the Journal hash chain is tampered", async () => {
    const { root, manager } = await setup();
    const file = path.join(root, "events.jsonl");
    const lines = (await readFile(file, "utf8")).trim().split("\n");
    const secondLine = lines[1];
    if (!secondLine) throw new Error("Fixture Journal entry missing.");
    const event = JSON.parse(secondLine) as Record<string, unknown>;
    event.previous_event_hash = "tampered";
    lines[1] = JSON.stringify(event);
    await writeFile(file, `${lines.join("\n")}\n`);
    const report = await manager.inspectRecoverability();
    expect(report.status).toBe("BLOCKED");
    expect(report.issues).toContain("JOURNAL_HASH_CHAIN_BROKEN");
  });
});
