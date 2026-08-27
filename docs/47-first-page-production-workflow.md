# First-page production workflow

The production path is: verify G3 and the current Handoff; run Renderer Doctor; create a dry-run Production Plan; compile the programmatic graphic and exact Text Layers; perform real DOM measurements; write a 1242×1660 PNG plus Manifest/Render/QA/Environment reports; update only the allowed Feishu pending fields; read them back; show the PNG; stop at G4.

The current Run is bound to Content, Content Version, Copy Version, Visual Plan Version, First Page Version, Handoff hash, template, Renderer environment and idempotency key. Same inputs reuse the asset. A changed input with the same identity conflicts; a previous PNG is never overwritten or deleted.

Phase 4B produces one Cover only. It does not upload the PNG, generate pages 2–6, enter G5 or publish.

Phase 4B-R inserts an optional direction-selection gate before formal first-page production. Candidate Asset IDs and previews are not FPV values. The retained C-0001 FPV-1 remains immutable technical evidence and cannot source the new direction or Style Lock.

After an explicit Host-generated direction selection, the formal Production Plan may use `AI_GENERATED_VISUAL` only when the text-free raster is already materialized under Project Home with signature, dimensions, checksum and provenance. The Renderer may fit a native 3:4 raster to the fixed 1242×1660 canvas, but it still owns every formal text layer, network access remains blocked, and same-environment replay must reproduce the final checksum. The quality score can make the asset ready for G4; it cannot approve G4.
