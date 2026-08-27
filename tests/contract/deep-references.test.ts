import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  dereferenceForTypeCompiler,
  renderGeneratedContracts,
} from "../../scripts/lib/contracts-generation.js";

describe("Draft 2020-12 type-generation compatibility view", () => {
  it("dereferences three levels, arrays, oneOf, anyOf and repeated common definitions", () => {
    const root: Record<string, unknown> = {
      type: "object",
      properties: {
        items: { type: "array", items: { $ref: "b.json#/$defs/middle" } },
        choice: {
          oneOf: [
            { $ref: "c.json#/$defs/asset" },
            { anyOf: [{ $ref: "c.json#/$defs/check" }, { type: "null" }] },
          ],
        },
      },
    };
    const middle: Record<string, unknown> = {
      $defs: {
        middle: {
          type: "object",
          properties: {
            asset: { $ref: "c.json#/$defs/asset" },
            repeated: { $ref: "c.json#/$defs/asset" },
            binding: { $ref: "c.json#/$defs/binding" },
          },
        },
      },
    };
    const common: Record<string, unknown> = {
      $defs: {
        asset: { type: "object", properties: { checksum: { type: "string" } } },
        check: { type: "object", properties: { status: { enum: ["PASS", "FAIL"] } } },
        binding: {
          type: "object",
          properties: { content_version: { type: "string" } },
        },
      },
    };
    const sources = new Map<string, Record<string, unknown>>([
      ["a.json", root],
      ["b.json", middle],
      ["c.json", common],
    ]);
    const result = dereferenceForTypeCompiler(root, "a.json", sources);
    const serialized = JSON.stringify(result);
    expect(serialized.match(/checksum/g)).toHaveLength(3);
    expect(serialized).toContain("content_version");
    expect(serialized).toContain("oneOf");
    expect(serialized).toContain("anyOf");
  });

  it("detects circular references with an explicit error instead of expanding forever", () => {
    const cycle: Record<string, unknown> = {
      $defs: {
        node: {
          type: "object",
          properties: { child: { $ref: "cycle.json#/$defs/node" } },
        },
      },
      $ref: "#/$defs/node",
    };
    const sources = new Map<string, Record<string, unknown>>([["cycle.json", cycle]]);
    expect(() => dereferenceForTypeCompiler(cycle, "cycle.json", sources)).toThrow(
      /Circular schema reference/,
    );
  });

  it("is deterministic and never mutates canonical Schema source", async () => {
    const schemaPath = path.resolve(
      "plugins/content-ops-studio/schemas/1.0/common-definitions.schema.json",
    );
    const before = await readFile(schemaPath, "utf8");
    const first = await mkdtemp(path.join(os.tmpdir(), "contracts-deep-a-"));
    const second = await mkdtemp(path.join(os.tmpdir(), "contracts-deep-b-"));
    const firstFiles = await renderGeneratedContracts(first);
    const secondFiles = await renderGeneratedContracts(second);
    expect(firstFiles).toEqual(secondFiles);
    expect(await readFile(path.join(first, "style-lock.ts"), "utf8")).toBe(
      await readFile(path.join(second, "style-lock.ts"), "utf8"),
    );
    expect(await readFile(schemaPath, "utf8")).toBe(before);
  });
});
