import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { findDuplicateStatusCodes } from "../../packages/core/src/index.js";

describe("status map", () => {
  it("contains no duplicate internal codes", async () => {
    const config = JSON.parse(
      await readFile(path.resolve("plugins/content-ops-studio/config/status-map.json"), "utf8"),
    ) as { groups: Record<string, Record<string, string>> };
    expect(findDuplicateStatusCodes(config.groups)).toEqual([]);
  });
});
