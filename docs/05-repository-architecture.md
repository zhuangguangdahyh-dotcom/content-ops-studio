# Repository architecture

The official CLI boundary lives in `packages/workspace-adapters/src/lark-cli/`. Version policy is repository configuration; the executable, OAuth cache and keychain data stay outside the repository.

Feishu code lives only under `packages/workspace-adapters/src/feishu/`; machine snapshots live under Plugin config, canonical contracts under Plugin schemas, and project runtime data outside the repository under `CONTENT_OPS_HOME`. `tests/feishu` is offline. The explicit live harness is never part of ordinary CI.

The Git development repository and installable Plugin are separate boundaries. The Plugin is rooted at `plugins/content-ops-studio/`; Phase 2C bundles MCP source and workspace packages into the explicit `runtime/dist/content-ops-mcp.mjs` distribution asset.

- `docs/` holds accepted product and engineering decisions.
- `plugins/` holds distributable Plugin resources.
- `packages/contracts` owns shared TypeScript contract types and deterministic identifiers.
- `packages/core` owns state validation, safe Asset Store implementations, path/checksum utilities, and provider-neutral visual-pipeline primitives.
- `packages/image-adapters` and `packages/renderer` own interfaces, network-free mocks, and explicit non-production capability boundaries.
- `services/content-ops-mcp` owns the official-SDK STDIO boundary, strict schemas, results, errors and 15-tool registration.
- `scripts/` provides deterministic validation with no external services.
- `tests/` mirrors unit, contract, integration, failure, eval, visual, and migration concerns.

Runtime customer data never enters this tree. The MCP bundle is the sole checked distribution exception under Plugin `runtime/dist`; it contains no source map, personal path or runtime data.

Canonical visual/final contracts remain in the Plugin Schema directory, generated declarations remain under `packages/contracts/src/generated/1.0/`, and fictional fixtures remain under `tests/fixtures/contracts/1.0/`. Temporary asset tests write only below operating-system temporary roots supplied by the test.

Phase 2A places recoverable orchestration under `packages/runtime`, the executable non-interactive entrypoint under `packages/cli`, and sanitized real-file fixtures under `tests/fixtures/runtime-assets`. Phase 2A.1 places Runtime policy/evidence validation and collection under `scripts/`; these commands inspect or execute only the current Runtime and never install another Node version. `reports/baselines` holds a content-hash manifest of the Phase 1B working tree; it excludes Git internals, dependencies, runtime data, logs, secrets, and file bodies.

Phase 3A places pure research rules in `packages/core/src/research`, persistence boundaries in `packages/research-adapters`, remote orchestration in `packages/runtime/src/research`, tool composition in `services/content-ops-mcp`, and Host workflow instructions in the two affected Skills. Research Run artifacts remain below external `CONTENT_OPS_HOME`; only sanitized counts and hashes enter reports.

Phase 3B places pure Content rules in `packages/core/src/content`, recoverable writes/G3 in `packages/runtime/src/content`, eight tool handlers in `services/content-ops-mcp/src/content-tools.ts`, and workflow policy in the Content Creation and Router Skills. Full packages remain only under external `CONTENT_OPS_HOME`; repository reports retain sanitized evidence and hashes.

Phase 4A adds pure rules at `packages/core/src/visual-planning`, bounded Runtime at `packages/runtime/src/visual-planning`, eight handlers in `services/content-ops-mcp/src/visual-tools.ts` and formal Skill references. Full mappings/hand-offs remain under external Home; repository evidence retains only hashes/counts.

# Renderer ownership

`packages/renderer` owns safe compilation, Browser execution and measurement. `packages/runtime/src/first-page` owns pending/G4/Style-Lock state. `services/content-ops-mcp` owns the eight bounded tool handlers. Browser binaries and produced assets are external runtime data, never repository or Plugin files.

`packages/core/src/image-production` owns deterministic routing, candidate, scoring, group and feedback decisions; `packages/image-adapters` owns Host file validation/materialization and channel adapters; `packages/runtime/src/image-production` owns external artifacts; Plugin `packs/visual-industries` and `packs/visual-overlays` are read-only defaults; MCP exposes 14 additional narrow tools.
