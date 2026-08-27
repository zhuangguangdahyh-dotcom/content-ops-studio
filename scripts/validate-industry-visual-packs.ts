import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const root = path.resolve("plugins/content-ops-studio/packs/visual-industries");
const overlaysRoot = path.resolve("plugins/content-ops-studio/packs/visual-overlays");
const registry = await loadSchemaRegistry();
const directories = (await readdir(root, { withFileTypes: true })).filter((entry) =>
  entry.isDirectory(),
);
if (directories.length !== 7)
  throw new Error(`Expected 7 Industry Visual Packs, found ${directories.length}.`);
const packIds = new Set<string>();
for (const directory of directories) {
  const value = JSON.parse(
    await readFile(path.join(root, directory.name, "pack.json"), "utf8"),
  ) as Record<string, unknown>;
  registry.assertValid(
    "https://content-ops-studio.local/schemas/1.0/industry-visual-pack.schema.json",
    value,
  );
  if (value.contains_customer_assets !== false)
    throw new Error(`${directory.name} contains customer assets.`);
  packIds.add(String(value.pack_id));
}
if (packIds.size !== 7) throw new Error("Industry Visual Pack IDs are not unique.");
const overlays = (await readdir(overlaysRoot)).filter((file) => file.endsWith(".json"));
if (overlays.length !== 7) throw new Error(`Expected 7 overlays, found ${overlays.length}.`);
for (const file of overlays) {
  const value = JSON.parse(await readFile(path.join(overlaysRoot, file), "utf8")) as Record<
    string,
    unknown
  >;
  if (
    !/^([A-Z]+_?)+$/u.test(String(value.overlay_id)) ||
    !/^[0-9]+\.[0-9]+\.[0-9]+$/u.test(String(value.overlay_version))
  )
    throw new Error(`Invalid overlay ${file}.`);
  if (!Array.isArray(value.hard_blocks) || !Array.isArray(value.quality_checks))
    throw new Error(`Overlay ${file} is incomplete.`);
}
console.log(
  `Validated ${directories.length} Industry Visual Packs and ${overlays.length} overlays.`,
);
