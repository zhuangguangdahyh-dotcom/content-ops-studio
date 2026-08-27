import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { HostNativeImageGenerationBridge } from "../../packages/image-adapters/src/index.js";

const at = "2099-01-01T01:02:03.000Z";
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), Buffer.alloc(24, 1)]);

describe("Host-native ImageGen bridge", () => {
  it("materializes a real local image, hashes it and persists a verified manifest", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "imagegen-bridge-"));
    const source = path.join(root, "host.png");
    await writeFile(source, png);
    const projectHome = path.join(root, "project-home");
    const bridge = new HostNativeImageGenerationBridge();
    const request = bridge.createRequest({
      generation_id: "GEN-DEMO-A",
      project_id: "PRJ-DEMO-001",
      content_id: "C-0001",
      candidate_id: "VDC-C-0001-A",
      purpose: "DIRECTION_CANDIDATE",
      prompt: "Text-free abstract professional editorial visual.",
      negative_constraints: ["No readable text"],
      requested_mime_type: "image/png",
      requested_width: 1242,
      requested_height: 1660,
      destination_relative_path: "projects/demo/candidates/a.png",
      formal_text_policy: "RENDERER_ONLY",
      run_id: "RUN-DEMO-001",
      requested_at: at,
    });
    const result = await bridge.acceptSubmission({
      request,
      projectHome,
      submission: {
        submission_id: "HGAS-DEMO-A",
        generation_id: request.generation_id,
        project_id: request.project_id,
        content_id: request.content_id,
        candidate_id: request.candidate_id,
        source_kind: "LOCAL_FILE",
        source_path: source,
        temporary_url: null,
        declared_mime_type: "image/png",
        expected_role: "DIRECTION_CANDIDATE",
        host_provider: "CODEX_HOST_IMAGEGEN",
        host_model: null,
        run_id: request.run_id,
        submitted_at: at,
      },
    });
    expect(result.asset.checksum).toMatch(/^[a-f0-9]{64}$/);
    expect(await readFile(path.join(projectHome, result.asset.relative_path))).toEqual(png);
    expect(
      JSON.parse(await readFile(path.join(projectHome, result.manifest_path), "utf8")),
    ).toMatchObject({ status: "GENERATION_SUCCESS", model: null });
  });
  it("rejects missing files and formal text outside Renderer", async () => {
    const bridge = new HostNativeImageGenerationBridge();
    expect(() =>
      bridge.createRequest({
        generation_id: "GEN-DEMO-A",
        project_id: "PRJ-DEMO-001",
        content_id: "C-0001",
        candidate_id: null,
        purpose: "DIRECTION_CANDIDATE",
        prompt: "visual",
        negative_constraints: [],
        requested_mime_type: "image/png",
        requested_width: 1,
        requested_height: 1,
        destination_relative_path: "asset.png",
        formal_text_policy: "HOST_GENERATED" as never,
        run_id: "RUN-DEMO-001",
        requested_at: at,
      }),
    ).toThrow(/RENDERER_ONLY/);
    await expect(
      bridge.submissionValidator.validate({
        submission_id: "HGAS-A",
        generation_id: "GEN-A",
        project_id: "PRJ-DEMO-001",
        content_id: "C-0001",
        candidate_id: null,
        source_kind: "LOCAL_FILE",
        source_path: "/not/a/real/image.png",
        temporary_url: null,
        declared_mime_type: "image/png",
        expected_role: "DIRECTION_CANDIDATE",
        host_provider: "HOST",
        host_model: null,
        run_id: "RUN-DEMO-001",
        submitted_at: at,
      }),
    ).rejects.toThrow("HOST_IMAGE_ASSET_UNMATERIALIZABLE");
  });
});
