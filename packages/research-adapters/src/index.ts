import { createHash } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry, type SchemaRegistry } from "@content-ops/contracts";
import {
  deduplicateSources,
  normalizeResearchSource,
  validatePainpointBatch,
  type NormalizedResearchSource,
  type ResearchPainpoint,
} from "@content-ops/core";

export type ResearchAdapterMode = "HOST_NATIVE" | "MANUAL_SOURCE" | "FIXTURE";
export type ResearchSessionStatus =
  "CREATED" | "SOURCES_INGESTED" | "CANDIDATES_INGESTED" | "REPORT_BUILT" | "FINALIZED" | "BLOCKED";

export interface ResearchSessionState {
  session_id: string;
  project_id: string;
  run_id: string;
  research_plan_id: string;
  mode: ResearchAdapterMode;
  status: ResearchSessionStatus;
  plan_hash: string;
  source_manifest_path: string | null;
  candidate_path: string | null;
  report_path: string | null;
  batch_path: string | null;
  checkpoint: number;
  created_at: string;
  updated_at: string;
}

export interface ResearchCapabilities {
  mode: ResearchAdapterMode;
  external_network: false;
  accepts_host_sources: boolean;
  accepts_manual_sources: boolean;
  fixture_only: boolean;
  persistence: "ATOMIC_LOCAL_ARTIFACTS";
}

export interface ResearchAdapter {
  probeCapabilities(): Promise<ResearchCapabilities>;
  validateResearchPlan(plan: unknown): Promise<void>;
  createResearchSession(plan: Record<string, unknown>): Promise<ResearchSessionState>;
  ingestSources(sessionId: string, manifest: unknown): Promise<ResearchSessionState>;
  normalizeSources(sources: NormalizedResearchSource[]): Promise<{
    unique: NormalizedResearchSource[];
    duplicates: NormalizedResearchSource[];
  }>;
  validateEvidence(evidence: unknown[]): Promise<void>;
  ingestPainpointCandidates(
    sessionId: string,
    candidates: unknown[],
  ): Promise<ResearchSessionState>;
  validatePainpointCandidates(
    candidates: ResearchPainpoint[],
    allowHypotheses: boolean,
  ): Promise<void>;
  buildResearchReport(sessionId: string, report: unknown): Promise<ResearchSessionState>;
  finalizePainpointBatch(sessionId: string, batch: unknown): Promise<ResearchSessionState>;
  inspectResearchSession(sessionId: string): Promise<ResearchSessionState>;
  resumeResearchSession(sessionId: string): Promise<ResearchSessionState>;
}

function assertSafeSegment(value: string): void {
  if (!/^[A-Z0-9][A-Z0-9-]{2,95}$/i.test(value)) throw new Error("RESEARCH_SESSION_ID_UNSAFE");
}

function stableHash(value: unknown): string {
  const normalize = (item: unknown): unknown => {
    if (Array.isArray(item)) return item.map(normalize);
    if (item && typeof item === "object")
      return Object.fromEntries(
        Object.entries(item as Record<string, unknown>)
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([key, child]) => [key, normalize(child)]),
      );
    return item;
  };
  return createHash("sha256")
    .update(JSON.stringify(normalize(value)))
    .digest("hex");
}

abstract class PersistentResearchAdapter implements ResearchAdapter {
  readonly mode: ResearchAdapterMode;
  readonly sessionsRoot: string;
  readonly schemaRoot: string | undefined;
  private registryPromise: Promise<SchemaRegistry> | undefined;

  protected constructor(options: {
    mode: ResearchAdapterMode;
    sessionsRoot: string;
    schemaRoot?: string;
  }) {
    this.mode = options.mode;
    this.sessionsRoot = path.resolve(options.sessionsRoot);
    this.schemaRoot = options.schemaRoot ? path.resolve(options.schemaRoot) : undefined;
  }

  abstract probeCapabilities(): Promise<ResearchCapabilities>;

  private registry(): Promise<SchemaRegistry> {
    const registry =
      this.registryPromise ??
      (this.schemaRoot ? loadSchemaRegistry(this.schemaRoot) : loadSchemaRegistry());
    this.registryPromise = registry;
    return registry;
  }

  private sessionRoot(sessionId: string): string {
    assertSafeSegment(sessionId);
    const result = path.resolve(this.sessionsRoot, sessionId);
    if (path.dirname(result) !== this.sessionsRoot) throw new Error("RESEARCH_SESSION_PATH_ESCAPE");
    return result;
  }

  private async atomicWrite(file: string, value: unknown): Promise<void> {
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const temporary = `${file}.tmp-${process.pid}`;
    const encoded = `${JSON.stringify(value, null, 2)}\n`;
    await writeFile(temporary, encoded, { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error("RESEARCH_ARTIFACT_READ_VERIFY_FAILED");
  }

  private async readState(sessionId: string): Promise<ResearchSessionState> {
    const file = path.join(this.sessionRoot(sessionId), "research-session.json");
    return JSON.parse(await readFile(file, "utf8")) as ResearchSessionState;
  }

  private async updateState(
    sessionId: string,
    update: Partial<ResearchSessionState>,
  ): Promise<ResearchSessionState> {
    const state = await this.readState(sessionId);
    const next = {
      ...state,
      ...update,
      checkpoint: state.checkpoint + 1,
      updated_at: new Date().toISOString(),
    };
    await this.atomicWrite(path.join(this.sessionRoot(sessionId), "research-session.json"), next);
    return next;
  }

  async validateResearchPlan(plan: unknown): Promise<void> {
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/painpoint-research-plan.schema.json",
      plan,
    );
  }

  async createResearchSession(plan: Record<string, unknown>): Promise<ResearchSessionState> {
    await this.validateResearchPlan(plan);
    const sessionId = String(plan.research_plan_id);
    const now = new Date().toISOString();
    const state: ResearchSessionState = {
      session_id: sessionId,
      project_id: String(plan.project_id),
      run_id: String(plan.run_id),
      research_plan_id: sessionId,
      mode: this.mode,
      status: "CREATED",
      plan_hash: typeof plan.plan_hash === "string" ? plan.plan_hash : stableHash(plan),
      source_manifest_path: null,
      candidate_path: null,
      report_path: null,
      batch_path: null,
      checkpoint: 0,
      created_at: now,
      updated_at: now,
    };
    const root = this.sessionRoot(sessionId);
    try {
      const existing = await this.readState(sessionId);
      if (existing.plan_hash !== state.plan_hash) {
        const retainedPlan = JSON.parse(
          await readFile(path.join(root, "painpoint-research-plan.json"), "utf8"),
        ) as Record<string, unknown>;
        if (retainedPlan.plan_hash !== state.plan_hash)
          throw new Error("RESEARCH_SESSION_PLAN_CONFLICT");
        const migrated = { ...existing, plan_hash: state.plan_hash };
        await this.atomicWrite(path.join(root, "research-session.json"), migrated);
        return migrated;
      }
      return existing;
    } catch (error) {
      if (error instanceof Error && error.message === "RESEARCH_SESSION_PLAN_CONFLICT") throw error;
    }
    await this.atomicWrite(path.join(root, "painpoint-research-plan.json"), plan);
    await this.atomicWrite(path.join(root, "research-session.json"), state);
    return state;
  }

  async ingestSources(sessionId: string, manifest: unknown): Promise<ResearchSessionState> {
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/research-source-manifest.schema.json",
      manifest,
    );
    const record = manifest as { sources: NormalizedResearchSource[]; source_count: number };
    if (record.source_count === 0 || record.sources.length === 0)
      throw new Error("RESEARCH_SOURCES_REQUIRED");
    const normalized = await this.normalizeSources(record.sources);
    if (normalized.unique.length !== record.source_count)
      throw new Error("RESEARCH_SOURCE_COUNT_MISMATCH");
    const relative = "research-source-manifest.json";
    await this.atomicWrite(path.join(this.sessionRoot(sessionId), relative), manifest);
    return this.updateState(sessionId, {
      status: "SOURCES_INGESTED",
      source_manifest_path: relative,
    });
  }

  normalizeSources(sources: NormalizedResearchSource[]): Promise<{
    unique: NormalizedResearchSource[];
    duplicates: NormalizedResearchSource[];
  }> {
    return Promise.resolve(
      deduplicateSources(sources.map((source) => normalizeResearchSource(source))),
    );
  }

  async validateEvidence(evidence: unknown[]): Promise<void> {
    if (evidence.length === 0) throw new Error("RESEARCH_EVIDENCE_REQUIRED");
    const registry = await this.registry();
    for (const item of evidence)
      registry.assertValid(
        "https://content-ops-studio.local/schemas/1.0/evidence-record.schema.json",
        item,
      );
  }

  async ingestPainpointCandidates(
    sessionId: string,
    candidates: unknown[],
  ): Promise<ResearchSessionState> {
    if (candidates.length === 0) throw new Error("PAINPOINT_CANDIDATES_REQUIRED");
    const registry = await this.registry();
    for (const item of candidates)
      registry.assertValid(
        "https://content-ops-studio.local/schemas/1.0/painpoint-record.schema.json",
        item,
      );
    const relative = "painpoint-candidates.json";
    await this.atomicWrite(path.join(this.sessionRoot(sessionId), relative), candidates);
    return this.updateState(sessionId, { status: "CANDIDATES_INGESTED", candidate_path: relative });
  }

  validatePainpointCandidates(
    candidates: ResearchPainpoint[],
    allowHypotheses: boolean,
  ): Promise<void> {
    const first = candidates[0];
    if (!first) throw new Error("PAINPOINT_CANDIDATES_REQUIRED");
    const errors = validatePainpointBatch({
      project_id: first.project_id,
      research_batch_id: first.research_batch_id,
      requested_count: Math.max(candidates.length, 1),
      produced_count: candidates.length,
      evidence_backed_count: candidates.filter(
        (item) => item.evidence_confidence !== "D_HYPOTHESIS",
      ).length,
      hypothesis_count: candidates.filter((item) => item.evidence_confidence === "D_HYPOTHESIS")
        .length,
      painpoints: candidates,
      allow_hypothesis_candidates: allowHypotheses,
    });
    if (errors.length > 0)
      return Promise.reject(new Error(`PAINPOINT_CANDIDATE_INVALID:${errors.join(",")}`));
    return Promise.resolve();
  }

  async buildResearchReport(sessionId: string, report: unknown): Promise<ResearchSessionState> {
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/painpoint-research-report.schema.json",
      report,
    );
    const relative = "painpoint-research-report.json";
    await this.atomicWrite(path.join(this.sessionRoot(sessionId), relative), report);
    return this.updateState(sessionId, { status: "REPORT_BUILT", report_path: relative });
  }

  async finalizePainpointBatch(sessionId: string, batch: unknown): Promise<ResearchSessionState> {
    (await this.registry()).assertValid(
      "https://content-ops-studio.local/schemas/1.0/painpoint-batch.schema.json",
      batch,
    );
    const state = await this.readState(sessionId);
    if (state.status !== "REPORT_BUILT" && state.status !== "FINALIZED")
      throw new Error("RESEARCH_REPORT_REQUIRED_BEFORE_FINALIZE");
    const relative = "painpoint-batch.json";
    await this.atomicWrite(path.join(this.sessionRoot(sessionId), relative), batch);
    return this.updateState(sessionId, { status: "FINALIZED", batch_path: relative });
  }

  inspectResearchSession(sessionId: string): Promise<ResearchSessionState> {
    return this.readState(sessionId);
  }

  async resumeResearchSession(sessionId: string): Promise<ResearchSessionState> {
    const state = await this.readState(sessionId);
    for (const relative of [
      state.source_manifest_path,
      state.candidate_path,
      state.report_path,
      state.batch_path,
    ])
      if (relative) await readFile(path.join(this.sessionRoot(sessionId), relative), "utf8");
    return state;
  }
}

export class HostNativeResearchAdapter extends PersistentResearchAdapter {
  constructor(options: { sessionsRoot: string; schemaRoot?: string }) {
    super({ ...options, mode: "HOST_NATIVE" });
  }
  probeCapabilities(): Promise<ResearchCapabilities> {
    return Promise.resolve({
      mode: "HOST_NATIVE",
      external_network: false,
      accepts_host_sources: true,
      accepts_manual_sources: false,
      fixture_only: false,
      persistence: "ATOMIC_LOCAL_ARTIFACTS",
    });
  }
}

export class ManualSourceResearchAdapter extends PersistentResearchAdapter {
  constructor(options: { sessionsRoot: string; schemaRoot?: string }) {
    super({ ...options, mode: "MANUAL_SOURCE" });
  }
  probeCapabilities(): Promise<ResearchCapabilities> {
    return Promise.resolve({
      mode: "MANUAL_SOURCE",
      external_network: false,
      accepts_host_sources: false,
      accepts_manual_sources: true,
      fixture_only: false,
      persistence: "ATOMIC_LOCAL_ARTIFACTS",
    });
  }
}

export class FixtureResearchAdapter extends PersistentResearchAdapter {
  constructor(options: { sessionsRoot: string; schemaRoot?: string; testOnly: true }) {
    if (options.testOnly !== true || process.env.NODE_ENV === "production")
      throw new Error("FIXTURE_RESEARCH_ADAPTER_FORBIDDEN");
    super({
      sessionsRoot: options.sessionsRoot,
      ...(options.schemaRoot ? { schemaRoot: options.schemaRoot } : {}),
      mode: "FIXTURE",
    });
  }
  probeCapabilities(): Promise<ResearchCapabilities> {
    return Promise.resolve({
      mode: "FIXTURE",
      external_network: false,
      accepts_host_sources: false,
      accepts_manual_sources: false,
      fixture_only: true,
      persistence: "ATOMIC_LOCAL_ARTIFACTS",
    });
  }
}

/** @deprecated Use FixtureResearchAdapter with an explicit testOnly flag. */
export const MockResearchAdapter = FixtureResearchAdapter;
