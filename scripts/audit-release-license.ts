import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const firstPartyPackages = [
  "package.json",
  "packages/cli/package.json",
  "packages/contracts/package.json",
  "packages/core/package.json",
  "packages/image-adapters/package.json",
  "packages/renderer/package.json",
  "packages/research-adapters/package.json",
  "packages/runtime/package.json",
  "packages/test-support/package.json",
  "packages/workspace-adapters/package.json",
  "services/content-ops-mcp/package.json",
];

for (const relative of firstPartyPackages) {
  const value = JSON.parse(await readFile(path.join(repositoryRoot, relative), "utf8")) as {
    license?: string;
  };
  if (value.license !== "MIT") throw new Error(`RELEASE_LICENSE_DRIFT:${relative}`);
}

const releasePackageManifest = JSON.parse(
  await readFile(path.join(repositoryRoot, "release/RELEASE_PACKAGE_MANIFEST.json"), "utf8"),
) as { license?: string };
if (releasePackageManifest.license !== "MIT")
  throw new Error("RELEASE_LICENSE_DRIFT:release/RELEASE_PACKAGE_MANIFEST.json");

const vendoredRuntime = JSON.parse(
  await readFile(
    path.join(repositoryRoot, "plugins/content-ops-studio/runtime/package.json"),
    "utf8",
  ),
) as { name?: string; license?: string };
if (vendoredRuntime.name !== "playwright-core" || vendoredRuntime.license !== "Apache-2.0")
  throw new Error("THIRD_PARTY_LICENSE_DRIFT:playwright-core");

const required = [
  "LICENSE",
  "LICENSE-DECISION.md",
  "THIRD_PARTY_NOTICES.md",
  "LICENSES/Apache-2.0.txt",
];
await Promise.all(required.map((relative) => access(path.join(repositoryRoot, relative))));
const license = await readFile(path.join(repositoryRoot, "LICENSE"), "utf8");
if (!license.includes("MIT License") || !license.includes("2026 zhuangguangdahyh-dotcom"))
  throw new Error("MIT_LICENSE_TEXT_INVALID");

console.log(
  JSON.stringify({
    status: "PASSED",
    first_party_license: "MIT",
    first_party_package_count: firstPartyPackages.length,
    third_party_runtime_license: "Apache-2.0",
    required_notice_files: required.length,
  }),
);
