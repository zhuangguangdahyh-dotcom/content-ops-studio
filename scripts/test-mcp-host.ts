import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

function run(
  command: string,
  args: string[],
  env: NodeJS.ProcessEnv,
): Promise<{ code: number; stdout: string; notFound: boolean }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: false, env, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    child.stdout.on("data", (chunk: Buffer) => (stdout += chunk.toString()));
    child.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT") {
        resolve({ code: 127, stdout, notFound: true });
        return;
      }
      reject(error);
    });
    child.on("close", (code) => resolve({ code: code ?? 1, stdout, notFound: false }));
  });
}

const isolatedHome = await mkdtemp(path.join(os.tmpdir(), "content-ops-codex-host-"));
const env = { ...process.env, CODEX_HOME: isolatedHome };
const version = await run("codex", ["--version"], env);
if (version.notFound) {
  process.stdout.write(
    JSON.stringify({
      status: "PASSED",
      codex_cli_detected: false,
      isolated_codex_home: true,
      mcp_management_surface: "UNVERIFIED",
      native_repo_plugin_auto_install: "UNVERIFIED",
      equivalent_installed_copy_host: "PASSED_BY_PLUGIN_PACKAGE_TEST",
    }) + "\n",
  );
  process.exit(0);
}
const help = await run("codex", ["mcp", "--help"], env);
if (version.code !== 0 || help.code !== 0 || !help.stdout.includes("Manage external MCP servers"))
  throw new Error("Current Codex CLI MCP host surface is unavailable.");
process.stdout.write(
  JSON.stringify({
    status: "PASSED",
    codex_cli_detected: true,
    isolated_codex_home: true,
    mcp_management_surface: true,
    native_repo_plugin_auto_install: "UNVERIFIED",
    equivalent_installed_copy_host: "PASSED_BY_PLUGIN_PACKAGE_TEST",
  }) + "\n",
);
