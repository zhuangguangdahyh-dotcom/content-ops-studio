import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ContentRuntime,
  type ContentWorkspacePort,
} from "../../packages/runtime/src/content/index.js";
import type {
  FeishuRecordInput,
  FeishuStoredRecord,
} from "../../packages/workspace-adapters/src/index.js";

class MemoryWorkspace implements ContentWorkspacePort {
  readonly records = new Map<string, FeishuStoredRecord>();
  constructor() {
    this.records.set("PRJ-20990101-DEMO::painpoint::P-0001", {
      recordId: "remote-painpoint",
      uniqueKey: "PRJ-20990101-DEMO::painpoint::P-0001",
      version: 1,
      tableId: "painpoints",
      tableLogicalKey: "painpoints",
      fields: {},
    });
  }
  findRecordByUniqueKey(uniqueKey: string): Promise<FeishuStoredRecord | null> {
    return Promise.resolve(structuredClone(this.records.get(uniqueKey) ?? null));
  }
  verifyWrite(record: FeishuStoredRecord, expected: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(
      Object.entries(expected).every(
        ([key, value]) => JSON.stringify(record.fields[key]) === JSON.stringify(value),
      ),
    );
  }
  batchUpsertRecords(records: FeishuRecordInput[]) {
    const succeeded = records.map((input) => {
      const existing = this.records.get(input.uniqueKey);
      const stored = {
        recordId: existing?.recordId ?? `remote-${this.records.size + 1}`,
        uniqueKey: input.uniqueKey,
        version: (existing?.version ?? 0) + 1,
        tableId: input.tableId,
        tableLogicalKey: input.tableLogicalKey,
        fields: { ...(existing?.fields ?? {}), ...structuredClone(input.fields) },
      };
      this.records.set(input.uniqueKey, stored);
      return structuredClone(stored);
    });
    return Promise.resolve({ succeeded, failed: [] });
  }
}

describe("Phase 3B Content Runtime", () => {
  it("creates once, links the painpoint, and reuses an exact idempotent replay", async () => {
    const workspace = new MemoryWorkspace();
    const root = await mkdtemp(path.join(os.tmpdir(), "content-runtime-"));
    const runtime = new ContentRuntime({
      workspace,
      auditRoot: root,
      contentTableId: "contents",
      painpointTableId: "painpoints",
      runId: "RUN-20990101-010203-DEMO",
    });
    const content = {
      content_id: "C-0001",
      project_id: "PRJ-20990101-DEMO",
      record_unique_key: "PRJ-20990101-DEMO::content::C-0001",
      primary_painpoint_id: "P-0001",
      content_topic: "虚构主题",
      content_angle: "判断",
      content_structure_type: "CHECKLIST",
      audience_explicit_need: "判断",
      audience_deep_anxiety: "选错",
      single_core_problem: "如何判断",
      core_viewpoint: "先核验证据",
      solution_logic: "逐项核验",
      content_objective: "TRUST",
      page_count: 4,
      page_structure_summary: "封面到总结",
      background_direction: "",
      visual_plan_summary: "",
      direct_message_hook: "",
      publish_title: "先核验再信任",
      title_character_count: 7,
      publish_body: "虚构正文",
      promotion_suitability: "MEDIUM",
      promotion_reason: "有判断价值",
      duplication_risk: "LOW",
      content_status: "COPY_PENDING_APPROVAL",
      image_status: "IMAGE_NOT_GENERATED",
      first_page_approval_status: "FIRST_PAGE_NOT_SUBMITTED",
      final_approval_status: "FINAL_NOT_SUBMITTED",
      sync_status: "SYNC_NOT_STARTED",
      output_relative_path: null,
      creation_source: "RESEARCH",
      content_version: "CV-1",
      copy_version: "CV-1",
      visual_plan_version: null,
      style_lock_version: null,
      schema_version: "1.0.0",
      last_run_id: "RUN-20990101-010203-DEMO",
      finalized_at: null,
      created_at: "2099-01-01T00:00:00.000Z",
      updated_at: "2099-01-01T00:00:00.000Z",
      extensions: {},
    };
    const pages = [1, 2, 3, 4].map((page_number) => ({
      page_number,
      page_role: page_number === 1 ? "COVER" : "ANALYSIS",
      copy_version: "CV-1",
      headline: `第${page_number}页`,
      body: "正文",
      supporting_text: "",
      content_purpose: "单一任务",
      background_direction: "",
      visual_evidence_requirement: "",
      layout_notes: "",
      negative_constraints: [],
      created_at: content.created_at,
      updated_at: content.updated_at,
      extensions: {},
    }));
    const input = {
      content,
      pages,
      fingerprint: "a".repeat(64),
      painpointUniqueKey: "PRJ-20990101-DEMO::painpoint::P-0001",
      painpointVersion: 1,
      painpointRecordId: "remote-painpoint",
      idempotencyKey: "CONTENT-REQUEST-0001",
      confirmLiveWrite: true,
    };
    expect(await runtime.finalizeCopy(input)).toMatchObject({
      created: 1,
      reused: 0,
      updatedPainpoints: 1,
    });
    expect(await runtime.finalizeCopy(input)).toMatchObject({
      created: 0,
      reused: 1,
      updatedPainpoints: 0,
    });
    expect(
      await runtime.applyG3({
        contentUniqueKey: content.record_unique_key,
        contentVersion: 1,
        decision: "APPROVE",
        reviewedAt: "2099-01-01T01:00:00.000Z",
        idempotencyKey: "G3-APPROVE-0001",
        confirmLiveWrite: true,
      }),
    ).toMatchObject({ status: "COPY_APPROVED", reused: false });
  });
});
