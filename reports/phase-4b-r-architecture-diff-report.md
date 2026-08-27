# Phase 4B-R architecture diff report

## Added

- Universal Image Production Core for six-channel routing, candidate plans, quality, group QA, batches and feedback eligibility.
- Host-native ImageGen bridge for request validation, real-file submission, image signature inspection, atomic materialization, SHA-256 and manifest read verification.
- Controlled Image Production Runtime under Project Home.
- Versioned Industry Visual Packs, overlays and Project Visual Profile contracts.
- Fourteen narrow MCP tools and refactored Image Production Skill/Router.

## Preserved boundaries

- Copy, Visual Plan and previous FPV are immutable inputs.
- Formal information text is Renderer-owned.
- Candidate assets are distinct from formal delivery, First Page Versions, G4 and Style Lock.
- Host execution is not an MCP image API.
- Production does not fall back to Mock.
- Plugin Root remains immutable; all generated media stays outside the repository.

## Explicitly unchanged

Plugin version `0.1.0`, license, Feishu production fields, attachment/publishing scope, Git remote/commit/push state, and the retained C-0001 FPV-1 bytes/checksum.
