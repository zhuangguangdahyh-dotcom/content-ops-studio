# Phase 1B contract diff report

## Planned and actual scope

The seven planned catalog entries became canonical implemented contracts with generated TypeScript and fixtures. Common definitions gained safe Asset Reference, Canvas, Safe Area, Bounding Box, Typography Token, Color Token, Text Layer, Image Treatment, Check Result, Version Binding, visual mode, page role, and SHA-256 definitions. No planned visual/final Schema remains.

## Schema field adjustments

- `style-lock` embeds the complete G4 approval event in addition to approval ID/version. This is necessary for standalone deterministic eligibility checks without a hidden data lookup.
- `generation-manifest` embeds per-attempt Version Binding and exposes requested output as a closed object. Failed attempts remain ordered history.
- `render-report` includes `generation_id`, allowing deterministic rejection of reports bound to old or missing generation output.
- `final-manifest` embeds the G5 approval event and page-number-to-asset entries, allowing exact approval, sequence, path, and checksum validation.
- Cross-object facts that JSON Schema cannot express, such as consecutive pages, unique token IDs, current-version approval, QA statistics, and manifest reference existence, are enforced by pure core validators rather than permissive Schema extensions.

## Adapter boundary adjustments

`ImageGenerationAdapter` now exposes capability probing, validation, generate/regenerate, inspection, and cancellation. `MockImageGenerationAdapter` and `PromptOnlyImageGenerationAdapter` return pending, non-production results and no image paths. `RendererAdapter` exposes capability probing, layout validation, page/set render, and inspection; its mock returns no PNG. Asset Store remains inside `packages/core` rather than creating a workspace package.

## State and invalidation adjustments

No business state machine or status-map code was added. Visual statuses remain artifact-internal. Existing invalidation rules 003-007 were non-destructively expanded to name Phase 1B artifacts, and `INV-009` adds file-replacement invalidation. All nine rules use `preserveHistory: true`.

## Dependencies and directories

No external production or development dependency was added. `packages/image-adapters` gained an explicit workspace-only dependency on `@content-ops/contracts`; pnpm lockfile metadata was refreshed. New source directories are `packages/core/src/assets/` and `packages/core/src/visual-pipeline/`. No independent Asset Store package was created.

## Risks and follow-up impact

`json-schema-to-typescript` still requires the isolated fully dereferenced compiler view. Phase 1B adds three-level, array, `oneOf`, `anyOf`, repeated-reference, canonical-non-mutation, deterministic-output, and cycle-rejection tests. Production providers must not interpret mock/prompt-only pending records as successful assets. Local Node 20 evidence remains unavailable and must close before a real Feishu Adapter phase.

No material Phase 1B contract deviations.
