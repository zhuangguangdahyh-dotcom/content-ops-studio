import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { compileFromFile } from "json-schema-to-typescript";
import { loadSchemaCatalog, SCHEMA_ROOT } from "../../packages/contracts/src/schema-catalog.js";

export const GENERATED_ROOT = path.resolve("packages/contracts/src/generated/1.0");
const HEADER = `/*\n * AUTO-GENERATED FILE.\n * DO NOT EDIT DIRECTLY.\n * Modify the source JSON Schema instead.\n */`;

function typeName(logicalName: string): string {
  return logicalName
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join("");
}

function resolvePointer(root: unknown, pointer: string): unknown {
  if (!pointer || pointer === "#") return root;
  return pointer
    .replace(/^#\//, "")
    .split("/")
    .map((part) => part.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce<unknown>((value, part) => {
      if (!value || typeof value !== "object")
        throw new Error(`Unresolved JSON pointer ${pointer}.`);
      return (value as Record<string, unknown>)[part];
    }, root);
}

export function dereferenceForTypeCompiler(
  value: unknown,
  currentFile: string,
  sources: Map<string, Record<string, unknown>>,
  stack: string[] = [],
): unknown {
  if (Array.isArray(value))
    return value.map((child) => dereferenceForTypeCompiler(child, currentFile, sources, stack));
  if (!value || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  if (typeof record.$ref === "string") {
    const [filePart, fragment = ""] = record.$ref.split("#");
    const targetFile = filePart || currentFile;
    const targetRoot = sources.get(targetFile);
    if (!targetRoot) throw new Error(`Unresolved schema file ${targetFile} from ${currentFile}.`);
    const key = `${targetFile}#${fragment}`;
    if (stack.includes(key)) throw new Error(`Circular schema reference in type compiler: ${key}.`);
    const resolved = dereferenceForTypeCompiler(
      resolvePointer(targetRoot, fragment ? `#${fragment}` : "#"),
      targetFile,
      sources,
      [...stack, key],
    ) as Record<string, unknown>;
    const siblings = Object.fromEntries(Object.entries(record).filter(([key]) => key !== "$ref"));
    return {
      ...resolved,
      ...(dereferenceForTypeCompiler(siblings, currentFile, sources, stack) as Record<
        string,
        unknown
      >),
    };
  }
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(record)) {
    if (["$schema", "$id", "$comment", "$defs", "title"].includes(key)) continue;
    output[key] = dereferenceForTypeCompiler(child, currentFile, sources, stack);
  }
  return output;
}

export async function renderGeneratedContracts(outputRoot: string): Promise<string[]> {
  const catalog = await loadSchemaCatalog();
  const entries = catalog.entries.filter((entry) => entry.status === "implemented");
  const files: string[] = [];
  const compilerRoot = await mkdtemp(path.join(os.tmpdir(), "content-ops-schema-compiler-"));
  await mkdir(outputRoot, { recursive: true });
  try {
    const sources = new Map<string, Record<string, unknown>>();
    for (const entry of entries) {
      if (!entry.file) throw new Error(`Implemented schema ${entry.logicalName} has no file.`);
      const source = JSON.parse(
        await readFile(path.join(SCHEMA_ROOT, entry.file), "utf8"),
      ) as Record<string, unknown>;
      sources.set(entry.file, source);
    }
    for (const entry of entries) {
      if (!entry.file) throw new Error(`Implemented schema ${entry.logicalName} has no file.`);
      const adapted = dereferenceForTypeCompiler(
        sources.get(entry.file),
        entry.file,
        sources,
      ) as Record<string, unknown>;
      adapted.title = typeName(entry.logicalName);
      await writeFile(path.join(compilerRoot, entry.file), JSON.stringify(adapted), "utf8");
    }
    for (const entry of entries) {
      if (!entry.file) throw new Error(`Implemented schema ${entry.logicalName} has no file.`);
      const output = await compileFromFile(path.join(compilerRoot, entry.file), {
        cwd: compilerRoot,
        bannerComment: HEADER,
        style: {
          printWidth: 100,
          singleQuote: false,
          semi: true,
          tabWidth: 2,
          trailingComma: "all",
        },
        unreachableDefinitions: false,
      });
      const filename = `${entry.logicalName}.ts`;
      await writeFile(path.join(outputRoot, filename), output, "utf8");
      files.push(filename);
    }
  } finally {
    await rm(compilerRoot, { recursive: true, force: true });
  }
  const index = `${HEADER}\n\n${entries
    .map(
      (entry) => `export type { ${typeName(entry.logicalName)} } from "./${entry.logicalName}.js";`,
    )
    .join("\n")}\n`;
  await writeFile(path.join(outputRoot, "index.ts"), index, "utf8");
  return [...files, "index.ts"].sort();
}

export async function checkGeneratedContracts(): Promise<void> {
  const temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "content-ops-contracts-"));
  try {
    const expected = await renderGeneratedContracts(temporaryRoot);
    const actual = (await readdir(GENERATED_ROOT)).filter((file) => file.endsWith(".ts")).sort();
    const missing = expected.filter((file) => !actual.includes(file));
    const extra = actual.filter((file) => !expected.includes(file));
    const stale: string[] = [];
    for (const file of expected.filter((candidate) => actual.includes(candidate))) {
      const [expectedText, actualText] = await Promise.all([
        readFile(path.join(temporaryRoot, file), "utf8"),
        readFile(path.join(GENERATED_ROOT, file), "utf8"),
      ]);
      if (expectedText !== actualText) stale.push(file);
    }
    if (missing.length || extra.length || stale.length) {
      throw new Error(
        `Generated contracts are not fresh. missing=[${missing.join(",")}] extra=[${extra.join(",")}] stale=[${stale.join(",")}].`,
      );
    }
  } finally {
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}
