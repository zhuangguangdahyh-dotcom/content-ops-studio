import { describe, expect, it } from "vitest";
import { runCli } from "../../packages/cli/src/runtime-cli.js";

function io() {
  const stdout: string[] = [];
  const stderr: string[] = [];
  return {
    stdout,
    stderr,
    value: {
      stdout: (line: string) => stdout.push(line),
      stderr: (line: string) => stderr.push(line),
    },
  };
}

describe("Feishu CLI", () => {
  it("reports a redacted NOT_CONFIGURED doctor without a network request", async () => {
    const output = io();
    expect(await runCli(["feishu", "doctor", "--json"], output.value)).toBe(0);
    expect(JSON.parse(output.stdout[0] ?? "{}")).toMatchObject({
      provider: "FEISHU",
      auth_mode: "SELF_BUILT_TENANT_APP",
      token_request_status: "NOT_CONFIGURED",
      secret_redaction_verified: true,
    });
  });

  it("prints the permission manifest and a 4/141 dry plan", async () => {
    const permissions = io();
    expect(await runCli(["feishu", "permissions", "--json"], permissions.value)).toBe(0);
    const permissionResult = JSON.parse(permissions.stdout[0] ?? "{}") as {
      manifest: { permissions: unknown[] };
    };
    expect(permissionResult.manifest.permissions.length).toBeGreaterThanOrEqual(12);
    const plan = io();
    expect(
      await runCli(
        [
          "feishu",
          "workspace",
          "plan",
          "--project-id",
          "PRJ-FIXTURE",
          "--project-name",
          "Fixture",
          "--run-id",
          "RUN-FIXTURE",
          "--json",
        ],
        plan.value,
      ),
    ).toBe(0);
    const planResult = JSON.parse(plan.stdout[0] ?? "{}") as {
      plan: { expected: Record<string, number> };
    };
    expect(planResult.plan.expected).toMatchObject({
      tables: 4,
      fields: 141,
      relations: 5,
      views: 4,
    });
  });

  it("rejects CLI secrets and Production writes without both gates", async () => {
    const secret = io();
    expect(await runCli(["feishu", "doctor", "--app-secret", "never-accept"], secret.value)).toBe(
      5,
    );
    expect(secret.stderr.join("\n")).not.toContain("never-accept");
    const provision = io();
    expect(
      await runCli(
        [
          "feishu",
          "workspace",
          "provision",
          "--mode",
          "PRODUCTION",
          "--workspace-adapter",
          "DIRECT_FEISHU",
          "--home",
          "/private/tmp/content-ops-cli-fixture",
          "--input",
          "tests/fixtures/contracts/1.0/project-profile/valid/complete.json",
        ],
        provision.value,
      ),
    ).toBe(2);
    expect(provision.stderr.join("\n")).toContain("FEISHU_LIVE_WRITE_DISABLED");
  });
});
