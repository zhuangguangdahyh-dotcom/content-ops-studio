import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);

describe("MCP host smoke script", () => {
  it("reports an unverified optional Codex host when the CLI is not installed", async () => {
    const { stdout } = await execFileAsync(
      process.execPath,
      ["--import", "tsx", "scripts/test-mcp-host.ts"],
      {
        cwd: process.cwd(),
        env: { ...process.env, PATH: "" },
      },
    );

    expect(JSON.parse(stdout)).toMatchObject({
      status: "PASSED",
      codex_cli_detected: false,
      mcp_management_surface: "UNVERIFIED",
      equivalent_installed_copy_host: "PASSED_BY_PLUGIN_PACKAGE_TEST",
    });
  });
});
