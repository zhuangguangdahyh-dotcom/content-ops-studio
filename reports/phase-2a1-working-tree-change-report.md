# Phase 2A.1 Working Tree Change Report

## Comparison basis

- Baseline: `reports/baselines/phase-1b-working-tree-baseline.json`.
- Baseline file count: 500.
- Baseline aggregate SHA-256: `4c5c71a2de9a40ef6bdbb064484229fcd0670bfd665c1d8ee7c38d5ee3287a2f`.
- Current measured file count: 651.
- Added: 151.
- Changed: 41.
- Removed: 0.
- Unchanged: 459.
- Current aggregate SHA-256: `561a5809b75c828fc30d71b5dfd05bf31bbc90d06c750844f6fc74e310c3d42d`.
- Aggregate changed: yes, as expected for the additive Phase 2A and corrective Phase 2A.1 implementation.
- This report is excluded from the measured set to prevent a self-referential hash.

## Scope

Added paths include the Phase 2A Runtime delivered previously plus the Phase 2A.1 ExecPlan, ADR-0014, two version files, Runtime Support Policy, generic evidence Schema/type/fixtures, Runtime policy module, three evidence/policy scripts, tests, Node 24 machine evidence, and four Phase 2A.1 reports.

Changed paths include current Runtime/CLI/contracts, root scripts and metadata, all CI workflows, canonical catalog/fixtures, migration and count tests, current policy documentation, historical report addenda, and report index. The obsolete Node 20 probe script is removed relative to Phase 2A but appears as no removal relative to the older Phase 1B baseline because it did not exist there.

The final report records only repository-relative paths, counts, categories, sizes, and SHA-256 comparison data. It contains no file body, secret, customer record, credential, or runtime project data.
