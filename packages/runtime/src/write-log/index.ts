import type { WriteLog } from "../../../contracts/src/generated/1.0/index.js";
import { AppendOnlyJsonlStore } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";

export class WriteLogStore {
  readonly #store: AppendOnlyJsonlStore<WriteLog>;
  constructor(file: string) {
    this.#store = new AppendOnlyJsonlStore(file);
  }

  async appendWriteAttempt(record: WriteLog): Promise<WriteLog> {
    const history = await this.#store.readAll();
    const sameKey = history.filter((item) => item.idempotency_key === record.idempotency_key);
    const verified = sameKey.find((item) => item.verification_status === "VERIFIED");
    if (verified) return verified;
    const expectedAttempt = sameKey.length + 1;
    if (record.attempt_number !== expectedAttempt)
      throw new RuntimeFailure("WRITE_ATTEMPT_SEQUENCE", `Expected attempt ${expectedAttempt}.`, 3);
    await this.#store.append(record);
    return record;
  }

  async #mark(
    idempotencyKey: string,
    status: "VERIFIED" | "PARTIAL" | "FAILED",
    completedAt: string,
    details: string,
  ): Promise<WriteLog> {
    const history = await this.#store.readAll();
    const current = [...history].reverse().find((item) => item.idempotency_key === idempotencyKey);
    if (!current) throw new RuntimeFailure("WRITE_NOT_FOUND", "Write attempt not found.", 5);
    if (current.verification_status === "VERIFIED") return current;
    const update: WriteLog = {
      ...current,
      write_id: `${current.write_id}-${status}-${current.attempt_number}`,
      operation: "VERIFY",
      verification_status: status,
      verification_details: details,
      completed_at: completedAt,
    };
    await this.#store.append(update);
    return update;
  }

  markWriteVerified(key: string, completedAt: string, details = "Read-after-write verified.") {
    return this.#mark(key, "VERIFIED", completedAt, details);
  }
  markWritePartial(key: string, completedAt: string, details: string) {
    return this.#mark(key, "PARTIAL", completedAt, details);
  }
  markWriteFailed(key: string, completedAt: string, details: string) {
    return this.#mark(key, "FAILED", completedAt, details);
  }
  async findByIdempotencyKey(key: string): Promise<WriteLog[]> {
    return (await this.#store.readAll()).filter((item) => item.idempotency_key === key);
  }
  async verifyWriteHistory(): Promise<{ valid: true; entries: number }> {
    const history = await this.#store.readAll();
    const attempts = new Map<string, number>();
    for (const record of history) {
      if (record.operation === "VERIFY") continue;
      const expected = (attempts.get(record.idempotency_key) ?? 0) + 1;
      if (record.attempt_number !== expected)
        throw new RuntimeFailure("WRITE_HISTORY_CORRUPTION", record.idempotency_key, 6);
      attempts.set(record.idempotency_key, expected);
    }
    return { valid: true, entries: history.length };
  }
  readAll(): Promise<WriteLog[]> {
    return this.#store.readAll();
  }
}

export async function appendWriteAttempt(store: WriteLogStore, record: WriteLog) {
  return store.appendWriteAttempt(record);
}
export async function markWriteVerified(store: WriteLogStore, key: string, at: string) {
  return store.markWriteVerified(key, at);
}
export async function markWritePartial(
  store: WriteLogStore,
  key: string,
  at: string,
  details: string,
) {
  return store.markWritePartial(key, at, details);
}
export async function markWriteFailed(
  store: WriteLogStore,
  key: string,
  at: string,
  details: string,
) {
  return store.markWriteFailed(key, at, details);
}
export async function findByIdempotencyKey(store: WriteLogStore, key: string) {
  return store.findByIdempotencyKey(key);
}
export async function verifyWriteHistory(store: WriteLogStore) {
  return store.verifyWriteHistory();
}
