import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
export const PNG_PRIVACY_CHUNK_TYPES = new Set(["caBX", "eXIf", "tEXt", "zTXt", "iTXt", "tIME"]);
const TEXT_PRIVACY_PATTERN =
  /(?:software|author|creator|creation[_ -]?time|timestamp|comment|prompt|workflow|generator|openai|c2pa|certificate|xmp|api)/iu;

export interface PngChunkInfo {
  type: string;
  data: Buffer;
  raw: Buffer;
}

export interface PngSanitizationResult {
  bytes: Buffer;
  source_sha256: string;
  output_sha256: string;
  width: number;
  height: number;
  bit_depth: number;
  color_type: number;
  idat_sha256: string;
  removed_chunks: Array<{ type: string; size: number; sha256: string }>;
  removed_chunk_count: number;
  removed_chunk_types: string[];
  pixel_stream_unchanged: true;
  dimensions_unchanged: true;
  bit_depth_unchanged: true;
  color_type_unchanged: true;
  pixel_reencoded: false;
}

export function isPrivacyBearingPngChunk(chunk: Pick<PngChunkInfo, "type" | "data">): boolean {
  if (chunk.type === "caBX" || chunk.type === "eXIf" || chunk.type === "tIME") return true;
  if (chunk.type !== "tEXt" && chunk.type !== "zTXt" && chunk.type !== "iTXt") return false;
  return TEXT_PRIVACY_PATTERN.test(chunk.data.toString("utf8"));
}

function digest(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function crc32(bytes: Buffer): number {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit += 1) value = (value >>> 1) ^ (0xedb88320 & -(value & 1));
  }
  return (value ^ 0xffffffff) >>> 0;
}

export function parsePngChunks(bytes: Buffer): PngChunkInfo[] {
  if (bytes.length < PNG_SIGNATURE.length || !bytes.subarray(0, 8).equals(PNG_SIGNATURE))
    throw Object.assign(new Error("PNG signature is invalid."), { code: "PNG_INVALID_SIGNATURE" });
  const chunks: PngChunkInfo[] = [];
  let offset = 8;
  while (offset < bytes.length) {
    if (offset + 12 > bytes.length)
      throw Object.assign(new Error("PNG chunk header is truncated."), {
        code: "PNG_INVALID_CHUNK",
      });
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length)
      throw Object.assign(new Error("PNG chunk data is truncated."), { code: "PNG_INVALID_CHUNK" });
    const type = bytes.subarray(offset + 4, offset + 8).toString("ascii");
    if (!/^[A-Za-z]{4}$/u.test(type))
      throw Object.assign(new Error("PNG chunk type is invalid."), { code: "PNG_INVALID_CHUNK" });
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    const expectedCrc = bytes.readUInt32BE(offset + 8 + length);
    const actualCrc = crc32(Buffer.concat([Buffer.from(type, "ascii"), data]));
    if (expectedCrc !== actualCrc)
      throw Object.assign(new Error(`PNG chunk ${type} failed CRC verification.`), {
        code: "PNG_INVALID_CRC",
      });
    chunks.push({ type, data, raw: bytes.subarray(offset, end) });
    offset = end;
    if (type === "IEND") break;
  }
  if (offset !== bytes.length)
    throw Object.assign(new Error("PNG contains bytes after IEND."), {
      code: "PNG_TRAILING_BYTES",
    });
  if (chunks[0]?.type !== "IHDR" || chunks[0].data.length !== 13)
    throw Object.assign(new Error("PNG must begin with one valid IHDR chunk."), {
      code: "PNG_INVALID_STRUCTURE",
    });
  if (chunks.filter((chunk) => chunk.type === "IHDR").length !== 1)
    throw Object.assign(new Error("PNG must contain exactly one IHDR chunk."), {
      code: "PNG_INVALID_STRUCTURE",
    });
  if (!chunks.some((chunk) => chunk.type === "IDAT") || chunks.at(-1)?.type !== "IEND")
    throw Object.assign(new Error("PNG must contain IDAT and terminate with IEND."), {
      code: "PNG_INVALID_STRUCTURE",
    });
  return chunks;
}

export function sanitizePngMetadata(source: Buffer): PngSanitizationResult {
  const chunks = parsePngChunks(source);
  const ihdr = chunks[0]?.data;
  if (!ihdr) throw new Error("PNG IHDR is missing.");
  const idat = Buffer.concat(
    chunks.filter((chunk) => chunk.type === "IDAT").map((chunk) => chunk.data),
  );
  const removed = chunks.filter(isPrivacyBearingPngChunk);
  const bytes = Buffer.concat([
    PNG_SIGNATURE,
    ...chunks.filter((chunk) => !isPrivacyBearingPngChunk(chunk)).map((chunk) => chunk.raw),
  ]);
  const outputChunks = parsePngChunks(bytes);
  if (outputChunks.some(isPrivacyBearingPngChunk))
    throw Object.assign(new Error("PNG privacy metadata remained after sanitization."), {
      code: "PNG_SANITIZATION_VERIFY_FAILED",
    });
  const outputIdat = Buffer.concat(
    outputChunks.filter((chunk) => chunk.type === "IDAT").map((chunk) => chunk.data),
  );
  if (!idat.equals(outputIdat))
    throw Object.assign(new Error("PNG pixel stream changed during sanitization."), {
      code: "PNG_PIXEL_STREAM_CHANGED",
    });
  return {
    bytes,
    source_sha256: digest(source),
    output_sha256: digest(bytes),
    width: ihdr.readUInt32BE(0),
    height: ihdr.readUInt32BE(4),
    bit_depth: ihdr[8] ?? 0,
    color_type: ihdr[9] ?? 0,
    idat_sha256: digest(idat),
    removed_chunks: removed.map((chunk) => ({
      type: chunk.type,
      size: chunk.data.length,
      sha256: digest(chunk.data),
    })),
    removed_chunk_count: removed.length,
    removed_chunk_types: [...new Set(removed.map((chunk) => chunk.type))].sort(),
    pixel_stream_unchanged: true,
    dimensions_unchanged: true,
    bit_depth_unchanged: true,
    color_type_unchanged: true,
    pixel_reencoded: false,
  };
}

export async function writeSanitizedPng(
  sourcePath: string,
  targetPath: string,
): Promise<{ result: PngSanitizationResult; reused: boolean }> {
  const result = sanitizePngMetadata(await readFile(sourcePath));
  await mkdir(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  try {
    const existing = await readFile(targetPath);
    if (!existing.equals(result.bytes))
      throw Object.assign(new Error("Sanitized PNG target conflicts with existing bytes."), {
        code: "DELIVERY_ASSET_VERSION_CONFLICT",
      });
    return { result, reused: true };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  const temporary = `${targetPath}.content-ops-tmp-${process.pid}`;
  await writeFile(temporary, result.bytes, { mode: 0o600, flag: "wx" });
  await rename(temporary, targetPath);
  if (!(await readFile(targetPath)).equals(result.bytes))
    throw Object.assign(new Error("Sanitized PNG read verification failed."), {
      code: "PNG_SANITIZATION_VERIFY_FAILED",
    });
  return { result, reused: false };
}
