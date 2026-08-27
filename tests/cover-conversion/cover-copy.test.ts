import { describe, expect, it } from "vitest";
import {
  evaluateCoverCopy,
  planCoverConversion,
} from "../../packages/core/src/cover-conversion/index.js";

const base = {
  projectId: "CAL-COMMERCIAL-SPACE-001",
  contentId: "C-CAL-SPACE-001",
  contentVersion: "CV-1",
  copyVersion: "CV-1",
  runId: "RUN-20990101-010101-CAL1",
  createdAt: "2099-01-01T01:01:01.000Z",
  platform: "XIAOHONGSHU" as const,
  accountGoal: "LEAD_GENERATION" as const,
  subject: "Fictional commercial-space advisory studio",
  audience: "Independent store owners planning an image upgrade",
  painpoint: "The storefront does not communicate category or positioning at first glance.",
  contentValue: "A first-impression diagnostic for storefront decisions.",
  decisionStage: "Renovation consideration",
  publishTitle: "Fictional storefront diagnostic",
  page1ContentCopy: "The first impression should communicate category and positioning.",
  projectVisualProfileVersion: null,
  globalVisualPreferenceVersion: "GUVPV-1",
  industryPackVersion: "1.0.0",
  platformPackVersion: "1.1.0",
};

describe("cover conversion and copy", () => {
  it("blocks a generic lead-generation subject and asks one concrete question", () => {
    const plan = planCoverConversion({ ...base, subject: "通用专业服务", audience: "" });
    expect(plan.ready).toBe(false);
    expect(plan.ambiguities).toContain("COVER_CONTEXT_INSUFFICIENT");
    expect(plan.ambiguities).toContain("COVER_SUBJECT_TOO_GENERIC");
    expect(plan.blocking_questions).toHaveLength(1);
  });

  it("separates concise cover conversion copy from page-one content copy", () => {
    const plan = planCoverConversion(base);
    const copy = evaluateCoverCopy({
      coverPrimaryHook: "生意不好，先看门头",
      coverSecondaryLine: "第一眼就劝退顾客？",
      coverSupportingCopy: "",
      page1ContentCopy: base.page1ContentCopy,
      targetCustomerSignal: false,
      painpointSignal: true,
      valueSignal: false,
      riskSignal: true,
      decisionSignal: false,
      promiseSupported: true,
      accountGoal: "LEAD_GENERATION",
      primaryLines: 2,
      secondaryLines: 1,
    });
    expect(plan.ready).toBe(true);
    expect(plan.selected_strategy).toBe("PAINPOINT_FIRST");
    expect(copy.ready_for_g3).toBe(true);
    expect(copy.hard_blocks).toEqual([]);
  });

  it("rejects generic or paragraph-like lead-generation cover copy", () => {
    const result = evaluateCoverCopy({
      coverPrimaryHook: "这是一个关于专业服务边界与身份资质核验的完整说明",
      coverSecondaryLine: "",
      coverSupportingCopy: "A paragraph is not allowed.",
      page1ContentCopy: "Different content body.",
      targetCustomerSignal: false,
      painpointSignal: false,
      valueSignal: false,
      riskSignal: false,
      decisionSignal: false,
      promiseSupported: true,
      accountGoal: "LEAD_GENERATION",
      primaryLines: 4,
      secondaryLines: 0,
    });
    expect(result.ready_for_g3).toBe(false);
    expect(result.hard_blocks).toContain("COVER_HOOK_TOO_LONG");
    expect(result.hard_blocks).toContain("COVER_HOOK_TOO_GENERIC");
  });
});
