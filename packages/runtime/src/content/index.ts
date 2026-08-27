import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { compileContentFeishuFields, type ContentPageDraft } from "@content-ops/core";
import type {
  FeishuBatchUpsertResult,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "@content-ops/workspace-adapters";

export * from "./calibration-repair.js";

export interface ContentWorkspacePort {
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

export interface ContentRuntimeOptions {
  workspace: ContentWorkspacePort;
  auditRoot: string;
  contentTableId: string;
  painpointTableId: string;
  runId: string;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

async function atomicWrite(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  const text = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(temporary, text, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== text)
    throw new Error("CONTENT_RUNTIME_READ_VERIFY_FAILED");
}

async function appendAudit(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

export class ContentRuntime {
  constructor(private readonly options: ContentRuntimeOptions) {}

  async finalizeCopy(input: {
    content: Record<string, unknown>;
    pages: ContentPageDraft[];
    fingerprint: string;
    painpointUniqueKey: string;
    painpointVersion: number;
    painpointRecordId: string;
    idempotencyKey: string;
    confirmLiveWrite: boolean;
  }): Promise<{ created: number; reused: number; updatedPainpoints: number }> {
    if (!input.confirmLiveWrite) throw new Error("LIVE_WRITE_CONFIRMATION_REQUIRED");
    const uniqueKey = String(input.content.record_unique_key);
    const contentFields = compileContentFeishuFields(
      input.content,
      input.pages,
      input.fingerprint,
      input.painpointRecordId,
    );
    const contentRecord: FeishuRecordInput = {
      uniqueKey,
      version: 1,
      fields: contentFields,
      tableId: this.options.contentTableId,
      tableLogicalKey: "contents",
      uniqueFieldLogicalKey: "contentsRecordUniqueKey",
      allowUserManaged: true,
    };
    const existing = await this.options.workspace.findRecordByUniqueKey(uniqueKey, contentRecord);
    let created = 0;
    let reused = 0;
    let remoteContent: FeishuStoredRecord;
    if (existing) {
      if (!(await this.options.workspace.verifyWrite(existing, contentFields)))
        throw new Error("CONTENT_IDEMPOTENCY_CONFLICT");
      reused = 1;
      remoteContent = existing;
    } else {
      const result = await this.options.workspace.batchUpsertRecords(
        [contentRecord],
        input.idempotencyKey,
      );
      if (result.failed.length || result.succeeded.length !== 1)
        throw new Error("CONTENT_REMOTE_WRITE_PARTIAL");
      created = 1;
      const stored = result.succeeded[0];
      if (!stored) throw new Error("CONTENT_REMOTE_WRITE_PARTIAL");
      remoteContent = stored;
    }

    const painpointFields = {
      painpointsContentizationStatus: "PAINPOINT_CONTENT_IN_PROGRESS",
      painpointsRelatedContent: [remoteContent.recordId],
      painpointsUpdatedAt: String(input.content.updated_at),
    };
    const painpointInput: FeishuRecordInput = {
      uniqueKey: input.painpointUniqueKey,
      version: input.painpointVersion,
      fields: painpointFields,
      tableId: this.options.painpointTableId,
      tableLogicalKey: "painpoints",
      uniqueFieldLogicalKey: "painpointsRecordUniqueKey",
      allowUserManaged: true,
    };
    const currentPainpoint = await this.options.workspace.findRecordByUniqueKey(
      input.painpointUniqueKey,
      painpointInput,
    );
    if (!currentPainpoint) throw new Error("PAINPOINT_NOT_FOUND");
    let updatedPainpoints = 0;
    if (!(await this.options.workspace.verifyWrite(currentPainpoint, painpointFields))) {
      const result = await this.options.workspace.batchUpsertRecords(
        [painpointInput],
        `${input.idempotencyKey}.painpoint`,
      );
      if (result.failed.length) throw new Error("CONTENT_PAINPOINT_LINK_WRITE_FAILED");
      updatedPainpoints = 1;
    }
    const at = new Date().toISOString();
    const evidence = {
      event: "CONTENT_COPY_FINALIZED",
      run_id: this.options.runId,
      content_id: input.content.content_id,
      content_version: input.content.content_version,
      copy_version: input.content.copy_version,
      idempotency_key_hash: hash(input.idempotencyKey),
      created,
      reused,
      painpoint_updated: updatedPainpoints,
      remote_identifier_hashes: [hash(remoteContent.recordId)],
      gate: "CONTENT_COPY",
      status: "AWAITING_APPROVAL",
      created_at: at,
    };
    await atomicWrite(path.join(this.options.auditRoot, "content-write-log.json"), evidence);
    await appendAudit(path.join(this.options.auditRoot, "write-log.jsonl"), evidence);
    await atomicWrite(path.join(this.options.auditRoot, "checkpoint.json"), {
      run_id: this.options.runId,
      gate: "CONTENT_COPY",
      target_type: "CONTENT_PACKAGE",
      target_id: input.content.content_id,
      target_version: `${String(input.content.content_version)}:${String(input.content.copy_version)}`,
      status: "AWAITING_APPROVAL",
      created_at: at,
    });
    return { created, reused, updatedPainpoints };
  }

  async applyG3(input: {
    contentUniqueKey: string;
    contentVersion: number;
    decision: "APPROVE" | "REVISE" | "REJECT" | "PAUSE";
    reviewedAt: string;
    idempotencyKey: string;
    confirmLiveWrite: boolean;
  }): Promise<{ status: string; reused: boolean }> {
    if (!input.confirmLiveWrite) throw new Error("LIVE_WRITE_CONFIRMATION_REQUIRED");
    const status = {
      APPROVE: "COPY_APPROVED",
      REVISE: "COPY_REVISION_REQUIRED",
      REJECT: "CONTENT_DISCARDED",
      PAUSE: "CONTENT_PAUSED",
    }[input.decision];
    const fields = { contentsContentStatus: status, contentsUpdatedAt: input.reviewedAt };
    const record: FeishuRecordInput = {
      uniqueKey: input.contentUniqueKey,
      version: input.contentVersion,
      fields,
      tableId: this.options.contentTableId,
      tableLogicalKey: "contents",
      uniqueFieldLogicalKey: "contentsRecordUniqueKey",
      allowUserManaged: true,
    };
    const existing = await this.options.workspace.findRecordByUniqueKey(
      input.contentUniqueKey,
      record,
    );
    if (!existing) throw new Error("CONTENT_NOT_FOUND");
    const reused = await this.options.workspace.verifyWrite(existing, fields);
    if (!reused) {
      const result = await this.options.workspace.batchUpsertRecords(
        [record],
        input.idempotencyKey,
      );
      if (result.failed.length) throw new Error("CONTENT_G3_REMOTE_WRITE_FAILED");
    }
    const evidence = {
      event: "G3_COPY_REVIEW_APPLIED",
      run_id: this.options.runId,
      decision: input.decision,
      status,
      reused,
      created_at: input.reviewedAt,
    };
    await appendAudit(path.join(this.options.auditRoot, "approvals.jsonl"), evidence);
    await atomicWrite(path.join(this.options.auditRoot, "g3-result.json"), evidence);
    return { status, reused };
  }
}
