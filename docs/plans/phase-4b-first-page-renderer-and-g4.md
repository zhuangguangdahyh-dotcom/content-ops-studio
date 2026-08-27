# Phase 4B — First-Page Renderer and G4

Status: PARTIAL — IMAGE PRODUCTION SPECIFICATION HOLD. Owner: repository maintainers. Started: 2026-08-25.

## Task goal

Implement a deterministic Playwright/Chromium production renderer and use the exact `C-0001` First-Page Handoff (`CV-1:CV-1`, `VV-1`) to produce one real 1242×1660 Cover PNG, perform browser-measured mechanical QA, write only the bounded Feishu pending fields, show the asset to the Operator and stop at G4. After explicit approval, bind the review/approval/checksum, create `SLV-1`, write the approved state and prove replay without producing pages 2–6.

## Non-goals

No image-model call, Generated Background, photography, illustration model asset, remaining page, full set, G5, Final Manifest, attachment upload, publishing, arbitrary browser/HTML/CSS/JavaScript/shell/file MCP tool, delete operation, new Base, new Content, copy mutation, `VV-1` mutation, Plugin version/license change, Git remote or push.

## Current First-Page Handoff

The retained fictional sandbox has one `C-0001`, `CV-1:CV-1`, `VV-1`, G3 APPROVED, six Visual Plans and a READY Cover handoff. Page 1 is 1242×1660, safe area T96/R84/B96/L84, seven typography tokens, five color tokens, three exact text layers, Copy Hash `58f34a2915c8c50060641abe5db913443f49353e5992573d7eb22074d29fb30b` and `PROGRAMMATIC_GRAPHIC`. No PNG, G4 or Style Lock exists.

## Production Renderer architecture

`packages/renderer` owns the closed template registry, safe compiler, graphic compiler, font/layout inspectors, browser capability/environment evidence and PNG rendering. `packages/runtime` owns external-Home artifacts, idempotency, journal/checkpoint and state transitions. Workspace writes remain mediated by the existing official Lark CLI Adapter. MCP and Skills expose user goals only.

## Playwright version selection

Official documentation and npm evidence on 2026-08-25 identify `playwright@1.62.1` and `playwright-core@1.62.1` as the stable matching pair. Official system requirements include Node 24, macOS 14+, Windows 11+ and supported Debian/Ubuntu releases. The Runtime bundle imports exact `playwright-core`; the repository/setup dependency uses exact `playwright`. No `@playwright/test` is added.

## Chromium installation and Browser Cache

Install only the Playwright-managed Chromium matching 1.62.1 through a fixed argv command. Development uses an explicit repository-external cache. Installed copies resolve `${PLUGIN_DATA}/playwright-browsers`. Browser bytes never enter Git or Plugin Root. Setup is explicit, never performed during MCP startup or ordinary rendering, and never falls back to system Chrome or the Mock Renderer.

## Plugin installed-copy strategy

Bundle `playwright-core` and renderer code into the single MCP artifact; do not bundle Chromium, fonts, output PNGs or source maps with personal paths. Installed-copy validation uses an isolated Plugin Root, writable Plugin Data/browser cache and external Project Home, and verifies the Plugin Root hash is unchanged.

## Renderer Config and Capability

Renderer ID `PLAYWRIGHT_HTML_CSS`; 1242×1660 viewport; device scale 1; `zh-CN`; `Asia/Shanghai`; light scheme; reduced motion; PNG; CSS scale; animations disabled; caret hidden; opaque background; fixed timeout; no arbitrary executable path/args. Capability is BLOCKED without the exact managed browser or usable Chinese font.

## Renderer Environment

Record Node, platform, architecture, Playwright/Chromium versions, headless mode, viewport, locale/timezone, screenshot options, resolved font families, blocked network counts and a deterministic environment fingerprint. Never persist an absolute browser/font path, Home path or environment dump. Pixel/file hashes are comparable only within the same platform/browser/font profile.

## Render Template Registry

Register one versioned `EDITORIAL_SERIES`/`COVER`/`PROGRAMMATIC_GRAPHIC` template. It accepts only structured components, primitives, tokens and bounded numeric layout data. Arbitrary HTML, CSS, JavaScript, URLs, external assets, navigation and script/event attributes are forbidden.

## Programmatic Graphic Compiler

Compile a text-free three-part verification framework from allowlisted primitives such as rectangles, lines, brackets and number markers. The output is a deterministic local SVG/background asset with SHA-256. It is local deterministic production, not AI generation, and contains no official information, logo, certificate, UI or Chinese body copy.

## HTML/CSS and Text Layer compilation

The compiler escapes all text, emits only declared text nodes and allowlisted CSS/token values, enforces CSP and aborts every network request. The three Handoff Text Layers are the sole formal text source. Only visual line wrapping is permitted; recomposed content must match the Handoff copy hash.

## Font Resolution

Probe the explicit system stack, wait for `document.fonts.ready`, record computed families per role, verify Chinese glyph visibility/tofu absence and warn on readable fallback. No font download, copy or persistence is allowed; no usable Chinese fallback is blocking.

## Actual Layout Inspection

Measure each layer with `getBoundingClientRect`, scroll/client dimensions, computed font family/size/line-height, line count, z-index and visibility. Block overflow, clipping, safe-area escape, required-layer invisibility, overlap, scroll, canvas mismatch, unreadable font and copy drift. Never pass by hiding, clipping or unbounded font shrinking.

## PNG, checksum and artifacts

After fonts and two animation frames, screenshot the exact canvas as opaque PNG with animations disabled, caret hidden and CSS scale. Re-read the output, verify PNG signature and 1242×1660 IHDR, nonzero size and SHA-256. Write the background SVG, controlled HTML, PNG, Generation Manifest, Render Report, First-Page QA, Production Report and Environment Evidence under the external Project Home without overwriting a version.

## Generation Manifest, Render Report and QA

Generation type is `PROGRAMMATIC_GRAPHIC`, Adapter `ProgrammaticGraphicCompiler`, Provider `LOCAL_DETERMINISTIC`, model NOT_APPLICABLE and at least one real attempt. Render Report binds environment/template/input/output and browser measurements. First-page QA covers Content, Visual, File and Data; readiness requires zero blocking failures.

## Feishu state

Before G4, only Image Status, First Page Status, last Run and update time may change: `FIRST_PAGE_PENDING_APPROVAL` and `FIRST_PAGE_APPROVAL_PENDING`. Content remains `VISUAL_PLANNING`; Final/Sync remain unchanged; Style Lock stays empty. Read-after-write must prove copy, `VV-1`, Painpoint and visual summary unchanged. No attachment is uploaded.

## G4, review and Style Lock

The first turn stops after showing the PNG. A First-Page Review is distinct from the formal Approval Event. Only explicit Operator APPROVE/REVISE/REJECT/PAUSE is accepted. APPROVE must bind `CV-1:CV-1:VV-1:FPV-1` plus asset checksum and environment. Runtime creates `SLV-1` only after a valid approval, then writes approved image/first-page/Style Lock state and verifies it. G4 never starts remaining-page production automatically.

## Revision

`RENDER_ONLY` plans `FPV+1` with unchanged CV/Copy/VV and a new G4. PAGE/GLOBAL Visual Plan changes return to Phase 4A and require a new VV. Copy changes return `CONTENT_REVISION_REQUIRED` to Phase 3B. Old PNGs/reports/reviews remain immutable.

## Idempotency and recovery

Bind Project, Content, versions, Handoff, template, environment and request key. Identical render reuses one asset with zero PNG/write additions; changed input conflicts. Recover by validating retained artifacts/checksum and completing only the missing Workspace/checkpoint step. Never delete prior artifacts.

## MCP tools, Skill and Router

Add exactly eight tools: renderer status/setup; production plan/render; asset get/verify; revision plan; review submit. Expected catalog is 47 tools, 32 read and 15 write. Update `image-set-production` for first-page/G4 only and Router intents without granting direct browser or Lark CLI ownership.

## Live sandbox validation and output display

Reconstruct the existing fictional sandbox mapping in a dedicated external Runtime Home; never create Base/Content/Visual Plan. Render one `FPV-1`, update pending state once, verify replay/conflict/drift/network/injection/determinism and show the actual local PNG in Codex. Stop with G4 AWAITING_USER_APPROVAL.

## Security and risk controls

- CSS/HTML injection: structural compiler and escaping; no arbitrary strings.
- Network: strict CSP plus request interception; local data only.
- Fonts: explicit probe, computed family evidence and blocking tofu check.
- Paths: safe relative outputs under external Home; browser cache under Plugin Data/external cache.
- Cross-platform: no universal pixel-hash claim.
- Browser lifecycle: isolated context, no cookies/profile/extensions/downloads, close page/context/browser.

## Files and dependencies

Four ADRs; eight Schemas/catalog/types/fixtures; renderer support config; Renderer/Runtime/CLI/MCP implementation; Skill/Router; CI/scripts/tests; docs 44–52 and affected repository docs; nine phase reports. New exact dependencies: `playwright-core@1.62.1` runtime and `playwright@1.62.1` development/setup, Apache-2.0.

## Test matrix

Strict Schema/migration tests; config/capability/environment/template/graphic/compiler/font/layout/PNG/report/QA; Feishu allowlist/read verification/replay; G4/review/Style Lock decisions and stale bindings; MCP counts/annotations/safety; Skill/Router evals; installed-copy render; Live C-0001 pending and approval flows; full existing regression, Secret Scan and example sanitization.

## Implementation steps

1. Freeze Phase 4A baseline, complete preflight and official Playwright review.
2. Add ADR-0032–0035, support policy and eight strict contracts.
3. Implement renderer setup/probe/compiler/browser render and deterministic artifact inspection.
4. Implement first-page Runtime, CLI/MCP/Skill/Router and Workspace pending/G4 boundaries.
5. Install exact managed Chromium outside the repository and validate source plus installed copy.
6. Execute the one-page Live run, show PNG and pause at G4.
7. Pause before any Review/Approval/Style Lock action and wait for a new complete Image Production Skill Specification from the Operator. Do not enter Phase 4C.

## Implementation record

- 2026-08-25: Read the complete Phase 4B instruction and current repository/Phase 4A evidence.
- 2026-08-25: Confirmed Node v24.19.0, pnpm 11.19.0, official Lark CLI 1.0.63 with verified OAuth, unborn `main`, no Git identity, no remote and no push. The instruction's `--format json` differs from CLI 1.0.63; actual supported `--json --verify` succeeded.
- 2026-08-25: Initial `CI=true pnpm check` passed with 81 Schemas, 39 tools, 48 test files and 236 tests.
- 2026-08-25: Created immutable Phase 4A baseline before source changes: 1086 files, aggregate `9742dbf0026835a6ac96637c94ffbe12fea954c4b6184ca97bbc03e31d8a7378`.
- 2026-08-25: Official sources identified matching stable `playwright`/`playwright-core` 1.62.1, Node 24 support, managed-browser version coupling, controlled browser paths, isolated contexts, screenshot options and same-environment visual-comparison limits.
- 2026-08-25: Added eight strict contracts, 90 generated TypeScript files for 89 Schemas, ADR-0032–0035, Renderer support policy, safe compiler/Template/graphic/font/layout/PNG implementation, First-Page Runtime and eight MCP tools (47 total: 32 read, 15 write).
- 2026-08-25: Installed the matching Playwright-managed Chromium 151.0.7922.34 into a repository-external cache. Doctor, same-environment double render and actual Chromium platform-font inspection passed on darwin/arm64; the three roles resolve to PingFang SC.
- 2026-08-25: Live validation exposed and corrected additive `PROGRAMMATIC` asset-source representation, SVG asset semantics, user-managed Feishu status permission, DateTime representation/comparison and Content-table mapping ambiguity. Each correction remained bounded and received offline validation.
- 2026-08-25: Final Handoff audit rejected an internal candidate that carried an undeclared English label and a Renderer-authored 104px safe area. The failed candidate was retained, never submitted for G4, and a new Run rendered exactly three VV-1 Text Layers, approved typography/colors and T96/R84/B96/L84 safe area.
- 2026-08-25: Corrected Run produced one 1242×1660 PNG (70,081 bytes), SHA-256 `68e9a0647f5a9ef00bc32eeb3516a519804192012208c4ad9e63fa987dd8b292`; mechanical QA and Feishu pending read-after-write passed. Same-Run replay made zero remote mutations and did not duplicate Journal/Write Log entries.
- 2026-08-25: Paused at G4 with `AWAITING_USER_APPROVAL`. No Review, Approval, Style Lock, page 2–6 output, G5 or Final Manifest exists.
- 2026-08-25: The Operator explicitly withheld both G4 APPROVE and G4 REVISE. `FPV-1` is retained and classified only as `RENDERER_TECHNICAL_PROOF_OF_CONCEPT` / 技术样张. It is not a project visual preference and is ineligible as a Style Lock source. No `FPV-2`, Style Lock, page 2–6 output, `VV-1`, `CV-1` or Copy Version mutation is authorized. Further Image Production Skill implementation and Phase 4C are paused pending a complete Operator-confirmed specification for backgrounds, text, quantity, quality, aesthetic approval and industry differences.
- 2026-08-25: Installed-copy Renderer passed from an isolated Plugin copy with 47 tools, a real fixture PNG, Plugin Data browser-cache boundary, external Project Home and an unchanged Plugin Root without repository cwd/root `node_modules`.
- 2026-08-25: Final offline `CI=true pnpm check` passed: 89 Schemas, 51 test files, 243/243 tests, 47 MCP tools, bundle/config/Host/package checks, Secret Scan and example sanitization.

## Final result

Implementation and the real first-page pending path are complete through the mandatory G4 pause. Phase status remains PARTIAL. Formal G4 evidence remains `AWAITING_USER_APPROVAL` because no decision event was submitted; operationally, `FPV-1` is frozen as a Renderer technical proof of concept and must not be submitted or used as a Style Lock source under the current specification. This pause is neither a Renderer failure nor a contract failure.

## Unresolved issues

- A new complete Image Production Skill Specification and Operator confirmation are required before any further first-page approval/revision or image-production work.
- G4 Review/Approval, Style Lock creation, approved Feishu writeback and approval/resume replay were not executed.
- Pages 2–6, image-model adapters, full-set QA, G5, Final Manifest, attachments, publishing and public MCP remain deferred; Phase 4C must not start from this artifact.
