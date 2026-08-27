import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateFinalizationEligibility } from "../../packages/core/src/finalization/index.js";
import { FinalizationRuntime } from "../../packages/runtime/src/finalization/index.js";
import { FINALIZATION_AND_DELIVERY_V1 } from "../../packages/runtime/src/workflows/index.js";
import { TOOL_NAMES } from "../../services/content-ops-mcp/src/tool-registry.js";
import { createFinalizationE2eFixture } from "./fixture.js";

describe("PLUGIN_V1_E2E_SMOKE", () => {
  it("walks the deterministic logical chain through G5 and Finalization without visual generation", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "plugin-v1-e2e-"));
    const finalContext = await createFinalizationE2eFixture(home);
    const chain = {
      project_context: { project_id: finalContext.project_id, status: "PROJECT_ACTIVE" },
      painpoint: { painpoint_id: "P-9001", status: "PAINPOINT_CONFIRMED" },
      content: { content_id: finalContext.content_id, version: finalContext.content_version },
      g3: finalContext.g3,
      visual_plan: { version: finalContext.visual_plan_version },
      g4: finalContext.g4,
      remaining_pages: finalContext.pages.slice(1),
      g5: finalContext.g5,
    };
    expect(chain.project_context.status).toBe("PROJECT_ACTIVE");
    expect(chain.painpoint.status).toBe("PAINPOINT_CONFIRMED");
    expect(chain.g3.decision).toBe("APPROVE");
    expect(chain.g4.decision).toBe("APPROVE");
    expect(chain.remaining_pages).toHaveLength(5);
    expect(chain.g5?.decision).toBe("APPROVE");
    expect(evaluateFinalizationEligibility(finalContext).eligible).toBe(true);
    expect(FINALIZATION_AND_DELIVERY_V1.steps.map((step) => step.step_id)).toEqual([
      "LOAD_FINALIZATION_CONTEXT",
      "VERIFY_APPROVAL_CHAIN",
      "VERIFY_FINAL_ASSETS",
      "VERIFY_GROUP_EVIDENCE",
      "BUILD_FINAL_MANIFEST",
      "BUILD_FINAL_SET_FINGERPRINT",
      "BUILD_DELIVERY_PACKAGE",
      "VERIFY_DELIVERY",
      "WRITE_ARCHIVE_STATE",
      "OPTIONAL_SYNC",
      "COMPLETE_RUN",
    ]);
    expect(TOOL_NAMES).toEqual(
      expect.arrayContaining([
        "content_ops_plan_finalization",
        "content_ops_finalize_delivery",
        "content_ops_verify_final_delivery",
      ]),
    );
    const runtime = new FinalizationRuntime({
      projectHome: home,
      pluginRoot: path.resolve("plugins/content-ops-studio"),
      projectId: finalContext.project_id,
      contentId: finalContext.content_id,
      runId: finalContext.run_id,
    });
    const result = await runtime.finalize(finalContext);
    expect(result).toMatchObject({
      status: "FINALIZED",
      imagegen_calls: 0,
      renderer_calls: 0,
    });
  });
});
