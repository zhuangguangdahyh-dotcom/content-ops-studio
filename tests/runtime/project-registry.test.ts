import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import type { ProjectRegistry } from "../../packages/contracts/src/generated/1.0/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";
import { ProjectRegistryStore } from "../../packages/runtime/src/project-registry/index.js";
import { initializeProjectHome } from "../../packages/runtime/src/project-home/index.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function setup() {
  const home = await mkdtemp(path.join(os.tmpdir(), "content-ops-registry-"));
  roots.push(home);
  await initializeProjectHome(home);
  const schemas = await loadSchemaRegistry(path.resolve("plugins/content-ops-studio/schemas/1.0"));
  return new ProjectRegistryStore(home, schemas, () => "2099-01-01T00:00:00.000Z");
}

function entry(id: string, name = "Fictional Project"): ProjectRegistry {
  return {
    project_id: id,
    display_name: name,
    subject_name: "Fictional Subject",
    project_root: `projects/${name.replaceAll(" ", "-")}__${id}`,
    project_status: "PROJECT_INITIALIZING",
    last_active_at: "2099-01-01T00:00:00.000Z",
    schema_version: "1.0.0",
    connection_status: "NOT_CONFIGURED",
    latest_run_id: null,
    created_at: "2099-01-01T00:00:00.000Z",
    updated_at: "2099-01-01T00:00:00.000Z",
  };
}

describe("ProjectRegistryStore", () => {
  it("atomically registers, replays, finds, and verifies projects", async () => {
    const store = await setup();
    const first = await store.upsertProject(entry("PRJ-20990101-R001"), "CREATE:R001");
    expect(first.replayed).toBe(false);
    expect((await store.upsertProject(entry("PRJ-20990101-R001"), "CREATE:R001")).replayed).toBe(
      true,
    );
    await store.upsertProject(entry("PRJ-20990101-R002"), "CREATE:R002");
    expect(await store.findProjectById("PRJ-20990101-R001")).not.toBeNull();
    expect(await store.findProjectsByName("Fictional Project")).toHaveLength(2);
    expect((await store.verifyRegistry()).entry_count).toBe(2);
    expect(await readFile(store.file, "utf8")).toContain("PRJ-20990101-R001");
  });

  it("rejects an idempotency conflict and corrupted or secret-bearing registry", async () => {
    const store = await setup();
    await store.upsertProject(entry("PRJ-20990101-R003"), "CREATE:R003");
    await expect(
      store.upsertProject(entry("PRJ-20990101-R003", "Changed"), "CREATE:R003"),
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
    await writeFile(store.file, "{not-json\n");
    await expect(store.readRegistry()).rejects.toMatchObject({ code: "REGISTRY_CORRUPTION" });
    await writeFile(
      store.file,
      JSON.stringify({
        schema_version: "1.0.0",
        entries: [],
        idempotency: {},
        last_active_project_id: null,
        updated_at: "2099-01-01T00:00:00.000Z",
        api_secret: "forbidden-fixture-value",
      }),
    );
    await expect(store.readRegistry()).rejects.toMatchObject({ code: "REGISTRY_SECRET_FORBIDDEN" });
  });
});
