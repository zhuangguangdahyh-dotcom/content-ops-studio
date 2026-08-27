import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StyleLock } from "../../../contracts/src/generated/1.0/index.js";
import { issue, validationOutcome, type ValidationOutcome } from "../validation-result.js";

export type AssetReference = StyleLock["source_first_page_asset"];

export interface AssetReader {
  read(relativePath: string): Promise<Uint8Array>;
  exists(relativePath: string): Promise<boolean>;
}

export interface AssetWriter {
  write(relativePath: string, content: Uint8Array): Promise<AssetReference>;
}

export interface AssetHasher {
  calculateChecksum(content: Uint8Array | string): string;
}

export interface AssetStore extends AssetReader, AssetWriter, AssetHasher {}

const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const WINDOWS_ABSOLUTE = /^[A-Za-z]:[\\/]/;

export function validateRelativeProjectPath(relativePath: string): ValidationOutcome {
  const issues = [];
  if (!relativePath) issues.push(issue("ASSET_PATH_EMPTY", "Asset path must not be empty."));
  if (path.posix.isAbsolute(relativePath) || WINDOWS_ABSOLUTE.test(relativePath))
    issues.push(issue("ASSET_PATH_ABSOLUTE", "Asset path must be project-relative."));
  if (/^file:/i.test(relativePath))
    issues.push(issue("ASSET_PATH_URI_FORBIDDEN", "File URIs are not project-relative paths."));
  if (relativePath.includes("\0"))
    issues.push(issue("ASSET_PATH_NUL", "Asset path must not contain a NUL byte."));
  const segments = relativePath.replaceAll("\\", "/").split("/");
  if (segments.includes(".."))
    issues.push(issue("ASSET_PATH_TRAVERSAL", "Asset path must not escape the project root."));
  return validationOutcome(issues);
}

export function validateChecksumFormat(checksum: string): ValidationOutcome {
  return validationOutcome(
    SHA256_PATTERN.test(checksum)
      ? []
      : [issue("CHECKSUM_FORMAT_INVALID", "Checksum must be lowercase SHA-256 hexadecimal.")],
  );
}

export function calculateFileSha256(content: Uint8Array | string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function validateAssetContentChecksum(
  asset: Pick<AssetReference, "checksum">,
  content: Uint8Array | string,
): ValidationOutcome {
  return validationOutcome(
    asset.checksum === calculateFileSha256(content)
      ? []
      : [
          issue(
            "CHECKSUM_CONTENT_MISMATCH",
            "Asset checksum does not match the supplied file content.",
            "/checksum",
          ),
        ],
  );
}

export function normalizeAssetReference(asset: AssetReference): AssetReference {
  return {
    ...asset,
    mime_type: asset.mime_type.toLowerCase(),
    relative_path: asset.relative_path.replaceAll("\\", "/").replace(/^\.\//, ""),
    checksum: asset.checksum.toLowerCase(),
    extensions: { ...asset.extensions },
  };
}

export function calculateExpectedPageFileNames(pageCount: number): string[] {
  if (!Number.isInteger(pageCount) || pageCount < 1)
    throw new Error("PAGE_COUNT_INVALID: page count must be a positive integer.");
  return Array.from({ length: pageCount }, (_, index) =>
    index === 0 ? "01-cover.png" : `${String(index + 1).padStart(2, "0")}.png`,
  );
}

export function calculateVersionedPageFileNames(pageCount: number, version: number): string[] {
  if (!Number.isInteger(version) || version < 1)
    throw new Error("ASSET_VERSION_INVALID: asset version must be a positive integer.");
  const suffix = `_v${String(version).padStart(3, "0")}.png`;
  return calculateExpectedPageFileNames(pageCount).map((name) => name.replace(/\.png$/, suffix));
}

export function validatePageAssetCompleteness(
  pageAssets: Array<{ page_number: number; asset: AssetReference }>,
  expectedPageCount: number,
): ValidationOutcome {
  const issues = [];
  const pages = pageAssets.map((item) => item.page_number);
  const expected = Array.from({ length: expectedPageCount }, (_, index) => index + 1);
  for (const page of expected)
    if (!pages.includes(page))
      issues.push(issue("PAGE_ASSET_MISSING", `Page ${page} has no final asset.`, "/final_assets"));
  if (new Set(pages).size !== pages.length)
    issues.push(
      issue("PAGE_ASSET_DUPLICATE", "A page has more than one final asset.", "/final_assets"),
    );
  for (const [index, item] of pageAssets.entries()) {
    issues.push(
      ...validateRelativeProjectPath(item.asset.relative_path).issues.map((entry) => ({
        ...entry,
        path: `/final_assets/${index}/asset/relative_path`,
      })),
      ...validateChecksumFormat(item.asset.checksum).issues.map((entry) => ({
        ...entry,
        path: `/final_assets/${index}/asset/checksum`,
      })),
    );
  }
  return validationOutcome(issues);
}

export function validateManifestReferences(
  referencedIds: readonly string[],
  availableIds: ReadonlySet<string>,
  pathPrefix = "/references",
): ValidationOutcome {
  return validationOutcome(
    referencedIds.flatMap((id, index) =>
      availableIds.has(id)
        ? []
        : [
            issue(
              "MANIFEST_REFERENCE_MISSING",
              `Referenced artifact ${id} does not exist.`,
              `${pathPrefix}/${index}`,
            ),
          ],
    ),
  );
}

export class InMemoryAssetStore implements AssetStore {
  private readonly entries = new Map<string, Uint8Array>();

  constructor(
    private readonly referenceFactory: (
      relativePath: string,
      content: Uint8Array,
    ) => AssetReference,
  ) {}

  calculateChecksum(content: Uint8Array | string): string {
    return calculateFileSha256(content);
  }

  async write(relativePath: string, content: Uint8Array): Promise<AssetReference> {
    const validation = validateRelativeProjectPath(relativePath);
    if (!validation.valid) throw new Error(validation.issues.map((entry) => entry.code).join(","));
    if (this.entries.has(relativePath)) throw new Error(`ASSET_ALREADY_EXISTS: ${relativePath}`);
    this.entries.set(relativePath, new Uint8Array(content));
    return Promise.resolve(this.referenceFactory(relativePath, content));
  }

  async read(relativePath: string): Promise<Uint8Array> {
    const value = this.entries.get(relativePath);
    if (!value) throw new Error(`ASSET_NOT_FOUND: ${relativePath}`);
    return Promise.resolve(new Uint8Array(value));
  }

  async exists(relativePath: string): Promise<boolean> {
    return Promise.resolve(this.entries.has(relativePath));
  }
}

export class TemporaryFilesystemAssetStore implements AssetStore {
  constructor(
    private readonly temporaryRoot: string,
    private readonly referenceFactory: (
      relativePath: string,
      content: Uint8Array,
    ) => AssetReference,
  ) {
    if (!path.isAbsolute(temporaryRoot))
      throw new Error("TEMPORARY_ROOT_INVALID: temporary root must be absolute.");
  }

  calculateChecksum(content: Uint8Array | string): string {
    return calculateFileSha256(content);
  }

  private resolve(relativePath: string): string {
    const validation = validateRelativeProjectPath(relativePath);
    if (!validation.valid) throw new Error(validation.issues.map((entry) => entry.code).join(","));
    const resolved = path.resolve(this.temporaryRoot, relativePath);
    const prefix = `${path.resolve(this.temporaryRoot)}${path.sep}`;
    if (!resolved.startsWith(prefix)) throw new Error("ASSET_PATH_TRAVERSAL");
    return resolved;
  }

  async write(relativePath: string, content: Uint8Array): Promise<AssetReference> {
    const target = this.resolve(relativePath);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, content, { flag: "wx" });
    return this.referenceFactory(relativePath, content);
  }

  async read(relativePath: string): Promise<Uint8Array> {
    return readFile(this.resolve(relativePath));
  }

  async exists(relativePath: string): Promise<boolean> {
    try {
      await stat(this.resolve(relativePath));
      return true;
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") return false;
      throw error;
    }
  }
}
