import { createHash } from "node:crypto";

export type RuntimeMode = "MOCK" | "DRY_RUN" | "PRODUCTION";
export type CapabilityStatus =
  "AVAILABLE" | "MOCK_ONLY" | "NOT_IMPLEMENTED" | "UNAVAILABLE" | "BLOCKED" | "UNKNOWN";

export interface Clock {
  now(): Date;
}

export interface IdFactory {
  next(prefix: string): string;
}

export interface HashProvider {
  sha256(value: string | Uint8Array): string;
}

export const systemClock: Clock = { now: () => new Date() };

export class DeterministicIdFactory implements IdFactory {
  #counter = 0;
  constructor(private readonly seed = "FIXTURE") {}
  next(prefix: string): string {
    this.#counter += 1;
    return `${prefix}-${this.seed}-${String(this.#counter).padStart(4, "0")}`;
  }
}

export const nodeHashProvider: HashProvider = {
  sha256(value) {
    return createHash("sha256").update(value).digest("hex");
  },
};

export class RuntimeFailure extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly exitCode: 2 | 3 | 4 | 5 | 6 = 4,
  ) {
    super(message);
    this.name = "RuntimeFailure";
  }
}

export function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactValue);
  if (!value || typeof value !== "object") return value;
  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    output[key] = /token|secret|authorization|api[_-]?key|signed[_-]?url/i.test(key)
      ? "[REDACTED]"
      : redactValue(item);
  }
  return output;
}
