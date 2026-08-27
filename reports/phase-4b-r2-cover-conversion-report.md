# Phase 4B-R.2 Cover Conversion Report

Status: `SUCCESS`  
Date: 2026-08-26  
Node: 24.19.0  
Plugin version: 0.1.0

## Result

Phase 4B-R.2 adds a dedicated Cover Conversion layer between approved Content and Visual Planning. Publish title, primary Hook, optional secondary line, supporting copy, Page 1 copy, publish body and DM Hook remain separate version-bound concepts. Xiaohongshu lead-generation Covers now have explicit two-size thumbnail, Click Clarity and Visual Semantic Relevance gates.

C-0001 was processed through the formal G4 Runtime as `REVISE`, with primary route `CONTENT_COPY` and combined routes `CONTENT_COPY + GLOBAL_VISUAL_DIRECTION`. FPV-2 remains byte-identical at SHA-256 `b70fb4c37493b21cf21a276656d2187a661fc91eb143e9860aa3299aeef237b5`; no FPV-3, Style Lock or pages 2–6 were created. Its negative reference scope is `CURRENT_SET`, and it does not mutate project, industry or global preferences.

Five Operator-confirmed Global User Visual Rules were persisted as immutable version 1 records and activated through `GUVPV-1`. A separate fictional commercial-space calibration produced three complete 1242×1660 candidates, true 310×414 and 186×248 thumbnails and three Contact Sheets. It wrote zero Feishu records and stops at `CALIBRATION_COVER_SELECTION / AWAITING_USER_SELECTION` with zero formal FPVs, G4 decisions or Style Locks.

## Safety boundaries

- All calibration identities and business details are fictional.
- Formal Chinese is Renderer-owned; Host ImageGen produced text-free backgrounds.
- The initial CAL1 attempt exposed a broken `file://` background handoff. It is retained as `FAILED`; CAL2 embeds materialized PNG data and is the accepted evidence.
- Project Visual Profile and Industry Pack were not mutated by calibration.
- No candidate was selected automatically and Phase 4C was not entered.

## Implementation inventory

- Eight strict additive Schemas and generated TypeScript/fixtures.
- Cover Conversion, Copy, Thumbnail, Click Clarity and Semantic Relevance core evaluators.
- Immutable Global User Visual Preference Runtime and multi-route G4 `REVISE` support.
- Xiaohongshu Platform Pack 1.1.0 Cover rules with retained 1.0.0 snapshot.
- Six bounded MCP tools with no generic filesystem, shell, delete or external-write authority.
- Content Creation, Visual Planning, Image Production and Router Skill updates.
- ADR-0044, Cover QA documentation, focused tests and deterministic calibration harness.

## Current gates

- C-0001: `REVISION_REQUIRED`; next action `COVER_COPY_REVISION_REQUIRED`.
- Calibration: `AWAITING_USER_SELECTION`.
- Calibration formal FPV/G4/Style Lock/pages: all not created.
- Attachment upload, publishing and Phase 4C: not started.

## Validation summary

- Strict source Schemas: 115; generated TypeScript files: 116 including index.
- MCP tools: 67; installed-copy and Host checks passed.
- Vitest: 65/65 files and 291/291 tests passed.
- Renderer Doctor: READY with Playwright 1.62.1 and controlled Chromium 151.
- Deterministic calibration replay: 12/12 checksum matches.
- Full `CI=true pnpm check`: exit 0.
- Secret Scan and example sanitization: passed.

The baseline-relative file inventory is in `reports/phase-4b-r2-working-tree-change-report.md`.
