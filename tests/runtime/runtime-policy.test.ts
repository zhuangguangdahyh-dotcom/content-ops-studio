import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { RuntimeEvidence } from "../../packages/contracts/src/generated/1.0/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import { ReferenceRuntimeEngine } from "../../packages/runtime/src/index.js";
import {
  assertRuntimeSupported,
  DEFAULT_RUNTIME_SUPPORT_POLICY,
  evaluateRuntimeSupport,
  loadRuntimeSupportPolicy,
  parseRuntimeVersion,
  validateRuntimeEvidence,
  validateRuntimePolicy,
  type RuntimeSupportPolicy,
} from "../../packages/runtime/src/runtime-policy/index.js";

const policyFile = path.resolve("plugins/content-ops-studio/config/runtime-support-policy.json");

describe("Node Runtime support policy", () => {
  it("allows Node 24 patches including the minimum and future patch releases", async () => {
    const policy = await loadRuntimeSupportPolicy(policyFile);
    for (const version of ["v24.0.0", "v24.19.0", "v24.999.999"])
      expect(evaluateRuntimeSupport(policy, version)).toMatchObject({
        status: "SUPPORTED",
        matches: true,
      });
  });

  it("rejects unsupported majors and blocks unclaimed majors by default", async () => {
    const policy = await loadRuntimeSupportPolicy(policyFile);
    expect(evaluateRuntimeSupport(policy, "v20.20.2").status).toBe("UPSTREAM_EOL");
    expect(evaluateRuntimeSupport(policy, "v23.9.9").status).toBe("UNSUPPORTED");
    for (const major of [22, 25, 26]) {
      expect(evaluateRuntimeSupport(policy, `v${major}.0.0`).status).toBe("UNCLAIMED");
      expect(() => assertRuntimeSupported(policy, `v${major}.0.0`)).toThrow(
        expect.objectContaining({ code: "UNCLAIMED_RUNTIME" }),
      );
    }
    expect(() => assertRuntimeSupported(policy, "v20.20.2")).toThrow(
      expect.objectContaining({ code: "UNSUPPORTED_RUNTIME" }),
    );
    expect(() => assertRuntimeSupported(policy, "v23.0.0")).toThrow(
      expect.objectContaining({ code: "UNSUPPORTED_RUNTIME" }),
    );
  });

  it("permits only an explicit unclaimed-Runtime override", async () => {
    const policy = await loadRuntimeSupportPolicy(policyFile);
    expect(
      assertRuntimeSupported(policy, "v22.0.0", { allowUnclaimedRuntime: true }),
    ).toMatchObject({ status: "UNCLAIMED", matches: false });
  });

  it("enforces the policy for MOCK reference execution construction", () => {
    expect(
      () =>
        new ReferenceRuntimeEngine({
          home: "/fixture/home",
          pluginRoot: path.resolve("plugins/content-ops-studio"),
          runtimeVersion: "v22.0.0",
        }),
    ).toThrow(expect.objectContaining({ code: "UNCLAIMED_RUNTIME" }));
  });

  it("rejects invalid SemVer, missing policy, and contradictory policy", async () => {
    expect(() => parseRuntimeVersion("node-24")).toThrow(
      expect.objectContaining({ code: "RUNTIME_VERSION_MISMATCH" }),
    );
    await expect(
      loadRuntimeSupportPolicy(path.resolve("tests/fixtures/runtime-policy-missing.json")),
    ).rejects.toMatchObject({ code: "RUNTIME_POLICY_INVALID" });
    const contradictory: RuntimeSupportPolicy = structuredClone(DEFAULT_RUNTIME_SUPPORT_POLICY);
    contradictory.unclaimedRuntimes.push({
      name: "node",
      major: 24,
      reasonCode: "NOT_VALIDATED_BY_THIS_PROJECT",
    });
    expect(validateRuntimePolicy(contradictory)).toContain("POLICY_CONTRADICTION");
  });
});

describe("generic Runtime evidence", () => {
  it("separates support policy from execution status", async () => {
    const [policy, node20, node22] = await Promise.all([
      loadRuntimeSupportPolicy(policyFile),
      readFile(
        "tests/fixtures/contracts/1.0/runtime-evidence/valid/node20-upstream-eol-not-required.json",
        "utf8",
      ).then((value) => JSON.parse(value) as RuntimeEvidence),
      readFile(
        "tests/fixtures/contracts/1.0/runtime-evidence/valid/node22-unclaimed-not-run.json",
        "utf8",
      ).then((value) => JSON.parse(value) as RuntimeEvidence),
    ]);
    expect(validateRuntimeEvidence(node20, policy)).toEqual([]);
    expect(node20).toMatchObject({
      support_policy_status: "UPSTREAM_EOL",
      execution_status: "NOT_REQUIRED",
    });
    expect(validateRuntimeEvidence(node22, policy)).toEqual([]);
    expect(node22).toMatchObject({
      support_policy_status: "UNCLAIMED",
      execution_status: "NOT_RUN",
    });
    expect({ ...node22, execution_status: "NOT_AVAILABLE" }).not.toMatchObject({
      execution_status: "FAILED",
    });
  });

  it("requires complete successful command evidence for PASSED", async () => {
    const [policy, registry, raw] = await Promise.all([
      loadRuntimeSupportPolicy(policyFile),
      loadSchemaRegistry(),
      readFile("tests/fixtures/contracts/1.0/runtime-evidence/valid/complete.json", "utf8"),
    ]);
    const evidence = JSON.parse(raw) as RuntimeEvidence;
    expect(validateRuntimeEvidence(evidence, policy)).toEqual([]);
    expect(
      registry.validateBySchemaId(
        "https://content-ops-studio.local/schemas/1.0/runtime-evidence.schema.json",
        { ...evidence, command_results: [] },
      ).valid,
    ).toBe(false);
    expect(
      validateRuntimeEvidence(
        {
          ...evidence,
          command_results: [
            ...evidence.command_results.slice(0, -1),
            { command: evidence.commands.at(-1) ?? "pnpm test", status: "FAILED", exit_code: 1 },
          ],
        },
        policy,
      ),
    ).toContain("PASSED_CONTAINS_FAILED_COMMAND");
  });
});
