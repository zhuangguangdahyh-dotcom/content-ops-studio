import { mkdtemp, readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  ImageProductionRuntime,
  ProjectVisualLearningRuntime,
} from "../../packages/runtime/src/image-production/index.js";

describe("Image Production Runtime", () => {
  it("writes validated artifacts only under Project Home and reads them back", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "image-production-runtime-"));
    const runtime = new ImageProductionRuntime({
      projectHome: home,
      projectId: "PRJ-20990101-DEMO",
      runId: "RUN-20990101-DEMO",
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const fixture = JSON.parse(
      await readFile(
        "tests/fixtures/contracts/1.0/image-production-context/valid/complete.json",
        "utf8",
      ),
    ) as unknown;
    const file = await runtime.write(
      "image-production-context",
      "image-production-context.json",
      fixture,
    );
    expect(file.startsWith(home)).toBe(true);
    expect(await runtime.read("image-production-context.json")).toEqual(fixture);
  });

  it("reuses an identical immutable artifact and rejects a different valid payload", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "image-production-write-once-"));
    const runtime = new ImageProductionRuntime({
      projectHome: home,
      projectId: "PRJ-20990101-DEMO",
      runId: "RUN-20990101-DEMO",
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const fixture = JSON.parse(
      await readFile(
        "tests/fixtures/contracts/1.0/image-production-context/valid/complete.json",
        "utf8",
      ),
    ) as Record<string, unknown>;
    const first = await runtime.writeOnceOrReuse(
      "image-production-context",
      "immutable-context.json",
      fixture,
    );
    const replay = await runtime.writeOnceOrReuse(
      "image-production-context",
      "immutable-context.json",
      fixture,
    );
    expect(first.reused).toBe(false);
    expect(replay).toMatchObject({ reused: true, sha256: first.sha256, path: first.path });
    await expect(
      runtime.writeOnceOrReuse("image-production-context", "immutable-context.json", {
        ...fixture,
        created_at: "2099-01-02T01:02:03.000Z",
      }),
    ).rejects.toMatchObject({ code: "IMAGE_PRODUCTION_ARTIFACT_VERSION_CONFLICT" });
  });

  it("persists immutable Profile versions and atomically advances the active version", async () => {
    const home = await mkdtemp(path.join(os.tmpdir(), "project-visual-learning-"));
    const runtime = new ProjectVisualLearningRuntime({
      projectHome: home,
      projectId: "PRJ-20990101-DEMO",
      schemaRoot: path.resolve("plugins/content-ops-studio/schemas/1.0"),
    });
    const v1 = JSON.parse(
      await readFile(
        "tests/fixtures/contracts/1.0/project-visual-profile/valid/complete.json",
        "utf8",
      ),
    ) as Record<string, unknown>;
    await runtime.writeVersion("project-visual-profile", "PVPFV-1", v1);
    await runtime.writeVersion("project-visual-profile", "PVPFV-1", v1);
    await runtime.activateProfile("PVPFV-1", v1);
    expect(await runtime.readActiveProfile()).toMatchObject({ artifact_key: "PVPFV-1" });
    await expect(
      runtime.writeVersion("project-visual-profile", "PVPFV-1", {
        ...v1,
        background_preferences: ["conflicting rewrite"],
      }),
    ).rejects.toThrow("PROJECT_VISUAL_LEARNING_VERSION_CONFLICT");
    const v2 = {
      ...v1,
      profile_version: "PVPFV-2",
      maturity: "LEARNING",
      maturity_status: "LEARNING",
      confirmed_by_operator: true,
      updated_at: "2099-01-02T01:02:03.000Z",
    };
    await runtime.writeVersion("project-visual-profile", "PVPFV-2", v2);
    await runtime.activateProfile("PVPFV-2", v2);
    expect(await runtime.readActiveProfile()).toMatchObject({
      artifact_key: "PVPFV-2",
      profile: { profile_version: "PVPFV-2" },
    });
    expect(
      await readFile(
        path.join(home, "projects/PRJ-20990101-DEMO/project-visual-learning/profiles/PVPFV-1.json"),
        "utf8",
      ),
    ).toContain('"profile_version": "PVPFV-1"');
  });
});
