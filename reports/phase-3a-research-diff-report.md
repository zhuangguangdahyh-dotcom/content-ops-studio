# Phase 3A Research Difference Report

## Planned and actual

The plan called for Profile DISCOVER, six contracts, three Research Adapters, deterministic evidence/scoring, eight MCP tools, existing-Feishu painpoint writes, G2 partial review, installed-copy validation and public-source sandbox evidence. All implementation and live surfaces passed.

## Architecture deltas

- Host research boundary: unchanged in intent. Network acquisition stayed in the Host; MCP accepted bounded source metadata only.
- Schema: six additive strict 1.0 catalog entries; catalog count is 66 and generated declarations count is 67 including the index.
- Scoring: fixed weights total 100; thresholds are CORE 80 and IMPORTANT 65.
- G2: item review is version-bound and supports partial batches. Local batch status is updated only after remote read verification.
- MCP: exactly eight tools added; total is exactly 23.
- Skill: Project Initialization now reports minimal material gaps; Painpoint Research owns source/evidence judgment and the G2 request.

## Live-observed deltas and repairs

- Bundled working-directory execution required explicit Schema-root injection.
- Semantic plan identity had to exclude observational timestamps for safe retries.
- Approval Event's existing ID pattern is narrower than the general MCP input pattern; generation now uses the contract-safe date/suffix form.
- B-grade Runtime validation now preserves independent source identity from retained content hashes or locations.
- `approvedLogicalKeys` means protected/skip keys in the existing compiler. Research Runtime no longer supplies all intended fields as protected.
- Official Lark reads return empty text/link/date cells as `null`, date-only values in local-zone form and timestamps in equivalent ISO representations. Read verification now normalizes those representations without weakening other field comparison.
- Retry candidate timestamps are stable for the same Run, Painpoint ID and version.
- Official Lark record updates are eventually consistent in this sandbox. Update read-after-write now uses four bounded verification attempts with increasing short delays.
- A retained exact G2 Review Batch can resume after a post-write verification interruption; a different same-version review is rejected. Recovery skips pending Finalize so it cannot overwrite reviewed state.

## Risks and impact

The initial empty-payload defect left five blank rows in the retained sandbox. Destructive cleanup is intentionally not automated. The incident proves that a successful remote create followed by failed local verification can leave remote residue; reports and manual cleanup therefore retain the count. No target duplicate exists.

The existing Phase 2B.2 field mapping contains legacy painpoint-priority option metadata, while the current contract uses CORE/IMPORTANT/SUPPLEMENTARY. Live record reads accepted and returned current values; a later explicit non-destructive option-migration plan is still preferable before a customer production workspace is used.

There is no change to Plugin version, license, Git history, remote, publishing, images, Renderer, attachments or public MCP scope.
