# Phase 3B Content Diff Report

## Planned versus implemented

- Planned: seven strict Content/G3 Schemas. Actual: seven sources, generated TypeScript and 35 valid/invalid fixtures; catalog total 73.
- Planned: deterministic Content planning, angle/structure, Claim, duplicate and quality rules. Actual: implemented under Core with Runtime/MCP composition and focused tests.
- Planned: one existing-sandbox Content row, mandatory G3 pause, explicit approval and replay/boundary evidence. Actual: one fictional C-0001 row, one P-0001 status update, the required pause, explicit `APPROVE`, remote `COPY_APPROVED` verification and zero-mutation replay.
- Planned: eight MCP tools and total 31. Actual: exactly 31 without renaming the previous 23.
- Planned: no Visual Planning or image work. Actual: formal visual fields are empty and no image/Renderer tool was added.

## Contract and G3 changes

`content-record` now requires `copy_version`; formal visual fields accept the pre-visual empty value. `content-page.background_direction` accepts empty until its owner phase. `approval-event.target_type` accepts `CONTENT_PACKAGE`. G3 binds `C-0001` to `CV-1:CV-1` and the source Run; stale or conflicting decisions remain blocking.

## MCP and Skill changes

The Content Creation Skill, Router, shared approval protocol, server instructions, tool registry, bundle and Plugin package reflect the new Content path. The server continues to expose no generic shell, raw Feishu, delete, image, Renderer or public-network tool.

## Live Lark CLI differences

Two real response differences were observed and fixed narrowly:

1. Single-select reads return the current visible label, not the stable logical code. The field map now performs reverse option normalization.
2. Relation reads return arrays of `{id}` objects, while writes use record-ID strings. Read-after-write equivalence now normalizes both shapes for field types 18 and 21.

Post-G3 testing exposed two local contract gaps and one enum mismatch, all fixed with regressions:

3. Generic resume previously treated Content runs as Project runs. Resume now recognizes the Content checkpoint/result and returns a verified completed no-op after G3.
4. Completed Content finalization replay previously re-entered the pending-state path. It now verifies the approved remote version/fingerprint/status and returns with zero mutations.
5. Fixed-angle planning now uses the canonical `DECISION_GUIDANCE` structure value.

The first relation mismatch occurred after the server had created the single Content row. Recovery did not delete or duplicate it; it reused the row and completed the missing Painpoint update/audit checkpoint. These changes affect only response normalization, not the Blueprint, permissions, write gates or public API capability claims.

## Risks and follow-up

G3 approval, status replay, exact-duplicate different-request blocking, alternate no-write planning and P-0003/P-0005 rejection evidence all passed. The legacy Painpoint priority option mismatch remains a separately deferred add-only migration. Full Plugin production readiness remains blocked by later capabilities.
