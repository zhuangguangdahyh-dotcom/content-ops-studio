# Phase 4A Visual Difference Report

Status: COMPLETE. Date: 2026-08-24.

## Planned versus implemented

- Original plan: convert the exact G3-approved six-page copy into a formal, versioned Visual Plan and stop at first-page production handoff.
- Actual implementation: completed the full deterministic Core/Runtime/MCP/Skill flow, one bounded Live Feishu summary write, read verification, replay/conflict/drift/overflow checks and dry-run revision. No image-production boundary was crossed.
- Schemas: added the eight requested strict Schemas, 24 fixtures and eight generated declarations; total moved from 73 to 81.
- Visual contracts: existing `visual-system` and `page-visual-plan` remain canonical; the new contracts wrap context, decision, references, assets, feasibility, quality, handoff and revision without mutating approved copy.
- Modes: retained three candidates and selected `EDITORIAL_SERIES`; `EVIDENCE_LED` remained unselected because approved evidence imagery was unavailable.
- Layout: implemented per-page codepoint/line/density feasibility and an explicit excessive-copy hard block.
- Feishu: reused the existing row and mapped fields; added no remote object. Six visual fields are the complete write allowlist.
- MCP: added eight tools; total 39, with 27 read and 12 write.
- Skill: added a formal Visual Planning Skill and Router intents for plan, validate, handoff and revision.

## Lark final-consistency adjustment

The retained sandbox title exceeds the official CLI title-lookup length. The adapter allowlist now permits the official CLI read-only `base +title-resolve` operation to resolve the unique existing sandbox before typed reads/writes. This does not grant raw command, delete or resource-creation access. The official CLI then performed one bounded record update and a verified zero-write replay.

## Local regression corrections

Two stale additive-count assertions were synchronized: generated declarations changed from 73+index to 81+index, and installed Plugin tools changed from 31 to 39. Strict Ajv, generated freshness, package immutability and all pre-existing tests remain active.

## Risks and downstream impact

- The selected direction is production-ready as a contract/handoff, not as an image.
- Programmatic rendering and final Chinese typography still require Phase 4B.
- Empty references are honest; adding reference assets later requires a versioned revision.
- Native repository Plugin auto-install remains unverified; installed-copy and isolated Host evidence passed.
- Public HTTP MCP, attachments and publishing remain blocked.

No API payload, Scope, batch-limit, pagination or rate-limit difference was observed in this Live run.
