import { readFile } from "node:fs/promises";
import path from "node:path";
import type { ProjectRegistry } from "../../../contracts/src/generated/1.0/index.js";
import type { SchemaRegistry } from "../../../contracts/src/validation/index.js";
import { AtomicJsonStore, canonicalJson, sha256 } from "../storage/index.js";
import { RuntimeFailure } from "../types.js";

const PROJECT_REGISTRY_SCHEMA =
  "https://content-ops-studio.local/schemas/1.0/project-registry.schema.json";

interface RegistryFile {
  schema_version: "1.0.0";
  entries: ProjectRegistry[];
  idempotency: Record<string, { input_hash: string; project_id: string }>;
  last_active_project_id: string | null;
  updated_at: string;
}

function hasSecret(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasSecret);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value as Record<string, unknown>).some(
    ([key, child]) =>
      /token|secret|authorization|api[_-]?key|signed[_-]?url/i.test(key) || hasSecret(child),
  );
}

export class ProjectRegistryStore {
  readonly file: string;
  readonly #store: AtomicJsonStore<RegistryFile>;

  constructor(
    home: string,
    private readonly schemas: SchemaRegistry,
    private readonly now: () => string,
  ) {
    this.file = path.join(home, "registry/projects.json");
    this.#store = new AtomicJsonStore(this.file, (value) => this.#validateFile(value));
  }

  #empty(): RegistryFile {
    return {
      schema_version: "1.0.0",
      entries: [],
      idempotency: {},
      last_active_project_id: null,
      updated_at: this.now(),
    };
  }

  #validateFile(value: unknown): void {
    const file = value as RegistryFile;
    if (!file || file.schema_version !== "1.0.0" || !Array.isArray(file.entries))
      throw new RuntimeFailure("REGISTRY_CORRUPTION", "Registry wrapper is invalid.", 6);
    if (hasSecret(file))
      throw new RuntimeFailure(
        "REGISTRY_SECRET_FORBIDDEN",
        "Registry contains secret-like keys.",
        5,
      );
    const ids = new Set<string>();
    for (const entry of file.entries) {
      this.schemas.assertValid(PROJECT_REGISTRY_SCHEMA, entry);
      if (ids.has(entry.project_id))
        throw new RuntimeFailure(
          "REGISTRY_DUPLICATE_ID",
          "Registry contains duplicate Project ID.",
          6,
        );
      ids.add(entry.project_id);
    }
  }

  async readRegistry(): Promise<RegistryFile> {
    try {
      return await this.#store.read();
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return this.#empty();
      if (error instanceof SyntaxError)
        throw new RuntimeFailure("REGISTRY_CORRUPTION", "Registry JSON cannot be parsed.", 6);
      throw error;
    }
  }

  async upsertProject(
    entry: ProjectRegistry,
    idempotencyKey: string,
  ): Promise<{ entry: ProjectRegistry; replayed: boolean }> {
    this.schemas.assertValid(PROJECT_REGISTRY_SCHEMA, entry);
    const registry = await this.readRegistry();
    const inputHash = sha256(canonicalJson(entry));
    const prior = registry.idempotency[idempotencyKey];
    if (prior) {
      if (prior.input_hash !== inputHash)
        throw new RuntimeFailure("IDEMPOTENCY_CONFLICT", "Registry key has different input.", 3);
      const existing = registry.entries.find((item) => item.project_id === prior.project_id);
      if (!existing)
        throw new RuntimeFailure(
          "REGISTRY_CORRUPTION",
          "Idempotency points to missing project.",
          6,
        );
      return { entry: existing, replayed: true };
    }
    const index = registry.entries.findIndex((item) => item.project_id === entry.project_id);
    if (index >= 0) registry.entries[index] = structuredClone(entry);
    else registry.entries.push(structuredClone(entry));
    registry.entries.sort((left, right) => left.project_id.localeCompare(right.project_id, "en"));
    registry.idempotency[idempotencyKey] = { input_hash: inputHash, project_id: entry.project_id };
    registry.updated_at = this.now();
    await this.#store.write(registry);
    return { entry: structuredClone(entry), replayed: false };
  }

  async findProjectById(projectId: string): Promise<ProjectRegistry | null> {
    return (
      (await this.readRegistry()).entries.find((entry) => entry.project_id === projectId) ?? null
    );
  }

  async findProjectsByName(name: string): Promise<ProjectRegistry[]> {
    return (await this.readRegistry()).entries.filter((entry) => entry.display_name === name);
  }

  async setLastActiveProject(projectId: string): Promise<void> {
    const registry = await this.readRegistry();
    if (!registry.entries.some((entry) => entry.project_id === projectId))
      throw new RuntimeFailure("PROJECT_NOT_RESOLVED", "Project does not exist.", 5);
    registry.last_active_project_id = projectId;
    registry.updated_at = this.now();
    await this.#store.write(registry);
  }

  async markProjectStatus(
    projectId: string,
    status: ProjectRegistry["project_status"],
  ): Promise<ProjectRegistry> {
    const registry = await this.readRegistry();
    const entry = registry.entries.find((item) => item.project_id === projectId);
    if (!entry) throw new RuntimeFailure("PROJECT_NOT_RESOLVED", "Project does not exist.", 5);
    entry.project_status = status;
    entry.updated_at = this.now();
    registry.updated_at = this.now();
    await this.#store.write(registry);
    return structuredClone(entry);
  }

  async verifyRegistry(): Promise<{ valid: true; file_hash: string; entry_count: number }> {
    const registry = await this.readRegistry();
    return {
      valid: true,
      file_hash: sha256(await readFile(this.file)),
      entry_count: registry.entries.length,
    };
  }

  async repairRegistry(replacement: ProjectRegistry[], reason: string): Promise<void> {
    if (!reason.trim())
      throw new RuntimeFailure("REPAIR_REASON_REQUIRED", "Repair needs a reason.", 5);
    const repaired = this.#empty();
    repaired.entries = structuredClone(replacement);
    repaired.updated_at = this.now();
    await this.#store.write(repaired);
  }
}

export async function readRegistry(store: ProjectRegistryStore) {
  return store.readRegistry();
}
export async function upsertProject(
  store: ProjectRegistryStore,
  entry: ProjectRegistry,
  idempotencyKey: string,
) {
  return store.upsertProject(entry, idempotencyKey);
}
export async function findProjectById(store: ProjectRegistryStore, projectId: string) {
  return store.findProjectById(projectId);
}
export async function findProjectsByName(store: ProjectRegistryStore, name: string) {
  return store.findProjectsByName(name);
}
export async function setLastActiveProject(store: ProjectRegistryStore, projectId: string) {
  return store.setLastActiveProject(projectId);
}
export async function markProjectStatus(
  store: ProjectRegistryStore,
  projectId: string,
  status: ProjectRegistry["project_status"],
) {
  return store.markProjectStatus(projectId, status);
}
export async function verifyRegistry(store: ProjectRegistryStore) {
  return store.verifyRegistry();
}
export async function repairRegistry(
  store: ProjectRegistryStore,
  replacement: ProjectRegistry[],
  reason: string,
) {
  return store.repairRegistry(replacement, reason);
}
