# Phase 4B-R.2.3 working-tree change report

## Baseline comparison

- Baseline ID: `BASELINE-PHASE-4B-R23-20260826`
- Baseline source phase: `PHASE_4B_R22`
- Baseline files: 1483
- Current files: 1531
- Added: 48
- Changed: 18
- Removed: 0
- Unchanged: 1465
- Baseline aggregate SHA-256: `381cc9d36d145eb5dc5a50679f4cb6e6139a9cede487d2c8a4b3b7f455dd7d14`
- Current aggregate SHA-256: `963176fb0e304c4d4b64a40c947a53bb05be194d36e62117358cdd274f0cd5af`

The aggregate excludes Git metadata, dependencies, generated runtime bundles, runtime Project Homes, environment files other than `.env.example`, every immutable baseline and this change report. No file body, secret, remote identifier or absolute user path is included.

## Added

- Documentation and reports: `docs/66-editorial-design-knowledge-and-cover-attention.md`, `docs/decisions/ADR-0047-editorial-design-knowledge-and-cover-attention.md`, `docs/plans/phase-4b-r23-editorial-design-cover-attention.md`, `reports/phase-4b-r23-calibration-round4.md`, `reports/phase-4b-r23-editorial-design-cover-attention-report.md`, `reports/phase-4b-r23-source-verification.md`.
- Core/config/scripts: `packages/core/src/visual-baseline/editorial-attention.ts`, two Editorial Design Knowledge config files, the Image Production reference, the Round 4 harness and knowledge validator.
- Contracts: seven Schemas, seven generated TypeScript declarations, seven valid fixtures and fourteen invalid fixtures.
- Tests: `tests/universal-visual/editorial-cover-attention.test.ts`.

## Changed

- Repository documentation/config: `README.md`, `CHANGELOG.md`, `docs/12-roadmap.md`, `reports/index.md`, `package.json`.
- Contracts/core: Dynamic Visual Strategy and Project Visual Profile Schemas/generated types, generated index, Schema catalog, Dynamic Visual Strategy core and Visual Baseline index.
- Skills/tooling/tests: Router Skill, Image Set Production Skill, fixture generator, baseline exclusions and migration tests.

## Removed

None.

## Boundary audit

- Prior A–H assets/evidence: unchanged and retained.
- C-0001 CV/Copy/VV/FPV: unchanged.
- Formal FPV, G4, Style Lock, remaining pages and Feishu writes created by this phase: zero.
- Repository commits/remotes/pushes: zero.
