# Phase 2A Local Runtime Report

## Status

- Phase 2A implementation: **SUCCESS**.
- Repository compatibility: **PARTIAL** because no real Node 20 execution or remote CI evidence exists.
- Execution date: 2026-08-23 to 2026-08-24 (Asia/Shanghai).
- Repository: `/Users/zhuangguangda/Desktop/content-ops-studio`.
- Git: unborn working tree, no commits, no configured identity, no remote, no push.
- Baseline: `reports/baselines/phase-1b-working-tree-baseline.json`, aggregate SHA-256 `4c5c71a2de9a40ef6bdbb064484229fcd0670bfd665c1d8ee7c38d5ee3287a2f`.

## Delivered runtime

Eleven strict runtime schemas and eleven generated declarations were added: Runtime Config, Platform Pack, Industry Pack, Pack Resolution, Project Runtime Snapshot, Workflow Definition, Run Plan, Run Event, Run Checkpoint, Project Lock, and Runtime Diagnostic. The catalog now contains 45 implemented contracts and 46 generated TypeScript files including the index. No external dependency was added.

`@content-ops/runtime` now provides explicit Runtime Modes, a dependency-injected Composition Root, explicit Project Home creation, atomic Project Registry, Pack loading/resolution and snapshots, Capability and Workflow registries, Run Store, append-only hash-chained Journal, Write Log, checkpointing, project locks, idempotency, approvals, diagnostics, and non-destructive recovery. `content-ops` provides doctor, Pack resolution, project create/inspect, run start/status/approve/resume/verify, and baseline create/verify commands.

The persistent local Mock Workspace materializes the four-table Blueprint below an explicit caller-supplied project directory. It uses only `MOCK-*` IDs, requires idempotency keys, performs read-after-write verification, injects partial failures, retries only unresolved items, and reports `MOCK_ONLY`; it never claims a Feishu write.

## Reference workflow evidence

- `PROJECT_INITIALIZATION_LOCAL_V1`: temporary Home, registry and Pack resolution, four-table Mock Workspace, snapshot, Write Log, Journal, checkpoint, G1 pause, explicit Router approval, resume, project activation, lock release, and verification all passed.
- `VISUAL_FINALIZATION_FIXTURE_V1`: temporary Home, four real sanitized fixture files, Phase 1B object validation, G4 pause/resume, Style Lock and remaining-page validation, render/QA validation, independent G5 pause/resume, Final Manifest validation, and completion all passed.

No network, real Feishu record, real image generation, production render, browser installation, attachment upload, publishing, MCP configuration, Hook, `.app.json`, `.mcp.json`, or customer data was used.

## Verification

- Node 24.19.0 / pnpm 11.19.0: passed.
- Test files: 23; tests: 109; passed: 109; failed: 0.
- Strict schemas: 45/45; generated declarations fresh.
- `CI=true pnpm check`: exit 0 on 2026-08-24.
- Secret scan and example sanitization: passed.
- Node 20 bounded probe: `NOT_AVAILABLE`; no commands were run under Node 20 and no compatibility claim is made.

The first attempt to execute the exact unprefixed final command chain stopped before contract generation because pnpm requested a TTY for dependency-state cleanup (`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`, exit 1). It was corrected by setting process-level `CI=true`. During the final safety audit, one operator command used a non-existent summary alias (`pnpm state-machines:validate`, exit 1) instead of the official `pnpm state:validate`; the official sequence was restarted. Its first restart then exposed an invalid test-only TypeScript assignment at `pnpm runtime:validate` (exit 2); the fixture was corrected to use a Schema-valid but stale target type, and the entire official sequence was restarted again from installation. The final ordered run produced these actual exits:

| Command                                  |                Exit |
| ---------------------------------------- | ------------------: |
| `CI=true pnpm install --frozen-lockfile` |                   0 |
| `pnpm contracts:generate`                |                   0 |
| `pnpm contracts:check-generated`         |                   0 |
| `pnpm contracts:validate`                |                   0 |
| `pnpm state:validate`                    |                   0 |
| `pnpm workspace-blueprint:validate`      |                   0 |
| `pnpm migrations:test`                   |                   0 |
| `pnpm visual-contracts:validate`         |                   0 |
| `pnpm visual-pipeline:validate`          |                   0 |
| `pnpm asset-contracts:test`              |                   0 |
| `pnpm finalization-contracts:test`       |                   0 |
| `pnpm baseline:create`                   |                   0 |
| `pnpm baseline:verify`                   |                   0 |
| `pnpm runtime:validate`                  |                   0 |
| `pnpm runtime:test`                      |                   0 |
| `pnpm recovery:test`                     |                   0 |
| `pnpm project-registry:test`             |                   0 |
| `pnpm pack-resolution:test`              |                   0 |
| `pnpm mock-workspace:test`               |                   0 |
| `pnpm cli:test`                          |                   0 |
| `pnpm node20:probe`                      | 0 (`NOT_AVAILABLE`) |
| `CI=true pnpm format:check`              |                   0 |
| `CI=true pnpm lint`                      |                   0 |
| `CI=true pnpm typecheck`                 |                   0 |
| `CI=true pnpm test`                      |                   0 |
| `CI=true pnpm validate:plugin`           |                   0 |
| `CI=true pnpm verify:bootstrap`          |                   0 |
| `CI=true pnpm scan:secrets`              |                   0 |
| `CI=true pnpm sanitize:examples`         |                   0 |
| `CI=true pnpm check`                     |                   0 |

Final read-only Git evidence: `git status --short --branch` reported `No commits yet on main`; `git log --oneline --decorate -5` exited 128 because the branch is unborn; `git remote -v` exited 0 with no output; Git user name/email probes exited 1 with no configured values. No commit or push was attempted.

## Remaining boundaries

Production Workspace/Feishu, research, image-generation, Renderer, attachment, publishing, Playwright, and MCP implementations remain absent and production readiness is `BLOCKED`. Node 20 compatibility remains the repository-level blocker. The next step should close Node 20 evidence, then use a separate accepted Phase 2B ExecPlan for production project initialization and Feishu Adapter work.

## Phase 2A.1 runtime-policy addendum

Node 20 was subsequently removed from the supported Runtime target after its upstream EOL status was formally incorporated into ADR-0014. The historical probe result and compatibility status above remain accurate for their execution date but are no longer a release or Phase 2B blocker. Current status is defined by the Phase 2A.1 reports.
