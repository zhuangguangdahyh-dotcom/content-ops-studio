import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { WorkspaceBlueprintDefinition } from "../../packages/contracts/src/workspace-blueprint.js";
import { PersistentLocalMockWorkspaceAdapter } from "../../packages/workspace-adapters/src/persistent-local-mock.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function setup(failureInjector?: (operation: string, index: number | null) => boolean) {
  const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-mock-workspace-"));
  roots.push(root);
  const blueprint = JSON.parse(
    await readFile(
      path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
      "utf8",
    ),
  ) as WorkspaceBlueprintDefinition;
  return new PersistentLocalMockWorkspaceAdapter({
    stateFile: path.join(root, "mock-workspace.json"),
    blueprint,
    ...(failureInjector ? { failureInjector } : {}),
  });
}

describe("PersistentLocalMockWorkspaceAdapter", () => {
  it("creates the four Blueprint tables with only explicit Mock IDs", async () => {
    const adapter = await setup();
    const first = await adapter.createWorkspace("Fictional Studio", "CREATE:WORKSPACE");
    const replay = await adapter.createWorkspace("Fictional Studio", "CREATE:WORKSPACE");
    expect(replay).toEqual(first);
    expect(first.workspaceId).toMatch(/^MOCK-WS-/);
    expect(await adapter.listTables()).toHaveLength(4);
    expect(
      (await adapter.listTables()).every((table) => table.tableId.startsWith("MOCK-TBL-")),
    ).toBe(true);
    expect((await adapter.probeConnection()).capability).toBe("MOCK_ONLY");
  });

  it("persists, verifies, searches, and idempotently replays records", async () => {
    const adapter = await setup();
    await adapter.createWorkspace("Fictional Studio", "CREATE:WORKSPACE");
    const created = await adapter.createRecord(
      { uniqueKey: "PRJ-DEMO::one", version: 1, fields: { status: "DRAFT" } },
      "CREATE:ONE",
    );
    expect(created.recordId).toMatch(/^MOCK-REC-/);
    expect(
      await adapter.createRecord(
        { uniqueKey: "PRJ-DEMO::one", version: 1, fields: { status: "DRAFT" } },
        "CREATE:ONE",
      ),
    ).toEqual(created);
    await adapter.updateRecord("PRJ-DEMO::one", 1, { status: "READY" }, "UPDATE:ONE");
    expect(await adapter.verifyWrite("PRJ-DEMO::one", { status: "READY" })).toBe(true);
    expect(await adapter.searchRecords({ fields: { status: "READY" } })).toHaveLength(1);
  });

  it("reports an injected third-item failure and retries only the failed item", async () => {
    let failThird = true;
    const adapter = await setup(
      (operation, index) => operation === "batchUpsertRecords" && index === 2 && failThird,
    );
    await adapter.createWorkspace("Fictional Studio", "CREATE:WORKSPACE");
    const records = [0, 1, 2, 3].map((index) => ({
      uniqueKey: `PRJ-DEMO::${index}`,
      version: 1,
      fields: { index },
    }));
    const partial = await adapter.batchUpsertRecords(records, "BATCH:ONE");
    expect(partial.succeeded).toHaveLength(3);
    expect(partial.failed.map((item) => item.uniqueKey)).toEqual(["PRJ-DEMO::2"]);
    failThird = false;
    const failedRecord = records[2];
    if (!failedRecord) throw new Error("Fixture record missing.");
    const retry = await adapter.batchUpsertRecords([failedRecord], "BATCH:ONE:RETRY");
    expect(retry.failed).toEqual([]);
    expect(await adapter.searchRecords({})).toHaveLength(4);
  });
});
