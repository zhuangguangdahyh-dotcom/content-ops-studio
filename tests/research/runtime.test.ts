import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HostNativeResearchAdapter } from "../../packages/research-adapters/src/index.js";
import {
  ResearchRuntime,
  type PainpointWorkspacePort,
  type ResearchPainpointBatch,
  type ResearchReviewBatch,
} from "../../packages/runtime/src/research/index.js";
import type {
  FeishuBatchUpsertResult,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "../../packages/workspace-adapters/src/feishu/adapter.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");
async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(path.join(fixtureRoot, name, "valid/complete.json"), "utf8"),
  ) as T;
}

class MemoryPainpointWorkspace implements PainpointWorkspacePort {
  readonly records = new Map<string, FeishuStoredRecord>();
  readonly receivedInputs: FeishuRecordInput[] = [];
  nextId = 1;

  batchUpsertRecords(
    records: FeishuRecordInput[],
    _idempotencyKey: string,
  ): Promise<FeishuBatchUpsertResult> {
    void _idempotencyKey;
    this.receivedInputs.push(...structuredClone(records));
    const succeeded = records.map((record) => {
      const existing = this.records.get(record.uniqueKey);
      const stored: FeishuStoredRecord = {
        recordId: existing?.recordId ?? `remote-${this.nextId++}`,
        tableId: record.tableId,
        tableLogicalKey: record.tableLogicalKey,
        uniqueKey: record.uniqueKey,
        version: existing ? existing.version + 1 : record.version,
        fields: structuredClone(record.fields),
      };
      this.records.set(record.uniqueKey, stored);
      return structuredClone(stored);
    });
    return Promise.resolve({ succeeded, failed: [] });
  }

  findRecordByUniqueKey(uniqueKey: string): Promise<FeishuStoredRecord | null> {
    return Promise.resolve(structuredClone(this.records.get(uniqueKey) ?? null));
  }

  verifyWrite(
    record: FeishuStoredRecord,
    expectedLogicalFields: Record<string, unknown>,
  ): Promise<boolean> {
    return Promise.resolve(
      Object.entries(expectedLogicalFields).every(
        ([key, value]) => JSON.stringify(record.fields[key]) === JSON.stringify(value),
      ),
    );
  }
}

describe("research runtime Feishu/G2 boundary", () => {
  it("writes pending painpoints idempotently, checkpoints G2 and applies mixed item decisions", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-runtime-"));
    const adapter = new HostNativeResearchAdapter({ sessionsRoot: path.join(root, "sessions") });
    const workspace = new MemoryPainpointWorkspace();
    const report = await fixture<{ final_painpoint_batch: ResearchPainpointBatch }>(
      "painpoint-research-report",
    );
    const batch = report.final_painpoint_batch;
    const runtime = new ResearchRuntime({
      adapter,
      workspace,
      auditRoot: path.join(root, "audit"),
      tableId: "table-fixture",
      runId: String(batch.run_id),
    });
    const first = await runtime.finalizePainpoints({
      sessionId: "RPL-DEMO-001",
      batch,
      allowHypothesisCandidates: false,
      idempotencyKey: "IDEMPOTENCY-RESEARCH-001",
      confirmLiveWrite: true,
    });
    const replay = await runtime.finalizePainpoints({
      sessionId: "RPL-DEMO-001",
      batch,
      allowHypothesisCandidates: false,
      idempotencyKey: "IDEMPOTENCY-RESEARCH-001",
      confirmLiveWrite: true,
    });
    expect(first).toMatchObject({
      status: "AWAITING_APPROVAL",
      succeeded: 1,
      failed: 0,
      created: 1,
      reused: 0,
    });
    expect(workspace.receivedInputs[0]?.approvedLogicalKeys).toBeUndefined();
    expect(replay).toMatchObject({ succeeded: 1, created: 0, reused: 1 });
    expect(workspace.records).toHaveLength(1);

    const review = await fixture<ResearchReviewBatch>("painpoint-review-batch");
    const effect = await runtime.applyG2Review({
      review,
      batch,
      latestReviewVersion: 0,
      idempotencyKey: "IDEMPOTENCY-G2-001",
      confirmLiveWrite: true,
    });
    expect(effect).toMatchObject({
      updated: 1,
      statuses: { PAINPOINT_CONFIRMED: 1 },
    });
    expect(workspace.receivedInputs.at(-1)?.approvedLogicalKeys).toBeUndefined();
    const reviewedPainpoint = batch.painpoints[0];
    if (!reviewedPainpoint) throw new Error("Fixture painpoint is required.");
    expect(
      workspace.records.get(reviewedPainpoint.record_unique_key)?.fields.painpointsReviewStatus,
    ).toBe("PAINPOINT_CONFIRMED");
    const receivedBeforeReplay = workspace.receivedInputs.length;
    const g2Replay = await runtime.applyG2Review({
      review,
      batch,
      latestReviewVersion: 0,
      idempotencyKey: "IDEMPOTENCY-G2-001",
      confirmLiveWrite: true,
    });
    expect(g2Replay).toMatchObject({ updated: 1 });
    expect(workspace.receivedInputs).toHaveLength(receivedBeforeReplay);
    const audit = await readFile(path.join(root, "audit", "painpoint-write-log.json"), "utf8");
    expect(audit).not.toContain("remote-1");
    expect(audit).toContain("remote_identifier_hashes");
    const history = await readFile(path.join(root, "audit", "research-audit.jsonl"), "utf8");
    expect(history.trim().split("\n")).toHaveLength(4);
    expect(history).not.toContain("remote-1");
  });

  it("requires the explicit live confirmation gate", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-runtime-gate-"));
    const report = await fixture<{ final_painpoint_batch: ResearchPainpointBatch }>(
      "painpoint-research-report",
    );
    const runtime = new ResearchRuntime({
      adapter: new HostNativeResearchAdapter({ sessionsRoot: path.join(root, "sessions") }),
      workspace: new MemoryPainpointWorkspace(),
      auditRoot: path.join(root, "audit"),
      tableId: "table-fixture",
      runId: String(report.final_painpoint_batch.run_id),
    });
    await expect(
      runtime.finalizePainpoints({
        sessionId: "RPL-DEMO-001",
        batch: report.final_painpoint_batch,
        allowHypothesisCandidates: false,
        idempotencyKey: "IDEMPOTENCY-RESEARCH-002",
        confirmLiveWrite: false,
      }),
    ).rejects.toThrow("LIVE_WRITE_CONFIRMATION_REQUIRED");
  });

  it("preserves independent source identity for B-grade evidence at the Runtime boundary", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "research-runtime-b-grade-"));
    const report = await fixture<{ final_painpoint_batch: ResearchPainpointBatch }>(
      "painpoint-research-report",
    );
    const batch = structuredClone(report.final_painpoint_batch);
    const firstEvidence = batch.evidence_records[0];
    const firstPainpoint = batch.painpoints[0];
    if (!firstEvidence || !firstPainpoint) throw new Error("Fixture batch entries are required.");
    const secondEvidence = {
      ...firstEvidence,
      evidence_id: "E-0002",
      source_name: "Independent fictional source",
      source_location: "sanitized-independent-reference",
    };
    batch.evidence_records.push(secondEvidence);
    firstPainpoint.evidence_refs = ["E-0001", "E-0002"];
    firstPainpoint.evidence_confidence = "B_MULTI_SOURCE";
    const runtime = new ResearchRuntime({
      adapter: new HostNativeResearchAdapter({ sessionsRoot: path.join(root, "sessions") }),
      workspace: new MemoryPainpointWorkspace(),
      auditRoot: path.join(root, "audit"),
      tableId: "table-fixture",
      runId: String(batch.run_id),
    });
    await expect(
      runtime.finalizePainpoints({
        sessionId: "RPL-DEMO-001",
        batch,
        allowHypothesisCandidates: false,
        idempotencyKey: "IDEMPOTENCY-RESEARCH-B-GRADE",
        confirmLiveWrite: true,
      }),
    ).resolves.toMatchObject({ succeeded: 1, created: 1 });
  });
});
