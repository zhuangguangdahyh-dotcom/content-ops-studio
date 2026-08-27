import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { listFiles } from "./lib/files.js";

export interface SecretFinding {
  file: string;
  type: string;
  blocking: true;
}

const rules: Array<{ type: string; pattern: RegExp }> = [
  { type: "bearer-authorization", pattern: /Authorization\s*:\s*Bearer\s+[A-Za-z0-9._~+/-]{12,}/i },
  { type: "app-secret-value", pattern: /app_secret\s*[:=]\s*["']?[A-Za-z0-9._-]{8,}/i },
  { type: "client-secret-value", pattern: /client_secret\s*[:=]\s*["']?[A-Za-z0-9._-]{8,}/i },
  { type: "access-token-value", pattern: /access_token\s*[:=]\s*["']?[A-Za-z0-9._-]{12,}/i },
  { type: "refresh-token-value", pattern: /refresh_token\s*[:=]\s*["']?[A-Za-z0-9._-]{12,}/i },
  { type: "private-key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { type: "long-token", pattern: /\b(?:sk|token|secret)[-_][A-Za-z0-9_-]{32,}\b/i },
];

export function scanText(text: string, file = "fixture.txt"): SecretFinding[] {
  return rules
    .filter((rule) => rule.pattern.test(text))
    .map((rule) => ({ file, type: rule.type, blocking: true }));
}

export async function scanRepository(repositoryRoot: string): Promise<SecretFinding[]> {
  const findings: SecretFinding[] = [];
  const ignored = new Set([".git", "node_modules", ".pnpm-store", "coverage", "dist"]);
  for (const file of await listFiles(repositoryRoot, ignored)) {
    const relative = path.relative(repositoryRoot, file).replaceAll(path.sep, "/");
    if (relative === "scripts/scan-secrets.ts" || relative === "pnpm-lock.yaml") continue;
    const basename = path.basename(file);
    if (basename === ".env" || (basename.startsWith(".env.") && basename !== ".env.example")) {
      findings.push({ file: relative, type: "real-env-file", blocking: true });
      continue;
    }
    let text: string;
    try {
      text = await readFile(file, "utf8");
    } catch {
      continue;
    }
    if (relative === ".env.example") continue;
    findings.push(...scanText(text, relative));
  }
  return findings;
}

async function main(): Promise<void> {
  const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const findings = await scanRepository(repositoryRoot);
  for (const finding of findings) console.error(`BLOCKING ${finding.type}: ${finding.file}`);
  if (findings.length > 0) process.exitCode = 1;
  else console.log("Secret scan passed: no blocking matches.");
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) await main();
