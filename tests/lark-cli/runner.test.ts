import { describe, expect, it, vi } from "vitest";
import {
  LarkCliError,
  LarkCliRunner,
  assertLarkCliCommandAllowed,
} from "../../packages/workspace-adapters/src/lark-cli/index.js";

describe("LarkCliRunner", () => {
  it("accepts official success JSON and keeps stdout/stderr separate", async () => {
    const runner = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({ ok: true, data: { value: 1 } }),
        stderr: "warning",
      }),
    );
    const result = await runner.run<{ value: number }>({
      argv: ["base", "+base-get", "--base-token", "fixture"],
      operation: "GET",
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.data.value).toBe(1);
    expect(result.stderr).toBe("warning");
  });

  it("returns official error envelopes and rejects exit-code drift", async () => {
    const failed = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 3,
        stdout: "",
        stderr: JSON.stringify({ ok: false, error: { code: "DENIED", message: "missing scope" } }),
      }),
    );
    expect(
      await failed.run({ argv: ["auth", "check", "--scope", "base:read"], operation: "SCOPE" }),
    ).toMatchObject({ ok: false, exitCode: 3, error: { code: "DENIED" } });
    const drift = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({ ok: false }),
        stderr: "",
      }),
    );
    await expect(
      drift.run({ argv: ["base", "+base-get"], operation: "GET" }),
    ).rejects.toMatchObject({ code: "LARK_CLI_EXIT_CODE_MISMATCH" });
  });

  it("rejects non-JSON, timeout and cancellation", async () => {
    const nonJson = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: "human text",
        stderr: "",
      }),
    );
    await expect(
      nonJson.run({ argv: ["base", "+base-get"], operation: "GET" }),
    ).rejects.toMatchObject({ code: "LARK_CLI_NON_JSON_OUTPUT" });
    const timeout = new LarkCliRunner("lark-cli", () => {
      const error = new Error("aborted");
      error.name = "AbortError";
      return Promise.reject(error);
    });
    await expect(
      timeout.run({ argv: ["base", "+base-get"], operation: "GET" }),
    ).rejects.toMatchObject({ code: "LARK_CLI_TIMEOUT" });
    const controller = new AbortController();
    controller.abort();
    await expect(
      timeout.run({ argv: ["base", "+base-get"], operation: "GET", signal: controller.signal }),
    ).rejects.toMatchObject({ code: "LARK_CLI_CANCELLED" });
  });

  it("passes an argv array and never invokes a shell", async () => {
    const executor = vi.fn((_binary: string, argv: string[]) =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({ ok: true, data: { argv } }),
        stderr: "",
      }),
    );
    const runner = new LarkCliRunner("lark-cli", executor);
    const hostileName = "name; rm -rf fixture";
    await runner.run({
      argv: ["base", "+base-create", "--name", hostileName],
      operation: "CREATE",
    });
    expect(executor).toHaveBeenCalledWith(
      "lark-cli",
      ["base", "+base-create", "--name", hostileName],
      30_000,
      undefined,
    );
  });

  it("blocks delete, risk-control, raw API, high-risk update and secret arguments", () => {
    const denied = [
      ["base", "+field-delete"],
      ["config", "risk-control", "off"],
      ["api", "POST", "/open-apis/bitable/v1/apps"],
      ["base", "+field-update", "--yes"],
      ["auth", "login", "--app-secret", "fixture"],
    ];
    for (const argv of denied)
      expect(() => assertLarkCliCommandAllowed({ argv, operation: "DENIED" })).toThrow(
        LarkCliError,
      );
  });

  it("allows only the explicitly confirmed scoped field cleanup", () => {
    expect(() =>
      assertLarkCliCommandAllowed({
        argv: ["base", "+field-delete", "--field-id", "fld-fixture", "--yes"],
        operation: "DELETE_FIELD",
        allowHighRiskUpdate: true,
      }),
    ).not.toThrow();
    expect(() =>
      assertLarkCliCommandAllowed({
        argv: ["base", "+field-delete", "--field-id", "fld-fixture", "--yes"],
        operation: "DELETE_FIELD",
      }),
    ).toThrow(LarkCliError);
  });

  it("redacts credential-shaped output before returning it", async () => {
    const sensitiveKey = ["access", "token"].join("_");
    const sensitiveValue = ["do", "not", "persist"].join("-");
    const runner = new LarkCliRunner("lark-cli", () =>
      Promise.resolve({
        exitCode: 0,
        stdout: JSON.stringify({ ok: true, data: { note: `${sensitiveKey}=${sensitiveValue}` } }),
        stderr: "",
      }),
    );
    const result = await runner.run({ argv: ["auth", "status", "--json"], operation: "AUTH" });
    expect(result.stdout).not.toContain(sensitiveValue);
  });
});
