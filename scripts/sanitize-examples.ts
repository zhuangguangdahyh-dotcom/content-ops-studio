import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listFiles } from "./lib/files.js";

const rules: Array<{ type: string; pattern: RegExp }> = [
  { type: "feishu-domain", pattern: /https?:\/\/[\w.-]*(?:feishu\.cn|larksuite\.com)/i },
  { type: "token-like", pattern: /\b(?:cli|tnt|app|token)[-_][A-Za-z0-9_-]{20,}\b/i },
  { type: "mobile-number", pattern: /(?<!\d)1[3-9]\d{9}(?!\d)/ },
  { type: "identity-number", pattern: /(?<!\d)\d{17}[\dXx](?!\d)/ },
  { type: "mac-user-path", pattern: /\/Users\/[^/\s]+\// },
  { type: "linux-user-path", pattern: /\/home\/[^/\s]+\// },
];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");
const findings: Array<{ file: string; type: string }> = [];
for (const file of await listFiles(root)) {
  const text = await readFile(file, "utf8");
  for (const rule of rules)
    if (rule.pattern.test(text))
      findings.push({ file: path.relative(root, file), type: rule.type });
}
for (const finding of findings) console.error(`BLOCKING ${finding.type}: ${finding.file}`);
if (findings.length > 0) process.exitCode = 1;
else console.log("Example sanitization passed: no blocking matches.");
