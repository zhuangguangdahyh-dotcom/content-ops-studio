import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { listFiles } from "./lib/files.js";
import { inspectPack } from "./lib/release-package.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productionRoots = ["packages", "services", "plugins/content-ops-studio"];
const authorPath = /\/Users\/zhuangguangda(?:\/|\b)|\\Users\\zhuangguangda(?:\\|\b)/;
const findings: string[] = [];

for (const relativeRoot of productionRoots) {
  for (const file of await listFiles(
    path.join(repositoryRoot, relativeRoot),
    new Set(["node_modules"]),
  )) {
    let text: string;
    try {
      text = await readFile(file, "utf8");
    } catch {
      continue;
    }
    if (authorPath.test(text))
      findings.push(path.relative(repositoryRoot, file).replaceAll(path.sep, "/"));
  }
}

const pack = await inspectPack(repositoryRoot);
for (const entry of pack.files) {
  let text: string;
  try {
    text = await readFile(path.join(repositoryRoot, entry.path), "utf8");
  } catch {
    continue;
  }
  if (authorPath.test(text)) findings.push(`package:${entry.path}`);
}

const allAuthorPathFiles: string[] = [];
for (const file of await listFiles(repositoryRoot, new Set([".git", "node_modules"]))) {
  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    continue;
  }
  if (authorPath.test(text))
    allAuthorPathFiles.push(path.relative(repositoryRoot, file).replaceAll(path.sep, "/"));
}

const allowedHistorical = allAuthorPathFiles.filter(
  (file) =>
    file.startsWith("reports/") ||
    file === "tests/release/cross-platform-paths.test.ts" ||
    file.startsWith("scripts/run-") ||
    file.startsWith("scripts/finalize-") ||
    file.startsWith("scripts/verify-commercial-space-"),
);
const unexpected = allAuthorPathFiles.filter((file) => !allowedHistorical.includes(file));
findings.push(...unexpected.map((file) => `unexpected:${file}`));

const unique = [...new Set(findings)].sort();
for (const finding of unique) console.error(`BLOCKING personal-path: ${finding}`);
if (unique.length) process.exitCode = 1;
else
  console.log(
    JSON.stringify({
      status: "PASSED",
      production_matches: 0,
      package_matches: 0,
      historical_excluded_files: allowedHistorical.length,
      package_file_count: pack.files.length,
    }),
  );
