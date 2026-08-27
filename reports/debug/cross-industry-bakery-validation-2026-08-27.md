# Cross-industry bakery validation — 2026-08-27

## Scope

This local validation used a bakery, snack-baking and fruit-tea store Profile to exercise a new-project flow through the bundled MCP server and the official Lark CLI Workspace Adapter. The runtime project Home is external to the repository. No secret or complete remote identifier is retained here.

## Current result

- Runtime: Node.js 24 LTS.
- MCP catalog at validation time: 71 tools; this release adds the sanitized-PNG export tool for a total of 72.
- Workspace Adapter: official Lark CLI 1.0.63.
- New remote test Base: one.
- Blueprint tables: four.
- Blueprint field mappings: 141.
- Blueprint relations: five.
- Blueprint named views: four.
- Project draft records: one, independently read back.
- Remote totals: 146 fields, seven relation fields and eight views.
- Platform-generated/default delta: five fields, two reverse-relation fields and four default views.
- Remote verification: `MATCH`.
- Idempotent replay: no duplicate Base, table, field, relation, view or project record.
- G1 approval: `APPROVE`, with remote status and canonical local Project Profile independently read-verified.
- Project state: `PROJECT_ACTIVE` and `CONFIG_CONFIRMED`.
- Research scope: reduced by the Operator from 30 candidates to 10 retained records.
- Research evidence: 18 retained public sources; all 10 retained painpoints are evidence-backed and hypotheses are disabled.
- Feishu painpoint records: 10 expected, 10 independently read-verified, zero duplicates.
- G2 review: three painpoints approved and seven paused, all read-verified.
- Content: `C-0001`, `C-0002` and `C-0003` were written and read-verified at `CV-1` / Copy `CV-1`; quality scores were 93, 96 and 95.
- G3: only `C-0002` was explicitly approved for visual work. `C-0001` and `C-0003` remain pending.
- C-0002 visual state: three 1242×1660 direction candidates registered locally at `AWAITING_USER_SELECTION`; quality scores are 84, 95 and 94 with zero hard blocks.
- C-0002 candidate Feishu visual writes: zero. No VV revision, FPV, G4, Style Lock or remaining page exists.
- Automatic cleanup: not performed.

## Problems found and repaired

1. The initialization plan treated structurally valid placeholder values as a complete Project Profile. The planner now emits a strict semantic gap report, distinguishes material blockers from non-blocking gaps and keeps inferred fields unconfirmed.
2. Runtime CLI failures were emitted as safe JSON on stderr, while the MCP context parsed only stdout. The context now accepts the last structured stdout or stderr result and preserves the real redacted error code.
3. Workspace verification defaulted to `MATCH` when the Adapter returned `{ verified: false, plan }`. Verification now requires `verified === true`, zero conflicts and zero pending repair operations.
4. Inspect mixed Blueprint targets with platform-generated objects. It now reports Blueprint mappings, reverse relations, default/extra fields and default/extra views separately from remote totals.
5. A full 141-field provisioning Run exceeded the MCP SDK default 60-second timeout. The server now emits a non-sensitive 15-second progress heartbeat when the Host requests progress notifications; clients can reset the timeout on progress while retaining a bounded total timeout.
6. A timed-out Host left an active five-minute project lock. The lock correctly prevented a duplicate write. After natural expiry, Runtime stale-lock recovery archived the old lock and the same project, Run and idempotency scope resumed safely.
7. Project list field counts excluded relation states and then exposed an array/object compatibility regression during the first fix. Counting now supports both persisted collection forms and includes relation fields.
8. G1 updated the remote status but did not promote the confirmed canonical local Project Profile, which incorrectly kept research blocked. G1 now persists the exact version-bound confirmed Profile only after remote read verification.
9. An invalid approval ID could be persisted before Schema validation. Approval events are now Schema-validated before any controlled artifact write; the rejected local artifact was archived outside the repository.
10. The first 30-item research finalization exposed that a single Feishu date field cannot accept multiple evidence dates joined into one string. Ten records with one effective evidence date were retained and verified after the Operator reduced the scope. Multi-date compilation remains a separate hardening item; it was not bypassed by weakening validation.
11. Content draft submission accepted stale near-semantic field names and delayed the strict failure until finalization. The MCP input now uses the canonical closed assessment shape (`content_id`, `similarities`, `differences`, `worth_continuing`, `rationale`, `alternative_angle`) and has a regression test.
12. Image Production MCP inputs accepted a five-character Run suffix while retained evidence Schemas required the canonical four-character suffix. The image-production input boundary now uses the canonical Run pattern and has a regression test. The failed external Run remains retained; the same candidate pixels were replayed under `RUN-20260827-213000-C2V1`.

## Retained painpoint mix

- Product/local purchase: one record covering single-person tasting and whole-cake waste.
- Learning and course decisions: nine records covering starter tools, measurement and substitutions, oven calibration, chiffon failures, fermentation, whipping state, real-time correction, hands-on practice and hidden course costs.

This first 10-item batch reflects the successfully verified records at the moment the Operator reduced the scope. The Operator approved the first three retained painpoints for contentization and paused the remaining seven.

## Remaining Profile gaps

The following are deliberately non-blocking for G1 but must be resolved before they become material to research, copy or visual production:

- price band;
- primary products and real menu;
- course offer details;
- verifiable award evidence;
- authorization and provenance of real product/store visual assets.

AI-generated food must never be presented as an exact item sold by the store. Award names, rankings, years and health or ingredient claims require evidence before publication.

## Cleanup

Manual cleanup is required when the Operator finishes this validation. Complete remote identifiers remain only in `$CONTENT_OPS_HOME`. Do not delete the Base before retaining the final redacted validation evidence needed for regression history.
