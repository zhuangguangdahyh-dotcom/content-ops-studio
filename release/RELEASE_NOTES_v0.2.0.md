# content-ops-studio v0.2.0

`v0.2.0` is a backward-preserving feature release of the local-first, approval-gated Content Ops Studio Plugin.

## Highlights

- Workspace Blueprint `1.1.0` puts the requested Project, Painpoint and Content fields first for newly provisioned Feishu Bases.
- Every predefined Feishu field and option display label is Chinese while stable logical keys and option codes remain unchanged.
- New-Base provisioning removes only the three exact platform-seeded helper fields (`单选`, `日期`, `附件`) from the verified new default table, with read-after-write checks.
- Finalization strips privacy-bearing PNG metadata, including `caBX`/C2PA, without decoding or re-encoding pixels; dimensions, bit depth, color type and the complete IDAT byte stream are verified unchanged.
- Operators can explicitly export only sanitized final PNGs into a marker-owned delivery directory.
- Cross-industry bakery regression fixes harden research normalization, Content MCP writes and image-production tool routing.

## Compatibility and migration

- Runtime support remains Node.js `>=24 <25`.
- Existing Project Homes, approvals, assets and remote records are preserved.
- Ordinary Feishu repair remains add-only. Existing Base column movement or label migration is not performed silently and requires an explicit audited workspace migration.
- Upgrade the installed Plugin as a new versioned copy; do not overwrite a running Project Home or approval history.

## Verified package surface

- 159 strict Schemas.
- 160 generated TypeScript contract files.
- 72 bounded MCP tools.
- 8 Skills.
- MIT licensed source and release artifact.

## Still deferred

- Feishu attachment upload.
- Automatic publishing.
- Public HTTP MCP or universal directory submission.
