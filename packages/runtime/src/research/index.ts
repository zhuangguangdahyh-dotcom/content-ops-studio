import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  compilePainpointFeishuFields,
  validateEvidenceReferences,
  validatePainpointBatch,
  validateReviewBatch,
  type ResearchPainpoint,
  type ReviewDecision,
} from "@content-ops/core";
import type { ResearchAdapter } from "@content-ops/research-adapters";
import type {
  FeishuBatchUpsertResult,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "@content-ops/workspace-adapters";

export interface ResearchEvidence {
  evidence_id: string;
  source_type: string;
  source_name: string;
  source_location: string;
  source_date: string | null;
  summary: string;
  [key: string]: unknown;
}

export interface ResearchPainpointBatch {
  research_batch_id: string;
  project_id: string;
  requested_count: number;
  produced_count: number;
  evidence_backed_count: number;
  hypothesis_count: number;
  painpoints: ResearchPainpoint[];
  evidence_records: ResearchEvidence[];
  [key: string]: unknown;
}

export interface ResearchReviewBatch {
  review_batch_id: string;
  research_batch_id: string;
  project_id: string;
  painpoint_batch_version: number;
  review_version: number;
  created_at: string;
  items: Array<{
    painpoint_id: string;
    painpoint_version: number;
    decision: ReviewDecision;
    comment: string;
    requested_changes: string[];
  }>;
  [key: string]: unknown;
}

export interface PainpointWorkspacePort {
  batchUpsertRecords(
    records: FeishuRecordInput[],
    idempotencyKey: string,
  ): Promise<FeishuBatchUpsertResult>;
  findRecordByUniqueKey(
    uniqueKey: string,
    input: Pick<FeishuRecordInput, "tableId" | "tableLogicalKey" | "uniqueFieldLogicalKey">,
  ): Promise<FeishuStoredRecord | null>;
  verifyWrite(
    record: FeishuStoredRecord,
    expectedLogicalFields: Record<string, unknown>,
  ): Promise<boolean>;
}

export interface ResearchRuntimeOptions {
  adapter: ResearchAdapter;
  workspace: PainpointWorkspacePort;
  auditRoot: string;
  tableId: string;
  runId: string;
}

function hashRemoteId(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function atomicWrite(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  const text = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(temporary, text, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== text)
    throw new Error("RESEARCH_RUNTIME_READ_VERIFY_FAILED");
}

async function appendAudit(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

function reviewStatus(decision: ReviewDecision): string {
  switch (decision) {
    case "APPROVE":
      return "PAINPOINT_CONFIRMED";
    case "REVISE":
      return "PAINPOINT_REVISION_REQUIRED";
    case "REJECT":
      return "PAINPOINT_REJECTED";
    case "PAUSE":
      return "PAINPOINT_PAUSED";
  }
}

export class ResearchRuntime {
  constructor(private readonly options: ResearchRuntimeOptions) {}

  private recordInput(
    painpoint: ResearchPainpoint,
    evidence: ResearchEvidence[],
  ): FeishuRecordInput {
    return {
      uniqueKey: painpoint.record_unique_key,
      version: painpoint.version,
      fields: compilePainpointFeishuFields(painpoint, evidence),
      tableId: this.options.tableId,
      tableLogicalKey: "painpoints",
      uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
      allowUserManaged: true,
    };
  }

  async finalizePainpoints(input: {
    sessionId: string;
    batch: ResearchPainpointBatch;
    allowHypothesisCandidates: boolean;
    idempotencyKey: string;
    confirmLiveWrite: boolean;
  }): Promise<{
    status: "AWAITING_APPROVAL";
    gate: "PAINPOINTS";
    attempted: number;
    succeeded: number;
    failed: number;
    created: number;
    reused: number;
    remote_identifier_hashes: string[];
  }> {
    if (!input.confirmLiveWrite) throw new Error("LIVE_WRITE_CONFIRMATION_REQUIRED");
    const errors = validatePainpointBatch({
      ...input.batch,
      allow_hypothesis_candidates: input.allowHypothesisCandidates,
    });
    const evidenceIds = input.batch.evidence_records.map((item) => item.evidence_id);
    const sourceIdentityByEvidence = new Map(
      input.batch.evidence_records.map((item) => {
        const extensions =
          item.extensions && typeof item.extensions === "object" && !Array.isArray(item.extensions)
            ? (item.extensions as Record<string, unknown>)
            : {};
        const contentHash = extensions.content_hash;
        return [
          item.evidence_id,
          typeof contentHash === "string"
            ? contentHash
            : typeof item.source_location === "string"
              ? item.source_location
              : item.evidence_id,
        ];
      }),
    );
    errors.push(
      ...validateEvidenceReferences(input.batch.painpoints, evidenceIds, sourceIdentityByEvidence),
    );
    if (errors.length > 0) throw new Error(`RESEARCH_BATCH_INVALID:${errors.sort().join(",")}`);
    await this.options.adapter.validateEvidence(input.batch.evidence_records);
    await this.options.adapter.validatePainpointCandidates(
      input.batch.painpoints,
      input.allowHypothesisCandidates,
    );
    const byId = new Map(input.batch.evidence_records.map((item) => [item.evidence_id, item]));
    const records = input.batch.painpoints.map((painpoint) =>
      this.recordInput(
        painpoint,
        painpoint.evidence_refs.flatMap((reference) => {
          const item = byId.get(reference);
          return item ? [item] : [];
        }),
      ),
    );
    const reused: FeishuStoredRecord[] = [];
    const missing: FeishuRecordInput[] = [];
    for (const record of records) {
      const existing = await this.options.workspace.findRecordByUniqueKey(record.uniqueKey, record);
      if (!existing) {
        missing.push(record);
        continue;
      }
      if (!(await this.options.workspace.verifyWrite(existing, record.fields)))
        throw new Error(`PAINPOINT_IDEMPOTENCY_CONFLICT:${hashRemoteId(record.uniqueKey)}`);
      reused.push(existing);
    }
    const written = await this.options.workspace.batchUpsertRecords(missing, input.idempotencyKey);
    const result: FeishuBatchUpsertResult = {
      succeeded: [...reused, ...written.succeeded],
      failed: written.failed,
    };
    const hashes = result.succeeded.map((item) => hashRemoteId(item.recordId)).sort();
    const evidence = {
      event: "PAINPOINT_BATCH_FINALIZED",
      run_id: this.options.runId,
      research_batch_id: input.batch.research_batch_id,
      idempotency_key_hash: hashRemoteId(input.idempotencyKey),
      attempted: records.length,
      succeeded: result.succeeded.length,
      failed: result.failed.length,
      reused: reused.length,
      remote_identifier_hashes: hashes,
      failures: result.failed.map((item) => ({
        unique_key_hash: hashRemoteId(item.uniqueKey),
        code: item.code,
      })),
      gate: "PAINPOINTS",
      status: result.failed.length === 0 ? "AWAITING_APPROVAL" : "PARTIAL",
      created_at: new Date().toISOString(),
    };
    await atomicWrite(path.join(this.options.auditRoot, "painpoint-write-log.json"), evidence);
    await appendAudit(path.join(this.options.auditRoot, "research-audit.jsonl"), evidence);
    await atomicWrite(path.join(this.options.auditRoot, "g2-checkpoint.json"), {
      run_id: this.options.runId,
      gate: "PAINPOINTS",
      target_id: input.batch.research_batch_id,
      target_version: "1",
      status: "AWAITING_APPROVAL",
      created_at: evidence.created_at,
    });
    if (result.failed.length > 0) throw new Error("PAINPOINT_REMOTE_WRITE_PARTIAL");
    return {
      status: "AWAITING_APPROVAL",
      gate: "PAINPOINTS",
      attempted: records.length,
      succeeded: result.succeeded.length,
      failed: 0,
      created: written.succeeded.length,
      reused: reused.length,
      remote_identifier_hashes: hashes,
    };
  }

  async applyG2Review(input: {
    review: ResearchReviewBatch;
    batch: ResearchPainpointBatch;
    latestReviewVersion: number;
    idempotencyKey: string;
    confirmLiveWrite: boolean;
  }): Promise<{ updated: number; statuses: Record<string, number> }> {
    if (!input.confirmLiveWrite) throw new Error("LIVE_WRITE_CONFIRMATION_REQUIRED");
    const errors = validateReviewBatch(input.review, {
      research_batch_id: input.batch.research_batch_id,
      painpoint_batch_version: 1,
      painpointVersions: new Map(
        input.batch.painpoints.map((item) => [item.painpoint_id, item.version]),
      ),
      latestReviewVersion: input.latestReviewVersion,
    });
    if (errors.length > 0) throw new Error(`PAINPOINT_REVIEW_INVALID:${errors.join(",")}`);
    const painpoints = new Map(input.batch.painpoints.map((item) => [item.painpoint_id, item]));
    const records = input.review.items.map((item) => {
      const current = painpoints.get(item.painpoint_id);
      if (!current) throw new Error(`PAINPOINT_REVIEW_UNKNOWN:${item.painpoint_id}`);
      const fields = {
        painpointsReviewStatus: reviewStatus(item.decision),
        painpointsUpdatedAt: input.review.created_at,
      };
      return {
        uniqueKey: current.record_unique_key,
        version: current.version,
        fields,
        tableId: this.options.tableId,
        tableLogicalKey: "painpoints",
        uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
        allowUserManaged: true,
      } satisfies FeishuRecordInput;
    });
    const reused: FeishuStoredRecord[] = [];
    const pending: FeishuRecordInput[] = [];
    for (const record of records) {
      const existing = await this.options.workspace.findRecordByUniqueKey(record.uniqueKey, record);
      if (existing && (await this.options.workspace.verifyWrite(existing, record.fields)))
        reused.push(existing);
      else pending.push(record);
    }
    const result = await this.options.workspace.batchUpsertRecords(pending, input.idempotencyKey);
    if (result.failed.length > 0) throw new Error("PAINPOINT_G2_REMOTE_WRITE_PARTIAL");
    const statuses = Object.fromEntries(
      ["APPROVE", "REVISE", "REJECT", "PAUSE"].map((decision) => [
        reviewStatus(decision as ReviewDecision),
        input.review.items.filter((item) => item.decision === decision).length,
      ]),
    );
    await atomicWrite(
      path.join(this.options.auditRoot, "painpoint-review-batch.json"),
      input.review,
    );
    const g2Evidence = {
      event: "G2_ITEM_DECISIONS_APPLIED",
      run_id: this.options.runId,
      review_batch_id: input.review.review_batch_id,
      idempotency_key_hash: hashRemoteId(input.idempotencyKey),
      updated: result.succeeded.length + reused.length,
      reused: reused.length,
      remote_identifier_hashes: [...result.succeeded, ...reused]
        .map((item) => hashRemoteId(item.recordId))
        .sort(),
      statuses,
      created_at: new Date().toISOString(),
    };
    await atomicWrite(path.join(this.options.auditRoot, "g2-write-log.json"), g2Evidence);
    await appendAudit(path.join(this.options.auditRoot, "research-audit.jsonl"), g2Evidence);
    return { updated: result.succeeded.length + reused.length, statuses };
  }
}
