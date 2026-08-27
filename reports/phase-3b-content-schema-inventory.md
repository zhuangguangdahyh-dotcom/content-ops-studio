# Phase 3B Content Schema Inventory

All entries are strict Draft 2020-12 Schemas, have generated TypeScript under `packages/contracts/src/generated/1.0/`, and passed Ajv strict validation.

| Name                       | `$id`                                                                                 | TypeScript                      | Valid | Invalid | Owner            | Status |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- | ----: | ------: | ---------------- | ------ |
| content-creation-plan      | `https://content-ops-studio.local/schemas/1.0/content-creation-plan.schema.json`      | `content-creation-plan.ts`      |     1 |       4 | Content Creation | PASSED |
| content-angle-decision     | `https://content-ops-studio.local/schemas/1.0/content-angle-decision.schema.json`     | `content-angle-decision.ts`     |     1 |       4 | Content Creation | PASSED |
| content-claim-map          | `https://content-ops-studio.local/schemas/1.0/content-claim-map.schema.json`          | `content-claim-map.ts`          |     1 |       4 | Content Creation | PASSED |
| content-duplication-report | `https://content-ops-studio.local/schemas/1.0/content-duplication-report.schema.json` | `content-duplication-report.ts` |     1 |       4 | Content Creation | PASSED |
| content-quality-report     | `https://content-ops-studio.local/schemas/1.0/content-quality-report.schema.json`     | `content-quality-report.ts`     |     1 |       4 | Content Creation | PASSED |
| content-copy-review        | `https://content-ops-studio.local/schemas/1.0/content-copy-review.schema.json`        | `content-copy-review.ts`        |     1 |       4 | Router/G3        | PASSED |
| content-revision-plan      | `https://content-ops-studio.local/schemas/1.0/content-revision-plan.schema.json`      | `content-revision-plan.ts`      |     1 |       4 | Content Creation | PASSED |

Related adjusted contracts: `content-record`, `content-page`, `content-package`, `content-fingerprint` and `approval-event`. No Schema validation was weakened and no generated declaration was hand-edited.
