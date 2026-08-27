# Phase 3B — Evidence-Grounded Content Creation and G3 Copy Approval

Status: COMPLETE. Owner: repository maintainers. Started: 2026-08-24. Completed: 2026-08-24.

## Task goal

Turn one confirmed primary Painpoint into one complete, evidence-grounded Xiaohongshu image-post Content Package; retain plan, angle, structure, Claim Map, pages, title/body/CTA, duplication and quality evidence; write one idempotent Content row to the existing fictional Feishu sandbox; update the Painpoint to content-in-progress; and stop at version-bound G3 `CONTENT_COPY` for an explicit Operator decision.

## Non-goals

No production visual-planning business, final background direction, final visual-plan summary, Style Lock, image generation, Renderer, Playwright, attachments, G4/G5, publishing, public HTTP MCP, public Plugin submission, delete tools, arbitrary Shell/File/Raw Feishu tools, new Base, customer data, Plugin version change, license change, Git remote or push.

## Current Live status

Phase 3A is SUCCESS. The retained fictional sandbox has one Base, four target tables, 141 Blueprint fields, five relations, four named views, one Project record and five correct Painpoint records. `P-0001`, `P-0002`, and `P-0004` are confirmed; `P-0003` requires revision; `P-0005` is rejected. Phase 3B added exactly one C-0001 Content row, explicitly approved it at `CV-1:CV-1`, and read-verified `COPY_APPROVED`. Complete identifiers remain outside the repository.

## Existing Content Contract

The current `content-record`, `content-page`, `content-package`, and `content-fingerprint` contracts establish one primary Painpoint, stable Content ID/unique key, page copy, title count, independent content/image/approval/sync states and deterministic fingerprinting. Phase 3B adds strict plan, angle, Claim Map, duplication, quality, copy review and revision artifacts without changing the four-table topology.

## Existing Painpoint and Evidence

Content context must reload the retained confirmed Painpoint, its referenced Evidence records, Project Profile, active Project rules, Platform/Industry Pack versions, recent project content and same-Painpoint content. Chat memory is never a project source. Factual external Claims require retained Evidence; Project first-party Claims require authorized project evidence; professional judgment and opinion remain explicitly classified.

## Content Creation readiness

Only `PAINPOINT_CONFIRMED` is eligible. `P-0003` and `P-0005` must return `PAINPOINT_NOT_CONFIRMED` without local Content finalization or remote Content writes. The existing Project is active/config-confirmed, Node 24 and Lark CLI 1.0.63 are ready, initial `CI=true pnpm check` passed, and Phase 3A baseline exists.

## Single core problem, viewpoint, and value

Each Content binds one primary Painpoint, one non-empty core problem and one core viewpoint. The selected value must include at least one of emotional, money, time, risk reduction, decision value or professional insight. The copy must answer why the Audience needs the information, what decision value it receives, and how it can judge or act.

## Content angles and structure selection

Default planning produces at least three angle candidates, records the selected candidate and preserves non-selected limitations. Angle and structure are separate. Stable angles include risk, cost, decision, misconception, diagnosis, comparison, process, case, emotional and professional judgment. Stable structures reuse the existing ten Platform Pack types. A fixed Operator angle still undergoes duplication checks; changing only a title is never an alternate.

## Page count and page copy

The resolved count is 4–8 and is distinct from the requested count. Page 1 is Cover, numbering is continuous, and every page has one primary role, purpose, headline, body or supporting text. Phase 3B may retain a visual-evidence requirement or preliminary handoff note but must not write formal background direction or visual-plan summary fields.

## Claim Map

Claims are classified as external fact, project first-party, professional judgment, opinion, example or CTA. Unsupported/rewrite-required Claims block G3. No fabricated percentage, ranking, study result, customer story, actual result or real Case is allowed. A fictional example must be identified as such.

## Title, body, direct-message hook, and promotion suitability

The Xiaohongshu title is deterministically counted by Unicode code points and must be at most 20 visible characters. The body adds context, judgment criteria, actions or limits rather than concatenating pages. A direct-message hook may be empty; it is allowed only when the Subject can genuinely fulfill it. Promotion suitability is HIGH/MEDIUM/LOW/NOT_RECOMMENDED with a reason and is distinct from quality.

## Content quality

Core validates page/count/version ranges, hard-check consistency, fixed weights totaling 100, threshold `weighted_score >= 75`, zero blocking failures and status. The Host model supplies dimension judgments. Hard checks cover focus, one Painpoint/problem/viewpoint, legal pages, Cover, title, Claims, CTA, forbidden expressions, fabrication, duplication, page tasks and the visual boundary.

## Exact and near-semantic duplication

Exact identity uses NFKC, case, line-break, whitespace and punctuation normalization over Painpoint ID, angle, viewpoint, Cover hook, structure and conclusion, then SHA-256. Near-semantic assessment is a retained Host judgment, not an embedding claim. HIGH risk blocks finalization. Idempotent replay reuses the original Content and is not a duplicate. Alternate creation requires a materially different angle or conclusion.

## Operations and one-Painpoint/many-Content behavior

Supported operations are CREATE_NEW, CREATE_ALTERNATE, REVISE and AUDIT_DUPLICATION. One Content has one primary Painpoint; one Painpoint may have multiple Contents. CREATE_ALTERNATE may create a new plan but the initial Live phase writes only one remote Content. REVISE preserves the prior local version and invalidates the prior G3.

## G3 copy approval and versioning

Finalization writes/read-verifies the Content and Painpoint state, checkpoints the Run and returns `AWAITING_APPROVAL` at Gate `CONTENT_COPY`, Target Type `CONTENT_PACKAGE`, bound to Content Version and Copy Version. APPROVE, REVISE, REJECT and PAUSE each produce a detailed Content Copy Review plus a Router-owned generic Approval Event. No decision is inferred. Only approved copy becomes eligible for later Visual Planning, and Phase 3B never starts that phase.

## Feishu Content library and Painpoint state

Compile all existing owned Content fields and system fields, use Record Unique Key for upsert, preserve Operator notes and approved versions, leave formal visual/asset fields empty, and use bounded read-after-write. Initial states are `COPY_PENDING_APPROVAL`, `IMAGE_NOT_GENERATED`, `FIRST_PAGE_NOT_SUBMITTED`, `FINAL_NOT_SUBMITTED`, and `SYNC_NOT_STARTED`. Before G3, the Painpoint becomes `PAINPOINT_CONTENT_IN_PROGRESS`; finalized count and latest content date remain unchanged.

## Idempotency and recovery

Every write binds Run ID, current versions, hashes, a stable idempotency key, lock, Journal, Write Log and Checkpoint. Same-input replay reuses one Content row. Partial success preserves state and retries only missing/unverified work. No rollback deletes local or remote history. A conflicting version/hash/request blocks.

## MCP tools

Add exactly eight narrow tools: get context, plan creation, submit draft, finalize copy, list contents, get content, verify content and plan revision. Expected total is 31 tools: 21 read and 10 write. No existing tool is renamed. Input/output are strict, annotations match actual effects, and results provide structured plus concise text content with stable redacted errors.

## Skill and Router

Implement the `content-creation` Skill with CREATE_NEW, CREATE_ALTERNATE, REVISE and AUDIT_DUPLICATION modes and dedicated contract/workflow/angle/structure/claim/duplication/quality/G3/failure/example references. Router recognizes create/alternate/revise/audit/review/resume intents, blocks unconfirmed Painpoints, and remains the only approval owner. Neither Skill nor Router directly calls Lark CLI or Feishu.

## Live sandbox validation

Reuse the retained external fictional Phase 2B.2/3A sandbox and `P-0001`; do not create a Base. Build one six-page Chinese CREATE_NEW Content with one decision/professional-insight value, Evidence-backed factual Claims and no real customer data. Finalize once, read-verify, replay idempotently, test an exact duplicate with a different request, create a no-write alternate plan, and prove `P-0003`/`P-0005` rejection.

## Mandatory first G3 pause

After the first successful remote Content write, the workflow generated the G3 matrix, displayed the exact current Content Package and stopped at `AWAITING_USER_APPROVAL`. A later explicit Operator reply approved exact version `CV-1:CV-1`; the resumed workflow wrote/read-verified the final G3 state and completed replay, duplicate, alternate and eligibility boundaries. Visual Planning was not started.

## Phase 3A blank-row boundary

Phase 3A historically observed five blank Painpoint rows after a failed empty payload. Current key and wide projections each return five correct rows and zero blanks. Phase 3B never treats a blank as a Painpoint and never auto-deletes remote residue.

## Legacy priority-option boundary

The remote Painpoint priority options are a legacy mixed set and do not exactly match `CORE`/`IMPORTANT`/`SUPPLEMENTARY`; `SUPPLEMENTARY` is absent. Phase 3B records this only. A separate add-only/non-destructive migration is deferred before customer production use.

## Security and truthfulness

No Secret, token, authorization header, full remote identifier, absolute personal runtime path, real customer material, full public page, fabricated Claim, unsupported production result or remote error body enters source/reports. The official Lark CLI remains the default Workspace path. Writes require explicit environment and CLI gates and never use secret arguments.

## Files involved

Schemas/catalog/generated contracts/fixtures; content core and Runtime modules; Workspace record compilation; CLI/MCP service and bundle; Content Creation/Router Skills; package scripts; tests/workflows; ADR-0026–0028; docs 29–35 and affected architecture/security/install/test/readiness docs; eight phase reports plus the preflight audit and baseline-relative diff.

## Dependencies

No new production or development dependency is planned. Node 24, Ajv, TypeScript, MCP SDK, Zod and existing Workspace/Runtime utilities are sufficient.

## Test matrix and commands

Contracts cover seven strict Schemas, generated declarations, fixtures and migration. Core tests cover plans, angles, Claims, pages, Unicode title count, CTA, fingerprint/duplicate, quality and version rules. Runtime/Workspace tests cover one-row writes, protected fields, states, relations, read verification, idempotency and G3/revision. MCP/Skill tests cover eight new tools, exact 31 count, annotations, strict errors and visual/image non-trigger boundaries. Run the complete task-specified sequence, explicit Live Harness, `pnpm check`, Secret Scan and installed-copy/Host tests.

## Implementation steps

1. Complete Preflight, immutable Phase 3A baseline and read-only data audit.
2. Add Accepted ADR-0026–0028 and seven strict contract artifacts.
3. Implement deterministic content planning, fingerprinting, validation, duplication, quality and version rules.
4. Implement external-Home artifacts, Feishu compilation/read verification, Painpoint state and G3/recovery orchestration.
5. Add eight MCP tools, CLI/Live Harness, full Skill/Router instructions and regression/eval coverage.
6. Build/validate the bundle and installed Plugin; complete docs/reports and offline regression.
7. Run the existing-sandbox Content flow and stop at G3 for explicit Operator approval.
8. After approval, resume, read-verify, test replay/duplicate/revision boundaries and finalize the phase.

## Failure handling

Any offline regression blocks Live work. Missing sandbox returns NOT_RUN. Missing/invalid Painpoint state, stale versions, unsupported Claims, HIGH duplication, invalid title/pages/quality, missing mapping, ambiguous Content candidates or failed read verification blocks without additional creation or deletion. Preserve artifacts and report the narrow recovery action.

## Implementation record

- 2026-08-24: Read the complete 3,375-line Phase 3B instruction, repository/global rules, accepted ADRs, current Content/Painpoint contracts, Workspace Blueprint, Skills, Runtime/MCP structure and Phase 3A evidence.
- 2026-08-24: Confirmed Node v24.19.0, pnpm 11.19.0, official Lark CLI 1.0.63, valid user OAuth, unborn `main`, no Git identity, no remote and no push.
- 2026-08-24: Initial `CI=true pnpm check` passed: 66 strict Schemas, 43 test files, 214 tests, 23 MCP tools, fresh bundle/installed-copy evidence, Secret Scan and example sanitization.
- 2026-08-24: Created immutable Phase 3A baseline before Phase 3B source changes: 917 files, aggregate `3221fb03f83b8c75a13c516580d8bb471c64a9987cd3e3a2f207c55d71cc358d`, MCP bundle `f0053e08f7e5017b6365ec3db97d998d2b4e8969d81acf3db2fcfe19d989f318`.
- 2026-08-24: Read-only official CLI audit confirmed the 3/1/1 G2 states, five addressable Painpoints, zero current Content rows and no current blank projection. The legacy priority-option mismatch remains deferred; no remote mutation or delete occurred.
- 2026-08-24: Implemented seven strict Content contracts, deterministic Core/Runtime flow, eight bounded MCP tools, Content Creation/Router instructions and regression coverage. The pre-Live full check passed with 73 Schemas, 31 MCP tools, 46 test files and 222 tests.
- 2026-08-24: The first Live attempt stopped before writes because the official CLI returned the current single-select label instead of the stable logical code. Added field-map-based reverse normalization and a regression test; the subsequent complete check passed with 223 tests.
- 2026-08-24: The second Live attempt created exactly one fictional `C-0001` remote row, then stopped at read-after-write verification before updating the Painpoint or establishing the G3 checkpoint. Read-only diagnosis proved the CLI represents relation values as `{id}` objects while the adapter expected record-ID strings. No retry, deletion or G3 action was performed before adding a relation-equivalence regression fix.
- 2026-08-24: Relation normalization passed the complete 73-Schema/46-file/223-test check. Same-Run recovery reused the only C-0001 row, updated P-0001 to `PAINPOINT_CONTENT_IN_PROGRESS`, persisted the Write Log and G3 Checkpoint, and independently read-verified both states. Quality is 89.5, duplication LOW and blocking failures 0.
- 2026-08-24: Generated docs 29–35 and all eight required Phase 3B reports in their mandated pre-approval state. The exact CV-1/CV-1 package is now presented to the Operator; no G3 decision, replay, alternate plan, revision apply or Visual Planning action has been executed.
- 2026-08-24: Pause-state `git diff --check` and full `CI=true pnpm check` passed: 73 Schemas, 31 tools, bundle/package/Host checks, 46 test files, 223 tests, Secret Scan and example sanitization. Final post-approval regression remains intentionally pending.
- 2026-08-24: The Operator explicitly approved C-0001 at exact version `CV-1:CV-1`. Router-owned G3 processing updated the existing remote row to `COPY_APPROVED`; independent verification confirmed status, version, fingerprint and the P-0001 relation/state.
- 2026-08-24: Added Content-aware completed-run resume and completed-finalization replay verification. Formal resume returned `PASSED_NO_OP`, identical approval replay updated 0 records, and finalization replay performed 0 remote mutations while retaining exactly one Content row.
- 2026-08-24: Live boundaries passed: different-request identical fingerprint was blocked, alternate fixed-angle planning succeeded as dry-run without a write, and P-0003/P-0005 were rejected as not confirmed. No Visual Planning action ran.
- 2026-08-24: Final `CI=true pnpm check` passed with 73 Schemas, 31 tools, bundle/package/Host checks, 46 test files, 225 tests, Secret Scan and example sanitization.

## Final result

SUCCESS. Content Creation implementation, one-row Live write/recovery, explicit G3 approval, remote verification, completed-run resume, zero-mutation replay, duplicate/alternate/non-confirmed boundaries and final regression all passed. Content Creation Production Readiness is READY. Visual Planning was not started, and full Plugin Production Integration Readiness remains BLOCKED.

## Unresolved issues

- Historical blank Painpoint residue still requires later Operator UI inspection; current projections do not expose it.
- Painpoint priority option metadata requires a separately approved non-destructive migration before a customer Workspace.
- Native repo-Plugin automatic installation remains unverified; installed-copy/SDK Host validation is the accepted local evidence path.
- Production Visual Planning, image generation, Renderer, attachment upload, publishing and public MCP hosting remain later-phase work; therefore full Plugin production readiness is still blocked.
