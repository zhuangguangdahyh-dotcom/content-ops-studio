# Phase 4B-R.2.2 working-tree change report

## Comparison

- Baseline: `BASELINE-PHASE-4B-R22-20260826`
- Source phase: `PHASE_4B_R21_COMPLETE`
- Baseline files: 1462
- Current files: 1483
- Added: 21
- Changed: 17
- Removed: 0
- Unchanged: 1445
- Baseline aggregate SHA-256: `4f8d27e52888f68256e0165ad4059e3e09f14b5fdc9344ce3dbac6fcf3460178`
- Current aggregate SHA-256: `381cc9d36d145eb5dc5a50679f4cb6e6139a9cede487d2c8a4b3b7f455dd7d14`

The report itself and every baseline file are excluded from the aggregate. No file body, absolute user path, Secret, token, remote ID or customer data is included.

## Added

- `docs/decisions/ADR-0046-typography-spatial-integrity-before-visual-score.md`
- `docs/plans/phase-4b-r22-typography-spatial-integrity.md`
- `packages/contracts/src/generated/1.0/typographic-breathing-room-report.ts`
- `packages/contracts/src/generated/1.0/typography-spatial-integrity-report.ts`
- `packages/core/src/visual-baseline/typography-spatial.ts`
- `plugins/content-ops-studio/schemas/1.0/typographic-breathing-room-report.schema.json`
- `plugins/content-ops-studio/schemas/1.0/typography-spatial-integrity-report.schema.json`
- `reports/phase-4b-r22-commercial-space-calibration-round3.md`
- `reports/phase-4b-r22-typography-spatial-integrity-report.md`
- `reports/phase-4b-r22-typography-spatial-regression-matrix.md`
- `scripts/finalize-commercial-space-cover-calibration-round3.ts`
- `scripts/run-commercial-space-cover-calibration-round3.ts`
- Six valid/invalid generated contract fixtures for the two new reports
- `tests/fixtures/typography-spatial/historical-round2-d.json`
- `tests/fixtures/typography-spatial/historical-round2-f.json`
- `tests/universal-visual/typography-spatial-integrity.test.ts`

## Changed

- `CHANGELOG.md`
- `README.md`
- `docs/12-roadmap.md`
- `docs/65-universal-visual-baseline-and-spatial-qa.md`
- `package.json`
- `packages/contracts/src/generated/1.0/candidate-set-visual-diversity-report.ts`
- `packages/contracts/src/generated/1.0/index.ts`
- `packages/core/src/visual-baseline/index.ts`
- `plugins/content-ops-studio/schemas/1.0/candidate-set-visual-diversity-report.schema.json`
- `plugins/content-ops-studio/schemas/1.0/schema-catalog.json`
- `plugins/content-ops-studio/skills/content-studio-router/SKILL.md`
- `plugins/content-ops-studio/skills/image-set-production/SKILL.md`
- `plugins/content-ops-studio/skills/image-set-production/references/universal-visual-baseline-policy.md`
- `reports/index.md`
- `scripts/generate-universal-visual-fixtures.ts`
- `scripts/lib/working-tree-baseline.ts`
- `tests/migrations/migrations.test.ts`

## Removed

None.
