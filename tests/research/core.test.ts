import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  assessProjectProfileDiscovery,
  assignPainpointPriority,
  calculatePainpointWeightedScore,
  calculateResearchCoverage,
  calculateSourceHash,
  compilePainpointFeishuFields,
  deduplicateSources,
  detectExactPainpointDuplicates,
  normalizeResearchSource,
  validateEvidenceReferences,
  validateHypothesisRestrictions,
  validatePainpointBatch,
  validateProjectResearchReadiness,
  validateReviewBatch,
  type ResearchPainpoint,
} from "../../packages/core/src/research/index.js";

const fixtureRoot = path.resolve("tests/fixtures/contracts/1.0");
async function fixture<T>(name: string): Promise<T> {
  return JSON.parse(
    await readFile(path.join(fixtureRoot, name, "valid/complete.json"), "utf8"),
  ) as T;
}

describe("deterministic painpoint research core", () => {
  it("keeps explicit pending values and inferred fields out of semantic completeness", async () => {
    const profile = await fixture<Record<string, unknown>>("project-profile");
    const gap = assessProjectProfileDiscovery({
      ...profile,
      project_status: "PROJECT_PENDING_CONFIRMATION",
      config_confirmation_status: "CONFIG_PENDING",
      service_region: ["南京"],
      price_band: "待确认",
      extensions: {
        unresolved_fields: ["price_band", "award_evidence"],
        inferred_fields: ["content_style"],
      },
    });
    expect(gap).toMatchObject({
      missing_required_fields: [],
      missing_recommended_fields: ["price_band"],
      material_blockers: [],
      non_blocking_gaps: ["award_evidence", "price_band"],
      ready_for_project_confirmation: true,
      ready_for_painpoint_research: false,
    });
    expect(gap.inferred_fields).toEqual([
      expect.objectContaining({ field: "content_style", confirmed: false }),
    ]);
    expect(gap.profile_completeness).toBeLessThan(1);
  });

  it("blocks project confirmation when a required semantic value is unresolved", async () => {
    const profile = await fixture<Record<string, unknown>>("project-profile");
    const gap = assessProjectProfileDiscovery({
      ...profile,
      audience_profile: { role: "AUDIENCE", description: "待确认", segments: ["待确认"] },
      extensions: { unresolved_fields: ["audience_profile"] },
    });
    expect(gap.ready_for_project_confirmation).toBe(false);
    expect(gap.material_blockers).toContain("audience_profile");
  });

  it("blocks unconfirmed projects and separates recommended gaps", async () => {
    const profile = await fixture<Record<string, unknown>>("project-profile");
    expect(validateProjectResearchReadiness(profile)).toEqual({
      ready: true,
      material_blockers: [],
      non_blocking_gaps: [],
    });
    expect(
      validateProjectResearchReadiness({
        ...profile,
        project_status: "PROJECT_PAUSED",
        price_band: "",
      }),
    ).toMatchObject({
      ready: false,
      material_blockers: ["project_status_not_active"],
      non_blocking_gaps: ["price_band"],
    });
  });

  it("normalizes safe public URLs, strips tracking and verifies hashes", () => {
    const source = normalizeResearchSource({
      source_id: "SRC-DEMO-001",
      source_type: "OFFICIAL_SOURCE",
      title: "  Official  guidance ",
      publisher_or_owner: "Publisher",
      source_location: "https://example.com/guide?utm_source=test#section",
      source_date: null,
      retrieved_at: "2099-01-01T00:00:00.000Z",
      language: "en",
      summary: " Short   summary ",
      supported_claims: ["Claim"],
      limitations: "None",
      credibility_notes: "Official",
      is_first_party: true,
      is_user_provided: false,
      is_current: true,
      extensions: {},
    });
    expect(source.source_location).toBe("https://example.com/guide");
    expect(source.content_hash).toBe(calculateSourceHash(source));
    expect(() =>
      normalizeResearchSource({ ...source, source_location: "http://127.0.0.1/x" }),
    ).toThrow(/UNSAFE|PRIVATE/);
  });

  it("deduplicates exact locations and hashes without claiming semantic similarity", async () => {
    const manifest = await fixture<{ sources: Parameters<typeof normalizeResearchSource>[0][] }>(
      "research-source-manifest",
    );
    const source = manifest.sources[0];
    if (!source) throw new Error("Fixture source is required.");
    const first = normalizeResearchSource(source);
    const result = deduplicateSources([first, { ...first, source_id: "SRC-DEMO-002" }]);
    expect(result.unique).toHaveLength(1);
    expect(result.duplicates[0]?.duplicate_of).toBe(first.source_id);
  });

  it("calculates the fixed nine-dimension score and assigns thresholds", () => {
    expect(
      calculatePainpointWeightedScore({
        audience_relevance: 5,
        frequency: 4,
        urgency: 4,
        decision_impact: 5,
        real_cost: 4,
        subject_advantage_fit: 4,
        evidence_strength: 5,
        content_potential: 4,
        promotion_fit: 3,
      }),
    ).toBe(88);
    expect(assignPainpointPriority(80)).toBe("CORE");
    expect(assignPainpointPriority(65)).toBe("IMPORTANT");
    expect(assignPainpointPriority(64.99)).toBe("SUPPLEMENTARY");
  });

  it("enforces B confidence and D hypothesis restrictions", async () => {
    const painpoint = await fixture<ResearchPainpoint>("painpoint-record");
    expect(
      validateEvidenceReferences(
        [{ ...painpoint, evidence_confidence: "B_MULTI_SOURCE", evidence_refs: ["E-1", "E-2"] }],
        ["E-1", "E-2"],
        new Map([
          ["E-1", "same"],
          ["E-2", "same"],
        ]),
      ),
    ).toContain(`${painpoint.painpoint_id}:B_CONFIDENCE_REQUIRES_TWO_INDEPENDENT_SOURCES`);
    expect(
      validateHypothesisRestrictions(
        {
          ...painpoint,
          evidence_confidence: "D_HYPOTHESIS",
          painpoint_priority: "CORE",
          promotion_priority: "HIGH",
          extensions: {},
        },
        false,
      ),
    ).toHaveLength(4);
  });

  it("rejects count mismatches, non-pending candidates and exact duplicates", async () => {
    const painpoint = await fixture<ResearchPainpoint>("painpoint-record");
    const pending = { ...painpoint, review_status: "PAINPOINT_PENDING" };
    const errors = validatePainpointBatch({
      project_id: painpoint.project_id,
      research_batch_id: painpoint.research_batch_id,
      requested_count: 2,
      produced_count: 1,
      evidence_backed_count: 2,
      hypothesis_count: 0,
      painpoints: [pending, { ...pending, painpoint_id: "P-0002" }],
      allow_hypothesis_candidates: false,
    });
    expect(errors).toContain("PRODUCED_COUNT_MISMATCH");
    expect(errors.some((error) => error.includes("EXACT_DUPLICATE"))).toBe(true);
  });

  it("binds G2 decisions to batch and item versions", async () => {
    const review = await fixture<{
      research_batch_id: string;
      painpoint_batch_version: number;
      review_version: number;
      items: Array<{ painpoint_id: string; painpoint_version: number; decision: "APPROVE" }>;
    }>("painpoint-review-batch");
    const firstItem = review.items[0];
    if (!firstItem) throw new Error("Fixture review item is required.");
    expect(
      validateReviewBatch(review, {
        research_batch_id: review.research_batch_id,
        painpoint_batch_version: 1,
        painpointVersions: new Map([[firstItem.painpoint_id, 2]]),
        latestReviewVersion: 0,
      }),
    ).toContain(`${firstItem.painpoint_id}:PAINPOINT_VERSION_STALE`);
  });

  it("compiles every Phase 3A Feishu painpoint field and reports coverage", async () => {
    const painpoint = await fixture<ResearchPainpoint>("painpoint-record");
    const fields = compilePainpointFeishuFields(painpoint, [
      {
        source_type: "MANUAL_SOURCE",
        source_name: "Fixture",
        source_location: "artifact/source.json",
        summary: "Fixture summary",
        source_date: null,
      },
    ]);
    expect(Object.keys(fields)).toHaveLength(34);
    expect(fields.painpointsRecordUniqueKey).toBe(painpoint.record_unique_key);
    expect(
      calculateResearchCoverage({
        requested_count: 30,
        painpoints: [painpoint],
        source_types: ["MANUAL_SOURCE"],
      }),
    ).toMatchObject({ produced_count: 1, source_type_count: 1, evidence_backed_count: 1 });
    expect(detectExactPainpointDuplicates([painpoint])).toEqual([]);
  });
});
