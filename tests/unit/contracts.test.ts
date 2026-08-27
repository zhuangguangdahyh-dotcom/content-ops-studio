import { describe, expect, it } from "vitest";
import {
  countUnicodeCodePoints,
  createApprovalId,
  createProjectId,
  createRecordUniqueKey,
  createRunId,
  sanitizeFilename,
} from "../../packages/contracts/src/index.js";

const date = new Date("2026-08-23T09:08:07.000Z");

describe("deterministic contract utilities", () => {
  it("creates stable identifier formats", () => {
    expect(createProjectId(date, "a1b2")).toBe("PRJ-20260823-A1B2");
    expect(createRunId(date, "a1b2")).toBe("RUN-20260823-090807-A1B2");
    expect(createApprovalId(date, "a1b2")).toBe("APR-20260823-A1B2");
  });

  it("rejects invalid identifier suffixes", () => {
    expect(() => createProjectId(date, "bad")).toThrow(/four/i);
  });

  it("creates typed record unique keys", () => {
    expect(createRecordUniqueKey("PRJ-20260823-A1B2", "painpoint", "P-0001")).toBe(
      "PRJ-20260823-A1B2::painpoint::P-0001",
    );
    expect(createRecordUniqueKey("PRJ-20260823-A1B2", "content", "C-0042")).toBe(
      "PRJ-20260823-A1B2::content::C-0042",
    );
    expect(createRecordUniqueKey("PRJ-20260823-A1B2", "rule", "R-0100")).toBe(
      "PRJ-20260823-A1B2::rule::R-0100",
    );
  });

  it("counts Unicode code points under the V1 title contract", () => {
    expect(countUnicodeCodePoints("空间✨经营")).toBe(5);
    expect(countUnicodeCodePoints("𠮷")).toBe(1);
  });

  it("sanitizes unsafe filename characters", () => {
    expect(sanitizeFilename("  项目/封面:01?.png  ")).toBe("项目-封面-01-.png");
    expect(sanitizeFilename("../..")).toBe("untitled");
  });
});
