import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  calculateInvalidations,
  getAvailableTransitions,
  loadInvalidationRules,
  loadStateMachineDefinitions,
  validateStateMachineDefinitions,
  validateTransition,
  type StateTransitionRequestInput,
} from "../../packages/core/src/state-machine/index.js";
import { OWNER_SKILLS } from "../../packages/contracts/src/workspace-blueprint.js";

const runId = "RUN-20990101-010203-DEMO";
const requestedAt = "2099-01-01T01:02:03.000Z";

function approval(overrides: Record<string, unknown> = {}) {
  return {
    approval_id: "APR-20990101-DEMO",
    gate: "CONTENT_COPY" as const,
    target_type: "CONTENT",
    target_id: "C-0001",
    target_version: "CV-1",
    decision: "APPROVE" as const,
    deprecated_at: null,
    ...overrides,
  };
}

function request(
  overrides: Partial<StateTransitionRequestInput> = {},
): StateTransitionRequestInput {
  return {
    machine: "content-status",
    from_state: "COPY_PENDING_APPROVAL",
    to_state: "COPY_APPROVED",
    trigger: "APPROVE_COPY",
    actor_skill: "content-studio-router",
    project_id: "PRJ-20990101-DEMO",
    target_type: "CONTENT",
    target_id: "C-0001",
    target_version: "CV-1",
    approval_event: approval(),
    current_context: { content_version: "CV-1" },
    available_artifacts: [],
    requested_at: requestedAt,
    run_id: runId,
    schema_version: "1.0.0",
    ...overrides,
  };
}

async function registeredStatusCodes(): Promise<Set<string>> {
  const statusMap = JSON.parse(
    await readFile(path.resolve("plugins/content-ops-studio/config/status-map.json"), "utf8"),
  ) as { groups: Record<string, Record<string, string>> };
  return new Set(Object.values(statusMap.groups).flatMap((group) => Object.keys(group)));
}

describe("data-driven state machines", () => {
  it("loads 11 valid machines whose states, owners, and transitions are registered", async () => {
    const definitions = await loadStateMachineDefinitions();
    expect(definitions).toHaveLength(11);
    expect(
      validateStateMachineDefinitions(
        definitions,
        await registeredStatusCodes(),
        new Set(OWNER_SKILLS),
      ),
    ).toEqual([]);
    expect(
      new Set(
        definitions.flatMap((definition) =>
          definition.transitions.flatMap((transition) =>
            transition.requiresApprovalGate ? [transition.requiresApprovalGate] : [],
          ),
        ),
      ),
    ).toEqual(
      new Set(["PROJECT_PROFILE", "PAINPOINTS", "CONTENT_COPY", "FIRST_PAGE", "FINAL_SET"]),
    );
    expect(
      getAvailableTransitions(definitions, "content-status", "COPY_PENDING_APPROVAL").length,
    ).toBeGreaterThan(0);
  });

  it("allows a correctly owned, current, matching G3 approval", async () => {
    const result = validateTransition(await loadStateMachineDefinitions(), request());
    expect(result).toMatchObject({
      allowed: true,
      next_state: "COPY_APPROVED",
      required_gate: "CONTENT_COPY",
      error_code: null,
    });
  });

  it.each([
    ["missing approval", { approval_event: null }, "APPROVAL_REQUIRED"],
    ["stale version", { approval_event: approval({ target_version: "CV-0" }) }, "APPROVAL_STALE"],
    [
      "deprecated approval",
      { approval_event: approval({ deprecated_at: requestedAt }) },
      "APPROVAL_STALE",
    ],
    ["wrong gate", { approval_event: approval({ gate: "FIRST_PAGE" }) }, "APPROVAL_MISMATCH"],
    ["wrong target ID", { approval_event: approval({ target_id: "C-0002" }) }, "APPROVAL_MISMATCH"],
    ["wrong owner", { actor_skill: "content-creation" }, "OWNER_SKILL_MISMATCH"],
  ])("rejects %s", async (_label, overrides, errorCode) => {
    const result = validateTransition(await loadStateMachineDefinitions(), request(overrides));
    expect(result.allowed).toBe(false);
    expect(result.error_code).toBe(errorCode);
  });

  it("rejects arbitrary transitions and transitions out of terminal states", async () => {
    const definitions = await loadStateMachineDefinitions();
    expect(
      validateTransition(definitions, request({ to_state: "CONTENT_PUBLISHED" })).error_code,
    ).toBe("INVALID_TRANSITION");
    expect(
      validateTransition(
        definitions,
        request({
          from_state: "CONTENT_PUBLISHED",
          to_state: "CONTENT_PLANNING",
          trigger: "RESUME_CONTENT",
          approval_event: null,
        }),
      ).error_code,
    ).toBe("TERMINAL_STATE");
  });

  it("rejects every committed approval-boundary fixture with its stable error code", async () => {
    const definitions = await loadStateMachineDefinitions();
    const root = path.resolve("tests/fixtures/state-machine/invalid");
    for (const file of await readdir(root)) {
      const fixture = JSON.parse(await readFile(path.join(root, file), "utf8")) as {
        expected_error: string;
        request: StateTransitionRequestInput;
      };
      const result = validateTransition(definitions, fixture.request);
      expect(result.allowed, file).toBe(false);
      expect(result.error_code, file).toBe(fixture.expected_error);
    }
  });

  it("detects injected illegal statuses, duplicate transitions, and unknown owners", async () => {
    const definitions = await loadStateMachineDefinitions();
    const injected = structuredClone(definitions);
    const firstMachine = injected[0];
    const firstTransition = firstMachine?.transitions[0];
    if (!firstMachine || !firstTransition) throw new Error("Expected a populated state machine.");
    firstMachine.states.push("UNKNOWN_STATE");
    firstMachine.transitions.push({ ...firstTransition, ownerSkill: "missing-skill" });
    const errors = validateStateMachineDefinitions(
      injected,
      await registeredStatusCodes(),
      new Set(OWNER_SKILLS),
    );
    expect(errors.some((error) => error.includes("unknown status"))).toBe(true);
    expect(errors.some((error) => error.includes("duplicate transition"))).toBe(true);
    expect(errors.some((error) => error.includes("unknown owner"))).toBe(true);
  });
});

describe("cross-state business invariants", () => {
  it.each([
    [
      "inactive project research",
      request({
        machine: "run-status",
        from_state: "RUN_PREFLIGHT",
        to_state: "RUNNING",
        trigger: "START_PAINPOINT_RESEARCH",
        actor_skill: "painpoint-research",
        approval_event: null,
        target_type: "RUN",
        target_id: runId,
        target_version: "1.0.0",
        current_context: {
          project_status: "PROJECT_PAUSED",
          config_confirmation_status: "CONFIG_CONFIRMED",
        },
      }),
    ],
    [
      "unconfirmed configuration research",
      request({
        machine: "run-status",
        from_state: "RUN_PREFLIGHT",
        to_state: "RUNNING",
        trigger: "START_PAINPOINT_RESEARCH",
        actor_skill: "painpoint-research",
        approval_event: null,
        target_type: "RUN",
        target_id: runId,
        target_version: "1.0.0",
        current_context: {
          project_status: "PROJECT_ACTIVE",
          config_confirmation_status: "CONFIG_PENDING",
        },
      }),
    ],
    [
      "unconfirmed painpoint content",
      request({
        machine: "painpoint-contentization",
        from_state: "PAINPOINT_NOT_CONTENTIZED",
        to_state: "PAINPOINT_CONTENT_IN_PROGRESS",
        trigger: "CREATE_FORMAL_CONTENT",
        actor_skill: "content-creation",
        approval_event: null,
        target_type: "PAINPOINT",
        target_id: "P-0001",
        target_version: "1",
        current_context: {
          project_status: "PROJECT_ACTIVE",
          config_confirmation_status: "CONFIG_CONFIRMED",
          painpoint_review_status: "PAINPOINT_PENDING",
        },
      }),
    ],
    [
      "unapproved copy first page",
      request({
        machine: "image-status",
        from_state: "IMAGE_NOT_GENERATED",
        to_state: "FIRST_PAGE_GENERATING",
        trigger: "START_FIRST_PAGE_GENERATION",
        actor_skill: "image-set-production",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          content_status: "COPY_PENDING_APPROVAL",
          visual_plan_version: "VV-1",
          visual_plan_content_version: "CV-1",
        },
      }),
    ],
    [
      "missing visual plan",
      request({
        machine: "image-status",
        from_state: "IMAGE_NOT_GENERATED",
        to_state: "FIRST_PAGE_GENERATING",
        trigger: "START_FIRST_PAGE_GENERATION",
        actor_skill: "image-set-production",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          content_status: "COPY_APPROVED",
          visual_plan_version: "",
          visual_plan_content_version: "CV-1",
        },
      }),
    ],
    [
      "unapproved first page",
      request({
        machine: "image-status",
        from_state: "FIRST_PAGE_APPROVED",
        to_state: "IMAGE_SET_GENERATING",
        trigger: "START_IMAGE_SET_GENERATION",
        actor_skill: "image-set-production",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          first_page_approval_status: "FIRST_PAGE_APPROVAL_PENDING",
          style_lock_version: "SLV-1",
          style_lock_content_version: "CV-1",
        },
      }),
    ],
    [
      "missing style lock",
      request({
        machine: "image-status",
        from_state: "FIRST_PAGE_APPROVED",
        to_state: "IMAGE_SET_GENERATING",
        trigger: "START_IMAGE_SET_GENERATION",
        actor_skill: "image-set-production",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          first_page_approval_status: "FIRST_PAGE_APPROVAL_APPROVED",
          style_lock_version: "",
          style_lock_content_version: "CV-1",
        },
      }),
    ],
    [
      "incomplete image set",
      request({
        machine: "content-status",
        from_state: "VISUAL_PLANNING",
        to_state: "FINAL_REVIEW_PENDING",
        trigger: "SUBMIT_FINAL_REVIEW",
        actor_skill: "content-finalization",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          image_status: "IMAGE_SET_GENERATING",
          generated_page_count: 5,
          expected_page_count: 6,
        },
      }),
    ],
    [
      "failed QA",
      request({
        machine: "final-approval",
        from_state: "FINAL_NOT_SUBMITTED",
        to_state: "FINAL_APPROVAL_PENDING",
        trigger: "SUBMIT_FINAL_VERSION",
        actor_skill: "content-finalization",
        approval_event: null,
        target_type: "CONTENT",
        current_context: {
          image_status: "IMAGE_SET_GENERATED",
          generated_page_count: 6,
          expected_page_count: 6,
          auto_qa_passed: false,
        },
      }),
    ],
  ])("blocks %s", async (_label, stateRequest) => {
    const result = validateTransition(await loadStateMachineDefinitions(), stateRequest);
    expect(result.allowed).toBe(false);
    expect(result.error_code).toBe("INVARIANT_VIOLATION");
  });

  it("does not conflate finalization with partial sync", async () => {
    const result = validateTransition(
      await loadStateMachineDefinitions(),
      request({
        machine: "sync-status",
        from_state: "SYNC_IN_PROGRESS",
        to_state: "SYNC_PARTIAL",
        trigger: "PARTIAL_SYNC",
        actor_skill: "content-finalization",
        approval_event: null,
        current_context: {
          content_status: "CONTENT_FINALIZED",
          image_status: "IMAGE_SET_GENERATED",
        },
      }),
    );
    expect(result.allowed).toBe(true);
    expect(result.next_state).toBe("SYNC_PARTIAL");
  });
});

describe("version invalidation rules", () => {
  it("encodes nine history-preserving rules including file replacement", async () => {
    const rules = await loadInvalidationRules();
    expect(rules.rules).toHaveLength(9);
    expect(rules.rules.every((rule) => rule.preserveHistory)).toBe(true);
  });

  it("invalidates page-copy approvals and visual artifacts deterministically", async () => {
    const result = calculateInvalidations(["headline"], await loadInvalidationRules());
    expect(result).toEqual({
      matchedRuleIds: ["INV-003"],
      invalidatedApprovals: ["FINAL_SET", "FIRST_PAGE"],
      invalidatedArtifacts: [
        "FINAL_MANIFEST",
        "PAGE_VISUAL_PLAN",
        "QA_REPORT",
        "RENDER_REPORT",
        "STYLE_LOCK",
        "VISUAL_SYSTEM",
      ],
      stateUpdates: {},
      preserveHistory: true,
    });
  });

  it("keeps Style Lock and first-page approval for a local layout tweak", async () => {
    const result = calculateInvalidations(["page_layout"], await loadInvalidationRules());
    expect(result.invalidatedApprovals).toEqual(["FINAL_SET"]);
    expect(result.invalidatedArtifacts).toEqual([
      "CHANGED_PAGE_QA",
      "CHANGED_PAGE_RENDER_REPORT",
      "FINAL_MANIFEST",
    ]);
  });
});
