# @content-ops/runtime

Runtime remains the owner of project Home, locks, run plans, journals, write logs, checkpoints, idempotency and approvals. Phase 2B provisioning stores Feishu connection/mapping state only in the project Home and pauses at G1; Skills cannot call the Adapter around Runtime.

Phase 2C MCP handlers compose these services through the existing CLI/Runtime boundary; they do not reimplement state, recovery or approval.

Explicit, recoverable local orchestration for Content Ops Studio. It owns filesystem I/O, Project Home/registry, Pack snapshots, capability checks, run plans, append-only journals/write logs, atomic checkpoints, project locks, approval resume, recovery, diagnostics, and MOCK-only reference workflows.

Importing the package performs no write. All runtime roots and dependencies are passed explicitly. `PRODUCTION` never falls back to Mock and is blocked until production Adapters exist.

V0.1.0 supports Node.js 24 LTS only (`>=24 <25`). Runtime composition, Runtime Config, and executable Mock references enforce the policy; tests may inject a fake Runtime version explicitly. Generic Runtime Evidence and Diagnostic APIs distinguish current Runtime support, actual local evidence, unverified cross-platform CI, and blocked production integrations.

Phase 3A adds Research Runtime composition for idempotent painpoint writes, read-after-write verification, audit/checkpoint evidence and version-bound G2 item decisions. It never creates content records or deletes remote history.

Phase 3B adds Content Runtime composition for one-row Content upsert, primary-Painpoint linkage, bounded read-after-write, Write Log/Checkpoint and version-bound G3 decisions. Partial remote success is resumed by unique key; relation values are normalized across official CLI response shapes. It never invokes Visual Planning or deletes history.

Phase 4A adds Visual Planning Runtime for an allowlisted six-field Content update, request/idempotency hashes, atomic state, append-only Journal/Write Log, Checkpoint and remote read verification. It preserves Copy/Painpoint/downstream state and never creates images, G4, Style Lock or rollback deletes.

Phase 4B adds First-Page Runtime state. It records one pending FPV/checksum, rejects stale or mismatched Review/Approval targets, creates Style Lock only after exact G4 APPROVE and reuses the approved result on replay. REVISE/REJECT/PAUSE preserve assets and create no Style Lock; no remaining page is started.

Phase 4B-R adds an Image Production Runtime root under each Project Run for schema-validated context, candidate sets/selections, quality, feedback and rule artifacts. Writes are atomic and read-verified outside Plugin Root. Candidate Runtime has no formal Feishu writer and preserves the G4/Style Lock boundary.
