import { mkdtemp, readFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  CapabilityRegistry,
  detectWorkflowCycles,
  IdempotencyRegistry,
  initializeProjectDirectory,
  initializeProjectHome,
  PROJECT_HOME_DIRECTORIES,
  PROJECT_INITIALIZATION_LOCAL_V1,
  rejectSymlinkEscape,
  resolveProjectDirectory,
  resolveSafePath,
  StepHandlerRegistry,
  validateRuntimeConfig,
  validateWorkflowDefinition,
  VISUAL_FINALIZATION_FIXTURE_V1,
} from "../../packages/runtime/src/index.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("runtime core boundaries", () => {
  it("separates MOCK capability from production readiness", () => {
    const registry = new CapabilityRegistry({ now: () => new Date("2099-01-01T00:00:00Z") });
    registry.registerCapability("workspace.write", "local-mock", "MOCK_ONLY");
    expect(registry.requireCapabilities(["workspace.write"], "MOCK")[0]?.status).toBe("MOCK_ONLY");
    expect(() => registry.assertProductionReady(["workspace.write"])).toThrow(
      expect.objectContaining({ code: "CAPABILITY_BLOCKED" }),
    );
  });

  it("rejects production fixtures, external network, and non-absolute Home", () => {
    const base = {
      runtime_mode: "PRODUCTION",
      content_ops_home: "relative-home",
      plugin_root: "/fixture/plugin",
      allow_external_network: true,
      allow_fixture_workflows: true,
      allow_mock_adapters: true,
      workspace_adapter: { implementation: "mock", capability_status: "MOCK_ONLY" },
      research_adapter: { implementation: "mock", capability_status: "MOCK_ONLY" },
      image_adapter: { implementation: "mock", capability_status: "MOCK_ONLY" },
      renderer_adapter: { implementation: "mock", capability_status: "MOCK_ONLY" },
      asset_store: { implementation: "mock", capability_status: "MOCK_ONLY" },
    } as unknown as Parameters<typeof validateRuntimeConfig>[0];
    expect(validateRuntimeConfig(base)).toEqual(
      expect.arrayContaining([
        "CONTENT_OPS_HOME_NOT_ABSOLUTE",
        "EXTERNAL_NETWORK_FORBIDDEN",
        "PRODUCTION_FIXTURE_WORKFLOW_FORBIDDEN",
      ]),
    );
  });

  it("creates only an explicit temporary Home and protects path boundaries", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-home-test-"));
    roots.push(root);
    const home = path.join(root, "explicit-home");
    await initializeProjectHome(home);
    for (const directory of PROJECT_HOME_DIRECTORIES)
      expect(await readFile(path.join(home, directory, ".missing")).catch(() => "missing")).toBe(
        "missing",
      );
    expect(() => resolveSafePath(home, "../../escape")).toThrow(
      expect.objectContaining({ code: "PATH_ESCAPE" }),
    );
    const one = await initializeProjectDirectory(home, "Same name", "PRJ-20990101-A001");
    const two = await initializeProjectDirectory(home, "Same name", "PRJ-20990101-A002");
    expect(one).not.toBe(two);
    expect(resolveProjectDirectory(home, "Renamed", "PRJ-20990101-A001")).toContain(
      "PRJ-20990101-A001",
    );
    const outside = path.join(root, "outside");
    await symlink(outside, path.join(home, "escape-link"));
    await expect(
      rejectSymlinkEscape(home, path.join(home, "escape-link", "child")),
    ).rejects.toThrow();
  });

  it("validates acyclic reference definitions with concrete handlers", () => {
    const handlers = new StepHandlerRegistry();
    handlers.register("executeReferenceStep", {
      mockOnly: true,
      execute: async () => Promise.resolve({}),
    });
    expect(detectWorkflowCycles(PROJECT_INITIALIZATION_LOCAL_V1)).toEqual([]);
    expect(detectWorkflowCycles(VISUAL_FINALIZATION_FIXTURE_V1)).toEqual([]);
    expect(() =>
      validateWorkflowDefinition(PROJECT_INITIALIZATION_LOCAL_V1, handlers),
    ).not.toThrow();
  });

  it("prevents a verified idempotent operation from being downgraded", () => {
    const registry = new IdempotencyRegistry();
    registry.registerIdempotencyKey("KEY", "STEP", { value: 1 });
    registry.markOperationResult("KEY", "SUCCESS", { ok: true });
    expect(registry.assertIdempotentReplay("KEY", { value: 1 })?.status).toBe("SUCCESS");
    expect(() => registry.markOperationResult("KEY", "FAILED", {})).toThrow(
      expect.objectContaining({ code: "VERIFIED_OPERATION_IMMUTABLE" }),
    );
    expect(() => registry.assertIdempotentReplay("KEY", { value: 2 })).toThrow(
      expect.objectContaining({ code: "IDEMPOTENCY_CONFLICT" }),
    );
  });
});
