# First-page mechanical QA

Mechanical QA runs before G4 and does not substitute for Operator aesthetic approval. It verifies exact Text Layer content, page role/version bindings, actual DOM bounds, safe area, overflow, clipping, visibility, scroll, canvas, resolved font, network isolation, PNG signature, dimensions, file size, SHA-256 and persisted read-after-write.

The Cover safe area comes from VV-1: top 96, right 84, bottom 96 and left 84 pixels. Blocking failures include copy drift, overflow, safe-area escape, hidden or clipped required text, canvas scroll, missing background, unusable Chinese font, wrong dimensions and missing/checksum-invalid output.

The Renderer must not pass by hiding text, clipping overflow, changing approved copy or unbounded font shrinking. Zero blocking failures is necessary for `ready_for_g4=true`.
