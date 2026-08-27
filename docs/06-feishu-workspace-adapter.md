# Feishu workspace Adapter

Phase 2C exposes the existing official Lark CLI Adapter through narrow MCP tools. MCP never calls raw Feishu APIs, reads keychain content, accepts secrets or bypasses the Adapter. Inspect/verify are read-only, repair is add-only, and identical initialization replay reuses the retained Workspace.

## Phase 2B.2 default and advanced paths

`AUTO` uses the official Lark CLI as user. `DIRECT_FEISHU` preserves the Phase 2B Node Fetch Adapter for explicit enterprise tenant-app deployments. Readiness evidence is separate for both Adapters. The Blueprint and provisioning state are shared; transport and authentication are not.

Phase 2B implements the China self-built tenant-app Adapter with Base/Table/Field/View/Record operations, field-name record payload compilation, read-after-write, pagination, bounded retry and structural inspection. New Bases return a blank default table; it is renamed and adopted only when uniquely safe. Relations are created after target table IDs. View filters/sorts are not claimed: creation is `NAME_ONLY`. Attachment upload returns `FEISHU_ATTACHMENT_UPLOAD_DEFERRED`.

Feishu will be the structured-data authority, but version 0.1.0 has no Feishu dependency and makes no HTTP request.

`WorkspaceAdapter` plans these capabilities: `probeConnection`, `createWorkspace`, `listTables`, `createTable`, `listFields`, `createField`, `createView`, `findRecordByUniqueKey`, `createRecord`, `updateRecord`, `batchUpsertRecords`, `readRecord`, `searchRecords`, `uploadAttachment`, and `verifyWrite`.

Every future write follows: read state → verify Schema version → verify record version → verify field lock → verify unique key → write → read again → compare critical fields → append write log. Partial success retries only failed parts. Destructive rollback is forbidden.

Skills cannot assemble Feishu HTTP requests. Core depends on `WorkspaceAdapter`; a concrete Feishu implementation must be introduced through an accepted ExecPlan. `PersistentLocalMockWorkspaceAdapter` is the complete Phase 2A test double. It materializes the four-table Blueprint into a caller-supplied temporary project directory, emits only `MOCK-*` IDs, requires idempotency keys, performs read-after-write checks, and supports partial failure injection. It reports `MOCK_ONLY` and never represents a Feishu write. `FeishuWorkspaceAdapter` still throws a traceable not-implemented error.

Credentials may come only from environment variables, operating-system secure storage, or an Operator-connected MCP. They may not be stored in `project.json`, `connections.json`, Feishu tables, Git, or reports.
