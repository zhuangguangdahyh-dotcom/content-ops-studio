import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository, scanText } from "./scan-secrets.js";
import { inspectPack } from "./lib/release-package.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const findings = await scanRepository(repositoryRoot);
const pack = await inspectPack(repositoryRoot);
const packageFindings: Array<{ file: string; type: string }> = [];
const privacyRules = [
  { type: "personal-mac-path", pattern: /\/Users\/zhuangguangda(?:\/|\b)/ },
  {
    type: "personal-email",
    pattern: /\b[A-Z0-9._%+-]+@(?!example\.(?:com|org)\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  { type: "signed-url", pattern: /https?:\/\/[^\s]+[?&](?:signature|x-amz-signature|token)=/i },
  { type: "conversation-url", pattern: /https?:\/\/[^\s]*(?:conversation|chat\/c\/)[^\s]*/i },
];

for (const entry of pack.files) {
  let text: string;
  try {
    text = await readFile(path.join(repositoryRoot, entry.path), "utf8");
  } catch {
    continue;
  }
  // The bundled MCP includes third-party OAuth implementations whose source
  // necessarily names secret/token fields and example support emails. Those
  // are not values. Repository source is scanned before bundling; the bundle
  // receives only value-oriented path and signed-URL checks here.
  if (!entry.path.endsWith("runtime/dist/content-ops-mcp.mjs"))
    for (const finding of scanText(text, entry.path))
      packageFindings.push({ file: finding.file, type: finding.type });
  for (const rule of entry.path.endsWith("runtime/dist/content-ops-mcp.mjs")
    ? privacyRules.filter((rule) => ["personal-mac-path", "signed-url"].includes(rule.type))
    : privacyRules)
    if (rule.pattern.test(text)) packageFindings.push({ file: entry.path, type: rule.type });
}

for (const finding of [...findings, ...packageFindings])
  console.error(`BLOCKING ${finding.type}: ${finding.file}`);
if (findings.length + packageFindings.length) process.exitCode = 1;
else
  console.log(
    JSON.stringify({
      status: "PASSED",
      repository_secret_matches: 0,
      package_privacy_matches: 0,
      package_file_count: pack.files.length,
    }),
  );
