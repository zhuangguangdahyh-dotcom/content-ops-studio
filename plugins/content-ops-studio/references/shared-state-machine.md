# Shared state machine

Internal state uses stable English codes. Feishu-facing labels use the Chinese values in `config/status-map.json`.

## Project

`PROJECT_INITIALIZING`, `PROJECT_PENDING_CONFIRMATION`, `PROJECT_ACTIVE`, `PROJECT_PAUSED`, `PROJECT_ARCHIVED`.

## Configuration

`CONFIG_PENDING`, `CONFIG_CONFIRMED`, `CONFIG_UPDATE_REQUIRED`.

## Painpoint review

`PAINPOINT_PENDING`, `PAINPOINT_CONFIRMED`, `PAINPOINT_REVISION_REQUIRED`, `PAINPOINT_REJECTED`.

## Painpoint contentization

`PAINPOINT_NOT_CONTENTIZED`, `PAINPOINT_CONTENT_IN_PROGRESS`, `PAINPOINT_CONTENT_AVAILABLE`, `PAINPOINT_COVERED`, `PAINPOINT_PAUSED`.

## Content

`CONTENT_ANALYSIS_PENDING`, `CONTENT_PLANNING`, `COPY_PENDING_APPROVAL`, `COPY_REVISION_REQUIRED`, `COPY_APPROVED`, `VISUAL_PLANNING`, `FINAL_REVIEW_PENDING`, `CONTENT_FINALIZED`, `CONTENT_PUBLISHED`, `CONTENT_PAUSED`, `CONTENT_DISCARDED`.

## Image production

`IMAGE_NOT_GENERATED`, `FIRST_PAGE_GENERATING`, `FIRST_PAGE_PENDING_APPROVAL`, `FIRST_PAGE_APPROVED`, `IMAGE_SET_GENERATING`, `IMAGE_SET_GENERATED`, `IMAGE_GENERATION_FAILED`.

## First-page approval

`FIRST_PAGE_NOT_SUBMITTED`, `FIRST_PAGE_APPROVAL_PENDING`, `FIRST_PAGE_REVISION_REQUIRED`, `FIRST_PAGE_APPROVAL_APPROVED`, `FIRST_PAGE_APPROVAL_REJECTED`.

## Final approval

`FINAL_NOT_SUBMITTED`, `FINAL_APPROVAL_PENDING`, `FINAL_REVISION_REQUIRED`, `FINAL_APPROVAL_APPROVED`.

## Synchronization

`SYNC_NOT_STARTED`, `SYNC_IN_PROGRESS`, `SYNC_COMPLETED`, `SYNC_PARTIAL`, `SYNC_FAILED`.

## Finalization

`NOT_ELIGIBLE`, `ELIGIBLE`, `FINALIZING`, `FINALIZED`, `FINALIZATION_FAILED`, `SUPERSEDED`.

Finalization transitions require artifact evidence. Only the complete current approval and asset chain may enter `ELIGIBLE`; Manifest creation enters `FINALIZING`; verified Delivery plus Archive evidence enters `FINALIZED`; a partial operation enters `FINALIZATION_FAILED` and may resume from verified immutable artifacts. A post-finalization version, approval, Style Lock or checksum change makes the old set `SUPERSEDED` without deleting it.

## Rule confirmation

`RULE_UNCLASSIFIED`, `RULE_PENDING_APPROVAL`, `RULE_ACTIVE`, `RULE_REJECTED`, `RULE_DEPRECATED`.

## Run

`RUN_CREATED`, `RUN_PREFLIGHT`, `RUNNING`, `AWAITING_APPROVAL`, `RUN_PARTIAL`, `RUN_BLOCKED`, `RUN_CONFLICT`, `RUN_FAILED`, `RUN_CANCELLED`, `RUN_SUCCEEDED`, `RUN_RESUMING`.

## Required transition constraints

- Copy must be `COPY_APPROVED` before `FIRST_PAGE_GENERATING`.
- First-page approval must be `FIRST_PAGE_APPROVAL_APPROVED` before `IMAGE_SET_GENERATING`.
- Images must be `IMAGE_SET_GENERATED` before `FINAL_REVIEW_PENDING`.
- QA must pass before `CONTENT_FINALIZED`.
- Checksum-bound explicit G5, current Style Lock, complete pages, passed Continuity and Group QA, and zero hard blocks are required before `FINALIZING`.
- An explicit Router-created approval is required for every approved state.
- Approval target version must equal the current target version.

These transitions are always illegal: unapproved copy → formal first page; unapproved first page → remaining pages; incomplete images → final review; failed QA → finalized; no Operator confirmation → approved; stale approval → advance a new version.

Visual artifact statuses such as `VISUAL_DRAFT`, `VISUAL_VALIDATED`, `FIRST_PAGE_READY`, `STYLE_LOCKED`, and `VISUAL_INVALIDATED` belong to the Visual System contract and do not add a twelfth business state machine. Remaining-page Generation Manifests require current Style Lock. A successful image set may coexist with `SYNC_PARTIAL` or `SYNC_FAILED`; synchronization failure never becomes `IMAGE_GENERATION_FAILED`.

`FINALIZED` and `SYNC_COMPLETED` are independent. Finalization never implies a Feishu metadata write or attachment upload.

Runtime orchestration states do not replace these business states. `AWAITING_APPROVAL` pauses a Run without implying approval. `RUN_RESUMING` is legal only from a current approval or verified recovery point. `RUN_SUCCEEDED` requires every planned step to be completed or explicitly skipped; Journal corruption forces `RUN_BLOCKED`.
