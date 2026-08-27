import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildFinalApprovalTargetVersion } from "../../packages/core/src/finalization/index.js";
import { FinalizationRuntime } from "../../packages/runtime/src/finalization/index.js";
import { createFinalizationE2eFixture, deterministicPng } from "./fixture.js";

const pluginRoot = path.resolve("plugins/content-ops-studio");

async function setup() {
  const home = await mkdtemp(path.join(os.tmpdir(), "final-runtime-"));
  const context = await createFinalizationE2eFixture(home);
  const runtime = new FinalizationRuntime({
    projectHome: home,
    pluginRoot,
    projectId: context.project_id,
    contentId: context.content_id,
    runId: context.run_id,
  });
  return { home, context, runtime };
}

describe("Finalization Runtime", () => {
  it("runs the full fixture through Manifest, Fingerprint, Delivery, Integrity and Archive", async () => {
    const { runtime, context } = await setup();
    const result = await runtime.finalize(context);
    expect(result).toMatchObject({
      status: "FINALIZED",
      reused_manifest: false,
      reused_delivery: false,
      imagegen_calls: 0,
      renderer_calls: 0,
      feishu_writes: 0,
      attachment_uploads: 0,
    });
    const integrity = JSON.parse(await readFile(result.integrity_report_path, "utf8")) as Record<
      string,
      unknown
    >;
    expect(integrity).toMatchObject({ overall_status: "PASSED", hard_block_count: 0 });
    expect(await runtime.inspect(context)).toMatchObject({
      status: "FINALIZED",
      current: true,
      sync_status: "SYNC_NOT_STARTED",
    });
  });

  it("replays idempotently without duplicating Manifest, pages or archive", async () => {
    const { runtime, context } = await setup();
    const first = await runtime.finalize(context);
    const second = await runtime.finalize(context);
    expect(second.final_set_fingerprint).toBe(first.final_set_fingerprint);
    expect(second.reused_manifest).toBe(true);
    expect(second.reused_delivery).toBe(true);
  });

  it("rejects changed bytes and preserves a non-finalized failure state", async () => {
    const { runtime, context } = await setup();
    const page = context.pages[1];
    if (!page) throw new Error("Fixture page missing.");
    await writeFile(page.source_path, deterministicPng(12, 16, 99));
    await expect(runtime.finalize(context)).rejects.toMatchObject({
      code: "FINAL_ASSET_INTEGRITY_FAILED",
    });
    expect(await runtime.inspect()).toMatchObject({
      status: "FINALIZATION_FAILED",
      current: false,
    });
  });

  it("detects immutable Manifest version conflicts", async () => {
    const { runtime, context } = await setup();
    await runtime.finalize(context);
    const changed = structuredClone(context);
    const page = changed.pages[1];
    if (!page) throw new Error("Fixture page missing.");
    page.page_intent = "A different payload under the same FMV is forbidden.";
    await expect(runtime.finalize(changed)).rejects.toMatchObject({
      code: "FINAL_MANIFEST_VERSION_CONFLICT",
    });
  });

  it("recovers after Manifest and Delivery partial failures without reproducing assets", async () => {
    const first = await setup();
    await expect(
      first.runtime.finalize(first.context, { fail_after: "MANIFEST" }),
    ).rejects.toMatchObject({ code: "FINALIZATION_TEST_FAILURE_AFTER_MANIFEST" });
    const recoveredManifest = await first.runtime.finalize(first.context);
    expect(recoveredManifest.reused_manifest).toBe(true);

    const second = await setup();
    await expect(
      second.runtime.finalize(second.context, { fail_after: "DELIVERY" }),
    ).rejects.toMatchObject({ code: "FINALIZATION_TEST_FAILURE_AFTER_DELIVERY" });
    const recoveredDelivery = await second.runtime.finalize(second.context);
    expect(recoveredDelivery.reused_manifest).toBe(true);
    expect(recoveredDelivery.reused_delivery).toBe(true);
  });

  it("keeps finalized state independent from Feishu sync and detects post-finalization staleness", async () => {
    const { runtime, context } = await setup();
    await runtime.finalize(context);
    const changed = structuredClone(context);
    const changedPage = changed.pages[0];
    const changedG5 = changed.g5;
    if (!changedPage || !changedG5) throw new Error("Fixture binding is missing.");
    changedPage.checksum = "f".repeat(64);
    changedG5.target_version = buildFinalApprovalTargetVersion(changed);
    expect(await runtime.inspect(changed)).toMatchObject({
      status: "SUPERSEDED",
      current: false,
      sync_status: "SYNC_NOT_STARTED",
    });
  });

  it("blocks secret-shaped metadata from passing Delivery Integrity", async () => {
    const { runtime, context } = await setup();
    const firstPage = context.pages[0];
    if (!firstPage) throw new Error("Fixture page is missing.");
    firstPage.renderer_provenance = ["app_", "secret=", "fictional-value"].join("");
    await expect(runtime.finalize(context)).rejects.toMatchObject({
      code: "DELIVERY_INTEGRITY_FAILED",
    });
    expect(await runtime.inspect()).toMatchObject({ status: "FINALIZATION_FAILED" });
  });
});
