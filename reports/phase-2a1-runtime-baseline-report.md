# Phase 2A.1 Runtime Baseline Report

## Status

- Phase 2A.1 implementation: **SUCCESS**.
- Declared Runtime Compatibility: **SUCCESS** for Node 24 LTS only.
- Validated Runtime: Node 24.19.0 on `darwin/arm64`.
- Cross-platform CI Evidence: **UNVERIFIED**; configuration was updated but no remote workflow ran.
- Production Integration Readiness: **BLOCKED**.
- Execution date: 2026-08-24 (Asia/Shanghai).
- Repository: `/Users/zhuangguangda/Desktop/content-ops-studio`.

## Runtime policy

V0.1.0 supports Node.js 24 LTS with `engines.node` set to `>=24 <25`. `.node-version` and `.nvmrc` both contain `24`. Node 20 is upstream EOL, unsupported by the project, and `NOT_REQUIRED` for execution. Node 22, 25, and 26 are unclaimed; the project does not assert that they cannot run.

The root `package.json`, `.node-version`, `.nvmrc`, policy file, and all CI workflows agree on this bounded major. The Plugin version remains 0.1.0.

The canonical repository policy is `plugins/content-ops-studio/config/runtime-support-policy.json`. Policy consistency validation covers root/package declarations, version files, all three CI workflows, current documentation, command registration, and removal of the obsolete Node 20 probe.

## CI configuration

CI uses explicit Node 24 jobs on `ubuntu-latest` and `macos-latest`. All workflows use `actions/checkout@v7` and `actions/setup-node@v7` with explicit `node-version: 24` or the bounded Node 24 matrix. No `latest`, `current`, `node`, wildcard, Node 20, remote, or workflow-run success is claimed.

## Runtime Evidence

`runtime-evidence.schema.json` separates support-policy status from execution status. The current machine-readable evidence is `reports/verification/runtime-evidence-node24.json`. It records only seven command names, exit codes, Runtime/package-manager versions, platform/architecture, timestamps, relative report path, and limitations; it stores no stdout/stderr body, environment dump, absolute personal path, credential, or project data.

Initial evidence collection failed because a negative-fixture generator contained a literal secret-like key and Secret Scan correctly blocked it. The fixture intent was preserved with a safely constructed key. The next collection passed all seven commands. No Node version was installed, downloaded, or probed.

## Runtime Diagnostic and CLI Doctor

Runtime Diagnostic now uses generic `current_runtime`, `runtime_support_policy`, `runtime_evidence`, `supported_runtime_match`, lifecycle snapshot, local readiness, production readiness, and cross-platform evidence. The unpublished `node20_evidence` field was removed under ADR-0014.

Current Doctor result:

- Current Runtime: Node 24.19.0.
- Policy match: yes, `>=24 <25`.
- Local Runtime Readiness: `READY`.
- Cross-platform CI Evidence: `UNVERIFIED`.
- Production Integration Readiness: `BLOCKED`.
- Production Workspace, image, and Renderer Adapters: `NOT_IMPLEMENTED`.

Doctor supports JSON and stable human-readable output. MOCK Doctor exits 0 with truthful warnings; Production Doctor exits 2 while production integrations remain absent.

## Schema, types, fixtures, and tests

- Canonical Schemas: 46 implemented.
- Generated TypeScript: 47 files including the index.
- New Schema: Runtime Evidence.
- Corrected pre-release Schemas: Runtime Config and Runtime Diagnostic.
- Runtime Evidence fixtures: Node 24 passed, Node 20 EOL/not-required, Node 22 unclaimed/not-run, and seven focused invalid cases.
- Tests before Phase 2A.1: 23 files / 109 tests.
- Current tests: 24 files / 119 tests, all passing in the final full run.

## Git and remote state

The repository remains an unborn `main` working tree. `user.name` and `user.email` are not configured, so no identity was fabricated and no commit was created. No remote is configured and nothing was pushed.

## Final verification

The final ordered sequence completed on Node 24.19.0. `CI=true` was applied to every pnpm invocation to keep pnpm deterministic in the non-interactive environment.

| Actual command                              |                                         Exit |
| ------------------------------------------- | -------------------------------------------: |
| `CI=true pnpm install --frozen-lockfile`    |                                            0 |
| `CI=true pnpm contracts:generate`           |                                            0 |
| `CI=true pnpm contracts:check-generated`    |                                            0 |
| `CI=true pnpm contracts:validate`           |                                            0 |
| `CI=true pnpm runtime-policy:validate`      |                                            0 |
| `CI=true pnpm runtime-evidence:collect`     |                                            0 |
| `CI=true pnpm runtime-evidence:validate`    |                                            0 |
| `CI=true pnpm state:validate`               |                                            0 |
| `CI=true pnpm workspace-blueprint:validate` |                                            0 |
| `CI=true pnpm migrations:test`              |                                            0 |
| `CI=true pnpm visual-contracts:validate`    |                                            0 |
| `CI=true pnpm visual-pipeline:validate`     |                                            0 |
| `CI=true pnpm asset-contracts:test`         |                                            0 |
| `CI=true pnpm finalization-contracts:test`  |                                            0 |
| `CI=true pnpm runtime:validate`             |                                            0 |
| `CI=true pnpm runtime:test`                 |                                            0 |
| `CI=true pnpm recovery:test`                |                                            0 |
| `CI=true pnpm project-registry:test`        |                                            0 |
| `CI=true pnpm pack-resolution:test`         |                                            0 |
| `CI=true pnpm mock-workspace:test`          |                                            0 |
| `CI=true pnpm cli:test`                     |                                            0 |
| `CI=true pnpm format:check`                 |                                            0 |
| `CI=true pnpm lint`                         |                                            0 |
| `CI=true pnpm typecheck`                    |                                            0 |
| `CI=true pnpm test`                         |                     0 (24 files / 119 tests) |
| `CI=true pnpm validate:plugin`              |                                 0 (8 Skills) |
| `CI=true pnpm verify:bootstrap`             | 0 (51 required paths plus package skeletons) |
| `CI=true pnpm scan:secrets`                 |                                            0 |
| `CI=true pnpm sanitize:examples`            |                                            0 |
| `CI=true pnpm check`                        |                                            0 |
| `git status --short --branch`               |                 0 (`No commits yet on main`) |
| `git log --oneline --decorate -5`           | 128 (expected: unborn branch has no commits) |
| `git remote -v`                             |              0 (empty: no remote configured) |

The expected `git log` result is repository-state evidence, not a failed implementation check. Earlier implementation-time failures were not skipped:

- Unprefixed contract generation: exit 1 because pnpm required non-TTY module-state confirmation; corrected with process-level `CI=true`.
- First fixture generation: exit 1 due strict Ajv `strictTypes`; Schema annotations were corrected and generation restarted.
- The next strict Ajv fixture pass found a missing numeric type for `minimum`; the Schema was corrected and generation restarted.
- First evidence collection: exit 1 because Secret Scan caught a negative-fixture source key; fixture generation was corrected and collection restarted.
- First expanded full test run: exit 1 with 118/119 passing due an incorrect test import; import was corrected and the full test suite then passed 119/119.
- The first final sequence stopped at `runtime:validate` because tightened constant Config fields made two old TypeScript branches unreachable; the branches were removed and the sequence restarted.
- The next final sequence stopped at `lint` because an external conditional Schema reference produced duplicate generated intersection constituents and one test retained an unnecessary assertion. Runtime Diagnostic now embeds a bounded projection of separately validated Runtime Evidence, the assertion was removed, generated contracts/fixtures were refreshed, and the sequence restarted from the beginning.

## Unimplemented boundaries

Real Feishu, Production Workspace Adapter, research, real image generation, Production Renderer, Playwright, official MCP, attachment upload, publishing, and release remain unimplemented. Runtime compatibility does not alter those boundaries.

## Next stage

The only recommended development step is a separately accepted Phase 2B ExecPlan for formal project initialization and a Feishu Workspace Adapter. Remote cross-platform CI should still be obtained before release, but it is not a Node 20 or Phase 2B blocker.
