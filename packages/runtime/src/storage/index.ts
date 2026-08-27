import { createHash } from "node:crypto";
import {
  lstat,
  mkdir,
  open,
  readFile,
  readlink,
  realpath,
  rename,
  stat,
  unlink,
} from "node:fs/promises";
import path from "node:path";
import { RuntimeFailure } from "../types.js";

export function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, item]) => [key, canonicalize(item)]),
  );
}

export function canonicalJson(value: unknown): string {
  return JSON.stringify(canonicalize(value));
}

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export function resolveSafePath(root: string, relativePath: string): string {
  if (!path.isAbsolute(root))
    throw new RuntimeFailure("ROOT_NOT_ABSOLUTE", "Root must be absolute.", 5);
  if (path.isAbsolute(relativePath) || relativePath.includes("\0"))
    throw new RuntimeFailure("PATH_ESCAPE", "Path must be relative and contain no NUL.", 5);
  const resolvedRoot = path.resolve(root);
  const candidate = path.resolve(resolvedRoot, relativePath);
  const relation = path.relative(resolvedRoot, candidate);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
    throw new RuntimeFailure("PATH_ESCAPE", "Path escapes the supplied root.", 5);
  return candidate;
}

export async function rejectSymlinkEscape(root: string, candidate: string): Promise<void> {
  const realRoot = await realpath(root);
  const lexicalRelation = path.relative(path.resolve(root), path.resolve(candidate));
  if (
    lexicalRelation === ".." ||
    lexicalRelation.startsWith(`..${path.sep}`) ||
    path.isAbsolute(lexicalRelation)
  )
    throw new RuntimeFailure("SYMLINK_ESCAPE", "Candidate is outside root.", 5);
  let cursor = path.resolve(root);
  for (const component of lexicalRelation.split(path.sep).filter(Boolean)) {
    cursor = path.join(cursor, component);
    try {
      const metadata = await lstat(cursor);
      if (metadata.isSymbolicLink()) {
        const target = await readlink(cursor);
        const resolvedTarget = path.resolve(path.dirname(cursor), target);
        const targetRelation = path.relative(realRoot, resolvedTarget);
        if (
          targetRelation === ".." ||
          targetRelation.startsWith(`..${path.sep}`) ||
          path.isAbsolute(targetRelation)
        )
          throw new RuntimeFailure("SYMLINK_ESCAPE", "Symbolic link resolves outside root.", 5);
        cursor = resolvedTarget;
      }
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") break;
      throw error;
    }
  }
  let existing = candidate;
  while (existing !== path.dirname(existing)) {
    try {
      await stat(existing);
      break;
    } catch {
      existing = path.dirname(existing);
    }
  }
  const realExisting = await realpath(existing);
  const relation = path.relative(realRoot, realExisting);
  if (relation === ".." || relation.startsWith(`..${path.sep}`) || path.isAbsolute(relation))
    throw new RuntimeFailure("SYMLINK_ESCAPE", "Existing path resolves outside root.", 5);
}

export class AtomicJsonStore<T> {
  constructor(
    readonly file: string,
    private readonly validate?: (value: unknown) => void,
  ) {}

  async read(): Promise<T> {
    const value = JSON.parse(await readFile(this.file, "utf8")) as T;
    this.validate?.(value);
    return value;
  }

  async write(value: T, options: { nonOverwrite?: boolean } = {}): Promise<{ sha256: string }> {
    this.validate?.(value);
    await mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
    if (options.nonOverwrite) {
      try {
        await stat(this.file);
        throw new RuntimeFailure("TARGET_EXISTS", "Atomic target already exists.", 3);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
    const body = `${JSON.stringify(value, null, 2)}\n`;
    const temporary = path.join(
      path.dirname(this.file),
      `.${path.basename(this.file)}.${process.pid}.${sha256(body).slice(0, 12)}.tmp`,
    );
    const handle = await open(temporary, "wx", 0o600);
    try {
      await handle.writeFile(body, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    try {
      await rename(temporary, this.file);
    } catch (error) {
      await unlink(temporary).catch(() => undefined);
      throw error;
    }
    const reread = await readFile(this.file, "utf8");
    if (sha256(reread) !== sha256(body))
      throw new RuntimeFailure("ATOMIC_WRITE_HASH_MISMATCH", "Atomic read-back hash differs.", 6);
    this.validate?.(JSON.parse(reread));
    return { sha256: sha256(reread) };
  }
}

export class AppendOnlyJsonlStore<T> {
  constructor(readonly file: string) {}

  async append(value: T): Promise<number> {
    await mkdir(path.dirname(this.file), { recursive: true, mode: 0o700 });
    const line = `${canonicalJson(value)}\n`;
    const handle = await open(this.file, "a", 0o600);
    try {
      await handle.write(line, null, "utf8");
      await handle.sync();
    } finally {
      await handle.close();
    }
    const values = await this.readAll();
    if (canonicalJson(values.at(-1)) !== canonicalJson(value))
      throw new RuntimeFailure("JSONL_TAIL_MISMATCH", "Appended JSONL tail differs.", 6);
    return values.length;
  }

  async readAll(): Promise<T[]> {
    let body: string;
    try {
      body = await readFile(this.file, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw error;
    }
    if (body && !body.endsWith("\n"))
      throw new RuntimeFailure("JSONL_PARTIAL_LINE", "JSONL ends with a partial line.", 6);
    return body
      .split("\n")
      .filter(Boolean)
      .map((line, index) => {
        try {
          return JSON.parse(line) as T;
        } catch {
          throw new RuntimeFailure("JSONL_CORRUPTION", `JSONL line ${index + 1} is invalid.`, 6);
        }
      });
  }
}

export class FileIntegrityVerifier {
  async verify(file: string, expected: string): Promise<boolean> {
    return sha256(await readFile(file)) === expected;
  }
}

export const CanonicalJsonSerializer = { stringify: canonicalJson, canonicalize };
export const SafePathResolver = { resolve: resolveSafePath, rejectSymlinkEscape };
