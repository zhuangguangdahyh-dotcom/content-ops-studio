# Schema inventory

Contract version: 1.0.0  
Schema version: 1.0.0  
Implemented: 27  
Planned: 7

JSON Schema files are the single source of truth. Implemented entries have generated TypeScript and valid/invalid fixture directories; planned Phase 1B entries deliberately have no placeholder schema.

| Logical name             | Status      | Owner domain  | Schema source                        | Generated type                                                   | Fixtures                                              |
| ------------------------ | ----------- | ------------- | ------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------------------- |
| common-definitions       | implemented | shared        | common-definitions.schema.json       | packages/contracts/src/generated/1.0/common-definitions.ts       | tests/fixtures/contracts/1.0/common-definitions       |
| task-envelope            | implemented | shared        | task-envelope.schema.json            | packages/contracts/src/generated/1.0/task-envelope.ts            | tests/fixtures/contracts/1.0/task-envelope            |
| task-result              | implemented | shared        | task-result.schema.json              | packages/contracts/src/generated/1.0/task-result.ts              | tests/fixtures/contracts/1.0/task-result              |
| error                    | implemented | shared        | error.schema.json                    | packages/contracts/src/generated/1.0/error.ts                    | tests/fixtures/contracts/1.0/error                    |
| approval-event           | implemented | shared        | approval-event.schema.json           | packages/contracts/src/generated/1.0/approval-event.ts           | tests/fixtures/contracts/1.0/approval-event           |
| run-manifest             | implemented | shared        | run-manifest.schema.json             | packages/contracts/src/generated/1.0/run-manifest.ts             | tests/fixtures/contracts/1.0/run-manifest             |
| project-profile          | implemented | project       | project-profile.schema.json          | packages/contracts/src/generated/1.0/project-profile.ts          | tests/fixtures/contracts/1.0/project-profile          |
| project-registry         | implemented | project       | project-registry.schema.json         | packages/contracts/src/generated/1.0/project-registry.ts         | tests/fixtures/contracts/1.0/project-registry         |
| workspace-connection     | implemented | project       | workspace-connection.schema.json     | packages/contracts/src/generated/1.0/workspace-connection.ts     | tests/fixtures/contracts/1.0/workspace-connection     |
| workspace-field-map      | implemented | project       | workspace-field-map.schema.json      | packages/contracts/src/generated/1.0/workspace-field-map.ts      | tests/fixtures/contracts/1.0/workspace-field-map      |
| workspace-blueprint      | implemented | project       | workspace-blueprint.schema.json      | packages/contracts/src/generated/1.0/workspace-blueprint.ts      | tests/fixtures/contracts/1.0/workspace-blueprint      |
| evidence-record          | implemented | research      | evidence-record.schema.json          | packages/contracts/src/generated/1.0/evidence-record.ts          | tests/fixtures/contracts/1.0/evidence-record          |
| painpoint-record         | implemented | research      | painpoint-record.schema.json         | packages/contracts/src/generated/1.0/painpoint-record.ts         | tests/fixtures/contracts/1.0/painpoint-record         |
| painpoint-batch          | implemented | research      | painpoint-batch.schema.json          | packages/contracts/src/generated/1.0/painpoint-batch.ts          | tests/fixtures/contracts/1.0/painpoint-batch          |
| content-page             | implemented | content       | content-page.schema.json             | packages/contracts/src/generated/1.0/content-page.ts             | tests/fixtures/contracts/1.0/content-page             |
| content-record           | implemented | content       | content-record.schema.json           | packages/contracts/src/generated/1.0/content-record.ts           | tests/fixtures/contracts/1.0/content-record           |
| content-package          | implemented | content       | content-package.schema.json          | packages/contracts/src/generated/1.0/content-package.ts          | tests/fixtures/contracts/1.0/content-package          |
| content-fingerprint      | implemented | content       | content-fingerprint.schema.json      | packages/contracts/src/generated/1.0/content-fingerprint.ts      | tests/fixtures/contracts/1.0/content-fingerprint      |
| feedback-record          | implemented | learning      | feedback-record.schema.json          | packages/contracts/src/generated/1.0/feedback-record.ts          | tests/fixtures/contracts/1.0/feedback-record          |
| active-project-rules     | implemented | learning      | active-project-rules.schema.json     | packages/contracts/src/generated/1.0/active-project-rules.ts     | tests/fixtures/contracts/1.0/active-project-rules     |
| rejected-directions      | implemented | learning      | rejected-directions.schema.json      | packages/contracts/src/generated/1.0/rejected-directions.ts      | tests/fixtures/contracts/1.0/rejected-directions      |
| write-log                | implemented | shared        | write-log.schema.json                | packages/contracts/src/generated/1.0/write-log.ts                | tests/fixtures/contracts/1.0/write-log                |
| capabilities             | implemented | shared        | capabilities.schema.json             | packages/contracts/src/generated/1.0/capabilities.ts             | tests/fixtures/contracts/1.0/capabilities             |
| state-transition-request | implemented | state-machine | state-transition-request.schema.json | packages/contracts/src/generated/1.0/state-transition-request.ts | tests/fixtures/contracts/1.0/state-transition-request |
| state-transition-result  | implemented | state-machine | state-transition-result.schema.json  | packages/contracts/src/generated/1.0/state-transition-result.ts  | tests/fixtures/contracts/1.0/state-transition-result  |
| schema-migration         | implemented | migration     | schema-migration.schema.json         | packages/contracts/src/generated/1.0/schema-migration.ts         | tests/fixtures/contracts/1.0/schema-migration         |
| migration-report         | implemented | migration     | migration-report.schema.json         | packages/contracts/src/generated/1.0/migration-report.ts         | tests/fixtures/contracts/1.0/migration-report         |
| visual-system            | planned     | visual        | —                                    | —                                                                | —                                                     |
| page-visual-plan         | planned     | visual        | —                                    | —                                                                | —                                                     |
| style-lock               | planned     | visual        | —                                    | —                                                                | —                                                     |
| generation-manifest      | planned     | production    | —                                    | —                                                                | —                                                     |
| render-report            | planned     | production    | —                                    | —                                                                | —                                                     |
| qa-report                | planned     | production    | —                                    | —                                                                | —                                                     |
| final-manifest           | planned     | production    | —                                    | —                                                                | —                                                     |

## Validation policy

- Draft 2020-12, unique stable `$id`, strict Ajv 2020, `allErrors: true`.
- Standard formats are registered with `ajv-formats`.
- Root and nested domain objects are closed unless a controlled `extensions` object is explicitly present.
- Type generation is deterministic; 27 declarations plus one generated index are committed.
