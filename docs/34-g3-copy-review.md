# G3 Copy Review

G3 is the explicit `CONTENT_COPY` approval gate. Its target type is `CONTENT_PACKAGE`; target ID, Content Version, Copy Version and source Run must all match the current package.

`APPROVE` moves the Content to `COPY_APPROVED`. `REVISE` moves it to `COPY_REVISION_REQUIRED`, `REJECT` to `CONTENT_DISCARDED`, and `PAUSE` to `CONTENT_PAUSED`. Every decision produces a detailed Content Copy Review plus the Router-owned generic Approval Event. Stale, wrong-target or conflicting reviews are blocked; exact retries are idempotent.

Before a decision, the Operator must see the Content ID, title, all page copy, publish body, CTA, Claim state, duplication risk and quality result. Approval makes copy eligible for a later Visual Planning request but does not invoke that phase or any image tool.

Phase 4A consumes that approval only when target Content/Copy versions and exact page snapshots still match. Visual-only `VV-N` changes do not need a new G3; any word/page-count change invalidates eligibility and returns to Content Creation.
