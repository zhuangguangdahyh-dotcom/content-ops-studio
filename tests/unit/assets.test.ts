import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { AssetReference } from "../../packages/core/src/index.js";
import {
  InMemoryAssetStore,
  TemporaryFilesystemAssetStore,
  calculateExpectedPageFileNames,
  calculateFileSha256,
  calculateVersionedPageFileNames,
  normalizeAssetReference,
  validateChecksumFormat,
  validateAssetContentChecksum,
  validateManifestReferences,
  validateRelativeProjectPath,
} from "../../packages/core/src/index.js";

const at = "2099-01-01T01:02:03.000Z";
function factory(relativePath: string, content: Uint8Array): AssetReference {
  return {
    asset_id: `AST-${relativePath.replace(/[^A-Za-z0-9]/g, "-").toUpperCase()}`,
    asset_role: "PROMPT_ARTIFACT",
    asset_type: "TEXT",
    mime_type: "TEXT/PLAIN",
    relative_path: relativePath,
    source_type: "MOCK",
    source_adapter: "test",
    source_run_id: "RUN-20990101-010203-DEMO",
    source_generation_id: null,
    version: 1,
    width: null,
    height: null,
    file_size: content.byteLength,
    checksum: calculateFileSha256(content).toUpperCase(),
    created_at: at,
    extensions: {},
  };
}

describe("asset contracts", () => {
  it("rejects absolute paths, Windows paths, file URIs, and traversal", () => {
    for (const unsafe of [
      "/Users/demo/file.png",
      "C:\\demo\\file.png",
      "file:///tmp/a.png",
      "projects/demo/../escape.png",
      "..\\escape.png",
    ])
      expect(validateRelativeProjectPath(unsafe).valid, unsafe).toBe(false);
    expect(validateRelativeProjectPath("projects/demo/final/01-cover.png").valid).toBe(true);
  });

  it("calculates lowercase SHA-256 and validates its format", () => {
    const checksum = calculateFileSha256("fictional");
    expect(checksum).toHaveLength(64);
    expect(validateChecksumFormat(checksum).valid).toBe(true);
    expect(validateChecksumFormat("ABC").issues[0]?.code).toBe("CHECKSUM_FORMAT_INVALID");
    expect(validateAssetContentChecksum({ checksum }, "fictional").valid).toBe(true);
    expect(validateAssetContentChecksum({ checksum }, "changed").issues[0]?.code).toBe(
      "CHECKSUM_CONTENT_MISMATCH",
    );
  });

  it("calculates deterministic formal and versioned filenames", () => {
    expect(calculateExpectedPageFileNames(4)).toEqual([
      "01-cover.png",
      "02.png",
      "03.png",
      "04.png",
    ]);
    expect(calculateVersionedPageFileNames(2, 3)).toEqual(["01-cover_v003.png", "02_v003.png"]);
  });

  it("normalizes separators, MIME and checksum without changing identity", () => {
    const normalized = normalizeAssetReference(
      factory("projects\\demo\\prompt.txt", new Uint8Array([1])),
    );
    expect(normalized.relative_path).toBe("projects/demo/prompt.txt");
    expect(normalized.mime_type).toBe("text/plain");
    expect(normalized.checksum).toMatch(/^[a-f0-9]{64}$/);
  });

  it("stores in memory without overwriting existing paths", async () => {
    const store = new InMemoryAssetStore(factory);
    const content = new Uint8Array([1, 2, 3]);
    await expect(store.write("projects/demo/a.txt", content)).resolves.toMatchObject({
      file_size: 3,
    });
    await expect(store.read("projects/demo/a.txt")).resolves.toEqual(content);
    await expect(store.write("projects/demo/a.txt", content)).rejects.toThrow(
      /ASSET_ALREADY_EXISTS/,
    );
  });

  it("writes only under a caller-supplied temporary root and refuses overwrite", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-assets-"));
    const store = new TemporaryFilesystemAssetStore(root, factory);
    await store.write("run/demo.txt", new Uint8Array([4, 5]));
    await expect(store.exists("run/demo.txt")).resolves.toBe(true);
    await expect(store.write("run/demo.txt", new Uint8Array([6]))).rejects.toMatchObject({
      code: "EEXIST",
    });
    await expect(store.write("../escape.txt", new Uint8Array([6]))).rejects.toThrow(
      /ASSET_PATH_TRAVERSAL/,
    );
  });

  it("detects references to missing manifests", () => {
    expect(validateManifestReferences(["GEN-1", "GEN-2"], new Set(["GEN-1"])).issues).toEqual([
      expect.objectContaining({ code: "MANIFEST_REFERENCE_MISSING" }),
    ]);
  });
});
