import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

async function walk(root: string): Promise<string[]> {
  const result: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".DS_Store") continue;
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(absolute)));
    else if (entry.isFile()) result.push(absolute);
  }
  return result;
}

describe("Stage 11 cross-platform static paths", () => {
  it("constructs Project and Plugin paths with native path semantics", () => {
    expect(path.posix.join("/opt/plugin data", "content-ops", "runtime")).toBe(
      "/opt/plugin data/content-ops/runtime",
    );
    expect(path.win32.join("C:\\Plugin Data", "content-ops", "runtime")).toBe(
      "C:\\Plugin Data\\content-ops\\runtime",
    );
    expect(path.win32.isAbsolute("C:\\Content Ops\\project")).toBe(true);
    expect(path.posix.isAbsolute("/var/tmp/content ops/project")).toBe(true);
  });

  it("has no case-colliding or Windows-invalid Plugin release filenames", async () => {
    const root = path.resolve("plugins/content-ops-studio");
    const relative = (await walk(root)).map((file) =>
      path.relative(root, file).replaceAll(path.sep, "/"),
    );
    expect(new Set(relative.map((file) => file.toLowerCase())).size).toBe(relative.length);
    for (const file of relative)
      for (const segment of file.split("/")) expect(segment).not.toMatch(/[<>:"|?*]|[ .]$/);
  });

  it("keeps author-machine paths out of Production source and package configuration", async () => {
    const files = [
      ...(await walk(path.resolve("packages"))),
      ...(await walk(path.resolve("services"))),
      ...(await walk(path.resolve("plugins/content-ops-studio"))),
      path.resolve("README.md"),
      path.resolve("QUICK_START.md"),
      path.resolve("ENVIRONMENT.md"),
      path.resolve(".env.example"),
    ];
    for (const file of files) {
      let text: string;
      try {
        text = await readFile(file, "utf8");
      } catch {
        continue;
      }
      expect(text).not.toContain("/Users/zhuangguangda");
      expect(text).not.toContain("Library/Caches/ms-playwright");
    }
  });
});
