---
name: content-studio-router
description: Route multi-stage content project requests across project initialization, painpoint research, content creation, visual planning, image production, finalization, and project learning while enforcing preflight checks, state transitions, and human approvals.
---

# Purpose

Resolve the request and project, establish a versioned task envelope, validate current state, route only the minimum necessary specialist work, record explicit G1–G5 approvals, resume interrupted runs, and aggregate results.

# Use this skill when

A request spans stages, requires project resolution, changes workflow state, contains an approval decision, or resumes a prior run.

# Do not use this skill when

A provider-neutral specialist contract can be invoked safely with an already resolved project, valid envelope, and no approval interpretation.

# Required preflight

Reload project configuration, workspace records, active rules, run history, capability status, Schema version, locks, and current state. Never rely on chat memory.

# Inputs

A task envelope, raw Operator instruction, project candidates, current state, capability report, and optional explicit approval language.

# Workflow boundary

Identify intent and project, validate state, form the envelope, convert explicit decisions to approval events, route specialist work, and merge task results. Do not create painpoints, write content, plan visuals, or generate images directly.

Project routes are `NEW_PROJECT` → DISCOVER/PROVISION, `UPDATE_PROJECT` → UPDATE and possibly G1, `REPAIR_PROJECT` → INSPECT/VERIFY/add-only REPAIR, `AUDIT_PROJECT` → read-only INSPECT/VERIFY, and `RESUME_RUN` → the saved checkpoint. Resolve whether the project exists first; multiple same-name candidates are a conflict, never a guess. The Router does not call Feishu HTTP or read credentials.

Use only the bundled `content-ops` MCP user-goal tools for implemented project, Run, approval, Research, Content, Visual Planning, Image Production, first-page Renderer and Workspace operations. Route confirmed-painpoint Content requests through context → plan → draft → finalize → G3. Route `PLAN_VISUALS`, `REVISE_VISUAL_PLAN`, `VALIDATE_VISUAL_PLAN`, and `GET_FIRST_PAGE_HANDOFF` to `visual-planning` only when Content is `COPY_APPROVED`, G3 exists and its Content/Copy version matches.

Route `PLAN_COVER_CONVERSION`, `PLAN_IMAGE_PRODUCTION`, `GENERATE_VISUAL_DIRECTIONS`, `SELECT_VISUAL_DIRECTION`, `PRODUCE_FORMAL_FIRST_PAGE`, `REVIEW_FIRST_PAGE`, `REVISE_FIRST_PAGE`, `PLAN_FULL_SET`, `RECORD_VISUAL_FEEDBACK`, `CONFIRM_VISUAL_RULE`, and `VIEW_VISUAL_RULES` to `image-set-production`. Detect a mature compatible Project Visual Profile, an explicit current visual instruction, or the need for two or three direction candidates. For lead-generation covers, block generic Subject/Audience/Painpoint context with `COVER_CONTEXT_INSUFFICIENT` and ask one question that changes the next action. Never choose a direction, approve G4, confirm a long-term rule, or convert a quality/tool defect into aesthetic preference.

Resolve visual rules in the full precedence order ending with `UNIVERSAL_DEFAULT_VISUAL_BASELINE`. That baseline is fallback-only. Route typography resolution, editorial spatial QA, image-text integration, candidate-set diversity, Painpoint-scene congruence and locale-scene fit through `image-set-production`; do not let a universal default override a current Operator instruction, Project/Profile/brand rule, content evidence need or Industry/Platform rule.

Route actual Renderer typography geometry through the pre-score `TYPOGRAPHY_SPATIAL_INTEGRITY` and `TYPOGRAPHIC_BREATHING_ROOM` gates. Any spatial block returns to image-set production recovery; it must not be hidden by a Visual Quality score or learned as an aesthetic preference.

For Covers, resolve `COVER_ENTRY` separately from content-page intents and route a candidate-specific Cover Attention Plan through `image-set-production`. `COVER_ATTENTION_DOMINANCE` runs after typography spatial gates and before G4. A readable thumbnail is not automatically attention-worthy; a passing attention score is not an Operator selection. Runtime does not browse editorial knowledge sources.

Missing G3 or Handoff blocks; stale versions conflict. Render-only changes increment FPV. A G4 REVISE may carry multiple explicit routes: `CONTENT_COPY` creates a Cover/Content Revision requiring a new G3, `PAGE_VISUAL_PLAN` creates a Visual Plan Revision, and `GLOBAL_VISUAL_DIRECTION` records a negative current-set reference plus separately confirmed global learning. Preserve the reviewed FPV and checksum; no route may hide the revision by overwriting it. Never invoke `lark-cli`, Playwright or any image API directly; never operate Feishu directly, skip a plan/inspect call, skip a Gate, rewrite an error as success, create Style Lock after REVISE, produce remaining pages without Style Lock, or auto-enter Phase 4C.

# Human approval boundary

Only this Skill may convert explicit Operator decisions into G1–G5 approval events. G3 requires a detailed Content Copy Review and target `CONTENT_PACKAGE` version `<content_version>:<copy_version>`. G4 requires a checksum-bound First-Page Review and target `FIRST_PAGE_ASSET` version `<content_version>:<copy_version>:<visual_plan_version>:<first_page_version>:<sha256>`. Never infer satisfaction, and never route unapproved copy to Visual Planning or unapproved first pages to Style Lock.

# Allowed writes

Run records, routing decisions, approval events, and Router-owned status fields after successful validation.

# Forbidden actions

Bypassing a Gate; directly generating research, copy, or images; modifying packs or core rules; assigning approval without explicit evidence.

# Success result

A valid task result with state changes, approval records, route decisions, warnings, and the next route.

# Failure result

Return `BLOCKED`, `CONFLICT`, or `FAILED` with a structured error and recovery action; preserve history.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `shared-state-machine.md`, `approval-protocol.md`, `field-ownership.md`, and `rule-priority.md`.

# Phase status

Phase 4B-R.2.3 adds a sourced non-template Editorial Design Knowledge layer, page-intent separation, visual-mass/color/type-form intelligence and a post-spatial, pre-G4 Cover Attention gate. I/J/K remain at Operator selection. Attachments, publishing and whole-Plugin production readiness remain blocked.
