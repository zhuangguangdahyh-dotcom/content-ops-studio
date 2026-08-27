# ADR-0029: Visual planning without copy mutation

- Status: Accepted
- Date: 2026-08-24

## Context

Visual Planning must convert approved copy into an executable page system while preserving the exact decision approved at G3. A visual layout may change wrapping, emphasis and Text Layer boundaries, but those are presentation operations, not authority to rewrite, omit or add words.

## Decision

Only `COPY_APPROVED` Content with an existing, version-matching G3 event is eligible. The Content Version, Copy Version, target version, page count and per-page Copy Snapshot hashes are checked before finalization and again before a remote update. A semantic or byte-relevant copy drift blocks with `VISUAL_COPY_DRIFT`; page-count change returns `CONTENT_REVISION_REQUIRED`; text that cannot remain readable inside Safe Area returns to Content Creation instead of being silently shortened.

Visual Plan Version is independent of Content Version and Copy Version. Visual-only changes increment `VV-N` and do not require a new G3. Any copy or page-count change requires Content revision and a new G3. Every prior plan remains immutable history; no rollback deletes it.

## Consequences

Line breaks, emphasis and layer splits may change when the concatenated approved text is identical. Planning retains deterministic hashes and rejects stale submissions. Feishu receives only the bounded visual summary/status fields, never a rewritten copy field.
