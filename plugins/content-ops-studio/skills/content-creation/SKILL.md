---
name: content-creation
description: Convert one confirmed evidence-backed Audience painpoint into focused Xiaohongshu image-post copy, validate claims and duplication, write one Content row, and stop for version-bound G3 review.
---

# Purpose

Create or revise one evidence-grounded Content Package while keeping conversion cover copy, page-one content copy, and visual production separate.

# Required preflight

Call `content_ops_get_content_context`. Require one `PAINPOINT_CONFIRMED` target, current Project Profile, Pack and active-rule versions, retained Evidence summaries, historical Content, title-count capability, and a resolved operation. Never treat chat memory as project evidence.

# Required tool sequence

1. Call `content_ops_plan_content_creation` in dry-run mode. Default to at least three material angles and 4–8 pages.
2. Let the host author one core problem, one core viewpoint, page copy, publish title/body, optional truthful CTA, classified claims, dimension scores, and reasoned near-semantic assessments. For Xiaohongshu, also create a versioned Cover Copy Package with distinct `cover_primary_hook`, `cover_secondary_line`, optional supporting copy, and unchanged `page_1_content_copy`.
3. Call `content_ops_submit_content_draft`. This writes only project-local artifacts and binds Plan hash, painpoint version, rule snapshot, and idempotency key.
4. Show the draft summary and obtain explicit write confirmation before `content_ops_finalize_content_copy`.
5. Finalize validates Schemas, claims, deterministic fingerprint, duplication, title, page structure and quality; it writes one existing-Base Content record, moves the painpoint to `PAINPOINT_CONTENT_IN_PROGRESS`, read-verifies, checkpoints, and stops at G3 `CONTENT_COPY`.
6. Show the exact Content/Copy version and copy. Never infer approval. Only the Router may submit a matching `content-copy-review` through `content_ops_submit_approval`.
7. Use list/get/verify tools for readback. For changes, call `content_ops_plan_content_revision`, retain history, resubmit a new copy version, and wait for a new G3.

# Authoring and evidence policy

One Content binds one primary painpoint, core problem, and core viewpoint. It must give the Audience emotional, money, time, risk-reduction, decision, or professional-insight value. External facts and project facts need appropriate Evidence Refs. Professional judgments and opinions must be labelled honestly. Never invent data, studies, rankings, customer stories, cases, or results. An unsupported claim blocks G3.

# Duplication and quality policy

Exact duplication is a deterministic SHA-256 fingerprint after NFKC, case, line-break, whitespace, and punctuation normalization. Near-semantic comparison is retained host-model reasoning; do not claim embeddings. High risk blocks finalization. Same-input replay reuses the Content. An alternate needs a materially different angle or conclusion.

Quality uses fixed weights totalling 100 and requires at least 75 with zero blocking failures. The publish title is at most 20 Unicode code points. The conversion cover hook is a separate field: for lead generation it should normally use 6–16 visible characters, must not exceed 20, must fit within three lines, and must signal the Audience, Painpoint, Value, Risk, Decision, or a supported question. Page-one content copy may be denser and must not be silently collapsed into the hook. Page 1 is Cover, numbering is contiguous, and every page has one purpose. CTA can be empty.

# Human approval boundary

G3 targets the exact Content Package and Cover Copy Package at `<content_version>:<copy_version>:<cover_copy_version>`. APPROVE makes the copy eligible for a later Visual Planning phase but does not start it. REVISE, REJECT and PAUSE preserve history. Any content or cover-copy edit invalidates the old G3.

# Allowed writes

Content-run artifacts and owned fields in one existing Feishu Content row plus the linked painpoint contentization state, only through Runtime and the configured Workspace Adapter.

# Forbidden actions

Unbounded research; raw Feishu tools; a new Base; destructive changes; automatic G3 approval; overwriting approved copy; formal background/visual-plan fields; image generation; rendering; attachments; publishing; fake evidence or success.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `field-ownership.md`, `approval-protocol.md`, and `shared-state-machine.md`; then `references/cover-conversion-copy-policy.md`, all files named by `references/README.md`, and only the active Platform/Industry Packs.

# Phase status

Phase 3B implements copy through G3 only. Visual Planning, images, production rendering, attachments, publishing, standalone Research HTTP services, and whole-Plugin production readiness remain unavailable.
