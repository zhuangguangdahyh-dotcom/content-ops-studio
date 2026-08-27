import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  MigrationRegistry,
  BASELINE_MIGRATION,
  baselineMigrationRegistry,
  classifySchemaChange,
  planMigration,
  runMigrationDryRun,
  validateMigrationPath,
} from "../../packages/contracts/src/migrations/index.js";

const runId = "RUN-20990101-010203-DEMO";
const at = "2099-01-01T01:02:03.000Z";

describe("schema migration protocol", () => {
  it("provides only the honest 1.0.0 no-op baseline", () => {
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
    expect(validateMigrationPath([BASELINE_MIGRATION])).toEqual([]);
  });

  it("blocks missing migration paths", () => {
    expect(() => planMigration(new MigrationRegistry(), "1.0.0", "2.0.0")).toThrow(
      /MIGRATION_PATH_MISSING/,
    );
  });

  it("dry-runs idempotently without mutating the input", () => {
    const input = { schema_version: "1.0.0", nested: { value: 1 } };
    const before = JSON.stringify(input);
    const first = runMigrationDryRun({
      registry: baselineMigrationRegistry,
      input,
      fromVersion: "1.0.0",
      toVersion: "1.0.0",
      runId,
      evaluatedAt: at,
    });
    const second = runMigrationDryRun({
      registry: baselineMigrationRegistry,
      input: first.output,
      fromVersion: "1.0.0",
      toVersion: "1.0.0",
      runId,
      evaluatedAt: at,
    });
    expect(JSON.stringify(input)).toBe(before);
    expect(first.output).toEqual(input);
    expect(second).toEqual(first);
    expect(first.report).toMatchObject({
      status: "NO_OP",
      dry_run: true,
      input_unchanged: true,
      idempotent: true,
    });
  });

  it("classifies destructive and enum changes conservatively", () => {
    expect(classifySchemaChange("DESCRIPTION_CHANGE")).toBe("PATCH");
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("ADD_INDEPENDENT_SCHEMA")).toBe("MINOR");
    expect(classifySchemaChange("REMOVE_FIELD")).toBe("MAJOR");
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
    expect("PROGRAMMATIC").not.toBe("GENERATED");
  });

  it("classifies the Phase 2A independent runtime contracts as additive", () => {
    const runtimeContracts = [
      "runtime-config",
      "platform-pack",
      "industry-pack",
      "pack-resolution",
      "project-runtime-snapshot",
      "workflow-definition",
      "run-plan",
      "run-event",
      "run-checkpoint",
      "project-lock",
      "runtime-diagnostic",
    ];
    expect(runtimeContracts).toHaveLength(11);
    expect(runtimeContracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      runtimeContracts.map(() => "MINOR"),
    );
  });

  it("records the Phase 2A.1 pre-release contract correction conservatively", () => {
    expect(classifySchemaChange("ADD_INDEPENDENT_SCHEMA")).toBe("MINOR");
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
    expect(classifySchemaChange("REMOVE_FIELD")).toBe("MAJOR");
  });

  it("classifies the eight Phase 2B Feishu contracts as independent additive schemas", () => {
    const contracts = [
      "feishu-integration-config",
      "feishu-auth-diagnostic",
      "feishu-permission-manifest",
      "feishu-api-capability",
      "feishu-workspace-plan",
      "feishu-provisioning-state",
      "feishu-reconciliation-report",
      "feishu-live-test-evidence",
    ];
    expect(contracts).toHaveLength(8);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
  });

  it("classifies the six Phase 2B.2 official CLI contracts as independent additive schemas", () => {
    const contracts = [
      "lark-cli-integration-config",
      "lark-cli-runtime-evidence",
      "lark-cli-command",
      "lark-cli-result",
      "lark-cli-capability-report",
      "lark-cli-auth-diagnostic",
    ];
    expect(contracts).toHaveLength(6);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
  });

  it("records Phase 3A contracts as additive and enum changes conservatively", () => {
    const contracts = [
      "project-profile-gap-report",
      "painpoint-research-plan",
      "research-source-manifest",
      "painpoint-scoring-record",
      "painpoint-research-report",
      "painpoint-review-batch",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
    expect(classifySchemaChange("REMOVE_ENUM_VALUE")).toBe("MAJOR");
  });

  it("classifies the eight Phase 4A Visual Planning contracts as independent additive schemas", () => {
    const contracts = [
      "visual-planning-context",
      "visual-direction-decision",
      "visual-reference-manifest",
      "asset-requirements-plan",
      "layout-feasibility-report",
      "visual-planning-quality-report",
      "visual-handoff-package",
      "visual-plan-revision",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
  });

  it("classifies the eight Phase 4B renderer contracts as independent additive schemas", () => {
    const contracts = [
      "renderer-config",
      "renderer-capability-report",
      "renderer-environment-evidence",
      "render-template-manifest",
      "first-page-production-plan",
      "first-page-production-report",
      "first-page-review",
      "first-page-revision-plan",
    ];
    expect(contracts).toHaveLength(8);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
  });

  it("records Stage 10 Finalization contracts and pre-release Manifest hardening conservatively", () => {
    const contracts = [
      "final-set-fingerprint",
      "delivery-package",
      "delivery-integrity-report",
      "finalization-state",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
  });

  it("records Blueprint 1.1 display migration and PNG sanitization contract conservatively", async () => {
    const blueprint = JSON.parse(
      await readFile("plugins/content-ops-studio/templates/feishu/workspace-v1.json", "utf8"),
    ) as { blueprint_version: string };
    const migrationNote = await readFile("docs/migrations/workspace-blueprint-1.1.0.md", "utf8");
    expect(blueprint.blueprint_version).toBe("1.1.0");
    expect(migrationNote).toContain("No automatic destructive migration");
    expect(classifySchemaChange("ADD_INDEPENDENT_SCHEMA")).toBe("MINOR");
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
  });

  it("classifies Phase 4B-R contracts as additive and enum expansion conservatively", () => {
    const contracts = [
      "image-production-policy",
      "image-production-context",
      "visual-asset-routing-plan",
      "visual-direction-candidate-set",
      "visual-direction-selection",
      "image-production-batch-plan",
      "image-quality-report",
      "group-quality-report",
      "host-generated-asset-submission",
      "project-visual-profile",
      "visual-feedback-event",
      "visual-rule-candidate",
      "visual-rule",
      "industry-visual-pack",
    ];
    expect(contracts).toHaveLength(14);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
  });

  it("classifies the direction-comparison evidence contract as additive", () => {
    expect(classifySchemaChange("ADD_INDEPENDENT_SCHEMA")).toBe("MINOR");
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
  });

  it("classifies the formal Host raster production-plan expansion conservatively", () => {
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
  });

  it("classifies Phase 4B-R.1 strategy contracts and granular Profile fields conservatively", () => {
    const contracts = [
      "dynamic-visual-strategy-plan",
      "visual-strategy-confidence-report",
      "visual-ambiguity-report",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
    expect(classifySchemaChange("CHANGE_FIELD_TYPE")).toBe("MAJOR");
  });

  it("classifies Phase 4B-R.2 cover contracts and backward-compatible extensions", () => {
    const contracts = [
      "cover-conversion-plan",
      "cover-copy-package",
      "cover-click-clarity-report",
      "cover-thumbnail-qa",
      "visual-semantic-relevance-report",
      "cover-concept-candidate-set",
      "cover-revision-plan",
      "global-user-visual-preference",
    ];
    expect(contracts).toHaveLength(8);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("CHANGE_FIELD_TYPE")).toBe("MAJOR");
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
  });

  it("classifies Phase 4B-R.2.1 universal visual contracts as additive", () => {
    const contracts = [
      "universal-visual-default-policy",
      "typography-default-policy",
      "editorial-spatial-composition-report",
      "image-text-integration-report",
      "candidate-set-visual-diversity-report",
      "painpoint-scene-congruence-report",
      "locale-scene-fit-report",
    ];
    expect(contracts).toHaveLength(7);
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
  });

  it("classifies Phase 4B-R.2.2 typography spatial evidence as additive", () => {
    const contracts = ["typography-spatial-integrity-report", "typographic-breathing-room-report"];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual([
      "MINOR",
      "MINOR",
    ]);
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
  });

  it("classifies Phase 4B-R.2.3 editorial knowledge and cover-attention contracts as additive", () => {
    const contracts = [
      "editorial-design-knowledge-source-manifest",
      "editorial-design-knowledge-layer",
      "cover-attention-plan",
      "visual-mass-hierarchy-report",
      "color-attention-strategy",
      "typography-as-form-report",
      "cover-attention-dominance-report",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("ADD_ENUM_VALUE")).toBe("POTENTIALLY_BREAKING");
  });

  it("classifies Phase 4B-R.2.4 calibration selection and pending-G4 contracts as additive", () => {
    const contracts = [
      "calibration-visual-direction-selection",
      "formal-calibration-cover",
      "calibration-first-page-review-request",
      "calibration-style-lock-preview",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("CHANGE_ID_SEMANTICS")).toBe("MAJOR");
  });

  it("classifies Phase 4B-R.2.5 raster contrast and non-destructive revision contracts as additive", () => {
    const contracts = ["text-background-contrast-report", "calibration-cover-revision"];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual([
      "MINOR",
      "MINOR",
    ]);
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
  });

  it("classifies Phase 4B-R.2.6 Calibration G4 and Style Lock contracts as additive", () => {
    const contracts = [
      "calibration-g4-approval",
      "calibration-style-lock",
      "universal-visual-calibration-validation",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("ADD_OPTIONAL_FIELD")).toBe("MINOR");
    expect(classifySchemaChange("CHANGE_ID_SEMANTICS")).toBe("MAJOR");
  });

  it("classifies Phase 4C-R.1 Calibration content wrappers as isolated additive contracts", () => {
    const contracts = [
      "project-reference",
      "calibration-content-package",
      "calibration-content-quality-report",
      "calibration-g3-review-request",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("CHANGE_ID_SEMANTICS")).toBe("MAJOR");
    expect(planMigration(baselineMigrationRegistry, "1.0.0", "1.0.0")).toEqual([
      BASELINE_MIGRATION,
    ]);
  });

  it("classifies Phase 4C-R.1 Step B approval and rebinding contracts as isolated additive contracts", () => {
    const contracts = [
      "calibration-g3-approval",
      "calibration-visual-plan",
      "calibration-rebound-first-page",
      "calibration-g4-review-request",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
    expect(classifySchemaChange("CHANGE_ID_SEMANTICS")).toBe("MAJOR");
  });

  it("classifies Phase 4C-R.2 G4, Style Lock, remaining-page and G5 contracts as additive", () => {
    const contracts = [
      "calibration-g4-approval-v2",
      "calibration-style-lock-v2",
      "calibration-remaining-page-production",
      "calibration-g5-review-request",
    ];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual(
      contracts.map(() => "MINOR"),
    );
  });

  it("classifies universal image-set continuity contracts as isolated additive contracts", () => {
    const contracts = ["image-set-production-strategy", "image-set-continuity-report"];
    expect(contracts.map(() => classifySchemaChange("ADD_INDEPENDENT_SCHEMA"))).toEqual([
      "MINOR",
      "MINOR",
    ]);
    expect(classifySchemaChange("ADD_REQUIRED_FIELD")).toBe("MAJOR");
  });
});
