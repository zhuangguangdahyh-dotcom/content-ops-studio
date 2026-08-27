import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { GlobalVisualPreferenceRuntime } from "../../packages/runtime/src/image-production/index.js";

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("global visual preference runtime", () => {
  it("writes immutable evidence and atomically activates a verified preference version", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "content-ops-global-visual-"));
    roots.push(root);
    const runtime = new GlobalVisualPreferenceRuntime({ dataHome: root });
    const at = "2099-01-01T01:02:03.000Z";
    const runId = "RUN-20990101-010203-GUVP";
    const event = {
      event_id: "VFE-GLOBAL-COVER-001",
      project_id: "PRJ-20990101-DEMO",
      content_id: null,
      feedback_class: "VISUAL_PREFERENCE",
      scope: "GLOBAL_USER_PREFERENCE",
      target_type: "GLOBAL",
      target_id: "GLOBAL-COVER-PREFERENCE",
      statement: "Cover visuals must be directly relevant to the account goal and content.",
      is_tool_or_system_defect: false,
      long_term_rule_candidate: true,
      creates_long_term_rule: false,
      source: "OPERATOR_FEEDBACK",
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
    };
    const rule = {
      rule_id: "VR-GLOBAL-COVER-001",
      project_id: null,
      source_event_id: event.event_id,
      source_candidate_id: null,
      global_preference_version: "GUVPV-1",
      rule_statement: "Do not use decorative-only cover backgrounds for lead generation.",
      rationale: "The Operator explicitly confirmed this as a global visual preference.",
      scope: "GLOBAL_USER_PREFERENCE",
      rule_type: "MUST_NOT",
      positive_examples: ["Direct business scene"],
      negative_examples: ["Unrelated luxury texture"],
      allowed_exceptions: ["Operator explicitly approves a content-grounded abstract metaphor."],
      confirmed_by_user: true,
      status: "ACTIVE",
      version: 1,
      supersedes_version: null,
      run_id: runId,
      schema_version: "1.0.0",
      created_at: at,
      updated_at: at,
    };
    const preference = {
      preference_id: "GUVP-DEFAULT",
      preference_version: "GUVPV-1",
      active_rule_refs: [`${rule.rule_id}@1`],
      supersedes_version: null,
      confirmed_by_operator: true,
      source_event_id: event.event_id,
      run_id: runId,
      created_at: at,
      updated_at: at,
      schema_version: "1.0.0",
      extensions: {},
    };

    await runtime.writeVersion("visual-feedback-event", event.event_id, event);
    await runtime.writeVersion("visual-rule", `${rule.rule_id}-V1`, rule);
    await runtime.writeVersion(
      "global-user-visual-preference",
      preference.preference_version,
      preference,
    );
    await runtime.activate(preference.preference_version, preference);
    await expect(runtime.readActive()).resolves.toEqual({
      artifact_key: "GUVPV-1",
      preference,
    });
    await expect(
      runtime.writeVersion("visual-rule", `${rule.rule_id}-V1`, {
        ...rule,
        rule_statement: "Conflicting rewrite.",
      }),
    ).rejects.toThrow("GLOBAL_VISUAL_PREFERENCE_VERSION_CONFLICT");
  });
});
