# Phase 2B.1 — Feishu Sandbox Live Validation

Status: IN_PROGRESS — SANDBOX_CONFIGURATION. Owner: repository maintainers. Started: 2026-08-24.

## Task goal

Produce controlled, auditable, repeatable and non-destructive live evidence for the Phase 2B Feishu China Workspace Adapter using only a dedicated test folder, a tenant self-built app and fictional data. The four independent outcomes are Phase implementation, Live Feishu evidence, Workspace Adapter readiness and whole-Plugin production readiness.

## Non-goals

This phase does not add research, image generation, a production Renderer, attachment upload, Playwright, MCP, publishing, Plugin release/version changes, Git remotes, pushes, automatic cleanup or customer data. Workspace readiness can never imply whole-Plugin production readiness.

## Current live state

Phase 2B is offline-complete. Its only live-harness execution returned `NOT_CONFIGURED`, with no authentication, remote permission, Base or write evidence and `writes_attempted=0`. Production Workspace Adapter readiness is `UNVERIFIED`; Plugin production integration is `BLOCKED`.

## Operator configuration conditions

The live branch requires non-empty process environment references for `FEISHU_APP_ID`, `FEISHU_APP_SECRET`, `FEISHU_TEST_PARENT_FOLDER_TOKEN` and absolute repository-external `CONTENT_OPS_HOME`, plus `CONTENT_OPS_ENABLE_LIVE_FEISHU=1`. Presence is reported only as booleans. No value may enter chat, a CLI argument, repository content, logs or reports.

## Secret handling

Secrets are read only by the environment-backed credential provider. Tokens remain in process memory. CLI flags named `--app-secret`, `--token` or `--authorization` must be rejected. Diagnostics, errors, plans, logs and evidence must be redacted. Secret scan remains mandatory.

## Permission verification

The 13 required scopes in `feishu-permission-manifest.json` must all be live-verified before Base creation. The one deferred attachment scope does not block this phase. Missing required scope, tenant installation or folder access blocks without a write.

## Official documentation review

If configuration is complete, immediately before the first real call re-check the official tenant-token, Base, Table, Field, View and Record endpoints, scopes, payloads, pagination and batch limits. Any drift pauses the live stage, updates the snapshot/capability/ADR evidence, adds an offline regression test and restarts `CI=true pnpm check` before resumption. If configuration is incomplete, no live API claim is upgraded and the existing snapshot remains `IMPLEMENTED_OFFLINE`.

## Test folder requirement

All live work must be confined to the Operator-created test folder referenced by `FEISHU_TEST_PARENT_FOLDER_TOKEN`. It must not use a production folder. Full remote identifiers remain only under `CONTENT_OPS_HOME`.

## Live write dual gate

Every real provision or repair requires both `CONTENT_OPS_ENABLE_LIVE_FEISHU=1` and explicit CLI `--confirm-live-write`. Dry-run, inspect and verify never write. The actual script and CLI help are inspected before choosing syntax; no candidate command in the task is assumed valid.

## Fictional test project and Base naming

The fixed project is `ContentOpsStudio Phase2B1 沙箱测试`, Subject `栖序示例咨询`, type `企业品牌`, industry `通用专业服务`, subfield `虚构内容咨询服务`, region `示例城市`, Audience `虚构的小型服务企业经营者`, advantage `结构化内容规划与长期内容管理`, platform `小红书`. System-generated IDs are required. Live Base titles use `ContentOpsStudio｜Phase2B1沙箱｜RUN-ID`.

## Dry-run and provision flow

Before live writes, save the JSON dry-run plan below the test Home and record only its hash and aggregate counts in repository reports. The plan must equal four tables, 141 Blueprint fields, five relations, four named views and one draft record. Provision uses the existing lock, run plan, append-only journal, write log, checkpoints, provisioning state, idempotency and read-after-write path. It pauses at `AWAITING_APPROVAL` for G1 `PROJECT_PROFILE`.

## G1 flow

Only the formal Runtime approval route may append the explicit `APPROVE` event with matching target, version and source Run. Activation must update the mapped Feishu project record to `已启用` / `已确认` and read it back. Direct remote mutation is forbidden.

## Idempotent replay

Replay uses the same project ID, run input, idempotency scope and test folder. It must reuse the one verified Base and record, refresh mapping and create no duplicate Base, table, field, relation, view or record. Ambiguous candidates block without adoption or deletion.

## Non-destructive repair validation

Live readiness requires add-only repair evidence. A sandbox-only omission may target one safe non-primary, non-relation, non-identity field and may never be exposed through ordinary production initialization. The flow is omit during the controlled initial sandbox provision, inspect missing state, dry-plan exactly the add, run dual-gated repair, read-verify completeness and confirm a second repair has no work. No remote object is deleted or type-overwritten.

## Remote structure verification

Inspect and verify Base location/title; the four named tables; Blueprint/API-created/platform-created/remote field counts; primary, ordinary, system and Operator-managed fields; option definitions; five directed relations and remote field identities; four `NAME_ONLY` views; and the unique project draft record. Platform-generated reverse fields are reported separately instead of hiding count differences.

## Evidence redaction and manual cleanup

Complete live evidence and identifiers remain under `CONTENT_OPS_HOME`. Repository evidence contains hashes and aggregate counts only and must validate against `feishu-live-test-evidence.schema.json`. The harness never deletes a Base. Any created Base is listed only by a redacted/hash title in the manual cleanup report, which points the Operator to full local evidence and requires human inspection/deletion.

## API difference and failure handling

On actual API, scope, default-table, relation, view, batch, pagination, error-code or retry drift: stop the affected write stage, retain the test asset, save redacted evidence, update the authoritative snapshot/config/ADR or delta report, add the smallest regression test, rerun the complete offline check and resume only from persisted verified state. Unknown Base creation results become orphan protection; partial success is never represented as PASSED.

## Files involved

- This ExecPlan and Phase 2B baseline under `reports/baselines/`.
- Phase 2B.1 operator setup, validation, capability, provisioning, recovery, cleanup and working-tree reports.
- A sanitized live-evidence JSON only after a real configured run produces evidence.
- Feishu Adapter/CLI/schema/tests only if a real live discrepancy justifies a bounded fix.

## Test commands

Preflight and final validation use the exact commands in the Phase 2B.1 instruction, including frozen install, contract generation/checks, every runtime/visual/Feishu/CLI suite, `CI=true pnpm check`, secret scan and final Git inspection. Live commands run only after configuration and read-only preflight pass.

## Implementation record

- 2026-08-24: Read repository rules, Phase 2B plan/ADRs/docs/reports, Feishu configs/contracts and relevant source boundaries.
- 2026-08-24: Preflight confirmed Node `v24.19.0`, pnpm `11.19.0`, unborn `main`, no remote and no local repository Git identity.
- 2026-08-24: Initial `CI=true pnpm check` exited 0; 54 schemas, 31 test files and 158 tests passed.
- 2026-08-24: Created `BASELINE-PHASE-2B-WORKING-TREE-20260824` before Phase 2B.1 edits: 746 files, aggregate `ebcbc96aecc48883a5bb9d8006f59049a6d6688903641c7487eac9ce915cd3d3`.
- 2026-08-24: Presence-only configuration check found `FEISHU_APP_ID`, `FEISHU_APP_SECRET`, `FEISHU_TEST_PARENT_FOLDER_TOKEN` and `CONTENT_OPS_HOME` absent and the live environment gate disabled. No value was read or printed.
- 2026-08-24: Closed the Live branch with zero writes. No token, permission/folder probe, Base, Provision, G1, replay, Repair or remote evidence operation was attempted.
- 2026-08-24: Verified repository CLI syntax for Doctor, documented permissions and the non-writing Workspace plan. Local compiler plan `FWP-89B3F78792010D76` contains 4 tables, 136 non-relation field operations, 5 relation fields, 4 `NAME_ONLY` views and one draft record (150 estimated operations).
- 2026-08-24: Created the Operator setup guide and six Phase 2B.1 stage reports. No sanitized live-evidence JSON was created because no live run occurred.
- 2026-08-24: The first targeted formatting invocation without `CI=true` exited 1 at the non-TTY pnpm dependency check and made no remote call; the identical `CI=true` invocation exited 0.
- 2026-08-24: Ran the complete prescribed final offline sequence, including frozen install, every contract/runtime/visual/Feishu/CLI command and final `CI=true pnpm check`; every command exited 0, with 31 test files and 158 tests passing.
- 2026-08-24: Resumed Phase 2B.1 through the approved one-click sandbox setup flow. Created one dedicated enterprise self-built application named `ContentOpsStudio Sandbox` with fictional-only purpose; no application identifier or credential was written to the repository.
- 2026-08-24: Configured and individually verified all 13 Required Scope keys from the repository manifest. Removed three unrelated default permissions. The deferred attachment scope remains deferred.
- 2026-08-24: Created one dedicated Feishu test enterprise after Operator-controlled phone/OTP verification. Associated the sandbox application with that test enterprise and switched the developer console to its isolated test version. No Base or other Workspace resource has been created yet.
- 2026-08-24: Operator logged the Feishu desktop client into the isolated test enterprise. Created exactly one dedicated cloud folder named `ContentOpsStudio Feishu Sandbox` there; its complete URL and Folder Token remain outside repository content and reports. No Base has been created.
- 2026-08-24: Re-opened the current official Feishu pages for tenant token, Base create/get, table, field, view and record operations immediately before credential handoff. No endpoint title or operation family drift was observed; search-record details remain subject to the first live read.
- 2026-08-24: Pre-write CLI inspection found the existing standalone Live Harness still uses the Phase 2B title/test payload, omits a required system field for Repair, and does not route G1 through the Runtime approval processor. These are Phase 2B.1 evidence blockers, so the Live write remains paused while the harness is narrowed to the mandated fictional payload, safe optional-field omission and formal G1 path with regression tests.
- 2026-08-24: Hardened the Live Harness before network writes: exact Phase 2B.1 fictional payload and Base naming, separate primary/Repair Bases, safe omission of optional `projectConfigOperatorNotes`, Runtime `ApprovalProcessor` G1 event, G1 readback, post-G1 idempotent replay and second Repair no-op evidence. Added three regression tests and a post-G1 replay assertion; complete `CI=true pnpm check` passed with 32 test files and 161 tests.
- 2026-08-24: First secure process-only credential handoff reached the read-only Doctor. Presence and redaction checks passed, but the tenant-token request returned `FEISHU_AUTH_FAILED`. The script stopped immediately under `set -e`; no Dry Run, Base, Provision or remote write occurred. No credential value was retained, printed or written to the repository.

## Final result

Phase 2B.1 is in progress. Sandbox application, test enterprise association, Required Scope configuration and dedicated test folder creation are complete. Credential handoff, Doctor, token-backed folder checks, provision, G1, replay, Repair and final evidence remain pending. Workspace Adapter readiness is still `UNVERIFIED` and Plugin Production Integration Readiness remains `BLOCKED`.

## Unresolved issues

- Tenant scopes are configured in the developer console but still require token-backed live verification. Secure credential handoff, folder access and current OpenAPI behavior remain unverified.
- The existing live harness does not yet supply Phase 2B.1 evidence for the formal Runtime G1 approval route; this must be evaluated only in the configured repeat run and corrected only if that live validation justifies a bounded change.
- The existing harness uses one partially provisioned Base for add-only completion; the configured repeat must verify whether the requested isolated Repair evidence can be produced safely without expanding ordinary production behavior.
