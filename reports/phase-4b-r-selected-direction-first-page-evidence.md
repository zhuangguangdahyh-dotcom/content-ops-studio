# Phase 4B-R selected direction and FPV-2 evidence

- Status: `G4 / AWAITING_USER_APPROVAL`
- Project / Content: fictional sandbox `PRJ-20260824-P2B2 / C-0001`
- Final Run: `RUN-20260825-174500-P4BF`
- Selection Artifact: `VDS-C-0001-A`
- Selected Candidate: `VDC-C-0001-A`
- Feedback: `PRODUCTION_FEEDBACK / CURRENT_SET`
- Long-term Rule Candidate: false
- Content Version / Copy Version: `CV-1 / CV-1`
- Visual Plan: VV-1 preserved; VV-2 created with six Page Visual Plans
- First Page: FPV-1 preserved as `RENDERER_TECHNICAL_PROOF_OF_CONCEPT`; FPV-2 created
- Asset Channel: `AI_GENERATED_VISUAL + Renderer`
- Visual Mode: `EDITORIAL_SERIES`
- Formal Feishu writes: 0

## Host asset and formal text

The built-in Host ImageGen generated one new text-free 1086×1448 native 3:4 raster. It was immediately materialized under Project Home with checksum `018c98fbcb571d67d8b8ea9bd64e6d09687e04669638498fe23c095bf7d5fdf9`. The existing Candidate A background was used only as a style/material reference; the formal composition was newly generated.

The Host visual contains no formal Chinese, labels, logos, seals, certificates, official pages, people or hands. Renderer owns exactly the approved title and body; no CTA, English subtitle, slogan, page label or added informational copy is present.

## Renderer and deterministic replay

- Final PNG: `projects/PRJ-20260824-P2B2/runs/RUN-20260825-174500-P4BF/outputs/first-page/01-cover_fpv2.png`
- Dimensions: 1242×1660 PNG
- Final checksum: `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`
- Replay checksum: `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`
- Copy Fidelity / Safe Area / Overflow / Clipping: PASS / PASS / false / false
- Resolved font: PingFang SC for Title and Body
- Remote requests: 0

The first formal Renderer attempt under `RUN-20260825-173000-P4BF` is retained. Actual visual QA found undesirable phrase splits in the Body. A single Renderer-only retry changed line grouping and size without changing copy, Host background, direction or version binding.

## Formal quality

- Total: 93 / 100
- Threshold: 85
- Hard blockers: 0
- Core-dimension floor: PASS
- Content/Semantic Fit: 5/5
- Composition/Focus: 4/5
- Hierarchy/Readability: 5/5
- Asset Quality/Integrity: 5/5
- Project/Audience Fit: 4/5
- Uniqueness/Anti-template: 4/5
- Visual Mode Execution: 5/5
- Platform/Mobile Performance: 5/5
- Result: `PASS_PENDING_OPERATOR`

Mechanical QA passed exact copy, safe area, overflow, clipping, resolved font, PNG signature/dimensions, checksum, network isolation and same-environment replay. Visual QA passed the strong title hierarchy, three-stage translucent boundary relationship, restrained palette and non-template execution. Project-fit QA passed the professional-services trust direction without literal or fabricated evidence.

Residual aesthetic risk: the lower mineral plinth may still carry a slight art-object or material-showroom association. The three aligned translucent planes, boundary nodes and Renderer composition reduce that risk, but Operator judgment remains authoritative at G4.

## Proposed Style Lock after a future G4 APPROVE

Rules proposed for locking:

- warm ivory/soft off-white field, deep charcoal or deep blue-black formal type and restrained copper-gold detail;
- translucent layered material language expressing alignment, boundaries and progressive verification;
- high whitespace, title-first hierarchy and Renderer-only formal Chinese;
- `EDITORIAL_SERIES` with `AI_GENERATED_VISUAL + Renderer` for this current C-0001 set;
- no fabricated evidence, logo, seal, official UI, person or hand.

Allowed future-page variation:

- page-specific layer count, crop, overlap, alignment, scale and boundary-line rhythm;
- warm-ivory versus smoke-charcoal balance within the restrained palette;
- different left/right distribution when the page role requires it;
- page-specific visual metaphors that retain boundary and correspondence logic without copying Cover coordinates.

Prohibited deviation:

- text generated inside Host imagery;
- mechanical duplication of the FPV-2 composition across pages;
- construction-material, stone-sample, interior-showroom, luxury-product or generic dashboard drift;
- ordinary PPT cards, web components, loading skeletons, flowcharts, saturated marketing color, glow, gradient text or cheap shadow;
- unapproved text, CTA, English subtitle, slogan, label, evidence claim or identity asset.

These are proposed rules only. No Style Lock Artifact exists until a checksum-bound explicit G4 `APPROVE`.

## Gate boundary

- G4 decision event: not created
- G4 Workflow: `AWAITING_USER_APPROVAL`
- Style Lock: `NOT_CREATED`
- Remaining-page eligibility: `NOT_ELIGIBLE`
- Pages 2–6 generated: 0
- Phase 4C: not entered

## Final validation

- `CI=true pnpm check`: PASS
- Strict Schemas: 104
- Generated TypeScript files including index: 105
- MCP tools: 61
- Test files / tests: 57 / 261
- Passed / failed: 261 / 0
- Renderer Doctor / installed-copy checks: PASS / PASS
- Secret Scan / example sanitization: PASS / PASS
