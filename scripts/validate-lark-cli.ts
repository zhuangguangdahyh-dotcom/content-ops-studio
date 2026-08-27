import { readFile } from "node:fs/promises";
import path from "node:path";

const config = JSON.parse(
  await readFile(path.resolve("plugins/content-ops-studio/config/lark-cli-support.json"), "utf8"),
) as Record<string, unknown>;
const versionPolicy = config.version_policy as Record<string, unknown> | undefined;
if (config.package !== "@larksuite/cli" || versionPolicy?.tested !== "1.0.63")
  throw new Error("Lark CLI support policy is missing the exact official tested version.");
const extensions = config.extensions as Record<string, unknown> | undefined;
if (!Array.isArray(extensions?.skills) || !Array.isArray(config.allowed_commands))
  throw new Error("Lark CLI capability and allowlist declarations are incomplete.");
const serialized = JSON.stringify(config);
if (/app[_-]?secret|access[_-]?token|authorization/i.test(serialized))
  throw new Error("Lark CLI support policy contains a forbidden credential field.");
process.stdout.write("Official Lark CLI support policy passed.\n");
