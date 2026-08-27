# Phase 2A.1 Node 24 LTS Runtime Baseline Correction

## Goal

Replace the obsolete Node 20 compatibility blocker with one explicit, executable V0.1.0 runtime policy: Node.js 24 LTS, range `>=24 <25`. Introduce version-agnostic runtime evidence, enforce the policy in Runtime and CLI composition, and preserve the separation between local Runtime readiness and unavailable production integrations.

## Non-goals

- No Feishu connection, token, Base, record, or attachment operation.
- No image generation, production Renderer, browser, Playwright, publishing, MCP, Hook, `.mcp.json`, or `.app.json`.
- No Plugin version or license change.
- No Node 20 installation, download, or execution probe.
- No support claim for Node 22, 25, 26, another platform, or remote CI.
- No Git remote, push, or global identity mutation.

## Background

Phase 2A passed the complete local suite on Node 24.19.0 but carried missing Node 20 execution as a repository compatibility blocker. The upstream lifecycle snapshot checked on 2026-08-24 classifies Node 20 as EOL and Node 24 as LTS. The repository is unpublished V0.1.0 with no external Runtime contract consumer, so a documented pre-release contract correction is safer than retaining an EOL target.

## Current state

- Root `engines.node`: `>=20`.
- CI: Node 20 contract job and Node 24 full job.
- Runtime Diagnostic: version-specific `node20_evidence` field.
- CLI doctor: reads `reports/verification/node-20-evidence.json`.
- Probe: `scripts/probe-node20-evidence.ts` and `pnpm node20:probe`.
- Preflight on Node 24.19.0 / pnpm 11.19.0: `CI=true pnpm check` exit 0; 23 files and 109 tests passed.
- Git: unborn `main`, no identity, remote, commit, or push.

## Current Node support declaration

The old `Node 20+` declaration is obsolete and will no longer control current behavior after this plan. Historical reports retain their original facts and receive an addendum that points to ADR-0014.

## Node 20 EOL handling

Node 20 is `UPSTREAM_EOL`, execution is `NOT_REQUIRED`, and the project marks it unsupported. The dedicated probe and command will be removed. Its historical report and machine evidence remain as historical artifacts and are not used by Runtime decisions.

## Node 24 support strategy

V0.1.0 supports and locally verifies only Node 24, with `engines.node`, version files, policy, Runtime Config, diagnostic logic, CI, documentation, and evidence agreeing on `>=24 <25` and major `24`.

## Node 22 unclaimed strategy

Node 22 is not described as incapable or upstream unsupported. It remains `UNCLAIMED` and is blocked by default because this project has no actual validation evidence for it.

## Package changes

- Root `engines.node` becomes `>=24 <25`.
- Workspace packages remain without lower conflicting `engines` declarations.
- Add `.node-version` and `.nvmrc`, both containing `24`.
- Add policy/evidence commands and remove `node20:probe`.
- Add the new Runtime contract to the Schema catalog and generated index.

## CI changes

Use an explicit Node 24 matrix on `ubuntu-latest` and `macos-latest`, with current official `actions/checkout` and `actions/setup-node` major versions. CI configuration is evidence of configuration only; no GitHub CI success will be claimed without a remote run.

## Runtime Diagnostic changes

Replace version-specific decision input with current Runtime, Runtime Support Policy summary, generic Runtime Evidence, supported-range match, warnings, and blocking errors. Local Runtime readiness and Production Integration readiness remain independent.

## Runtime Config changes

Add `required_runtime_policy`, `enforce_supported_runtime`, and `allow_unclaimed_runtime`. Defaults are enforced in code: supported Node 24 proceeds; explicit unsupported versions return `UNSUPPORTED_RUNTIME`; unclaimed versions return `UNCLAIMED_RUNTIME`; malformed or inconsistent policies return stable Runtime policy errors. Tests may pass a fake version explicitly.

## CLI Doctor changes

Doctor loads and validates the policy and generic Node 24 evidence, reports Node 20/22/24/26 independently, shows local readiness separately from production integration readiness, supports JSON and text output, and retains stable exit behavior for production blockers.

## Old report handling

Historical Phase 1A, Phase 1B, and Phase 2A reports retain their dates, results, and original compatibility statements. Short addenda record that ADR-0014 supersedes Node 20 as a current release blocker.

## Old script handling

Delete `scripts/probe-node20-evidence.ts` and remove `pnpm node20:probe`. This repository has no published consumer, and a compatibility wrapper would unnecessarily preserve an obsolete command surface.

## Files involved

- Runtime policy/version: `package.json`, `.node-version`, `.nvmrc`, `.github/workflows/*`, `plugins/content-ops-studio/config/runtime-support-policy.json`.
- Contracts: Runtime Evidence, Runtime Config, Runtime Diagnostic Schema, catalog, generated declarations, fixtures, migration notes/tests.
- Runtime/CLI: policy evaluation, evidence validation/collection, diagnostics, composition, CLI doctor, exports.
- Scripts/tests: policy/evidence scripts, contract/runtime/CLI tests, full regression suite.
- Decisions/docs/reports: ADR-0014, current docs, historical addenda, four Phase 2A.1 reports.

## Interface changes

- New generic `RuntimeEvidence` contract.
- Runtime Config adds required policy controls in the pre-release 1.0 contract.
- Runtime Diagnostic replaces `node20_evidence` with generic runtime fields; the old field is removed before publication and documented as a pre-release correction.
- Runtime composition validates a caller-supplied or actual Runtime version before capability use.
- CLI doctor output gains runtime-policy/evidence and split-readiness sections.

## Data changes and Schema compatibility

There is no production project data or released external consumer. The correction is classified and tested as pre-release contract hardening. Existing canonical fixture data is migrated in the repository; historical Node 20 evidence JSON is retained but is not interpreted as the generic contract. No history is deleted.

## Migration approach

Add a no-data migration note and migration-test assertion for the pre-release Runtime contracts. Regenerate TypeScript only from canonical Schema. Historical report addenda identify ADR-0014 rather than rewriting past outcomes.

## Security risks

- Evidence could accidentally capture secrets or excessive process output.
- A policy/evidence mismatch could be hidden and permit an unsupported Runtime.
- CI version aliases could drift.

Controls: strict Schema, allowlisted environment fields, bounded command summaries, relative report paths, no environment dump, consistency validator, explicit major version, secret scan, and no runtime installation behavior.

## Privacy risks

Evidence contains only runtime/tool versions, platform, architecture, timestamps, relative command names, exit codes, and sanitized limitations. It contains no project, customer, credential, Home path, or command stdout/stderr body.

## Distribution impact

V0.1.0 installation becomes intentionally narrower: Node 24 only. Node 22/26 are unclaimed, not declared broken. The Plugin version remains 0.1.0. Production integration remains blocked.

## Test plan

- Runtime policy: supported Node 24 patches, unsupported 20/23/25, unclaimed 22/26, invalid SemVer, missing and contradictory policies.
- Consistency: package engines, version files, policy, CI, and current docs.
- Evidence: Node 24 passed, Node 20 EOL/not required, unclaimed/not run, invalid success claims, invalid paths and secret fields.
- Doctor: text/JSON, supported Node 24, Node 20 EOL, Node 22 unclaimed, local ready, production blocked, stable exit.
- Regression: all contract, state, visual, runtime, recovery, registry, Pack, Mock Workspace, CLI, E2E, secret, and example checks.

## Failure recovery

All source changes remain in the existing uncommitted working tree. Generated evidence is deterministic in structure and can be regenerated explicitly. Historical artifacts are preserved. A failed command stops the final sequence; fix and restart the sequence rather than skipping it.

## Implementation steps

1. Complete preflight and upstream-source verification.
2. Create this ExecPlan and ADR-0014.
3. Establish engines, version files, policy, and CI baseline.
4. Add Runtime Evidence Schema, update diagnostic/config contracts, regenerate types and fixtures.
5. Implement policy evaluation, evidence collection/validation, Runtime composition enforcement, and CLI doctor.
6. Add tests and migration coverage.
7. Update current documentation and historical addenda.
8. Generate Node 24 evidence and four Phase 2A.1 reports.
9. Run the exact final validation sequence and capture Git evidence.

## Implementation log

- 2026-08-24: Read the Phase 2A.1 instruction and required repository rules/documents; classified the work as a pre-release core Runtime contract correction.
- 2026-08-24: Verified upstream lifecycle from the official Node.js release pages: Node 20 is EOL and Node 24 is LTS. Verified current official GitHub Action documentation/repositories before selecting Action versions.
- 2026-08-24: Preflight recorded Node 24.19.0, pnpm 11.19.0, unborn `main`, no Git identity/remote, and `CI=true pnpm check` exit 0 with 23/109 tests passing.
- 2026-08-24: Accepted ADR-0014; set root engines and both version files to Node 24; updated all three workflows to explicit Node 24 with current Action v7 configuration and an Ubuntu/macOS CI matrix.
- 2026-08-24: Added the generic Runtime Evidence Schema, corrected unpublished Runtime Config/Diagnostic contracts, regenerated 47 TypeScript files and fixtures for 46 Schemas, and removed the Node 20 probe command/script.
- 2026-08-24: Added Runtime policy evaluation/enforcement to Config, Composition Root, reference Runtime, evidence tooling, and CLI Doctor; Node 20 is EOL/unsupported, while Node 22/25/26 are unclaimed by default.
- 2026-08-24: Initial evidence collection correctly failed because a negative-fixture source used a scanner-triggering secret-like key. The key is now constructed safely; Secret Scan passed and Node 24 local evidence passed all seven bounded commands.
- 2026-08-24: The first ordered final pass exposed unreachable Runtime Config branches after the Schema constants were tightened; the implementation was aligned with the contract and the sequence restarted.
- 2026-08-24: The next pass exposed duplicate generated TypeScript intersection constituents from embedding the full conditional evidence Schema. Runtime Diagnostic now carries a strict diagnostic projection of separately validated generic evidence, regenerated contracts pass ESLint, and the sequence restarted.
- 2026-08-24: The complete prescribed validation sequence passed on Node 24.19.0: 46 Schemas, 47 generated TypeScript files, 24 test files / 119 tests, 8 Plugin Skills, 51 Bootstrap paths, Secret Scan, example sanitization, and final `CI=true pnpm check` all passed. Git remains unborn with no remote, commit, or push; remote CI remains unverified.

## Final result

**SUCCESS.** Declared Runtime Compatibility is successful for Node 24 LTS (`>=24 <25`) with local evidence on Node 24.19.0/darwin/arm64. Cross-platform CI evidence remains `UNVERIFIED`, and Production Integration Readiness remains `BLOCKED` because the production Adapters are intentionally unimplemented.

## Unresolved questions

- Cross-platform CI evidence remains unverified until the repository has an authorized remote and a real workflow run.
- Future Node 22 or Node 26 support requires separately scoped actual execution evidence and policy amendment.
