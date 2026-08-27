import { describe, expect, it } from "vitest";
import { selectWorkspaceAdapter } from "../../packages/workspace-adapters/src/lark-cli/index.js";

describe("workspace adapter AUTO selection", () => {
  it("defaults to authenticated official Lark CLI", () => {
    expect(
      selectWorkspaceAdapter({ production: true, larkInstalled: true, larkAuthenticated: true }),
    ).toEqual({ status: "READY", adapter: "LARK_CLI" });
  });

  it("pauses for OAuth and never falls back to Direct or Mock", () => {
    expect(
      selectWorkspaceAdapter({
        production: true,
        larkInstalled: true,
        larkAuthenticated: false,
        directExplicitlyConfigured: true,
      }),
    ).toEqual({ status: "AWAITING_USER_AUTHORIZATION", adapter: "LARK_CLI" });
    expect(
      selectWorkspaceAdapter({ production: true, larkInstalled: false, larkAuthenticated: false }),
    ).toEqual({ status: "BLOCKED", code: "LARK_CLI_NOT_INSTALLED" });
  });

  it("allows Direct only explicitly and blocks Mock in Production", () => {
    expect(
      selectWorkspaceAdapter({
        preference: "DIRECT_FEISHU",
        production: true,
        larkInstalled: false,
        larkAuthenticated: false,
        directExplicitlyConfigured: true,
      }),
    ).toEqual({ status: "READY", adapter: "DIRECT_FEISHU" });
    expect(
      selectWorkspaceAdapter({
        preference: "MOCK",
        production: true,
        larkInstalled: false,
        larkAuthenticated: false,
      }),
    ).toEqual({ status: "BLOCKED", code: "PRODUCTION_MOCK_ADAPTER_FORBIDDEN" });
    expect(
      selectWorkspaceAdapter({
        preference: "MOCK",
        production: false,
        larkInstalled: false,
        larkAuthenticated: false,
      }),
    ).toEqual({ status: "READY", adapter: "MOCK" });
  });
});
