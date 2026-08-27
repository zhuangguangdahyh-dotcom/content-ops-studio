import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  GenerationManifest,
  PageVisualPlan,
  StyleLock,
} from "../../contracts/src/generated/1.0/index.js";

export type ImageAssetReference = StyleLock["source_first_page_asset"];
export type RequestedOutput = GenerationManifest["requested_output"];

export interface ImageAdapterCapabilities {
  implementationStatus: "MOCK_ONLY" | "PROMPT_ONLY";
  networkAccess: false;
  producesImageBytes: false;
  supportsCancellation: boolean;
}

export interface ImageGenerationRequest {
  page_visual_plan: PageVisualPlan;
  style_lock: StyleLock | null;
  reference_assets: ImageAssetReference[];
  generation_constraints: string[];
  requested_output: RequestedOutput;
  run_context: { run_id: string; generation_id: string; requested_at: string };
}

export interface ImageGenerationResponse {
  generation_manifest: GenerationManifest;
  asset_references: ImageAssetReference[];
  prompt_artifact: string | null;
  capability_warnings: string[];
  errors: Array<{ code: string; message: string }>;
}

export interface ImageGenerationAdapter {
  probeCapabilities(): Promise<ImageAdapterCapabilities>;
  validateRequest(
    request: ImageGenerationRequest,
  ): Promise<Array<{ code: string; message: string }>>;
  generateAsset(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  regenerateAsset(
    request: ImageGenerationRequest,
    previousGenerationId: string,
  ): Promise<ImageGenerationResponse>;
  inspectResult(response: ImageGenerationResponse): Promise<{ valid: boolean; warnings: string[] }>;
  cancelRequest(generationId: string): Promise<{ cancelled: boolean; generation_id: string }>;
}

function pendingManifest(
  request: ImageGenerationRequest,
  adapter: string,
  prompt: string,
): GenerationManifest {
  const plan = request.page_visual_plan;
  return {
    generation_id: request.run_context.generation_id,
    project_id: plan.project_id,
    content_id: plan.content_id,
    page_number: plan.page_number,
    content_version: plan.content_version,
    copy_version: plan.copy_version,
    visual_plan_version: plan.visual_plan_version,
    style_lock_version: request.style_lock?.style_lock_version ?? null,
    generation_type: plan.page_number === 1 ? "FIRST_PAGE_BACKGROUND" : "PAGE_BACKGROUND",
    adapter,
    provider: { provider_name: "NONE", request_identifier: null },
    model_descriptor: { model_name: "not-executed", model_version: "not-executed" },
    input_assets: [],
    reference_assets: request.reference_assets,
    prompt_snapshot: prompt,
    negative_constraints: [...request.generation_constraints],
    requested_output: request.requested_output,
    attempts: [],
    output_assets: [],
    generation_status: "GENERATION_PENDING",
    failure_summary: null,
    warnings: ["No image bytes were generated."],
    run_id: request.run_context.run_id,
    schema_version: "1.0.0",
    started_at: request.run_context.requested_at,
    completed_at: null,
    extensions: { implementation_status: adapter === "prompt-only" ? "PROMPT_ONLY" : "MOCK_ONLY" },
  };
}

function validateBoundary(
  request: ImageGenerationRequest,
): Array<{ code: string; message: string }> {
  const errors: Array<{ code: string; message: string }> = [];
  if (request.page_visual_plan.page_number > 1 && !request.style_lock)
    errors.push({ code: "STYLE_LOCK_REQUIRED", message: "Remaining pages require Style Lock." });
  if (
    request.requested_output.relative_path.startsWith("/") ||
    request.requested_output.relative_path.includes("..")
  )
    errors.push({
      code: "ASSET_PATH_UNSAFE",
      message: "Requested output path must be project-relative.",
    });
  return errors;
}

export class MockImageGenerationAdapter implements ImageGenerationAdapter {
  async probeCapabilities(): Promise<ImageAdapterCapabilities> {
    return Promise.resolve({
      implementationStatus: "MOCK_ONLY",
      networkAccess: false,
      producesImageBytes: false,
      supportsCancellation: true,
    });
  }

  async validateRequest(request: ImageGenerationRequest) {
    return Promise.resolve(validateBoundary(request));
  }

  async generateAsset(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    return Promise.resolve({
      generation_manifest: pendingManifest(
        request,
        "mock-image-generation",
        request.page_visual_plan.background_direction,
      ),
      asset_references: [],
      prompt_artifact: null,
      capability_warnings: ["MOCK_ONLY does not create a file or claim provider success."],
      errors: validateBoundary(request),
    });
  }

  async regenerateAsset(request: ImageGenerationRequest, previousGenerationId: string) {
    const response = await this.generateAsset(request);
    response.generation_manifest.generation_type = "REGENERATION";
    response.generation_manifest.extensions = {
      ...response.generation_manifest.extensions,
      previous_generation_id: previousGenerationId,
    };
    return response;
  }

  async inspectResult(response: ImageGenerationResponse) {
    return Promise.resolve({
      valid:
        response.generation_manifest.generation_status === "GENERATION_PENDING" &&
        response.asset_references.length === 0,
      warnings: [...response.capability_warnings],
    });
  }

  async cancelRequest(generationId: string) {
    return Promise.resolve({ cancelled: true, generation_id: generationId });
  }
}

export class PromptOnlyImageGenerationAdapter extends MockImageGenerationAdapter {
  override async probeCapabilities(): Promise<ImageAdapterCapabilities> {
    return Promise.resolve({
      implementationStatus: "PROMPT_ONLY",
      networkAccess: false,
      producesImageBytes: false,
      supportsCancellation: false,
    });
  }

  override async generateAsset(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const prompt = [
      request.page_visual_plan.background_direction,
      request.page_visual_plan.composition,
      ...request.generation_constraints.map((constraint) => `Constraint: ${constraint}`),
    ].join("\n");
    return Promise.resolve({
      generation_manifest: pendingManifest(request, "prompt-only", prompt),
      asset_references: [],
      prompt_artifact: prompt,
      capability_warnings: ["Awaiting external execution; no image asset exists."],
      errors: validateBoundary(request),
    });
  }

  override async cancelRequest(generationId: string) {
    return Promise.resolve({ cancelled: false, generation_id: generationId });
  }
}

export type PromptOnlyAdapter = PromptOnlyImageGenerationAdapter;

export interface HostImageGenerationCapabilities {
  implementationStatus: "HOST_NATIVE" | "UNAVAILABLE";
  requiresApiKeyFromOperator: false;
  acceptsLocalFileSubmission: true;
  acceptsTemporaryUrlAsDurableAsset: false;
  productionMockFallback: false;
}

export interface HostImageGenerationRequest {
  generation_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string | null;
  purpose: "DIRECTION_CANDIDATE" | "FORMAL_FIRST_PAGE" | "FORMAL_INNER_PAGE";
  prompt: string;
  negative_constraints: string[];
  requested_mime_type: "image/png" | "image/jpeg" | "image/webp";
  requested_width: number;
  requested_height: number;
  destination_relative_path: string;
  formal_text_policy: "RENDERER_ONLY";
  run_id: string;
  requested_at: string;
}

export interface HostGeneratedAssetSubmissionInput {
  submission_id: string;
  generation_id: string;
  project_id: string;
  content_id: string;
  candidate_id: string | null;
  source_kind: "LOCAL_FILE";
  source_path: string;
  temporary_url: null;
  declared_mime_type: "image/png" | "image/jpeg" | "image/webp";
  expected_role: "DIRECTION_CANDIDATE" | "FORMAL_FIRST_PAGE" | "FORMAL_INNER_PAGE";
  host_provider: string;
  host_model: string | null;
  run_id: string;
  submitted_at: string;
}

export class HostImageGenerationCapabilityProbe {
  probe(hostCapabilityAvailable: boolean): HostImageGenerationCapabilities {
    return {
      implementationStatus: hostCapabilityAvailable ? "HOST_NATIVE" : "UNAVAILABLE",
      requiresApiKeyFromOperator: false,
      acceptsLocalFileSubmission: true,
      acceptsTemporaryUrlAsDurableAsset: false,
      productionMockFallback: false,
    };
  }
}

function assertSafeRelativePath(value: string): void {
  if (
    !value ||
    path.isAbsolute(value) ||
    value.includes("\0") ||
    value.split(/[\\/]/u).includes("..") ||
    /^[a-z]+:/iu.test(value)
  )
    throw new Error("ASSET_PATH_UNSAFE");
}

export class HostImageGenerationRequestValidator {
  validate(request: HostImageGenerationRequest): void {
    if (!request.prompt.trim()) throw new Error("HOST_IMAGEGEN_PROMPT_REQUIRED");
    if (request.formal_text_policy !== "RENDERER_ONLY")
      throw new Error("HOST_IMAGEGEN_FORMAL_TEXT_MUST_BE_RENDERER_ONLY");
    if (request.requested_width < 1 || request.requested_height < 1)
      throw new Error("HOST_IMAGEGEN_DIMENSIONS_INVALID");
    assertSafeRelativePath(request.destination_relative_path);
    const lowerPrompt = request.prompt.toLowerCase();
    if (lowerPrompt.includes("api key") || lowerPrompt.includes("authorization:"))
      throw new Error("HOST_IMAGEGEN_SECRET_SHAPED_INPUT_REJECTED");
  }
}

export class HostGeneratedAssetSubmissionValidator {
  async validate(submission: HostGeneratedAssetSubmissionInput): Promise<void> {
    if (submission.source_kind !== "LOCAL_FILE" || submission.temporary_url !== null)
      throw new Error("HOST_IMAGE_ASSET_UNMATERIALIZABLE");
    if (!path.isAbsolute(submission.source_path))
      throw new Error("HOST_IMAGE_SOURCE_PATH_MUST_BE_ABSOLUTE");
    const metadata = await stat(submission.source_path).catch(() => null);
    if (!metadata?.isFile() || metadata.size === 0)
      throw new Error("HOST_IMAGE_ASSET_UNMATERIALIZABLE");
  }
}

export class GeneratedAssetHasher {
  async hash(file: string): Promise<string> {
    return createHash("sha256")
      .update(await readFile(file))
      .digest("hex");
  }
}

export class GeneratedAssetInspector {
  async inspect(
    file: string,
    declaredMimeType: string,
  ): Promise<{
    valid: boolean;
    file_size: number;
    detected_mime_type: "image/png" | "image/jpeg" | "image/webp" | "unknown";
  }> {
    const bytes = await readFile(file);
    let detected: "image/png" | "image/jpeg" | "image/webp" | "unknown" = "unknown";
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])))
      detected = "image/png";
    else if (bytes[0] === 0xff && bytes[1] === 0xd8) detected = "image/jpeg";
    else if (
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    )
      detected = "image/webp";
    return {
      valid: detected === declaredMimeType,
      file_size: bytes.length,
      detected_mime_type: detected,
    };
  }
}

export class GeneratedAssetMaterializer {
  async materialize(options: {
    projectHome: string;
    sourcePath: string;
    destinationRelativePath: string;
  }): Promise<string> {
    assertSafeRelativePath(options.destinationRelativePath);
    const projectHome = path.resolve(options.projectHome);
    const destination = path.resolve(projectHome, options.destinationRelativePath);
    if (!destination.startsWith(`${projectHome}${path.sep}`)) throw new Error("ASSET_PATH_UNSAFE");
    await mkdir(path.dirname(destination), { recursive: true, mode: 0o700 });
    const temporary = `${destination}.tmp-${process.pid}`;
    await copyFile(options.sourcePath, temporary);
    await rename(temporary, destination);
    const [source, retained] = await Promise.all([
      readFile(options.sourcePath),
      readFile(destination),
    ]);
    if (!source.equals(retained)) throw new Error("HOST_IMAGE_ASSET_READ_VERIFY_FAILED");
    return destination;
  }
}

export class HostNativeImageGenerationBridge {
  readonly probe = new HostImageGenerationCapabilityProbe();
  readonly requestValidator = new HostImageGenerationRequestValidator();
  readonly submissionValidator = new HostGeneratedAssetSubmissionValidator();
  readonly inspector = new GeneratedAssetInspector();
  readonly materializer = new GeneratedAssetMaterializer();
  readonly hasher = new GeneratedAssetHasher();

  createRequest(request: HostImageGenerationRequest): HostImageGenerationRequest {
    this.requestValidator.validate(request);
    return structuredClone(request);
  }

  async acceptSubmission(options: {
    request: HostImageGenerationRequest;
    submission: HostGeneratedAssetSubmissionInput;
    projectHome: string;
  }): Promise<{
    asset: {
      relative_path: string;
      checksum: string;
      file_size: number;
      mime_type: string;
      host_provider: string;
      host_model: string | null;
    };
    manifest_path: string;
  }> {
    this.requestValidator.validate(options.request);
    await this.submissionValidator.validate(options.submission);
    if (
      options.submission.generation_id !== options.request.generation_id ||
      options.submission.project_id !== options.request.project_id ||
      options.submission.content_id !== options.request.content_id ||
      options.submission.run_id !== options.request.run_id
    )
      throw new Error("HOST_IMAGE_SUBMISSION_VERSION_BINDING_MISMATCH");
    const inspection = await this.inspector.inspect(
      options.submission.source_path,
      options.submission.declared_mime_type,
    );
    if (!inspection.valid) throw new Error("HOST_IMAGE_ASSET_FORMAT_MISMATCH");
    const destination = await this.materializer.materialize({
      projectHome: options.projectHome,
      sourcePath: options.submission.source_path,
      destinationRelativePath: options.request.destination_relative_path,
    });
    const checksum = await this.hasher.hash(destination);
    const manifest = {
      generation_id: options.request.generation_id,
      project_id: options.request.project_id,
      content_id: options.request.content_id,
      candidate_id: options.request.candidate_id,
      purpose: options.request.purpose,
      provider: options.submission.host_provider,
      model: options.submission.host_model,
      destination_relative_path: options.request.destination_relative_path,
      checksum,
      file_size: inspection.file_size,
      mime_type: inspection.detected_mime_type,
      attempt: 1,
      status: "GENERATION_SUCCESS",
      run_id: options.request.run_id,
      created_at: options.submission.submitted_at,
    };
    const manifestRelativePath = path.join(
      "runs",
      options.request.run_id,
      "image-production",
      `${options.request.generation_id}.json`,
    );
    const manifestPath = path.resolve(options.projectHome, manifestRelativePath);
    await mkdir(path.dirname(manifestPath), { recursive: true, mode: 0o700 });
    const temporary = `${manifestPath}.tmp-${process.pid}`;
    const encoded = `${JSON.stringify(manifest, null, 2)}\n`;
    await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, manifestPath);
    if ((await readFile(manifestPath, "utf8")) !== encoded)
      throw new Error("HOST_IMAGE_MANIFEST_READ_VERIFY_FAILED");
    return {
      asset: {
        relative_path: options.request.destination_relative_path,
        checksum,
        file_size: inspection.file_size,
        mime_type: inspection.detected_mime_type,
        host_provider: options.submission.host_provider,
        host_model: options.submission.host_model,
      },
      manifest_path: manifestRelativePath,
    };
  }
}

export class ProjectAssetAdapter {
  async validate(input: {
    projectHome: string;
    relativePath: string;
    authorized: boolean;
    checksum: string;
  }): Promise<void> {
    if (!input.authorized) throw new Error("PROJECT_ASSET_AUTHORIZATION_REQUIRED");
    assertSafeRelativePath(input.relativePath);
    const file = path.resolve(input.projectHome, input.relativePath);
    if (!file.startsWith(`${path.resolve(input.projectHome)}${path.sep}`))
      throw new Error("ASSET_PATH_UNSAFE");
    const actual = await new GeneratedAssetHasher().hash(file);
    if (actual !== input.checksum) throw new Error("PROJECT_ASSET_CHECKSUM_MISMATCH");
  }
}

export class EvidenceAssetAdapter {
  validate(input: {
    evidenceRef: string;
    source: string;
    authorized: boolean;
    misleadingCrop: boolean;
  }): void {
    if (!input.evidenceRef || !input.source) throw new Error("EVIDENCE_ASSET_SOURCE_REQUIRED");
    if (!input.authorized) throw new Error("EVIDENCE_ASSET_AUTHORIZATION_REQUIRED");
    if (input.misleadingCrop) throw new Error("EVIDENCE_ASSET_MISLEADING_CROP");
  }
}

export class ProgrammaticGraphicAdapter {
  validatePurpose(purpose: string): void {
    if (!/structure|process|relationship|step|data|comparison|timeline|evidence/iu.test(purpose))
      throw new Error("PROGRAMMATIC_GRAPHIC_PURPOSE_OUT_OF_SCOPE");
  }
}

export class PureTypographyAdapter {
  validate(input: { rendererEnabled: boolean; templateLike: boolean }): void {
    if (!input.rendererEnabled) throw new Error("PURE_TYPOGRAPHY_RENDERER_REQUIRED");
    if (input.templateLike) throw new Error("PURE_TYPOGRAPHY_GENERIC_TEMPLATE_REJECTED");
  }
}

export class MixedAssetComposer {
  validate(components: Array<{ assetId: string; declaredPurpose: string }>): void {
    if (components.length < 2) throw new Error("MIXED_ASSET_REQUIRES_MULTIPLE_COMPONENTS");
    if (components.some((item) => !item.assetId || !item.declaredPurpose.trim()))
      throw new Error("MIXED_ASSET_COMPONENT_PURPOSE_REQUIRED");
  }
}
