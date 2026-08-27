---
name: visual-planning
description: Plan, validate, revise, and hand off a G3-approved image-post Visual System without changing copy, generating images, or creating G4/Style Lock.
---

# Purpose

Convert one exact `COPY_APPROVED` Content Package and G3-approved Cover Copy Package into a versioned Visual System, page-specific plans, explicit asset requirements, layout/quality evidence and a First-Page Production Handoff.

# Modes

Support `PLAN`, `REVISE_PLAN`, `VALIDATE`, and `GET_FIRST_PAGE_HANDOFF`.

# Use this skill when

The Operator asks to plan visuals for G3-approved Content, choose a Visual Mode, define a multi-page layout/background system, check whether approved text fits, revise a visual direction, validate an existing plan, or prepare the Cover production handoff.

# Do not use this skill when

Content has not passed G3; the request changes copy or page count; the task is Painpoint research, image generation, first-page approval, finalization or publishing. Route copy/page-count changes to Content Revision. Report image/G4/Renderer/attachment/publishing requests as unavailable in this phase.

# Required sequence

1. Call `content_ops_doctor`, then `content_ops_get_visual_context`.
2. Require current G3, exact Content/Copy/Cover Copy versions, specific Subject/Audience/Painpoint context, 4–8 contiguous pages and Page 1 Cover.
3. Call `content_ops_plan_cover_conversion`, then `content_ops_plan_visual_direction`; retain at least three candidates unless the Operator fixed a mode. Each candidate must declare conversion strategy, background semantic role, text prominence, text-to-image ratio, 310×414 and 186×248 thumbnail targets, and a material difference reason.
   Resolve typography and composition from the current Operator request, Project/Profile/brand, content needs, Industry/Platform rules, and only then the Universal Default. A fallback candidate set must declare materially different composition families, text regions, asset structures and reading paths.
4. The Host authors the selected Visual System, Page Visual Plans, Reference Manifest, Asset Requirements and planning-only Layout Feasibility/Quality evidence.
5. Call `content_ops_submit_visual_plan`; this is a local-only write.
6. Show the exact plan/hash and obtain explicit Feishu-write confirmation.
7. Call `content_ops_finalize_visual_plan`; it may update only the bounded visual fields and must read-verify protected fields.
8. Call `content_ops_verify_visual_plan`, then `content_ops_get_first_page_handoff`.
9. Show the direction, score, limitations and handoff readiness. Stop; do not enter image production automatically.

# Copy and layout boundary

Never rewrite, delete or add approved text. Use the approved Cover Copy Package for the cover and the approved page copy for content pages. Line breaks, emphasis and Text Layer splits are permitted only when the concatenated snapshot is identical. Excessive cover text returns `COVER_COPY_REVISION_REQUIRED`; excessive page copy returns `CONTENT_REVISION_REQUIRED`. Do not shrink below readable size. Every text layer stays inside Safe Area and references existing typography/color tokens.

# Asset and evidence boundary

Declare one source strategy and semantic role per page. Lead-generation covers may not use `DECORATIVE_ONLY`; abstract metaphors require explicit project fit and a direct-relation statement. Evidence screenshots require authorized Evidence Assets. Never fabricate certificates, official marks, logos, screenshots, copyright status or output paths. Image models never own final Chinese titles, body copy or tables. `GENERATED_BACKGROUND` and `PROGRAMMATIC_GRAPHIC` are requirements, not completed assets.

# Quality and handoff

Weights total 100 and readiness requires at least 80 with zero blocking failures. The Cover handoff binds current Content, Copy and Visual Plan versions plus exact copy hash, Visual System, page plan, asset need, Text Layers and constraints. It contains no G4, Style Lock, generated asset, render report or output path.

Planning quality must anticipate actual editorial spatial relationships and an explainable image-text anchor. Do not solve every image with upper-left text, an opaque card, a generic gradient or a decorative industry photo. For Painpoint-, Risk- and Question-first covers, plan direct problem evidence, an Audience-recognition scene or a valid contrast; require locale fit whenever region materially changes the scene.

# Tool boundary

Use only the bundled `content-ops` MCP tools. Never invoke Lark CLI, raw Feishu, Shell, arbitrary File tools, image tools or Renderer tools directly.

# Supporting references

Read `../../references/shared-execution-protocol.md`, `field-ownership.md`, `approval-protocol.md`, `shared-state-machine.md`, then every file listed by `references/README.md`.

# Phase status

Phase 4A implements formal planning and first-page handoff only. Image production, G4/Style Lock, Renderer, attachment upload, publishing and whole-Plugin production readiness remain blocked.
