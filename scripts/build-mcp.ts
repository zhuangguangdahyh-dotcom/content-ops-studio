import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";

export const MCP_BUNDLE = path.resolve(
  "plugins/content-ops-studio/runtime/dist/content-ops-mcp.mjs",
);

export async function buildMcp(outfile = MCP_BUNDLE): Promise<void> {
  await mkdir(path.dirname(outfile), { recursive: true });
  const runtimeRoot = path.dirname(path.dirname(outfile));
  const playwrightRoot = path.resolve("packages/renderer/node_modules/playwright-core");
  await Promise.all([
    copyFile(path.join(playwrightRoot, "package.json"), path.join(runtimeRoot, "package.json")),
    copyFile(path.join(playwrightRoot, "browsers.json"), path.join(runtimeRoot, "browsers.json")),
  ]);
  await build({
    entryPoints: [path.resolve("services/content-ops-mcp/src/stdio.ts")],
    outfile,
    bundle: true,
    packages: "bundle",
    // Playwright's pre-bundled optional platform/BiDi branches retain guarded
    // dynamic requires. The first-page Chromium path does not execute them;
    // leaving only those guarded specifiers external avoids embedding a native
    // fsevents binary or requiring chromium-bidi in the installed Plugin.
    external: ["fsevents", "chromium-bidi/*"],
    platform: "node",
    format: "esm",
    target: "node24",
    sourcemap: false,
    legalComments: "none",
    charset: "utf8",
    treeShaking: true,
    banner: {
      js: 'import { createRequire as __contentOpsCreateRequire } from "node:module"; import { dirname as __contentOpsDirname } from "node:path"; import { fileURLToPath as __contentOpsFileURLToPath } from "node:url"; const require = __contentOpsCreateRequire(import.meta.url); const __filename = __contentOpsFileURLToPath(import.meta.url); const __dirname = __contentOpsDirname(__filename);',
    },
    logLevel: "silent",
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  await buildMcp();
  process.stdout.write(`${MCP_BUNDLE}\n`);
}
