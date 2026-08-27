# Phase 2B.1 Live Capability Delta

Date: 2026-08-24. Live branch: `NOT_CONFIGURED`; writes attempted: 0.

## Capability disposition

- Token, Base, Table, Field, View and Record operations: `IMPLEMENTED_OFFLINE`; no live upgrade.
- Tenant-app authentication and token expiry behavior: `NOT_RUN` live.
- Required scope grants and test-folder access: `NOT_RUN` live.
- Create/get Base, default-table adoption, four-table provisioning: `NOT_RUN` live.
- 141 Blueprint field mapping and five relations: `NOT_RUN` live.
- Four views: offline claim remains `NAME_ONLY`; live behavior `NOT_RUN`.
- Draft record, unique-key search and read-after-write: `NOT_RUN` live.
- G1 remote activation: `NOT_RUN` live.
- Idempotent replay and add-only repair: `NOT_RUN` live.
- Attachment upload: `DEFERRED`.

## Runtime-only observations

- Static manifest: 13 required scopes, one deferred scope, validator passed.
- Machine capability snapshot: 18 operations, 17 `IMPLEMENTED_OFFLINE`, one `DEFERRED`.
- Offline compiler: 4 tables, 141 fields including five relation fields, 4 views, no unsupported field types.
- Published batch behavior remains the offline snapshot: batch create/update maximum 1,000. Actual live batch behavior was not observed.
- Actual rate-limit and `Retry-After` behavior: not observed.
- Actual pagination, default-table, reverse-relation and view behavior: not observed.

No capability was marked `LIVE_VERIFIED`, and no official snapshot/config/ADR change was justified without a live call.
