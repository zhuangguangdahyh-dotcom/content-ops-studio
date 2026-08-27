# Phase 3A — Project Profile Discovery and Evidence-Backed Painpoint Research

Status: COMPLETE — SUCCESS. Owner: repository maintainers. Started and completed: 2026-08-24.

## Goal

Turn Project Profile discovery and painpoint research from scaffolds into an executable, evidence-backed workflow. Separate Operator, Subject and Audience; identify only material Profile gaps; accept host-researched or Operator-provided sources; deterministically validate, score, deduplicate and persist painpoints; write one painpoint per Feishu row with read-after-write; pause at G2; apply version-bound item decisions; and resume idempotently.

## Non-goals

No content creation, titles, body copy, direct-message hooks, visual planning business workflow, image generation, Production Renderer, Playwright, attachments, publishing, public HTTP MCP, public Plugin submission, arbitrary Web/Search/Fetch/File/Shell/Raw Feishu tools, third-party search credentials, remote deletion, Plugin version change, Git remote or push.

## Current state and existing Project Profile

Phase 2C is complete: Node 24.19.0, Lark CLI 1.0.63, 60 implemented Schemas, 39 test files/194 tests, 15 MCP tools and one retained fictional Phase 2B.2 sandbox. The existing confirmed fictional Profile represents a generic professional-service Subject and a small-service-business Audience. Full runtime/remote identifiers remain only in external `CONTENT_OPS_HOME`.

The immutable Phase 2C baseline is `BASELINE-PHASE-2C-WORKING-TREE-20260824`: 844 files, aggregate `ea96f4a648ea4f58d164be6d365c3cf02c2ab90d20b7a4962e63b8ea2bdb1d8f`, Node v24.19.0, Lark CLI 1.0.63 and MCP bundle `0c54b9947c89f35da474d52ceb78400b4adbcba07135af2c64bb898618ac3580`.

## Project Profile gaps and DISCOVER

DISCOVER reads current conversation inputs and the canonical Profile plan, then emits a strict gap report. Known, missing required, missing recommended, conflicting and inferred fields remain distinct. Operator notes, Subject facts and Audience characteristics cannot substitute for one another. Only missing facts that prevent confirmation or materially change research become blockers. Recommended questions exclude known fields, avoid unrelated sensitive data and remain few enough for direct answers. Inferences remain unconfirmed until G1. Major confirmed-profile changes route to `CONFIG_UPDATE_REQUIRED`; existing active projects do not repeat the full questionnaire.

## Research boundary

The Research Skill owns query design, semantic synthesis, near-semantic review and business judgment. The Host owns Web Search, page opening and user-file reading. The MCP server exposes no generic search or fetch. Research Adapters validate the plan and source manifest, normalize/deduplicate submitted sources, persist artifacts, validate Evidence/candidates, deterministically score, build reports/batches and recover sessions.

- Host-native: accepts structured, cited results produced by an available Host Web capability; it performs no network request itself.
- Manual source: accepts safe public URLs, short summaries or project-relative customer-material artifacts.
- Fixture: deterministic tests only; Production never falls back to it.
- If Host research is unavailable, use Manual Source and report live public research `NOT_RUN`; never fabricate READY or sources.

Official OpenAI documentation reviewed on 2026-08-24 confirms that Skill MCP dependencies belong in `agents/openai.yaml`, workflow instructions remain necessary, MCP annotations must reflect real effects, and Web Search responses provide visible URL citations plus source metadata.

## Evidence and source policy

Source types include official/first-party/customer/interview/industry/platform/social/review/competitor/Q&A/forum/news/manual/model-hypothesis. Store title, publisher/owner, safe URL or project-relative location, date, retrieval time, language, necessary summary, supported claims, limitations, credibility notes and content hash. Do not store full pages/reports. Quoted excerpts are short and bounded. URLs must be HTTP(S); local absolute paths and path traversal are rejected.

Evidence grades are A direct/strong, B independent multi-source, C single/indirect and D hypothesis. B requires at least two independent sources. D is disabled by default, cannot be CORE or HIGH promotion, must state limitations and remains deferred/validation-needed.

## Research plan and query plan

Plans bind Project Profile version, Platform/Industry Pack versions, current Run, scope, date/language/region, Audience segments, decision stages, business scenarios, source mix, query plan, Evidence requirements, deterministic scoring/dedup policy, expected artifacts and capability requirements. Requested count defaults to 30; actual count is independent. `minimum_acceptable_count` never authorizes padding. User-specified count/scope wins when safe.

## Decision chain and business scenarios

Research maps problem awareness, active search, option comparison, risk evaluation, purchase, use and referral; it covers triggers, explicit needs, deep anxiety, barriers, commercial loss, information behavior and Subject-advantage fit. Each candidate carries this structure and at least one valid Evidence reference unless explicitly allowed as D.

## Scoring and deduplication

Core computes nine 0–5 dimensions with version-bound weights totaling 100: Audience relevance 15, frequency 10, urgency 10, decision impact 15, real cost 10, Subject fit 10, Evidence strength 15, content potential 10 and promotion fit 5. Default priority is CORE 80–100, IMPORTANT 65–79.99 and SUPPLEMENTARY below 65. Exact duplicates use deterministic normalization. The Skill may label near-semantic candidates with an explicit reason; no embedding capability is claimed.

## Default 30 and insufficient quantity

Production defaults to 30, but reports the real `produced_count`. It never pads with synonyms, renamed scenarios, arbitrary splitting, generic industry statements or unsupported certainty. Coverage gaps and deferred hypotheses are explicit.

## Painpoint Batch and Feishu field compilation

One painpoint is one row and one research batch contains multiple versioned painpoints. Initial review state is `PAINPOINT_PENDING`, contentization is `PAINPOINT_NOT_CONTENTIZED`, produced-content count is zero, relations/dates are empty and Operator notes are preserved. The compiler maps the full existing Painpoint Blueprint plus hidden system fields. Record Unique Key provides idempotent upsert; confirmed records are not overwritten; new research creates a new historical batch; refresh of confirmed records produces a diff and waits for approval.

## Local research artifacts

Each Run stores request, plan, Profile snapshot, query plan, source manifest, Evidence, candidates, scoring, dedup/coverage reports, research report, painpoint batch, review batch, write log, approvals, checkpoint and result below the project Run directory. Writes are atomic, schema-validated and Run-bound. Plugin Root receives no runtime data, secrets, full page text or complete remote identifiers.

## G2 batch review and item decisions

G2 is a batch approval fact; a separate Painpoint Review Batch records one current APPROVE/REVISE/REJECT/PAUSE decision per item. Review and approval bind research batch, painpoint batch/review versions and source Run. Partial review is legal: undecided items remain pending. APPROVE becomes confirmed and may later enter content creation; REVISE, REJECT, PAUSE and pending cannot. Resume performs Feishu status updates and read verification without deleting history.

## Idempotency and recovery

Research sessions, source/candidate chunks, finalization, Feishu writes and G2 application use stable hashes and idempotency keys. Duplicate chunks return the stored result. Hash/version/session mismatches block. Partial Feishu failures retry only failed rows. Journal, Write Log and Checkpoint preserve verified progress; no rollback deletes remote or local history.

## MCP and Skill flow

Add eight narrow tools: get context, plan research, submit sources, submit candidates, finalize, list/get painpoints and verify batch. Total becomes 23 without renaming the original 15. Read annotations are closed-world; submitted sources and final Feishu write are open-world writes; candidate ingestion is local-only. Server instructions retain plan-before-write, explicit approval, no delete, idempotency and honest results in the first 512 characters and add the Evidence/no-padding/G2 boundary.

Skill flow: Doctor → Research Context → Plan → Host Web or Manual sources → Submit Sources → semantic candidates → Submit Candidates → Finalize → show G2 → wait for explicit decisions → submit approval → resume → verify batch. Router supports research/expand/refresh/revise/audit/resume intents but never writes Feishu or calls Lark CLI directly.

## Live sandbox validation

When the retained external sandbox is available, use host Web Search for at least three public sources of at least two types, including an official or first-party source, on the fictional small-professional-service/Xiaohongshu trust topic. Produce five evidence-backed painpoints, write them to the existing Painpoint table, verify pending state, apply 3 APPROVE/1 REVISE/1 REJECT, read back, replay finalization idempotently and prove no duplicate rows or content records. No new Base and no deletion. If Host search or the sandbox is unavailable, report the corresponding live status honestly.

## Security, privacy, copyright and citations

No real customer data, credentials, tokens, authorization headers, arbitrary paths or full remote IDs enter source/reports. Source summaries and short excerpts are minimal; links, title, publisher and dates remain traceable. Model inference is not an external source. MCP stdout remains protocol-only. No tool accepts arbitrary command, URL fetch, file path or Home.

## Data and interface changes

Add six strict Draft 2020-12 Schemas and generated declarations; add pure research core functions, Adapter/session persistence, Runtime/G2 orchestration, Workspace painpoint record operations, eight MCP contracts, Skill/Router instructions, tests, docs and seven reports. Schema additions are backward-compatible MINOR contract expansion under the existing 1.0 catalog; migration remains history-preserving no-op for existing records.

## Dependencies

No new production or development dependency is planned. Existing Ajv, TypeScript, MCP SDK, Zod and Node 24 APIs are sufficient.

## Files involved

`plugins/content-ops-studio/schemas/1.0`, schema catalog/generated contracts/fixtures, `packages/core/src/research`, `packages/research-adapters`, Runtime and Workspace Adapter composition, `services/content-ops-mcp`, Router/Project Initialization/Painpoint Research Skills, tests/scripts/workflows, ADR-0023–0025, docs 24–28, existing architecture/security/testing/install/roadmap docs and seven Phase 3A reports.

## Test matrix and commands

Contract tests cover strict valid/invalid fixtures and migration. Core/Adapter tests cover Profile gaps, plan defaults/overrides, URL/path/source dedup, Evidence A–D, scoring, D restrictions, exact/near-semantic boundaries, insufficient count, batch fields and session recovery. G2 covers complete/partial/invalid/stale/duplicate decisions, resume, idempotency and readback. MCP covers 23 tools, annotations, strict schemas, chunk/hash/session errors, bundle, SDK E2E and installed-copy Host. Skill evals cover direct/indirect/missing/out-of-scope requests. Final commands are the explicit Phase 3A validation sequence plus `pnpm check` and the non-CI `pnpm research:live-test`.

## Implementation steps

1. Complete preflight, official-doc review, immutable baseline and this plan.
2. Add Accepted research/evidence/G2 ADRs and six strict contracts with fixtures/types/migration tests.
3. Implement pure research validation/scoring/dedup/Profile-gap logic.
4. Implement Host-native, Manual and Fixture Adapters plus atomic session artifacts/recovery.
5. Add painpoint Workspace write/read verification and Runtime G2 item-review orchestration.
6. Add eight MCP tools, Skill/Router flows, bundle and installed-copy tests.
7. Run public-source and existing-sandbox live validation when safely available.
8. Complete docs, seven reports, baseline diff and full regression.

## Failure recovery

Contract or offline regression blocks all live work. Missing Host research or sandbox produces `NOT_RUN`. Insufficient sources yields `INSUFFICIENT_EVIDENCE`. Hash/version/session conflicts block without writes. Partial remote success preserves mappings/write logs and resumes only failed items. Ambiguous resources or confirmed-record conflicts block; no automatic deletion or overwrite.

## Implementation record

- 2026-08-24: Read the complete 2,765-line Phase 3A instruction, repository/Plugin rules, accepted architecture/Runtime/Lark/MCP decisions, current contracts, Skills, Adapter/MCP scaffolds and Phase 2B.2/2C evidence.
- 2026-08-24: Rechecked official OpenAI Plugin packaging, Skill dependency, MCP tool/annotation/result and Web Search citation/source guidance. Confirmed Host Web Search is available in this session and remains a Host capability, not a new MCP tool.
- 2026-08-24: Pre-change Node v24.19.0, pnpm 11.19.0 and Lark CLI 1.0.63 checks passed. Lark user authorization is present; output was reduced to non-sensitive status metadata.
- 2026-08-24: Pre-change `CI=true pnpm check` passed: 60 strict Schemas, 39 test files, 194 tests, fresh MCP bundle, installed-copy test, Secret Scan and example sanitization.
- 2026-08-24: Created immutable Phase 2C baseline before Phase 3A source modification: 844 files, aggregate `ea96f4a648ea4f58d164be6d365c3cf02c2ab90d20b7a4962e63b8ea2bdb1d8f`.
- 2026-08-24: Accepted ADR-0023–0025; added six strict Schemas, 67 generated files including the index, deterministic research core, three Adapters, Research Runtime/G2, Skills and exactly eight MCP tools for a total of 23.
- 2026-08-24: Live Host research retained five bounded public sources across three source types and produced five evidence-backed fictional painpoints (three B, two C; three CORE, two IMPORTANT; no hypothesis).
- 2026-08-24: Live validation exposed and repaired bundled Schema-root resolution, semantic plan retry identity, Approval ID generation, B-source Runtime identity, protected-field Payload semantics, Lark empty/date normalization and cross-retry timestamp drift. Focused regression suites passed after each repair.
- 2026-08-24: The failed empty Payload attempt left five blank projected rows in the retained sandbox. No deletion was attempted. Five corrected target rows exist, pass list/get/batch verification and replay with zero new target records. Manual cleanup remains required.
- 2026-08-24: The live Run is paused at G2 with five `PAINPOINT_PENDING` rows. The proposed 3 APPROVE / 1 REVISE / 1 REJECT review has not been applied because the Operator must explicitly confirm it.
- 2026-08-24: Regenerated the three stale TypeScript declarations exposed by the pre-G2 regression and resolved strict lint boundary issues without weakening any rule. The pre-G2 `CI=true pnpm check` then passed: 66 Schemas, 43 test files, 213 tests, 23 bundled MCP tools, Secret Scan and example sanitization all passed.
- 2026-08-24: The Operator explicitly authorized the proposed 3 APPROVE / 1 REVISE / 1 REJECT G2 batch. The first remote update applied all five states, but immediate official-CLI read verification returned stale values and reported `PAINPOINT_G2_REMOTE_WRITE_PARTIAL`.
- 2026-08-24: Read-only inspection proved the intended 3/1/1 values were already present. Added bounded update read-after-write retries, deterministic review timestamps, exact same-version recovery, conflicting-review protection and regression coverage. A restart then correctly refused to replay pending Finalize over reviewed data, so the live Harness was narrowed to resume from the retained Review Batch.
- 2026-08-24: Recovery completed without new target records: all five reviewed records were reused, G2 returned SUCCESS and final independent Inspect reported five found, zero field mismatches, three confirmed, one revision-required and one rejected.
- 2026-08-24: Final `CI=true pnpm install --frozen-lockfile` and `CI=true pnpm check` exited 0. Final evidence: 66 strict Schemas, 43 test files, 214 tests, 23 MCP tools, installed-copy Host validation, Secret Scan and example sanitization all passed.

## Final result

Implementation, public-source research, Feishu target writes, idempotent replay, explicit G2, recovery, final Inspect and full regression are complete. Phase 3A is SUCCESS and Painpoint Research Production Readiness is READY. Plugin Production Integration Readiness remains BLOCKED by later-phase capabilities.

## Unresolved issues

- Native Codex repo-Plugin automatic installation remains unverified from Phase 2C; installed-copy/SDK Host validation passed and remains the local evidence route.
- The retained sandbox and its complete identifiers are external to the repository.
- An earlier wider projection observed five blank rows from the retained live failure, while the final key-projected query returned five targets and zero blank projections. No deletion was performed; manual UI inspection and sandbox cleanup remain required.
