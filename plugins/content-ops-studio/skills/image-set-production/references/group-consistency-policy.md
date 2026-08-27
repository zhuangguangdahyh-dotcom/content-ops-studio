# Group consistency policy

Review full-size pages plus actual 310×414 and 186×248 contact sheets for visual-system consistency, subject/product/space identity, meaningful page difference, near duplicates, source reuse and mode-specific coherence.

Consistency and difference are separate requirements:

- consistency means one visual motif, identity world, typography family, palette logic, image treatment and grid language;
- difference means each page adds a new semantic responsibility, background asset or permitted non-raster construction, shot/spatial node, composition decision and narrative step;
- a different crop, overlay, exposure or text layout does not make the same raster master a different background;
- same-axis or same-source near duplicates fail even when individual pages pass;
- Zone names and metadata never override actual-pixel similarity.

Formal full sets must validate the Image Set Production Strategy and Image Set Continuity Report in addition to the candidate-oriented Group Quality Report. `DISTINCT_BACKGROUND_REQUIRED` source checksums must be unique. Reuse is allowed only when the page explicitly declares `REUSE_WITH_MATERIAL_TRANSFORMATION`, the channel genuinely requires it, and the transformation supplies new evidence rather than disguising duplication. Pure Typography and programmatic pages may use `NO_RASTER_BACKGROUND`.

Systemic failures return to batch or direction planning; isolated failures revise the page. Any hard block keeps G5 pending.
