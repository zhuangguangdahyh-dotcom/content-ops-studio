# G2 Painpoint Review

G2 is a version-bound item review over one Painpoint Batch. Finalization returns an approval request and pauses with every new item in `PAINPOINT_PENDING`; it never infers approval from satisfaction or from a successful write.

The Operator may decide `APPROVE`, `REVISE`, `REJECT` or `PAUSE` per item. A strict Painpoint Review Batch binds the research batch, painpoint batch version, review version, Painpoint ID and Painpoint version. Duplicate current decisions, unknown IDs, stale versions and inconsistent summary counts are rejected before a remote update.

Approved items become `PAINPOINT_CONFIRMED`; revised items become `PAINPOINT_REVISION_REQUIRED`; rejected items become `PAINPOINT_REJECTED`; paused items become `PAINPOINT_PAUSED`. Unreviewed items in a partial review remain pending. Only confirmed items may become inputs to a future content-creation phase.

The Runtime updates only the review status and update timestamp. It preserves user-managed notes and all research evidence, read-verifies the remote result, updates the local batch artifact and writes a G2 audit log with hashed remote identifiers.

A confirmed item is eligibility, not automatic Content production. Phase 3B must explicitly select it, create one evidence-grounded package and stop again at G3. Revision-required, rejected and paused Painpoints remain blocked inputs.
