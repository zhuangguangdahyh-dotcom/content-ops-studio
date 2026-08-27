# Phase 3A Research Schema Inventory

All entries are strict Draft 2020-12, status `IMPLEMENTED`, contract/schema version 1.0.0. Each has one complete valid fixture and four invalid fixtures (missing required, invalid enum, invalid ID and version mismatch).

| Logical name               | Schema ID                                                                             | Generated TypeScript            | Valid | Invalid | Owner           | Status      |
| -------------------------- | ------------------------------------------------------------------------------------- | ------------------------------- | ----: | ------: | --------------- | ----------- |
| project-profile-gap-report | `https://content-ops-studio.local/schemas/1.0/project-profile-gap-report.schema.json` | `project-profile-gap-report.ts` |     1 |       4 | project-profile | IMPLEMENTED |
| painpoint-research-plan    | `https://content-ops-studio.local/schemas/1.0/painpoint-research-plan.schema.json`    | `painpoint-research-plan.ts`    |     1 |       4 | research        | IMPLEMENTED |
| research-source-manifest   | `https://content-ops-studio.local/schemas/1.0/research-source-manifest.schema.json`   | `research-source-manifest.ts`   |     1 |       4 | research        | IMPLEMENTED |
| painpoint-scoring-record   | `https://content-ops-studio.local/schemas/1.0/painpoint-scoring-record.schema.json`   | `painpoint-scoring-record.ts`   |     1 |       4 | research        | IMPLEMENTED |
| painpoint-research-report  | `https://content-ops-studio.local/schemas/1.0/painpoint-research-report.schema.json`  | `painpoint-research-report.ts`  |     1 |       4 | research        | IMPLEMENTED |
| painpoint-review-batch     | `https://content-ops-studio.local/schemas/1.0/painpoint-review-batch.schema.json`     | `painpoint-review-batch.ts`     |     1 |       4 | approvals       | IMPLEMENTED |

Catalog total: 66. Generated files: 67 including `index.ts`. Existing Painpoint, Evidence, Batch, Profile and Approval contracts remain referenced rather than duplicated.
