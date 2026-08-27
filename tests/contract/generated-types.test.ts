import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { checkGeneratedContracts } from "../../scripts/lib/contracts-generation.js";
import { loadSchemaCatalog } from "../../packages/contracts/src/schema-catalog.js";

const generatedRoot = path.resolve("packages/contracts/src/generated/1.0");

describe("generated TypeScript contracts", () => {
  it("contains one declaration per implemented contract plus the index", async () => {
    const files = (await readdir(generatedRoot)).filter((file) => file.endsWith(".ts")).sort();
    const catalog = await loadSchemaCatalog();
    expect(files).toHaveLength(
      catalog.entries.filter((entry) => entry.status === "implemented").length + 1,
    );
    for (const file of files) {
      const content = await readFile(path.join(generatedRoot, file), "utf8");
      expect(content).toContain("AUTO-GENERATED FILE.");
      expect(content).toContain("DO NOT EDIT DIRECTLY.");
      expect(content).toContain("Modify the source JSON Schema instead.");
    }
  });

  it("is deterministic and fresh without modifying the working tree", async () => {
    await expect(checkGeneratedContracts()).resolves.toBeUndefined();
  });
});
