import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listFiles } from "./lib/files.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const roots = [
  "README.md",
  "QUICK_START.md",
  "ENVIRONMENT.md",
  "SECURITY.md",
  "PRIVACY.md",
  "LICENSE-DECISION.md",
  "docs",
  "plugins/content-ops-studio/skills",
  "reports/index.md",
];
const markdownFiles: string[] = [];
for (const relative of roots) {
  const absolute = path.join(repositoryRoot, relative);
  if (relative.endsWith(".md")) markdownFiles.push(absolute);
  else markdownFiles.push(...(await listFiles(absolute)).filter((file) => file.endsWith(".md")));
}

const failures: string[] = [];
for (const file of markdownFiles) {
  const text = await readFile(file, "utf8");
  const links = [...text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)].map((match) => match[1] ?? "");
  for (const raw of links) {
    const target = raw.replace(/^<|>$/g, "").split("#")[0]?.trim() ?? "";
    if (!target || /^(?:https?:|mailto:|#)/i.test(raw)) continue;
    if (path.isAbsolute(target)) {
      failures.push(`${path.relative(repositoryRoot, file)} -> absolute:${target}`);
      continue;
    }
    try {
      await access(path.resolve(path.dirname(file), decodeURIComponent(target)));
    } catch {
      failures.push(`${path.relative(repositoryRoot, file)} -> ${target}`);
    }
  }
}

for (const failure of failures) console.error(`BLOCKING broken-link: ${failure}`);
if (failures.length) process.exitCode = 1;
else console.log(JSON.stringify({ status: "PASSED", markdown_files: markdownFiles.length }));
