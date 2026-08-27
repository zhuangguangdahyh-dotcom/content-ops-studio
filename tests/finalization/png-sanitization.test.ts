import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  PNG_PRIVACY_CHUNK_TYPES,
  parsePngChunks,
  sanitizePngMetadata,
} from "../../packages/runtime/src/finalization/png-sanitization.js";
import { deterministicPng } from "./fixture.js";

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
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([label, data])));
  return Buffer.concat([length, label, data, checksum]);
}

function withPrivacyMetadata(source: Buffer): Buffer {
  const chunks = parsePngChunks(source);
  return Buffer.concat([
    source.subarray(0, 8),
    chunks[0]?.raw ?? Buffer.alloc(0),
    chunk("caBX", Buffer.from("C2PA private fixture", "utf8")),
    chunk("tEXt", Buffer.from("software\0OpenAI Media Service API", "utf8")),
    ...chunks.slice(1).map((item) => item.raw),
  ]);
}

describe("PNG metadata sanitization", () => {
  it("removes caBX and textual privacy chunks while preserving IHDR and IDAT bytes", () => {
    const source = withPrivacyMetadata(deterministicPng(12, 16, 7));
    const before = parsePngChunks(source);
    const result = sanitizePngMetadata(source);
    const after = parsePngChunks(result.bytes);
    expect(result.removed_chunk_types).toEqual(["caBX", "tEXt"]);
    expect(result.removed_chunk_count).toBe(2);
    expect(after.some((item) => PNG_PRIVACY_CHUNK_TYPES.has(item.type))).toBe(false);
    expect(after.find((item) => item.type === "IHDR")?.data).toEqual(
      before.find((item) => item.type === "IHDR")?.data,
    );
    expect(after.filter((item) => item.type === "IDAT").map((item) => item.raw)).toEqual(
      before.filter((item) => item.type === "IDAT").map((item) => item.raw),
    );
    expect(result).toMatchObject({
      width: 12,
      height: 16,
      bit_depth: 8,
      color_type: 6,
      pixel_stream_unchanged: true,
      pixel_reencoded: false,
    });
  });

  it("is byte-identical and idempotent when no removable metadata exists", () => {
    const source = deterministicPng(12, 16, 8);
    const first = sanitizePngMetadata(source);
    const second = sanitizePngMetadata(first.bytes);
    expect(first.bytes).toEqual(source);
    expect(second.bytes).toEqual(first.bytes);
    expect(first.output_sha256).toBe(createHash("sha256").update(source).digest("hex"));
  });

  it("preserves a textual chunk that does not carry privacy metadata", () => {
    const source = deterministicPng(12, 16, 10);
    const chunks = parsePngChunks(source);
    const withPublicText = Buffer.concat([
      source.subarray(0, 8),
      chunks[0]?.raw ?? Buffer.alloc(0),
      chunk("tEXt", Buffer.from("Title\0Approved cover", "utf8")),
      ...chunks.slice(1).map((item) => item.raw),
    ]);
    const result = sanitizePngMetadata(withPublicText);
    expect(result.removed_chunk_count).toBe(0);
    expect(result.bytes).toEqual(withPublicText);
  });

  it("fails closed on malformed CRC and trailing bytes", () => {
    const invalidCrc = Buffer.from(deterministicPng(12, 16, 9));
    const finalByte = invalidCrc.length - 1;
    invalidCrc[finalByte] = (invalidCrc[finalByte] ?? 0) ^ 0xff;
    expect(() => sanitizePngMetadata(invalidCrc)).toThrow(/CRC/u);
    expect(() =>
      sanitizePngMetadata(Buffer.concat([deterministicPng(12, 16, 9), Buffer.from([0])])),
    ).toThrow(/after IEND/u);
  });
});
