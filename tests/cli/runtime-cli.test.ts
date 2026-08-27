import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectProfile } from "../../packages/contracts/src/generated/1.0/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import {
  assertProjectProfileApproval,
  runCli,
  type CliIo,
} from "../../packages/cli/src/runtime-cli.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

function capture(): { io: CliIo; out: string[]; err: string[] } {
  const out: string[] = [];
  const err: string[] = [];
  return {
    io: { stdout: (value) => out.push(value), stderr: (value) => err.push(value) },
    out,
    err,
  };
}

describe("content-ops CLI", () => {
  it("binds Production G1 approval to the exact project, version and source run", () => {
    const approval = {
      approval_id: "APR-20990101-G1",
      gate: "PROJECT_PROFILE",
      target_type: "PROJECT",
      target_id: "PRJ-FIXTURE",
      target_version: "PROJECT-PROFILE-V1",
      decision: "APPROVE",
      comment: "Approve fictional sandbox profile.",
      source_run_id: "RUN-FIXTURE",
      created_at: "2099-01-01T00:00:00.000Z",
      deprecated_at: null,
      schema_version: "1.0.0",
    } as const;
    expect(() =>
      assertProjectProfileApproval(approval, {
        projectId: "PRJ-FIXTURE",
        runId: "RUN-FIXTURE",
      }),
    ).not.toThrow();
    expect(() =>
      assertProjectProfileApproval(
        { ...approval, source_run_id: "RUN-OTHER" },
        { projectId: "PRJ-FIXTURE", runId: "RUN-FIXTURE" },
      ),
    ).toThrow("G1 approval does not match");
  });

  it("reports Node 24 local readiness separately from blocked production integration", async () => {
    const mock = capture();
    expect(await runCli(["doctor", "--mode", "MOCK", "--json"], mock.io)).toBe(0);
    const mockDiagnostic = JSON.parse(mock.out[0] ?? "{}") as Record<string, unknown>;
    expect(mockDiagnostic).toMatchObject({
      overall_status: "READY_WITH_WARNINGS",
      supported_runtime_match: true,
      local_runtime_readiness: "READY",
      production_integration_readiness: "BLOCKED",
      cross_platform_ci_evidence: "UNVERIFIED",
    });
    expect(mockDiagnostic.capabilities).toContainEqual(
      expect.objectContaining({
        capability: "workspace.adapter",
        provider: "feishu",
        status: "AVAILABLE",
      }),
    );
    (await loadSchemaRegistry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/runtime-diagnostic.schema.json",
      mockDiagnostic,
    );
    const production = capture();
    expect(await runCli(["doctor", "--mode", "PRODUCTION", "--json"], production.io)).toBe(2);
    expect(JSON.parse(production.out[0] ?? "{}") as Record<string, unknown>).toMatchObject({
      overall_status: "BLOCKED",
      production_integration_readiness: "BLOCKED",
    });
  });

  it("reports Node 20 as EOL and Node 22 as unclaimed without fabricated execution", async () => {
    const node20 = capture();
    expect(
      await runCli(["doctor", "--mode", "MOCK", "--json"], node20.io, process.cwd(), "v20.20.2"),
    ).toBe(2);
    const node20Result = JSON.parse(node20.out[0] ?? "{}") as {
      upstream_lifecycle_snapshot: Array<Record<string, unknown>>;
    };
    expect(node20Result.upstream_lifecycle_snapshot).toContainEqual(
      expect.objectContaining({
        runtime_major: 20,
        upstream_status: "EOL",
        project_status: "UPSTREAM_EOL",
        execution_status: "NOT_REQUIRED",
      }),
    );
    const node22 = capture();
    expect(
      await runCli(["doctor", "--mode", "MOCK", "--json"], node22.io, process.cwd(), "v22.0.0"),
    ).toBe(2);
    expect(
      (
        JSON.parse(node22.out[0] ?? "{}") as {
          upstream_lifecycle_snapshot: Array<Record<string, unknown>>;
        }
      ).upstream_lifecycle_snapshot,
    ).toContainEqual(
      expect.objectContaining({
        runtime_major: 22,
        project_status: "UNCLAIMED",
        execution_status: "NOT_RUN",
      }),
    );
  });

  it("provides stable human-readable doctor output", async () => {
    const captured = capture();
    expect(await runCli(["doctor", "--mode", "MOCK"], captured.io)).toBe(0);
    expect(captured.out[0]).toContain("Current Runtime: node v24.19.0");
    expect(captured.out[0]).toContain("Project Supported Runtime: >=24 <25");
    expect(captured.out[0]).toContain("Node 20: EOL / UPSTREAM_EOL / NOT_REQUIRED");
    expect(captured.out[0]).toContain("Production Integration Readiness: BLOCKED");
  });

  it("uses stable invalid-input exit code and never echoes a supplied secret value", async () => {
    const captured = capture();
    const exit = await runCli(
      ["run", "start", "--home", "/tmp/fixture", "--input", "api_key=DO_NOT_ECHO"],
      captured.io,
    );
    expect(exit).toBe(5);
    expect(captured.err.join("\n")).not.toContain("DO_NOT_ECHO");
  });

  it("executes project create against an explicit temporary Home", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-cli-"));
    roots.push(root);
    const home = path.join(root, "home");
    const runId = "RUN-20990103-040506-C001";
    const projectId = "PRJ-20990103-C001";
    const profile = JSON.parse(
      await readFile("tests/fixtures/contracts/1.0/project-profile/valid/complete.json", "utf8"),
    ) as ProjectProfile;
    Object.assign(profile, {
      project_id: projectId,
      project_name: "Fictional CLI Project",
      project_status: "PROJECT_INITIALIZING",
      config_confirmation_status: "CONFIG_PENDING",
      platform_pack: "xiaohongshu",
      industry_pack: "generic",
      last_run_id: runId,
    });
    const input = path.join(root, "profile.json");
    await writeFile(input, JSON.stringify(profile));
    const captured = capture();
    const exit = await runCli(
      [
        "project",
        "create",
        "--home",
        home,
        "--mode",
        "MOCK",
        "--input",
        input,
        "--project-id",
        projectId,
        "--run-id",
        runId,
        "--json",
      ],
      captured.io,
    );
    expect(exit).toBe(0);
    expect(JSON.parse(captured.out[0] ?? "{}") as { status: string }).toMatchObject({
      status: "AWAITING_APPROVAL",
    });
  });
});
