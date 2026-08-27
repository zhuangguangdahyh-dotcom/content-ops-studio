import { describe, expect, it } from "vitest";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import { assertActionAllowed, type ProductionState } from "../../packages/core/src/index.js";
import { LocalMockWorkspaceAdapter } from "../../packages/workspace-adapters/src/index.js";
import {
  mockApprovalEvent,
  mockTaskEnvelope,
  mockTaskResult,
} from "../../packages/test-support/src/index.js";

async function contractValidator(name: string): Promise<(value: unknown) => boolean> {
  const registry = await loadSchemaRegistry();
  return (value) =>
    registry.validateBySchemaId(
      `https://content-ops-studio.local/schemas/1.0/${name}.schema.json`,
      value,
    ).valid;
}

describe("mock integration", () => {
  it("creates and verifies a mock project initialization record", async () => {
    const adapter = new LocalMockWorkspaceAdapter();
    expect(await adapter.probeConnection()).toEqual({ ready: true, implementation: "local-mock" });
    const record = {
      uniqueKey: "PRJ-20990101-DEMO::project",
      version: 1,
      fields: { state: "PROJECT_PENDING_CONFIRMATION" },
    };
    await adapter.createRecord(record);
    expect(await adapter.verifyWrite(record.uniqueKey, record.fields)).toBe(true);
  });

  it("validates mock envelopes, results, and approval events", async () => {
    expect((await contractValidator("task-envelope"))(mockTaskEnvelope())).toBe(true);
    expect((await contractValidator("task-result"))(mockTaskResult())).toBe(true);
    expect((await contractValidator("approval-event"))(mockApprovalEvent())).toBe(true);
  });

  it("blocks illegal workflow advancement", () => {
    const state: ProductionState = {
      copy: "COPY_PENDING_APPROVAL",
      firstPage: "FIRST_PAGE_NOT_SUBMITTED",
      images: "IMAGE_NOT_GENERATED",
      qaPassed: false,
      finalApproval: "FINAL_NOT_SUBMITTED",
    };
    expect(() => assertActionAllowed(state, "GENERATE_FIRST_PAGE")).toThrow(/INVALID_STATE/);
    expect(() => assertActionAllowed(state, "FINALIZE")).toThrow(/INVALID_STATE/);
  });
});
