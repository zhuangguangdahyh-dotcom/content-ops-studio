import { canonicalJson, sha256 } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";

export interface IdempotencyEntry {
  key: string;
  scope: string;
  input_hash: string;
  status: "REGISTERED" | "SUCCESS" | "FAILED" | "INVALIDATED";
  result_hash: string | null;
}

export function createIdempotencyKey(scope: string, input: unknown): string {
  return `${scope}:${sha256(canonicalJson(input))}`;
}

export class IdempotencyRegistry {
  readonly #entries = new Map<string, IdempotencyEntry>();

  registerIdempotencyKey(key: string, scope: string, input: unknown): IdempotencyEntry {
    const inputHash = sha256(canonicalJson(input));
    const existing = this.#entries.get(key);
    if (existing) {
      if (existing.input_hash !== inputHash)
        throw new RuntimeFailure("IDEMPOTENCY_CONFLICT", "Same key has different input.", 3);
      return structuredClone(existing);
    }
    const entry: IdempotencyEntry = {
      key,
      scope,
      input_hash: inputHash,
      status: "REGISTERED",
      result_hash: null,
    };
    this.#entries.set(key, entry);
    return structuredClone(entry);
  }

  findExistingOperation(key: string): IdempotencyEntry | null {
    const value = this.#entries.get(key);
    return value ? structuredClone(value) : null;
  }

  assertIdempotentReplay(key: string, input: unknown): IdempotencyEntry | null {
    const existing = this.#entries.get(key);
    if (!existing) return null;
    if (existing.input_hash !== sha256(canonicalJson(input)))
      throw new RuntimeFailure("IDEMPOTENCY_CONFLICT", "Replay input differs.", 3);
    return structuredClone(existing);
  }

  markOperationResult(
    key: string,
    status: IdempotencyEntry["status"],
    result: unknown,
  ): IdempotencyEntry {
    const existing = this.#entries.get(key);
    if (!existing) throw new RuntimeFailure("IDEMPOTENCY_NOT_REGISTERED", key, 5);
    if (existing.status === "SUCCESS" && status !== "SUCCESS")
      throw new RuntimeFailure("VERIFIED_OPERATION_IMMUTABLE", key, 3);
    existing.status = status;
    existing.result_hash = sha256(canonicalJson(result));
    return structuredClone(existing);
  }

  snapshot(): Record<string, string> {
    return Object.fromEntries(
      [...this.#entries.entries()].map(([key, value]) => [key, value.status]),
    );
  }
}

export function registerIdempotencyKey(
  registry: IdempotencyRegistry,
  key: string,
  scope: string,
  input: unknown,
) {
  return registry.registerIdempotencyKey(key, scope, input);
}
export function findExistingOperation(registry: IdempotencyRegistry, key: string) {
  return registry.findExistingOperation(key);
}
export function assertIdempotentReplay(registry: IdempotencyRegistry, key: string, input: unknown) {
  return registry.assertIdempotentReplay(key, input);
}
export function markOperationResult(
  registry: IdempotencyRegistry,
  key: string,
  status: IdempotencyEntry["status"],
  result: unknown,
) {
  return registry.markOperationResult(key, status, result);
}
