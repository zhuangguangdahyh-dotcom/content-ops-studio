# System architecture

Phase 2C adds a Host-facing local STDIO MCP layer above the existing Runtime composition. MCP owns boundary validation and presentation only; Runtime remains authoritative for state, locks, idempotency, Journal, Write Log, Checkpoint, approval and recovery, while `LarkCliWorkspaceAdapter` remains authoritative for official-CLI Workspace I/O. Plugin Root is immutable and Plugin Data/Home owns all mutable evidence.

Phase 2B.2 makes `LarkCliWorkspaceAdapter` the AUTO Workspace side-effect driver. Runtime orchestration still owns locks, plans, state transitions, idempotency, Journal, Write Log and Checkpoints. Direct Feishu is explicit advanced mode; Mock is never a Production fallback.

Phase 2B adds a production Feishu Workspace boundary beneath Runtime: credential provider → in-memory token provider → allowlisted `FeishuTransport` → `FeishuWorkspaceAdapter` → Blueprint/provisioning/reconciliation services. Skills and Core never call Feishu HTTP or receive SDK types/secrets. External writes still pass locks, plans, write logs, checkpoints and read verification.

## Components

```text
Plugin Core
├── Router / Orchestrator
├── Core Workflow
├── Specialist Skills
├── Platform Packs
├── Industry Packs
├── Project Profile
├── Adapters
├── Schemas
├── Human Approval Gates
├── QA
└── Outputs
```

## Rule layers and priority

Business rules live in five layers: Plugin Core, Platform Pack, Industry Pack, Project Profile, and Current Run. Resolution order is safety/compliance/factual accuracy/tool permissions → current explicit Operator request → confirmed project rules → platform pack → industry pack → Plugin defaults. A current request cannot override data protection, safety, factual accuracy, compliance, or tool permissions.

## Data sovereignty

Feishu is the future source of truth for structured business records: project settings, painpoints, content, confirmations, progress, active rules, feedback, and human notes. The local project directory under `CONTENT_OPS_HOME` is the future source of truth for file assets and run records: backgrounds, final images, visual specifications, Style Locks, prompts, parameters, QA, manifests, hashes, sync logs, and checkpoints.

Current instructions are the strongest business input for one run but do not automatically become project rules. Chat context is not a database. Recovery reloads configuration, workspace records, active rules, runs, and current state.

## Project and Plugin isolation

Plugin source and installation paths contain no runtime project data. Future runtime data belongs under `${CONTENT_OPS_HOME}/projects/<project-name>__<project-id>/`. The recommended default is `~/ContentOpsStudio`, but this bootstrap does not create that directory.

## Adapter boundary

Core code depends on interfaces, never provider HTTP implementations:

```text
Core → Adapter Interface → Concrete Implementation
```

Provider-neutral interfaces are `WorkspaceAdapter`, `ResearchAdapter`, `ImageGenerationAdapter`, `RendererAdapter`, `AssetStore`, and `CredentialProvider`. Phase 1B implements Image Generation, Renderer, and Asset Store contracts behind network-free mocks only. Skills never construct provider HTTP calls. External operations require state validation, idempotency, verification reads, error records, and capability checks.

## Human approval and QA

The Router alone converts explicit Operator decisions into approval events. G1 confirms project data, G2 painpoints, G3 copy, G4 the first page, and G5 the final set. Approval is version-scoped. No Skill can infer approval, and no invalid state transition may advance a run.

Phase 1B keeps visual-artifact states inside versioned contracts rather than adding speculative Feishu business states. A current G4 creates Style Lock; current four-layer QA and G5 create a new immutable Final Manifest. Business, image-generation, and synchronization status remain independent.

## Phase 2A local runtime

`packages/runtime` is the composition boundary for explicit `MOCK`, `DRY_RUN`, and `PRODUCTION` modes. Phase 2A executes only the two fixture workflows in `MOCK`; production capability probes remain blocked. Runtime state is stored only below an explicit Project Home, with atomic JSON state, append-only Journal and Write Log records, version-bound approvals, checkpoints tied to the Journal head, and project-scoped locks. The CLI depends on Runtime; Runtime never depends on the CLI.

Phase 2A.1 adds a Node 24 LTS (`>=24 <25`) support gate before Runtime composition and reference-workflow execution. Generic Runtime Evidence keeps project support status separate from execution status. Local Runtime readiness may be `READY` while Production Integration readiness remains `BLOCKED`.

## Phase 3A research path

The Host owns public network research and citations; the MCP server owns strict source ingestion, local atomic artifacts and deterministic validation. `packages/research-adapters` never fetches a URL. `packages/runtime` composes retained Evidence and painpoints with the existing official Lark CLI Workspace Adapter, prechecks unique keys, read-verifies writes and pauses at G2. G2 updates only item review status and timestamps.

## Phase 3B content path

`packages/core/src/content` owns pure page, Claim, fingerprint, duplicate and quality rules. `packages/runtime/src/content` owns idempotent Content/Painpoint writes, audits and G3 state. Eight MCP tools compose these boundaries through the existing official Lark CLI Adapter. The path consumes one confirmed Painpoint, writes one Content row, read-verifies both records and stops at G3 before any Visual Planning call.

## Phase 4A visual path

`packages/core/src/visual-planning` owns copy fidelity, direction, layout, quality and handoff rules. `packages/runtime/src/visual-planning` owns one allowlisted Content update, Journal/Write Log/Checkpoint and replay. Eight MCP tools compose the path and stop with a verified First-Page Handoff; no image, G4 or Style Lock is created.

# Phase 4B addition

The Adapter layer now contains a Production `PLAYWRIGHT_HTML_CSS` Renderer for page 1. Runtime owns output persistence, idempotency, G4 and Style Lock; MCP exposes bounded user-goal tools. Image-model generation, remaining-page rendering and finalization are still separate blocked capabilities.

Phase 4B-R adds Universal Image Production Core, versioned Industry Visual Pack and Project Visual Profile layers, a Host-native ImageGen file bridge, and Per-Content routing/quality artifacts. MCP coordinates narrow local operations; the Skill invokes Host generation. Candidate production has no formal Feishu write authority.
