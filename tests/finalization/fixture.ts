import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import {
  buildFinalApprovalTargetVersion,
  type FinalizationContext,
} from "../../packages/core/src/finalization/index.js";

function crc32(bytes: Buffer): number {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const label = Buffer.from(type, "ascii");
  const header = Buffer.alloc(4);
  header.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([label, data])));
  return Buffer.concat([header, label, data, checksum]);
}

export function appendPngChunkBeforeIend(source: Buffer, type: string, data: Buffer): Buffer {
  const iendLength = 12;
  return Buffer.concat([
    source.subarray(0, source.length - iendLength),
    chunk(type, data),
    source.subarray(source.length - iendLength),
  ]);
}

export function deterministicPng(width: number, height: number, seed: number): Buffer {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const row = Buffer.alloc(width * 4 + 1);
  for (let index = 1; index < row.length; index += 4) {
    row[index] = (seed * 29) % 256;
    row[index + 1] = (seed * 53) % 256;
    row[index + 2] = (seed * 71) % 256;
    row[index + 3] = 255;
  }
  const raster = Buffer.concat(Array.from({ length: height }, () => row));
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raster, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export async function createFinalizationE2eFixture(home: string): Promise<FinalizationContext> {
  const projectId = "PRJ-20990101-FINL";
  const contentId = "C-9001";
  const runId = "RUN-20990101-010203-FINL";
  const assetRoot = path.join(home, "projects", projectId, "runs", runId, "approved-assets");
  await mkdir(assetRoot, { recursive: true });
  const pages = [];
  for (let pageNumber = 1; pageNumber <= 6; pageNumber += 1) {
    const bytes = deterministicPng(12, 16, pageNumber);
    const sourcePath = path.join(assetRoot, `${String(pageNumber).padStart(2, "0")}.png`);
    await writeFile(sourcePath, bytes);
    pages.push({
      page_number: pageNumber,
      page_role:
        pageNumber === 1 ? "COVER" : pageNumber === 6 ? "SUMMARY_CONVERSION" : "CONTENT_VALUE",
      page_intent: `Fictional page ${pageNumber} serves one approved narrative duty.`,
      asset_id: `AST-FINL-${String(pageNumber).padStart(2, "0")}`,
      source_path: sourcePath,
      relative_path: `projects/fictional/assets/${String(pageNumber).padStart(2, "0")}.png`,
      checksum: sha256(bytes),
      width: 12,
      height: 16,
      file_size: bytes.length,
      mime_type: "image/png" as const,
      asset_channel: "PURE_RENDERER" as const,
      renderer_provenance: "PLAYWRIGHT_HTML_CSS@1.62.1",
      imagegen_provenance: null,
      generation_manifest_ref: `GEN-FINL-${String(pageNumber).padStart(2, "0")}`,
      render_report_ref: `RPT-RENDER-FINL-${String(pageNumber).padStart(2, "0")}`,
      single_page_qa_ref: `RPT-QA-FINL-${String(pageNumber).padStart(2, "0")}`,
      single_page_qa_status: "PASS" as const,
      hard_block_count: 0,
      approved_formal_asset: true,
      asset_status: "APPROVED" as const,
    });
  }
  const contact_sheets = [];
  for (const [index, size] of (["FULL", "310", "186"] as const).entries()) {
    const bytes = deterministicPng(18, 16, 20 + index);
    const sourcePath = path.join(assetRoot, `contact-sheet-${size.toLowerCase()}.png`);
    await writeFile(sourcePath, bytes);
    contact_sheets.push({
      size,
      source_path: sourcePath,
      relative_path: `projects/fictional/previews/contact-sheet-${size.toLowerCase()}.png`,
      checksum: sha256(bytes),
    });
  }
  const context: FinalizationContext = {
    project_id: projectId,
    project_kind: "TEST_FIXTURE",
    content_id: contentId,
    run_id: runId,
    runtime_mode: "TEST",
    workspace_target: "NONE",
    content_version: "CV-1",
    copy_version: "CV-1",
    visual_plan_version: "VV-1",
    first_page_version: "FPV-1",
    style_lock_id: "SL-FINL-001",
    style_lock_version: "SLV-1",
    style_lock_active: true,
    style_lock_visual_plan_version: "VV-1",
    g3: {
      approval_id: "APR-20990101-G3AA",
      gate: "CONTENT_COPY",
      decision: "APPROVE",
      target_id: contentId,
      target_version: "CV-1:CV-1",
      source_run_id: runId,
      deprecated_at: null,
      fixture_approval: true,
      test_only: true,
    },
    g4: {
      approval_id: "APR-20990101-G4AA",
      gate: "FIRST_PAGE",
      decision: "APPROVE",
      target_id: contentId,
      target_version: "VV-1",
      source_run_id: runId,
      deprecated_at: null,
      fixture_approval: true,
      test_only: true,
    },
    g5: null,
    page_count: 6,
    pages,
    qa_report_id: "RPT-QA-FINL-001",
    qa_status: "QA_PASSED",
    group_qa_ref: "RPT-GROUP-QA-FINL-001",
    group_qa_status: "PASS",
    group_hard_block_count: 0,
    continuity_report_ref: "RPT-CONTINUITY-FINL-001",
    continuity_status: "PASS",
    strategy_ref: "STRATEGY-FINL-001",
    contact_sheets,
    content_package_ref: "CONTENT-PACKAGE-FINL-001",
    visual_system_ref: "VS-FINL-001",
    final_manifest_id: "FINAL-FINL-001",
    final_manifest_version: "FMV-1",
    finalized_at: "2099-01-01T01:02:03.000Z",
  };
  context.g5 = {
    approval_id: "APR-20990101-G5AA",
    gate: "FINAL_SET",
    decision: "APPROVE",
    target_id: contentId,
    target_version: buildFinalApprovalTargetVersion(context),
    source_run_id: runId,
    deprecated_at: null,
    fixture_approval: true,
    test_only: true,
  };
  return context;
}
