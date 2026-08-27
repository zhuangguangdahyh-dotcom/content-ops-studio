import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import type { ProjectLock } from "../../../contracts/src/generated/1.0/index.js";
import type { Clock, IdFactory } from "../types.js";
import { AppendOnlyJsonlStore, AtomicJsonStore } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";
import type { RunJournal } from "../journal/index.js";

export interface LockOwner {
  processId: string;
  hostLabel: string;
}

export class ProjectLockManager {
  constructor(
    private readonly locksDirectory: string,
    private readonly clock: Clock,
    private readonly ids: IdFactory,
    private readonly owner: LockOwner,
    private readonly leaseMs: number,
  ) {}

  #file(projectId: string): string {
    return path.join(this.locksDirectory, `${projectId}.lock.json`);
  }
  #history(projectId: string): AppendOnlyJsonlStore<ProjectLock> {
    return new AppendOnlyJsonlStore(
      path.join(this.locksDirectory, "history", `${projectId}.jsonl`),
    );
  }

  async acquireProjectWriteLock(projectId: string, runId: string): Promise<ProjectLock> {
    await mkdir(this.locksDirectory, { recursive: true, mode: 0o700 });
    const acquired = this.clock.now();
    const lock: ProjectLock = {
      lock_id: this.ids.next("LOCK"),
      project_id: projectId,
      run_id: runId,
      owner_process_id: this.owner.processId,
      owner_host_label: this.owner.hostLabel,
      acquired_at: acquired.toISOString(),
      expires_at: new Date(acquired.getTime() + this.leaseMs).toISOString(),
      last_heartbeat_at: acquired.toISOString(),
      lock_version: 1,
      status: "LOCK_ACTIVE",
      recovery_reason: null,
      schema_version: "1.0.0",
      extensions: {},
    };
    let handle;
    try {
      handle = await open(this.#file(projectId), "wx", 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "EEXIST")
        throw new RuntimeFailure("PROJECT_LOCKED", "Project already has an active lock.", 3);
      throw error;
    }
    try {
      await handle.writeFile(`${JSON.stringify(lock, null, 2)}\n`);
      await handle.sync();
    } finally {
      await handle.close();
    }
    return lock;
  }

  async inspectProjectLock(projectId: string): Promise<ProjectLock | null> {
    try {
      const lock = JSON.parse(await readFile(this.#file(projectId), "utf8")) as ProjectLock;
      if (
        lock.status === "LOCK_ACTIVE" &&
        Date.parse(lock.expires_at) <= this.clock.now().getTime()
      )
        return { ...lock, status: "LOCK_STALE" };
      return lock;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      if (error instanceof SyntaxError)
        throw new RuntimeFailure("LOCK_CORRUPTION", "Lock JSON is invalid.", 6);
      throw error;
    }
  }

  #assertOwner(lock: ProjectLock): void {
    if (
      lock.owner_process_id !== this.owner.processId ||
      lock.owner_host_label !== this.owner.hostLabel
    )
      throw new RuntimeFailure("LOCK_OWNER_MISMATCH", "Lock belongs to another owner.", 3);
  }

  async refreshProjectWriteLock(projectId: string): Promise<ProjectLock> {
    const lock = await this.inspectProjectLock(projectId);
    if (!lock || lock.status !== "LOCK_ACTIVE")
      throw new RuntimeFailure("LOCK_NOT_ACTIVE", "Lock is not active.", 3);
    this.#assertOwner(lock);
    const now = this.clock.now();
    const refreshed: ProjectLock = {
      ...lock,
      last_heartbeat_at: now.toISOString(),
      expires_at: new Date(now.getTime() + this.leaseMs).toISOString(),
      lock_version: lock.lock_version + 1,
    };
    await new AtomicJsonStore<ProjectLock>(this.#file(projectId)).write(refreshed);
    return refreshed;
  }

  async releaseProjectWriteLock(projectId: string): Promise<ProjectLock> {
    const lock = await this.inspectProjectLock(projectId);
    if (!lock) throw new RuntimeFailure("LOCK_NOT_FOUND", "Lock does not exist.", 5);
    this.#assertOwner(lock);
    const released: ProjectLock = {
      ...lock,
      status: "LOCK_RELEASED",
      lock_version: lock.lock_version + 1,
    };
    await this.#history(projectId).append(released);
    await unlink(this.#file(projectId));
    return released;
  }

  async recoverStaleProjectLock(
    projectId: string,
    reason: string,
    journal?: RunJournal,
  ): Promise<ProjectLock> {
    const lock = await this.inspectProjectLock(projectId);
    if (!lock || lock.status !== "LOCK_STALE")
      throw new RuntimeFailure("LOCK_NOT_STALE", "Only a stale lock can be recovered.", 3);
    if (!reason.trim()) throw new RuntimeFailure("RECOVERY_REASON_REQUIRED", "Reason required.", 5);
    const recovered: ProjectLock = {
      ...lock,
      status: "LOCK_RECOVERED",
      recovery_reason: reason,
      lock_version: lock.lock_version + 1,
    };
    await this.#history(projectId).append(recovered);
    const archived = `${this.#file(projectId)}.${lock.lock_id}.recovered`;
    await rename(this.#file(projectId), archived);
    if (journal)
      await journal.appendEvent({
        event_type: "LOCK_RECOVERED",
        run_id: lock.run_id,
        project_id: lock.project_id,
        workflow_id: "LOCK_RECOVERY",
        step_id: null,
        status: "RECORDED",
        payload_summary: { reason },
      });
    return recovered;
  }
}

export async function acquireProjectWriteLock(
  manager: ProjectLockManager,
  projectId: string,
  runId: string,
) {
  return manager.acquireProjectWriteLock(projectId, runId);
}
export async function refreshProjectWriteLock(manager: ProjectLockManager, projectId: string) {
  return manager.refreshProjectWriteLock(projectId);
}
export async function releaseProjectWriteLock(manager: ProjectLockManager, projectId: string) {
  return manager.releaseProjectWriteLock(projectId);
}
export async function inspectProjectLock(manager: ProjectLockManager, projectId: string) {
  return manager.inspectProjectLock(projectId);
}
export async function recoverStaleProjectLock(
  manager: ProjectLockManager,
  projectId: string,
  reason: string,
  journal?: RunJournal,
) {
  return manager.recoverStaleProjectLock(projectId, reason, journal);
}
