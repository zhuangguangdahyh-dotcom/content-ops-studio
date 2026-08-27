# Content Ops Studio

Content Ops Studio is a local-first Codex Plugin for running evidence-backed, approval-gated image-post content projects. It keeps Project data outside the Plugin, preserves every approved version, and turns research, copy, visual production and delivery into a recoverable workflow.

## What it is

The Plugin is for Operators managing long-term content work for a Subject and an Audience across industries. It provides deterministic local state, strict contracts, bounded MCP tools, optional Feishu/Lark workspace integration, Host-native research and ImageGen handoffs, a Playwright Renderer, visual QA, explicit approvals and immutable final delivery.

It is not an autonomous publisher, a generic image generator, an approval substitute, a cloud-hosted public MCP service or a place to store customer runtime data.

## Core capabilities

- Project initialization, registry, locks, journals, checkpoints and recovery.
- Host-mediated evidence research and item-level G2 Painpoint review.
- Versioned Content Packages, claim/duplication/quality checks and G3.
- Dynamic Visual Planning, formal Cover production, G4 and Style Lock.
- Six-page set production, per-page QA, continuity, Group QA and G5.
- Immutable Final Manifest, deterministic fingerprint, delivery integrity and archive.
- 158 strict Schemas, 159 generated TypeScript files, 71 bounded MCP tools and 8 Skills.
- Optional official Lark CLI and gated Feishu OpenAPI integration.

## Workflow

`Project Setup → Research / Painpoint → Content Package → G3 → Visual Plan → First Page → G4 → Style Lock → Remaining Pages → Group QA / Continuity → G5 → Finalization → Optional Feishu Sync`

G1–G5 are human decisions. Scores, QA results and tool success never create approval automatically.

## Requirements

- Node.js `>=24 <25`.
- pnpm `11.19.0` for repository development.
- Supported official `@larksuite/cli@1.0.63` for ordinary Feishu workspace operations.
- Playwright/Chromium `1.62.1` for production rendering.
- A Host-installed native ImageGen capability for generated visual assets.

The Plugin does not require an Operator to configure an OpenAI API key. See the [environment contract](ENVIRONMENT.md).

## Installation

For source validation:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm release:pack
```

The installable Plugin root inside the package is `plugins/content-ops-studio/`. It contains its own bundled STDIO MCP server and does not need repository `node_modules` at runtime. Follow [Quick Start](QUICK_START.md) and [local Plugin installation](docs/21-local-plugin-installation.md).

## Quick Start

Run `content_ops_doctor`, initialize a Project through `content_ops_plan_project_initialization`, and execute every write only after its explicit confirmation. Runtime artifacts are written to external `CONTENT_OPS_HOME` or the Host-managed Plugin Data location. The shortest complete setup is in [QUICK_START.md](QUICK_START.md).

## Project and Workspace model

The Plugin installation is read-only. Project Profiles, Runs, journals, mappings, approved assets, delivery packages and archives live under an external Project Home. Production, Calibration and TEST fixtures are isolated; fixture approvals cannot authorize Production.

## Approval Gates

- G1 confirms Project configuration.
- G2 reviews individual Painpoints.
- G3 approves an exact Content/Copy version.
- G4 approves the checksum-bound formal first page and creates the current Style Lock.
- G5 approves the exact final page checksums before Finalization.

REVISE and REJECT preserve history. A later version invalidates stale downstream approvals.

## Visual and Image Production

Image Production Skill V1 is `PRODUCTION_READY / FROZEN_FOR_V1`. Phase 4D exposed production-reliability defects; Phase 4E repaired them and both frozen deterministic Strategy regressions pass. This does not turn any Cover layout, color, crop or attention mode into a Universal template. Further visual capability work belongs to V1.1+.

Generated visuals come from the Host-installed ImageGen capability. All formal Chinese text is composed by the Renderer. Chromium must be explicitly installed and pass Renderer Doctor; no system-Chrome or Mock fallback is allowed in Production.

## Feishu and Lark integration

Official Lark CLI OAuth is the default Feishu path. Use the Plugin setup/Doctor tools and never paste credentials into chat or CLI arguments. Live writes remain explicitly gated and read-verified. The legacy enterprise-app adapter accepts secrets only from the process environment.

## MCP and Plugin usage

The package exposes 71 closed-schema tools through the bundled STDIO MCP. Read tools plan and inspect; writes require explicit confirmation, pre-write checks, idempotency and readback. The Plugin exposes no arbitrary shell, raw HTTP, credential or delete tool.

## Finalization and Delivery

Finalization requires current G3/G4/G5, active Style Lock, every approved page, passing single-page and group evidence, continuity and zero hard blocks. It re-reads PNG bytes and checksums, creates `FINAL_MANIFEST_V1`, a Final Set Fingerprint, approved-only Delivery Package, integrity report and versioned archive. Normal Finalization makes zero ImageGen and Renderer calls.

## Recovery and Idempotency

Every write is journaled and version-bound. Retrying an identical operation reuses verified artifacts. Conflicting payloads under the same immutable version stop with a stable conflict code. Partial failures preserve evidence and resume from the last verified checkpoint; rollback never deletes approved history.

## Security

Never put credentials, tokens, customer data, personal assets or external Project Homes in the repository or Plugin root. Release packaging excludes dependencies, caches, runtime outputs and historical raster evidence. See [SECURITY.md](SECURITY.md) and [PRIVACY.md](PRIVACY.md).

## The eight Skills

- `content-studio-router` — routes the complete workflow and approval boundaries; all stages.
- `project-initialization` — creates and validates Project/Workspace contracts; setup and G1.
- `painpoint-research` — turns retained evidence into reviewable Audience Painpoints; research and G2.
- `content-creation` — creates evidence-grounded Content Packages; copy production and G3.
- `visual-planning` — creates the Visual System and page plans without producing images; post-G3 planning.
- `image-set-production` — resolves visual strategy, assets, Renderer QA, G4, Style Lock and final-set QA; production through G5.
- `content-finalization` — validates the approved set and creates delivery/archive evidence; post-G5.
- `project-learning` — governs confirmed project-level rules without silently modifying core or industry packs; explicit feedback review.

## Current V1 limitations

- Feishu final metadata sync is `PARTIAL`: dedicated Final Manifest ID and Final Set Fingerprint fields are not yet in the Blueprint.
- Feishu attachment upload is `DEFERRED`; `drive:file:upload` is not required for local Finalization.
- Public HTTP MCP, public submission and automatic publishing are not included.
- Host ImageGen must be installed and available in the operating Host.
- Production rendering depends on the pinned local Playwright/Chromium environment and available fonts.

## Development

Run `pnpm check` on Node 24. The complete suite validates formatting, lint, types, contracts, state, Runtime, Renderer, visual production, Feishu/Lark, MCP, installed copies, Finalization, security and examples.

## Release and versioning

`0.1.0` is the repository's first open-source V1 release. The version is synchronized across package and Plugin metadata. Release artifacts must pass clean-install and installed E2E checks. See [release and distribution](docs/11-release-and-distribution.md).

## License

Content Ops Studio is open source under the [MIT License](LICENSE). Bundled third-party components retain their original licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).
