# Phase 2B Working Tree Change Report

## Comparison basis

- Baseline: `reports/baselines/phase-2a1-working-tree-baseline.json`.
- Baseline ID: `BASELINE-PHASE-2A1-WORKING-TREE-20260824`.
- Baseline file count: 651.
- Baseline aggregate SHA-256: `561a5809b75c828fc30d71b5dfd05bf31bbc90d06c750844f6fc74e310c3d42d`.
- Current measured file count: 746.
- Added: 95.
- Changed: 44.
- Removed: 0.
- Unchanged: 607.
- Current aggregate SHA-256: `ebcbc96aecc48883a5bb9d8006f59049a6d6688903641c7487eac9ce915cd3d3`.
- Aggregate changed: yes, as expected for Phase 2B.
- This report and baseline artifacts are excluded from the measured set to prevent a self-referential hash.

## Added inventory

The 95 added files comprise 14 documentation/report files, 38 generated fixtures, eight generated declarations, seven Plugin/config/Skill files, eight schemas, 12 source files, and eight test/live-boundary files. They contain the Feishu research snapshot, ADR-0015 through ADR-0018, ExecPlan, setup/live/troubleshooting docs, eight contract families, credentials/token/transport/Adapter/Blueprint/provisioning modules, validation/live scripts, Feishu test suites, six Phase 2B reports, and the explicit live-test directory marker.

## Changed inventory

The 44 changed files comprise one CI file, one root configuration file, 18 documentation/report files, one generated index, six Plugin files, five repository policy/metadata files, two schema/catalog files, six source files, and four tests. Changes connect the Adapter to CLI/Runtime boundaries, update the schema catalog and migration coverage, document the split readiness states, add offline CI commands, and preserve version 0.1.0.

## Removed and unchanged inventory

No baseline file was removed. All 607 unchanged baseline files retain their Phase 2A.1 SHA-256 and size. No real project Home, credential, token, customer material, full remote identifier, `node_modules`, distribution output other than the tracked placeholder, or runtime log is included in this comparison.
