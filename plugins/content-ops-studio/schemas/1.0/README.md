# Schema 1.0

This directory is the single source of truth for 158 implemented JSON Schema Draft 2020-12 contracts. Core contracts remain provider-neutral; provider-scoped Feishu/Lark contracts stay isolated from Content, Visual, Renderer, Image Production and Finalization contracts. Every entry is strictly compiled by Ajv 2020 with standard formats and versioned `1.0.0`.

TypeScript declarations are generated into `packages/contracts/src/generated/1.0/`; never edit them directly. Stage 10 adds four independent Finalization contracts and hardens the pre-release Final Manifest V1 with exact version, approval, lineage and group-evidence bindings. ADR-0056 and migration tests record this conservatively; no released V1 consumer or production Final Manifest exists to migrate. Valid/invalid fixtures, migration classification, and catalog/type freshness checks are migration evidence. Future changes require migration notes, fixtures, and tests.
