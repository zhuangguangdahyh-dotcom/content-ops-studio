import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, readdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry, type SchemaRegistry } from "@content-ops/contracts";
import {
  buildFinalSetFingerprint,
  buildFinalSetFingerprintInputs,
  evaluateFinalizationEligibility,
  isCurrentFinalization,
  type FinalizationContext,
  type FinalizationPageInput,
  type FinalizationPreviewInput,
} from "@content-ops/core";

type FailurePoint = "MANIFEST" | "DELIVERY" | "ARCHIVE";

export interface FinalizationRuntimeResult {
  status: "FINALIZED";
  reused_manifest: boolean;
  reused_delivery: boolean;
  final_manifest_id: string;
  final_set_fingerprint: string;
  manifest_path: string;
  delivery_path: string;
  integrity_report_path: string;
  archive_state_path: string;
  imagegen_calls: 0;
  renderer_calls: 0;
  feishu_writes: 0;
  attachment_uploads: 0;
}

interface VerifiedFile {
  bytes: Buffer;
  checksum: string;
  width: number;
  height: number;
  fileSize: number;
}

const FORBIDDEN_DELIVERY_NAME =
  /(?:^|[-_.])(candidate|rejected|failed|superseded|debug|fixture|blind|tmp|temp)(?:[-_.]|$)/iu;
const SECRET_PATTERN =
  /(?:authorization|bearer\s+|app[_-]?secret|access[_-]?token|refresh[_-]?token)/iu;
const ABSOLUTE_USER_PATH = /(?:\/Users\/|[A-Za-z]:[\\/]|file:\/\/)/u;

function safeSegment(value: string): string {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/u.test(value))
    throw Object.assign(new Error("Finalization artifact key is invalid."), {
      code: "FINALIZATION_ARTIFACT_KEY_INVALID",
    });
  return value;
}

function isWithin(parent: string, child: string): boolean {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function digest(bytes: Buffer | string): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function pngDimensions(bytes: Buffer): { width: number; height: number } | null {
  if (
    bytes.length < 24 ||
    bytes[0] !== 0x89 ||
    bytes.subarray(1, 4).toString("ascii") !== "PNG" ||
    bytes.readUInt32BE(12) !== 0x49484452
  )
    return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

function relativeProjectPath(
  projectId: string,
  contentId: string,
  version: string,
  tail: string,
): string {
  return path.posix.join("projects", projectId, "finalization", contentId, version, tail);
}

async function atomicJson(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  const temporary = `${file}.tmp-${process.pid}`;
  await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
  await rename(temporary, file);
  if ((await readFile(file, "utf8")) !== encoded)
    throw Object.assign(new Error("Finalization JSON read verification failed."), {
      code: "FINALIZATION_READ_VERIFY_FAILED",
    });
}

async function writeOnceOrReuse(
  file: string,
  value: unknown,
  conflictCode: string,
): Promise<{ reused: boolean; sha256: string }> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await readFile(file, "utf8")) !== encoded)
      throw Object.assign(
        new Error("Immutable finalization artifact conflicts with its version."),
        {
          code: conflictCode,
        },
      );
    return { reused: true, sha256: digest(encoded) };
  }
  return { reused: false, sha256: digest(encoded) };
}

async function copyVerified(source: string, target: string, checksum: string): Promise<boolean> {
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 });
  try {
    const existing = await readFile(target);
    if (digest(existing) !== checksum)
      throw Object.assign(new Error("Delivery target already exists with different bytes."), {
        code: "DELIVERY_ASSET_VERSION_CONFLICT",
      });
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  await copyFile(source, target);
  if (digest(await readFile(target)) !== checksum)
    throw Object.assign(new Error("Delivery copy read verification failed."), {
      code: "DELIVERY_COPY_VERIFY_FAILED",
    });
  return false;
}

export class FinalizationRuntime {
  readonly home: string;
  readonly pluginRoot: string;
  readonly projectId: string;
  readonly contentId: string;
  readonly runId: string;
  readonly root: string;
  private registryPromise?: Promise<SchemaRegistry>;

  constructor(options: {
    projectHome: string;
    pluginRoot: string;
    projectId: string;
    contentId: string;
    runId: string;
  }) {
    this.home = path.resolve(options.projectHome);
    this.pluginRoot = path.resolve(options.pluginRoot);
    this.projectId = safeSegment(options.projectId);
    this.contentId = safeSegment(options.contentId);
    this.runId = safeSegment(options.runId);
    if (isWithin(this.pluginRoot, this.home))
      throw Object.assign(new Error("Finalization Home must be outside immutable Plugin Root."), {
        code: "FINALIZATION_HOME_INSIDE_PLUGIN",
      });
    this.root = path.join(this.home, "projects", this.projectId, "finalization", this.contentId);
  }

  private registry(): Promise<SchemaRegistry> {
    const current =
      this.registryPromise ?? loadSchemaRegistry(path.join(this.pluginRoot, "schemas", "1.0"));
    this.registryPromise = current;
    return current;
  }

  private async assertSchema(logicalName: string, value: unknown): Promise<void> {
    (await this.registry()).assertValid(
      `https://content-ops-studio.local/schemas/1.0/${logicalName}.schema.json`,
      value,
    );
  }

  private async verifyFile(
    input: FinalizationPageInput | FinalizationPreviewInput,
    expected?: Pick<FinalizationPageInput, "width" | "height" | "file_size">,
  ): Promise<VerifiedFile> {
    const source = path.resolve(input.source_path);
    if (!isWithin(this.home, source))
      throw Object.assign(new Error("Final asset must remain under CONTENT_OPS_HOME."), {
        code: "FINAL_ASSET_PATH_ESCAPE",
      });
    if (FORBIDDEN_DELIVERY_NAME.test(path.basename(source)))
      throw Object.assign(new Error("Non-formal or temporary asset cannot enter delivery."), {
        code: "UNAPPROVED_ASSET_IN_DELIVERY",
      });
    const info = await stat(source).catch((error: NodeJS.ErrnoException) => {
      if (error.code === "ENOENT")
        throw Object.assign(new Error("Final asset is missing."), {
          code: "FINAL_ASSET_INTEGRITY_FAILED",
        });
      throw error;
    });
    if (!info.isFile())
      throw Object.assign(new Error("Final asset is not a file."), {
        code: "FINAL_ASSET_INTEGRITY_FAILED",
      });
    const bytes = await readFile(source);
    const dimensions = pngDimensions(bytes);
    const checksum = digest(bytes);
    if (!dimensions || checksum !== input.checksum)
      throw Object.assign(new Error("PNG signature or approved checksum is different."), {
        code: "FINAL_ASSET_INTEGRITY_FAILED",
      });
    if (
      expected &&
      (dimensions.width !== expected.width ||
        dimensions.height !== expected.height ||
        bytes.length !== expected.file_size)
    )
      throw Object.assign(new Error("Final asset dimensions or file size changed."), {
        code: "FINAL_ASSET_INTEGRITY_FAILED",
      });
    return {
      bytes,
      checksum,
      width: dimensions.width,
      height: dimensions.height,
      fileSize: bytes.length,
    };
  }

  private paths(version: string) {
    safeSegment(version);
    const archive = path.join(this.root, "archive", version);
    const delivery = path.join(this.root, "delivery", version);
    return {
      archive,
      delivery,
      manifest: path.join(archive, "final-manifest.json"),
      fingerprint: path.join(archive, "final-set-fingerprint.json"),
      deliveryPackage: path.join(archive, "delivery-package.json"),
      archiveState: path.join(archive, "archive-state.json"),
      currentState: path.join(this.root, "current-state.json"),
    };
  }

  private async writeState(
    context: FinalizationContext,
    status:
      | "NOT_ELIGIBLE"
      | "ELIGIBLE"
      | "FINALIZING"
      | "FINALIZED"
      | "FINALIZATION_FAILED"
      | "SUPERSEDED",
    options: { fingerprint?: string | null; evidence?: string[]; current?: boolean } = {},
  ): Promise<Record<string, unknown>> {
    const state = {
      project_id: context.project_id,
      content_id: context.content_id,
      final_manifest_id: status === "NOT_ELIGIBLE" ? null : context.final_manifest_id,
      final_set_fingerprint: options.fingerprint ?? null,
      status,
      current: options.current ?? status === "FINALIZED",
      evidence_refs: options.evidence ?? [],
      sync_status: "SYNC_NOT_STARTED",
      updated_at: context.finalized_at,
      run_id: context.run_id,
      schema_version: "1.0.0",
    };
    await this.assertSchema("finalization-state", state);
    await atomicJson(this.paths(context.final_manifest_version).currentState, state);
    return state;
  }

  async inspect(context?: FinalizationContext): Promise<Record<string, unknown> | null> {
    try {
      const state = JSON.parse(
        await readFile(this.paths(context?.final_manifest_version ?? "FMV-1").currentState, "utf8"),
      ) as Record<string, unknown>;
      if (
        context &&
        typeof state.final_set_fingerprint === "string" &&
        !isCurrentFinalization(state.final_set_fingerprint, context)
      )
        return { ...state, status: "SUPERSEDED", current: false };
      return state;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async finalize(
    context: FinalizationContext,
    testOptions: { fail_after?: FailurePoint } = {},
  ): Promise<FinalizationRuntimeResult> {
    if (
      context.project_id !== this.projectId ||
      context.content_id !== this.contentId ||
      context.run_id !== this.runId
    )
      throw Object.assign(new Error("Finalization Runtime identity does not match context."), {
        code: "FINALIZATION_CONTEXT_IDENTITY_MISMATCH",
      });
    if (
      testOptions.fail_after &&
      (context.runtime_mode !== "TEST" || context.project_kind !== "TEST_FIXTURE")
    )
      throw Object.assign(new Error("Failure injection is test-fixture only."), {
        code: "FINALIZATION_FAILURE_INJECTION_FORBIDDEN",
      });
    const eligibility = evaluateFinalizationEligibility(context);
    if (!eligibility.eligible) {
      await this.writeState(context, "NOT_ELIGIBLE");
      const first = eligibility.issues[0];
      throw Object.assign(new Error(first?.message ?? "Finalization is not eligible."), {
        code: first?.code ?? "FINALIZATION_NOT_ELIGIBLE",
        issues: eligibility.issues,
      });
    }
    const paths = this.paths(context.final_manifest_version);
    const evidenceBase = relativeProjectPath(
      context.project_id,
      context.content_id,
      context.final_manifest_version,
      "archive",
    );
    await this.writeState(context, "FINALIZING", { evidence: [evidenceBase] });
    try {
      const verifiedPages = await Promise.all(
        context.pages.map((page) => this.verifyFile(page, page)),
      );
      await Promise.all(context.contact_sheets.map((preview) => this.verifyFile(preview)));
      const g5 = context.g5;
      if (!g5) throw Object.assign(new Error("G5 is required."), { code: "G5_APPROVAL_REQUIRED" });
      const finalOutput = relativeProjectPath(
        context.project_id,
        context.content_id,
        context.final_manifest_version,
        "delivery",
      );
      const finalAssets = context.pages.map((page, index) => ({
        page_number: page.page_number,
        page_role: page.page_role,
        page_intent: page.page_intent,
        asset_channel: page.asset_channel,
        renderer_provenance: page.renderer_provenance,
        imagegen_provenance: page.imagegen_provenance,
        single_page_qa_ref: page.single_page_qa_ref,
        asset: {
          asset_id: page.asset_id,
          asset_role: "FINAL_PAGE",
          asset_type: "IMAGE",
          mime_type: "image/png",
          relative_path: page.relative_path,
          source_type: "RENDERED",
          source_adapter: page.renderer_provenance,
          source_run_id: context.run_id,
          source_generation_id: page.generation_manifest_ref,
          version: Number(context.final_manifest_version.replace("FMV-", "")),
          width: verifiedPages[index]?.width ?? page.width,
          height: verifiedPages[index]?.height ?? page.height,
          file_size: verifiedPages[index]?.fileSize ?? page.file_size,
          checksum: page.checksum,
          created_at: context.finalized_at,
          extensions: {},
        },
      }));
      const manifest = {
        final_manifest_id: context.final_manifest_id,
        project_id: context.project_id,
        project_kind: context.project_kind,
        content_id: context.content_id,
        content_version: context.content_version,
        copy_version: context.copy_version,
        visual_plan_version: context.visual_plan_version,
        first_page_version: context.first_page_version,
        style_lock_version: context.style_lock_version,
        style_lock_id: context.style_lock_id,
        g3_approval_id: context.g3.approval_id,
        g4_approval_id: context.g4.approval_id,
        final_approval_id: g5.approval_id,
        final_approval_target_version: g5.target_version,
        final_approval: {
          approval_id: g5.approval_id,
          gate: "FINAL_SET",
          target_type: "IMAGE_SET",
          target_id: context.content_id,
          target_version: g5.target_version,
          decision: "APPROVE",
          comment:
            context.project_kind === "TEST_FIXTURE"
              ? "FIXTURE_APPROVAL TEST_ONLY NON_PRODUCTION"
              : "Explicit Operator G5 approval.",
          source_run_id: g5.source_run_id,
          created_at: context.finalized_at,
          deprecated_at: null,
          schema_version: "1.0.0",
        },
        qa_report_id: context.qa_report_id,
        qa_status: context.qa_status,
        final_output_directory: finalOutput,
        final_assets: finalAssets,
        content_package_ref: context.content_package_ref,
        visual_system_ref: context.visual_system_ref,
        style_lock_ref: context.style_lock_id,
        generation_manifest_refs: context.pages.map((page) => page.generation_manifest_ref),
        render_report_refs: context.pages.map((page) => page.render_report_ref),
        checksums: Object.fromEntries(
          context.pages.map((page) => [page.relative_path, page.checksum]),
        ),
        file_count: context.pages.length,
        page_count: context.page_count,
        group_evidence: {
          strategy_ref: context.strategy_ref,
          continuity_report_ref: context.continuity_report_ref,
          group_qa_ref: context.group_qa_ref,
          contact_sheet_refs: context.contact_sheets.map((preview) => preview.relative_path),
        },
        final_manifest_version: context.final_manifest_version,
        finalized_by: "CONTENT_OPS_RUNTIME",
        origin: "RUNTIME_FINALIZATION",
        business_status: "CONTENT_FINALIZED",
        image_status: "IMAGE_SET_GENERATED",
        sync_status: "SYNC_NOT_STARTED",
        finalized_at: context.finalized_at,
        run_id: context.run_id,
        schema_version: "1.0.0",
        extensions: {},
      };
      await this.assertSchema("final-manifest", manifest);
      const manifestWrite = await writeOnceOrReuse(
        paths.manifest,
        manifest,
        "FINAL_MANIFEST_VERSION_CONFLICT",
      );
      const fingerprintHash = buildFinalSetFingerprint(context);
      const fingerprint = {
        fingerprint_id: `FSF-${context.content_id.replace("-", "")}-${context.final_manifest_version.replace("-", "")}`,
        final_manifest_id: context.final_manifest_id,
        algorithm: "SHA-256",
        canonical_version: "1.0.0",
        hash: fingerprintHash,
        inputs: buildFinalSetFingerprintInputs(context),
        schema_version: "1.0.0",
      };
      await this.assertSchema("final-set-fingerprint", fingerprint);
      await writeOnceOrReuse(paths.fingerprint, fingerprint, "FINAL_SET_FINGERPRINT_CONFLICT");
      if (testOptions.fail_after === "MANIFEST")
        throw Object.assign(new Error("Injected failure after Manifest."), {
          code: "FINALIZATION_TEST_FAILURE_AFTER_MANIFEST",
        });

      let reusedDelivery = true;
      const roleName = (page: FinalizationPageInput): string => {
        if (page.page_number === 1) return "cover";
        if (page.page_number === context.page_count) return "summary";
        return "content";
      };
      const deliveryPages = [];
      for (const page of context.pages) {
        const filename = `${String(page.page_number).padStart(2, "0")}-${roleName(page)}.png`;
        const reused = await copyVerified(
          page.source_path,
          path.join(paths.delivery, "pages", filename),
          page.checksum,
        );
        reusedDelivery &&= reused;
        deliveryPages.push({ page_number: page.page_number, filename, checksum: page.checksum });
      }
      const previewNames = {
        FULL: "contact-sheet-full.png",
        "310": "contact-sheet-310.png",
        "186": "contact-sheet-186.png",
      } as const;
      for (const preview of context.contact_sheets) {
        const reused = await copyVerified(
          preview.source_path,
          path.join(paths.delivery, "previews", previewNames[preview.size]),
          preview.checksum,
        );
        reusedDelivery &&= reused;
      }
      const deliveryManifestPath = path.join(paths.delivery, "final-manifest.json");
      const deliveryManifestReused = await copyVerified(
        paths.manifest,
        deliveryManifestPath,
        manifestWrite.sha256,
      );
      reusedDelivery &&= deliveryManifestReused;
      const summary = {
        final_manifest_id: context.final_manifest_id,
        final_set_fingerprint: fingerprintHash,
        page_count: context.page_count,
        g5_approval_id: g5.approval_id,
        imagegen_calls: 0,
        renderer_calls: 0,
        feishu_writes: 0,
        attachment_uploads: 0,
        audit_history_separate: true,
      };
      await atomicJson(path.join(paths.delivery, "reports", "finalization-summary.json"), summary);
      if (testOptions.fail_after === "DELIVERY")
        throw Object.assign(new Error("Injected failure after Delivery."), {
          code: "FINALIZATION_TEST_FAILURE_AFTER_DELIVERY",
        });

      const checks = await this.verifyDelivery({
        context,
        deliveryRoot: paths.delivery,
        manifest,
        deliveryPages,
        fingerprintHash,
      });
      const failed = checks.filter((check) => check.status === "FAIL");
      const integrity = {
        report_id: `DIR-${context.content_id.replace("-", "")}-${context.final_manifest_version.replace("-", "")}`,
        delivery_package_id: `DP-${context.content_id.replace("-", "")}-${context.final_manifest_version.replace("-", "")}`,
        final_manifest_id: context.final_manifest_id,
        checks,
        passed_count: checks.length - failed.length,
        failed_count: failed.length,
        hard_block_count: failed.filter((check) => check.blocking).length,
        overall_status: failed.length === 0 ? "PASSED" : "FAILED",
        verified_at: context.finalized_at,
        run_id: context.run_id,
        schema_version: "1.0.0",
      };
      await this.assertSchema("delivery-integrity-report", integrity);
      await atomicJson(
        path.join(paths.delivery, "reports", "delivery-integrity-report.json"),
        integrity,
      );
      if (integrity.hard_block_count !== 0)
        throw Object.assign(new Error("Delivery integrity has blocking failures."), {
          code: "DELIVERY_INTEGRITY_FAILED",
        });
      const deliveryPackage = {
        delivery_package_id: integrity.delivery_package_id,
        delivery_package_version: "1.0.0",
        final_manifest_id: context.final_manifest_id,
        final_set_fingerprint: fingerprintHash,
        root_ref: finalOutput,
        pages: deliveryPages,
        previews: ["contact-sheet-full.png", "contact-sheet-310.png", "contact-sheet-186.png"],
        reports: ["finalization-summary.json", "delivery-integrity-report.json"],
        created_at: context.finalized_at,
        run_id: context.run_id,
        schema_version: "1.0.0",
      };
      await this.assertSchema("delivery-package", deliveryPackage);
      await writeOnceOrReuse(
        paths.deliveryPackage,
        deliveryPackage,
        "DELIVERY_PACKAGE_VERSION_CONFLICT",
      );
      if (testOptions.fail_after === "ARCHIVE")
        throw Object.assign(new Error("Injected failure before Archive state."), {
          code: "FINALIZATION_TEST_FAILURE_BEFORE_ARCHIVE",
        });
      const evidence = [
        relativeProjectPath(
          context.project_id,
          context.content_id,
          context.final_manifest_version,
          "archive/final-manifest.json",
        ),
        relativeProjectPath(
          context.project_id,
          context.content_id,
          context.final_manifest_version,
          "archive/final-set-fingerprint.json",
        ),
        relativeProjectPath(
          context.project_id,
          context.content_id,
          context.final_manifest_version,
          "delivery/reports/delivery-integrity-report.json",
        ),
      ];
      const state = await this.writeState(context, "FINALIZED", {
        fingerprint: fingerprintHash,
        evidence,
        current: true,
      });
      await writeOnceOrReuse(paths.archiveState, state, "FINALIZATION_ARCHIVE_STATE_CONFLICT");
      return {
        status: "FINALIZED",
        reused_manifest: manifestWrite.reused,
        reused_delivery: reusedDelivery,
        final_manifest_id: context.final_manifest_id,
        final_set_fingerprint: fingerprintHash,
        manifest_path: paths.manifest,
        delivery_path: paths.delivery,
        integrity_report_path: path.join(
          paths.delivery,
          "reports",
          "delivery-integrity-report.json",
        ),
        archive_state_path: paths.archiveState,
        imagegen_calls: 0,
        renderer_calls: 0,
        feishu_writes: 0,
        attachment_uploads: 0,
      };
    } catch (error) {
      const current = await this.inspect();
      const priorEvidence = Array.isArray(current?.evidence_refs)
        ? (current.evidence_refs as string[])
        : [];
      await this.writeState(context, "FINALIZATION_FAILED", {
        fingerprint:
          typeof current?.final_set_fingerprint === "string" ? current.final_set_fingerprint : null,
        evidence: priorEvidence,
        current: false,
      });
      throw error;
    }
  }

  private async verifyDelivery(input: {
    context: FinalizationContext;
    deliveryRoot: string;
    manifest: Record<string, unknown>;
    deliveryPages: Array<{ page_number: number; filename: string; checksum: string }>;
    fingerprintHash: string;
  }): Promise<
    Array<{ code: string; status: "PASS" | "FAIL"; blocking: boolean; message: string }>
  > {
    const results: Array<{
      code: string;
      status: "PASS" | "FAIL";
      blocking: boolean;
      message: string;
    }> = [];
    const check = (code: string, pass: boolean, message: string) =>
      results.push({ code, status: pass ? "PASS" : "FAIL", blocking: !pass, message });
    const manifestText = await readFile(
      path.join(input.deliveryRoot, "final-manifest.json"),
      "utf8",
    );
    const pageDirectory = path.join(input.deliveryRoot, "pages");
    const previewDirectory = path.join(input.deliveryRoot, "previews");
    const pageFiles = (await readdir(pageDirectory)).sort();
    const previewFiles = (await readdir(previewDirectory)).sort();
    check(
      "MANIFEST_MATCH",
      JSON.stringify(JSON.parse(manifestText)) === JSON.stringify(input.manifest),
      "Delivery Manifest matches immutable archive Manifest.",
    );
    check(
      "PAGE_COUNT",
      pageFiles.length === input.context.page_count,
      "Delivery page count matches approved Page Count.",
    );
    check(
      "ORDERED_ASSETS",
      pageFiles.join("|") === input.deliveryPages.map((page) => page.filename).join("|"),
      "Delivery page order is stable and contiguous.",
    );
    let checksumMatch = true;
    let canvasMatch = true;
    for (const page of input.deliveryPages) {
      const bytes = await readFile(path.join(pageDirectory, page.filename));
      checksumMatch &&= digest(bytes) === page.checksum;
      const dimensions = pngDimensions(bytes);
      const source = input.context.pages[page.page_number - 1];
      canvasMatch &&=
        source !== undefined &&
        dimensions?.width === source.width &&
        dimensions.height === source.height;
    }
    check("CHECKSUM_MATCH", checksumMatch, "Every delivered page checksum matches G5-bound bytes.");
    check("CANVAS_MATCH", canvasMatch, "Every delivered page Canvas matches approved evidence.");
    check(
      "NO_MISSING_FILE",
      pageFiles.length === input.deliveryPages.length,
      "No approved page is missing.",
    );
    check(
      "NO_EXTRA_FORMAL_FILE",
      pageFiles.every((file) => input.deliveryPages.some((page) => page.filename === file)),
      "No extra formal page is present.",
    );
    check(
      "NO_TEMPORARY_ASSET",
      !pageFiles.some((file) => FORBIDDEN_DELIVERY_NAME.test(file)),
      "No temporary asset entered Delivery.",
    );
    check(
      "NO_REJECTED_ASSET",
      input.context.pages.every((page) => page.asset_status === "APPROVED"),
      "No rejected, failed, candidate or superseded asset entered Delivery.",
    );
    const structuredText = `${manifestText}\n${JSON.stringify(input.manifest)}`;
    check(
      "NO_SECRET",
      !SECRET_PATTERN.test(structuredText),
      "Delivery metadata contains no credential-shaped material.",
    );
    check(
      "NO_ABSOLUTE_USER_PATH",
      !ABSOLUTE_USER_PATH.test(structuredText),
      "Delivery metadata contains no absolute user path.",
    );
    check(
      "NO_INTERNAL_RUNTIME_LEAK",
      !structuredText.includes(input.deliveryRoot),
      "Delivery metadata contains no internal Runtime path.",
    );
    check(
      "PREVIEW_MATCH",
      previewFiles.join("|") ===
        "contact-sheet-186.png|contact-sheet-310.png|contact-sheet-full.png",
      "All three G5-approved previews are present.",
    );
    check(
      "CONTENT_VERSION_MATCH",
      input.manifest.content_version === input.context.content_version &&
        input.manifest.copy_version === input.context.copy_version,
      "Content and Copy versions match current approvals.",
    );
    check(
      "APPROVAL_CHAIN_MATCH",
      input.manifest.g3_approval_id === input.context.g3.approval_id &&
        input.manifest.g4_approval_id === input.context.g4.approval_id &&
        input.manifest.final_approval_id === input.context.g5?.approval_id,
      "G3, G4 and G5 bindings match.",
    );
    check(
      "FINGERPRINT_MATCH",
      input.fingerprintHash === buildFinalSetFingerprint(input.context),
      "Final Set Fingerprint is deterministic and current.",
    );
    return results;
  }
}
