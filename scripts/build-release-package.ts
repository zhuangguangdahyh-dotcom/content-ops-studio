import { createHash } from "node:crypto";
import { copyFile, mkdir, mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPack, readPackSource, type PackResult } from "./lib/release-package.js";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = JSON.parse(
  await readFile(path.join(repositoryRoot, "package.json"), "utf8"),
) as {
  name: string;
  version: string;
  license: string;
  engines: { node: string };
};
const pluginManifest = JSON.parse(
  await readFile(
    path.join(repositoryRoot, "plugins/content-ops-studio/.codex-plugin/plugin.json"),
    "utf8",
  ),
) as { version: string };
if (packageJson.version !== pluginManifest.version) throw new Error("RELEASE_VERSION_DRIFT");
if (packageJson.license !== "MIT") throw new Error("RELEASE_LICENSE_DRIFT");

const temporary = await mkdtemp(path.join(os.tmpdir(), "content-ops-release-pack-"));
const firstDirectory = path.join(temporary, "first");
const secondDirectory = path.join(temporary, "second");
await Promise.all([mkdir(firstDirectory), mkdir(secondDirectory)]);
const [first, second] = await Promise.all([
  createPack(repositoryRoot, firstDirectory),
  createPack(repositoryRoot, secondDirectory),
]);

function normalizedFiles(pack: PackResult): string[] {
  return pack.files.map((file) => file.path).sort((left, right) => left.localeCompare(right, "en"));
}

async function canonicalFingerprint(pack: PackResult): Promise<string> {
  const entries: string[] = [];
  for (const file of [...pack.files].sort((left, right) =>
    left.path.localeCompare(right.path, "en"),
  )) {
    const bytes = await readPackSource(repositoryRoot, file);
    entries.push(
      `${file.path}\0${bytes.length}\0${createHash("sha256").update(bytes).digest("hex")}\n`,
    );
  }
  return createHash("sha256").update(entries.join(""), "utf8").digest("hex");
}

const firstFiles = normalizedFiles(first);
const secondFiles = normalizedFiles(second);
if (JSON.stringify(firstFiles) !== JSON.stringify(secondFiles))
  throw new Error("RELEASE_PACKAGE_FILE_LIST_NONDETERMINISTIC");
const [firstFingerprint, secondFingerprint] = await Promise.all([
  canonicalFingerprint(first),
  canonicalFingerprint(second),
]);
if (firstFingerprint !== secondFingerprint)
  throw new Error("RELEASE_PACKAGE_CONTENT_NONDETERMINISTIC");

const required = [
  "README.md",
  "QUICK_START.md",
  "ENVIRONMENT.md",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "LICENSES/Apache-2.0.txt",
  "release/RELEASE_PACKAGE_MANIFEST.json",
  "plugins/content-ops-studio/.codex-plugin/plugin.json",
  "plugins/content-ops-studio/.mcp.json",
  "plugins/content-ops-studio/runtime/dist/content-ops-mcp.mjs",
  "plugins/content-ops-studio/schemas/1.0/schema-catalog.json",
  "packages/contracts/src/generated/1.0/index.ts",
];
for (const file of required)
  if (!firstFiles.includes(file)) throw new Error(`RELEASE_FILE_MISSING:${file}`);
const forbidden = firstFiles.filter(
  (file) =>
    file.includes("node_modules/") ||
    file.startsWith("reports/") ||
    file.startsWith("tests/") ||
    file.startsWith("scripts/") ||
    file.startsWith("release/artifacts/") ||
    file.includes("playwright-browsers") ||
    file === ".env" ||
    file.endsWith(".log"),
);
if (forbidden.length) throw new Error(`RELEASE_FORBIDDEN_FILES:${forbidden.join(",")}`);

const firstArchive = path.isAbsolute(first.filename)
  ? first.filename
  : path.join(firstDirectory, first.filename);
const secondArchive = path.isAbsolute(second.filename)
  ? second.filename
  : path.join(secondDirectory, second.filename);
const [firstBytes, secondBytes] = await Promise.all([
  readFile(firstArchive),
  readFile(secondArchive),
]);
const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const artifactDirectory = path.join(repositoryRoot, "release", "artifacts");
await mkdir(artifactDirectory, { recursive: true, mode: 0o700 });
const artifactFilename = path.basename(first.filename);
const artifactPath = path.join(artifactDirectory, artifactFilename);
await copyFile(firstArchive, artifactPath);
const metadata = await stat(artifactPath);
const schemaCount = firstFiles.filter((file) => file.endsWith(".schema.json")).length;
const generatedTypeCount = firstFiles.filter(
  (file) => file.startsWith("packages/contracts/src/generated/") && file.endsWith(".ts"),
).length;
const skillCount = firstFiles.filter((file) => /\/skills\/[^/]+\/SKILL\.md$/.test(file)).length;
const inspection = {
  status: "PASSED",
  product: packageJson.name,
  version: packageJson.version,
  artifact_filename: artifactFilename,
  packed_file_count: firstFiles.length,
  package_size_bytes: metadata.size,
  package_sha256: sha256(firstBytes),
  canonical_content_fingerprint: firstFingerprint,
  repeated_pack_file_list_match: true,
  repeated_pack_content_match: true,
  repeated_pack_byte_match: firstBytes.equals(secondBytes),
  repeated_pack_second_sha256: sha256(secondBytes),
  strict_schema_count: schemaCount,
  generated_typescript_count: generatedTypeCount,
  skill_count: skillCount,
  required_files_present: required.length,
  forbidden_files: 0,
};
await mkdir(path.join(repositoryRoot, "reports", "verification"), { recursive: true });
await writeFile(
  path.join(repositoryRoot, "reports/verification/stage-11-pack-inspection.json"),
  `${JSON.stringify(inspection, null, 2)}\n`,
  { mode: 0o644 },
);
const releaseManifest = {
  release_manifest_version: "1.0.0",
  product: packageJson.name,
  version: packageJson.version,
  commit_sha: null,
  package_filename: artifactFilename,
  package_sha256: inspection.package_sha256,
  canonical_package_fingerprint: firstFingerprint,
  node_requirement: packageJson.engines.node,
  pnpm_version: "11.19.0",
  tool_count: 72,
  skill_count: skillCount,
  schema_count: schemaCount,
  generated_typescript_count: generatedTypeCount,
  test_count: 489,
  release_date: "2026-08-27",
  license: packageJson.license,
  source_tag: "v0.2.0",
  known_limitations: [
    "Feishu final metadata sync is PARTIAL.",
    "Feishu attachment upload is DEFERRED.",
    "Public HTTP MCP and automatic publishing are not included.",
    "Host ImageGen and pinned local Chromium are external capabilities.",
  ],
  clean_install_status: "PENDING",
  installed_e2e_status: "PENDING",
  image_production_skill_v1: "PRODUCTION_READY / FROZEN_FOR_V1",
};
await writeFile(
  path.join(repositoryRoot, "release/RELEASE_MANIFEST.json"),
  `${JSON.stringify(releaseManifest, null, 2)}\n`,
  { mode: 0o644 },
);
console.log(JSON.stringify(inspection));
