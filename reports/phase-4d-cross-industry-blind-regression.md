# Phase 4D｜Cross-Industry Blind Full-Set Regression V1

## Result

- Phase 4D: `FAILED / REVISION_REQUIRED`
- Case A: `FAILED`
- Case B: `FAILED`
- G5: `AWAITING_USER_APPROVAL` for both Cases
- System rules changed after the test: `0`
- Production code fixes after the test: `0`
- Feishu writes: `0`
- C-9001: `UNCHANGED`
- G5 approvals: `0`
- Final manifests: `0`
- Final repository check: `PASSED`
- Strict Schemas: `154`
- Test files: `75 passed`
- Tests: `404 passed / 0 failed`
- Secret Scan: `PASSED`
- Git: unborn `main`, no commits, no remote, no push

The blind run completed real planning, image generation, rendering, actual thumbnails, Contact Sheets and QA. The result is not upgraded by aggregate visual scores because formal hard blocks remain.

## Case A｜Commercial Space

### Strategy

- Project: `CAL-COMMERCIAL-BLIND-001`
- Run: `RUN-20260827-080000-P4DA`
- Visual motif: `SILENT_WAYFINDING`
- Visual system: `A-WARM-STONE-MOSS-ROUTE-V1`
- Continuity anchors: one fictional hospitality-space identity; warm limestone, smoked oak and muted moss; consistent subdued left daylight; restrained bronze route line; one modern Chinese Songti editorial system.
- ImageGen calls: `5`
- Formal Renderer pages: `6`
- Actual thumbnail renders: `12`
- Contact Sheets: `3`

### Asset sequence and duties

1. P1 Cover — threshold establishing wide; `AI_GENERATED_VISUAL`; distinct raster.
2. P2 Problem — reverse oblique entrance transition; `AI_GENERATED_VISUAL`; distinct raster.
3. P3 Movement — deep circulation turn to focal destination; `AI_GENERATED_VISUAL`; distinct raster.
4. P4 Pause — lateral human-scale seating zone; `AI_GENERATED_VISUAL`; distinct raster.
5. P5 Function — elevated multi-node relationship view; `AI_GENERATED_VISUAL`; distinct raster.
6. P6 Summary — three-stop decision path; `PROGRAMMATIC_GRAPHIC`; no raster.

Five raster sources have five different SHA-256 values and five distinct shot signatures. Actual inspection supports the claim that they depict one coherent fictional project from different evidence-bearing viewpoints rather than one raster with five crops.

### QA

- Passed formal pages: P3, P5
- P1: `OVERFLOW`
- P2: `DETERMINISM`
- P4: `RASTER_CONTRAST` on the section label; low-percentile ratio `3.692`, required `4.0`
- P6: `COPY_FIDELITY`, `DETERMINISM`
- Hard blocks: `5`
- Group result: `FAILED`

Actual-pixel observation: the spatial identity and page-duty progression are coherent. P2 has an awkward forced line break, P4's body hierarchy becomes small at mobile size, and P6 contains unapproved numeric markers in the text layer, which explains the Copy Fidelity failure. These are not masked by the preliminary page scores of 89–94.

### Contact Sheets

- Full: `projects/CAL-COMMERCIAL-BLIND-001/runs/RUN-20260827-080000-P4DA/image-production/contact-sheets/full-contact-sheet.png`
- 310: `projects/CAL-COMMERCIAL-BLIND-001/runs/RUN-20260827-080000-P4DA/image-production/contact-sheets/contact-sheet-310.png`
- 186: `projects/CAL-COMMERCIAL-BLIND-001/runs/RUN-20260827-080000-P4DA/image-production/contact-sheets/contact-sheet-186.png`

## Case B｜Professional Services

### Strategy

- Project: `CAL-PRO-SERVICE-BLIND-001`
- Run: `RUN-20260827-080100-P4DB`
- Visual motif: `SIGNAL_EXTRACTION`
- Visual system: `B-INK-IVORY-COBALT-SIGNAL-V1`
- Continuity anchors: one fictional consultant identity; ink/ivory/cobalt palette with restrained lime; signal-line/grid motif; consistent editorial image treatment; one modern Chinese Songti editorial system; fictional anonymous evidence treatment.
- ImageGen calls: `3`
- Renderer-generated evidence fixtures: `2`
- Formal Renderer pages: `6`
- Actual thumbnail renders: `12`
- Contact Sheets: `3`

### Asset routing

1. P1 Cover — `PROJECT_ASSET / PORTRAIT_A`; distinct raster.
2. P2 Problem — `PROJECT_ASSET / WORKSPACE_A`; distinct raster.
3. P3 Positioning — `PROGRAMMATIC_GRAPHIC`; no raster.
4. P4 Information — `EVIDENCE_ASSET / EVIDENCE_SCREEN_A`; distinct raster.
5. P5 Proof — `MIXED_ASSET / PORTRAIT_B + EVIDENCE_NOTES_A`; distinct raster.
6. P6 Summary — `PURE_TYPOGRAPHY`; no raster.

The route uses Project, Programmatic, Evidence, Mixed and Pure Typography channels. It does not impose commercial-space multi-view, material, building-node, unoccupied-space or area rules.

### QA

- Passed formal page: P3
- P1: `OVERFLOW`, `DETERMINISM`
- P2: `DETERMINISM`
- P4: `DETERMINISM`
- P5: `DETERMINISM`
- P6: `DETERMINISM`, `RASTER_CONTRAST`; low-percentile title contrast `2.116`, required `3.5`
- Hard blocks: `7`
- Industry leakage check: `PASSED / NONE`
- Group result: `FAILED`

Actual-pixel observation: the professional-service system is visually independent from the commercial-space Case and the asset routing is semantically defensible. P1's title line breaks are compressed, P4 is dense at 186×248, and P6's cobalt circle overlaps the title region and materially reduces local contrast. Preliminary page scores of 89–94 do not override these failures.

### Contact Sheets

- Full: `projects/CAL-PRO-SERVICE-BLIND-001/runs/RUN-20260827-080100-P4DB/image-production/contact-sheets/full-contact-sheet.png`
- 310: `projects/CAL-PRO-SERVICE-BLIND-001/runs/RUN-20260827-080100-P4DB/image-production/contact-sheets/contact-sheet-310.png`
- 186: `projects/CAL-PRO-SERVICE-BLIND-001/runs/RUN-20260827-080100-P4DB/image-production/contact-sheets/contact-sheet-186.png`

## A–J active regression

- A same raster with five crops → `FAIL`, matched.
- B five same-axis near-duplicate files → `FAIL`, matched.
- C visual-system drift across different backgrounds → `FAIL`, matched.
- D one evidence asset with real material transformation and new evidence → `PASS_ALLOWED`, matched.
- E pure typography without raster → `PASS`, matched through Case B P6 routing.
- F programmatic graphic without raster → `PASS`, matched through Case A P6 and Case B P3 routing.
- G professional services forced into space-identity multi-view rules → `FAIL`, matched.
- H unrelated commercial-space projects presented as one set → `FAIL`, matched.
- I final page containing only “联系我们” → `FAIL`, matched.
- J useful summary plus an already-approved CTA → `PASS_ALLOWED`, matched by rule; not used in either formal Case because no CTA was approved.

## Cross-industry conclusion

- Universal system: `FAILED` for this formal blind run because both Cases contain hard blocks.
- Fixed-template dependency: `NONE DETECTED` in the produced layouts and routing.
- Commercial-space rule leakage: `NONE DETECTED` in Case B.
- Meaningless asset diversity: `NONE DETECTED` in the formal Cases.
- Asset planning and routing: demonstrated.
- Formal full-set production readiness: not demonstrated because QA and deterministic replay failed.

No repair is performed in Phase 4D. The next action is Operator review of the produced sets and failure evidence; any subsequent correction must be authorized as a separate revision phase.

## Validation note

The first sandboxed full-check attempt reached Renderer Doctor and could not launch Chromium because browser child-process launch was restricted. The existing repository-external Playwright 1.62.1 cache was then used in a controlled non-sandbox test process. The complete `CI=true pnpm check` chain exited `0`; no dependency was downloaded or installed and no browser path is persisted in this report.
