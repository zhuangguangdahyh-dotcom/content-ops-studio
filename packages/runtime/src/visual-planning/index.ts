import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  FeishuBatchUpsertResult,
  FeishuRecordInput,
  FeishuStoredRecord,
} from "@content-ops/workspace-adapters";

export const VISUAL_FEISHU_ALLOWED_FIELDS = [
  "contentsBackgroundDirection",
  "contentsVisualPlanSummary",
  "contentsVisualPlanVersion",
  "contentsContentStatus",
  "contentsLastRunId",
  "contentsUpdatedAt",
] as const;

export interface VisualWorkspacePort {
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

export interface VisualPlanningRuntimeOptions {
  workspace: VisualWorkspacePort;
  auditRoot: string;
  contentTableId: string;
  runId: string;
}

const hash = (value: string) => createHash("sha256").update(value).digest("hex");

async function atomicWrite(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.tmp-${process.pid}`;
  const text = `${JSON.stringify(value, null, 2)}\n`;
  await writeFile(temporary, text, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== text) throw new Error("VISUAL_RUNTIME_READ_VERIFY_FAILED");
}

async function appendAudit(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  await appendFile(file, `${JSON.stringify(value)}\n`, { encoding: "utf8", mode: 0o600 });
}

export class VisualPlanningRuntime {
  constructor(private readonly options: VisualPlanningRuntimeOptions) {}

  async finalize(input: {
    contentUniqueKey: string;
    contentVersion: number;
    contentId: string;
    contentVersionLabel: string;
    copyVersion: string;
    visualPlanVersion: string;
    planHash: string;
    backgroundDirection: string;
    visualPlanSummary: string;
    updatedAt: string;
    idempotencyKey: string;
    confirmLiveWrite: boolean;
  }): Promise<{ updated: number; reused: number; writesAttempted: number }> {
    if (!input.confirmLiveWrite) throw new Error("LIVE_WRITE_CONFIRMATION_REQUIRED");
    const requestHash = hash(
      JSON.stringify({
        content: input.contentUniqueKey,
        version: input.contentVersionLabel,
        copy: input.copyVersion,
        visual: input.visualPlanVersion,
        plan: input.planHash,
      }),
    );
    const stateFile = path.join(this.options.auditRoot, "visual-finalization-state.json");
    try {
      const previous = JSON.parse(await readFile(stateFile, "utf8")) as Record<string, unknown>;
      if (previous.idempotency_key_hash === hash(input.idempotencyKey)) {
        if (previous.request_hash !== requestHash) throw new Error("VISUAL_IDEMPOTENCY_CONFLICT");
        const existing: FeishuRecordInput = {
          uniqueKey: input.contentUniqueKey,
          version: input.contentVersion,
          fields: {},
          tableId: this.options.contentTableId,
          tableLogicalKey: "contents",
          uniqueFieldLogicalKey: "contentsRecordUniqueKey",
          allowUserManaged: true,
        };
        if (!(await this.options.workspace.findRecordByUniqueKey(input.contentUniqueKey, existing)))
          throw new Error("CONTENT_NOT_FOUND");
        return { updated: 0, reused: 1, writesAttempted: 0 };
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
    const fields: Record<string, unknown> = {
      contentsBackgroundDirection: input.backgroundDirection,
      contentsVisualPlanSummary: input.visualPlanSummary,
      contentsVisualPlanVersion: input.visualPlanVersion,
      contentsContentStatus: "VISUAL_PLANNING",
      contentsLastRunId: this.options.runId,
      contentsUpdatedAt: input.updatedAt,
    };
    const illegal = Object.keys(fields).filter(
      (key) => !(VISUAL_FEISHU_ALLOWED_FIELDS as readonly string[]).includes(key),
    );
    if (illegal.length) throw new Error("VISUAL_FEISHU_FIELD_ALLOWLIST_VIOLATION");
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
    let updated = 0;
    if (!reused) {
      const result = await this.options.workspace.batchUpsertRecords(
        [record],
        input.idempotencyKey,
      );
      if (result.failed.length || result.succeeded.length !== 1)
        throw new Error("VISUAL_REMOTE_WRITE_FAILED");
      const stored = result.succeeded[0];
      if (!stored || !(await this.options.workspace.verifyWrite(stored, fields)))
        throw new Error("VISUAL_REMOTE_READ_VERIFY_FAILED");
      updated = 1;
    }
    const at = input.updatedAt;
    const evidence = {
      event: "VISUAL_PLAN_FINALIZED",
      run_id: this.options.runId,
      content_id: input.contentId,
      content_version: input.contentVersionLabel,
      copy_version: input.copyVersion,
      visual_plan_version: input.visualPlanVersion,
      plan_hash: input.planHash,
      idempotency_key_hash: hash(input.idempotencyKey),
      request_hash: requestHash,
      updated,
      reused: reused ? 1 : 0,
      remote_identifier_hash: hash(existing.recordId),
      status: "FIRST_PAGE_HANDOFF_READY",
      created_at: at,
    };
    await atomicWrite(stateFile, evidence);
    await atomicWrite(path.join(this.options.auditRoot, "visual-write-log.json"), evidence);
    await appendAudit(path.join(this.options.auditRoot, "write-log.jsonl"), evidence);
    await appendAudit(path.join(this.options.auditRoot, "journal.jsonl"), {
      event: "VISUAL_FEISHU_READ_VERIFIED",
      run_id: this.options.runId,
      plan_hash: input.planHash,
      created_at: at,
    });
    await atomicWrite(path.join(this.options.auditRoot, "checkpoint.json"), {
      run_id: this.options.runId,
      phase: "VISUAL_PLANNING",
      target_type: "VISUAL_HANDOFF_PACKAGE",
      target_id: input.contentId,
      target_version: `${input.contentVersionLabel}:${input.copyVersion}:${input.visualPlanVersion}`,
      status: "FIRST_PAGE_HANDOFF_READY",
      created_at: at,
    });
    return { updated, reused: reused ? 1 : 0, writesAttempted: updated };
  }
}
