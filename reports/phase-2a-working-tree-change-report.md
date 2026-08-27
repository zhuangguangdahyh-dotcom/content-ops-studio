# Phase 2A Working Tree Change Report

## Comparison basis

- Baseline: `reports/baselines/phase-1b-working-tree-baseline.json`.
- Baseline file count: 500.
- Baseline aggregate SHA-256: `4c5c71a2de9a40ef6bdbb064484229fcd0670bfd665c1d8ee7c38d5ee3287a2f`.
- Current measured aggregate SHA-256: `8a15f086ae93564f45d2936a0dbd5f2af5dcfcb9334bdb9dbc0c424c17f7ba9c`.
- Aggregate changed: yes.
- Current comparison: 122 added, 30 changed, 0 removed, and 470 unchanged files.
- This report is excluded from the measured set to avoid a self-referential hash. Baseline manifests, dependency directories, Git internals, runtime data, logs, environment files, and file bodies are also excluded by the baseline policy.

## Added

The 122 additions comprise:

- four ADRs and the Phase 2A ExecPlan;
- the `@content-ops/runtime` package with 21 source modules, README, package metadata, and TypeScript config;
- CLI binary and Runtime command implementation;
- eleven canonical schemas and eleven generated declarations;
- the persistent Blueprint-backed Mock Workspace Adapter;
- baseline and Node 20 evidence scripts;
- five other Phase 2A reports plus machine-readable Node 20 evidence;
- CLI, E2E, Runtime, registry, Pack, recovery, and Mock Workspace tests;
- 55 valid/invalid contract fixtures for eleven runtime schemas; and
- four sanitized real-file visual runtime assets.

The complete sorted path list is emitted by `CI=true pnpm baseline:verify`; no file body is included.

## Changed

All 30 changed paths are:

- `CHANGELOG.md`
- `README.md`
- `docs/01-system-architecture.md`
- `docs/02-data-model.md`
- `docs/03-state-machines.md`
- `docs/04-skill-contracts.md`
- `docs/05-repository-architecture.md`
- `docs/06-feishu-workspace-adapter.md`
- `docs/08-security-and-privacy.md`
- `docs/09-testing-and-evals.md`
- `docs/10-installation.md`
- `docs/12-roadmap.md`
- `package.json`
- `packages/cli/package.json`
- `packages/cli/src/index.ts`
- `packages/contracts/src/generated/1.0/index.ts`
- `packages/workspace-adapters/package.json`
- `plugins/content-ops-studio/references/approval-protocol.md`
- `plugins/content-ops-studio/references/error-codes.md`
- `plugins/content-ops-studio/references/field-ownership.md`
- `plugins/content-ops-studio/references/shared-execution-protocol.md`
- `plugins/content-ops-studio/references/shared-state-machine.md`
- `plugins/content-ops-studio/schemas/1.0/README.md`
- `plugins/content-ops-studio/schemas/1.0/schema-catalog.json`
- `pnpm-lock.yaml`
- `reports/index.md`
- `scripts/generate-contract-fixtures.ts`
- `tests/contract/generated-types.test.ts`
- `tests/contract/schemas.test.ts`
- `tests/migrations/migrations.test.ts`

## Removed and unchanged

No baseline file was removed. The 470 unchanged files include all existing Plugin manifests, eight Skills, 11 state-machine definitions, nine invalidation rules, Pack source files, Phase 1A/1B canonical schemas and generated declarations, existing Adapter/Core implementations, sanitized examples, and existing tests not intentionally extended by Phase 2A.

The comparison stores only repository-relative paths, sizes, categories, and SHA-256 values. It contains no source body, secret, absolute user path, real customer data, or runtime project record.
