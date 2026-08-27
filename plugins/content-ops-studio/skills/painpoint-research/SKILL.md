---
name: painpoint-research
description: Plan and complete host-mediated or manual evidence-backed Audience painpoint research for one active confirmed project, retain source and score artifacts, write pending painpoints idempotently, and stop for item-level G2 review.
---

# Purpose

Create a recoverable, evidence-backed painpoint batch without padding, fabricated sources, or premature content production.

# Use this skill when

The Operator wants painpoint research for a project that is `PROJECT_ACTIVE` and `CONFIG_CONFIRMED`, or wants to inspect/review an existing research batch.

# Do not use this skill when

Project configuration is not confirmed, material Profile gaps remain, the request is final copy or image production, or no source path is available.

# Required preflight

Call `content_ops_get_research_context`. Verify Profile readiness; Platform/Industry Pack versions; active rules and rejected directions; existing painpoints/content summaries; research capability; and G1 evidence. Keep Operator, Subject and Audience distinct.

# Required tool sequence

1. Call `content_ops_plan_painpoint_research`. Default to 30 requested items, but never promise that count.
2. The host searches/opens current public sources with host-native tools, or the Operator supplies bounded manual sources. The MCP server never searches or fetches the internet.
3. Call `content_ops_submit_research_sources` with URL or project-relative locator, source metadata, bounded summary, supported claims, limitations, first-party flags, and content hash.
4. Analyze the evidence semantically in the host. Call `content_ops_submit_painpoint_candidates`; every candidate must reference evidence, carry A/B/C/D confidence, and include deterministic 0–5 score dimensions.
5. Call `content_ops_finalize_painpoint_research` only after explicit write confirmation. Runtime validates, writes pending painpoints idempotently, read-verifies and stops at G2 `PAINPOINTS`.
6. Show the retained batch to the Operator. Record per-item APPROVE / REVISE / REJECT / PAUSE decisions before calling existing `content_ops_submit_approval` for the matching batch and version.
7. Use `content_ops_list_painpoints`, `content_ops_get_painpoint`, and `content_ops_verify_painpoint_batch` for readback and verification.

# Evidence policy

A is direct strong first-party, interview, official statistic, transaction or consultation evidence. B requires two independent reliable sources with aligned claims. C is single, indirect, public comment, competitor, news or limited sample evidence. D is a model hypothesis: disabled by default, explicitly allowed in the Plan only, always limited/deferred, never `CORE`, and never HIGH/CRITICAL promotion priority.

Do not store full pages or reports. Store necessary summaries, short claim locators and citations only. User uploads are Manual Source, Customer Material, or First-Party Data; they never become public evidence by implication.

# Scoring and count policy

Use the fixed nine-dimension, 100-weight policy: audience relevance 15; frequency 10; urgency 10; decision impact 15; real cost 10; Subject advantage fit 10; evidence strength 15; content potential 10; promotion fit 5. `CORE >= 80`, `IMPORTANT >= 65`, otherwise `SUPPLEMENTARY`, unless a version-bound Pack explicitly changes thresholds.

Return fewer items than requested when evidence is insufficient and state why. Exact deduplication is deterministic. Near-semantic decisions are host model judgments with a retained reason; never claim embedding deduplication.

# Human approval boundary

All new painpoints start `PAINPOINT_PENDING` and stop at G2. A review artifact with one current version-bound decision per painpoint must exist before the generic approval event. Only `PAINPOINT_CONFIRMED` items can enter content creation later.

# Allowed writes

Project-local research plan/session/source/candidate/score/report/batch/review artifacts and approved fields in the existing Feishu painpoint table through Runtime and the configured Workspace Adapter.

# Forbidden actions

Autonomous network access; arbitrary search/fetch/browser/shell/file/raw Feishu tools; fabricated citations; quota padding; fixture fallback in Production; overwriting user notes; deleting remote records; auto-approving G2; producing final titles, body, visual plans, images, attachments, rendering or publishing.

# Success result

Retained public/manual source evidence, an honestly sized scored batch, idempotent Feishu readback, and a version-bound G2 item review.

# Failure result

Return `INSUFFICIENT_EVIDENCE`, `RESEARCH_SOURCE_INVALID`, `DUPLICATE_RISK`, `BLOCKED`, `CONFLICT`, or `FAILED` with retained recovery state. Never turn a partial write or missing source into success.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `field-ownership.md`, `approval-protocol.md`, and `shared-state-machine.md`; then read `references/contract.md`, `workflow.md`, `tool-policy.md`, `failure-handling.md`, and `examples.md`; load only the active Platform and Industry Packs.

# Phase status

Phase 3A implements this research and G2 boundary. Content creation, images, production rendering, attachments, publishing, Research HTTP services, and whole-Plugin production readiness remain unavailable.
