import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface PackFile {
  path: string;
  size?: number;
  mode?: number;
}

export interface PackResult {
  name: string;
  version: string;
  filename: string;
  files: PackFile[];
  packedSize?: number;
  unpackedSize?: number;
}

function pnpmCommand(): string {
  return process.platform === "win32" ? "pnpm.cmd" : "pnpm";
}

export function runCommand(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (value: string) => (stdout += value));
    child.stderr.setEncoding("utf8").on("data", (value: string) => (stderr += value));
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${command} ${args.join(" ")} failed (${code}): ${stderr || stdout}`));
    });
  });
}

export async function inspectPack(repositoryRoot: string): Promise<PackResult> {
  const result = await runCommand(pnpmCommand(), ["pack", "--dry-run", "--json"], repositoryRoot);
  return JSON.parse(result.stdout) as PackResult;
}

export async function createPack(repositoryRoot: string, destination: string): Promise<PackResult> {
  const result = await runCommand(
    pnpmCommand(),
    ["pack", "--pack-destination", destination, "--json"],
    repositoryRoot,
  );
  return JSON.parse(result.stdout) as PackResult;
}

export async function readPackSource(repositoryRoot: string, file: PackFile): Promise<Buffer> {
  return readFile(path.join(repositoryRoot, file.path));
}
