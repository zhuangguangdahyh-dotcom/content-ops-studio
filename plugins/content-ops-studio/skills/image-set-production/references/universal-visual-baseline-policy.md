# Universal Visual Baseline Policy

`UVDPV-1` is the last-resort cold-start baseline, not a style template. Apply it only after safety, the current Operator instruction, Style Lock, Project Visual Profile, confirmed global preference, per-content semantics/assets, Industry Pack/Overlay and Platform Pack.

When no higher rule supplies typography, use `TDPV-1`: resolve a Renderer-verified modern Chinese serif, prefer a real 700/800 title weight, use Regular/Medium for subtitle and Regular for body, forbid synthetic bold, font downloads and silent PingFang fallback. If no usable font exists, return `SONGTI_FONT_UNAVAILABLE` or `SONGTI_WEIGHT_UNAVAILABLE`.

An important image should establish at least two real spatial relationships. A photo plus mechanically placed upper-left text is not an editorial composition. The image must carry an explicit semantic responsibility, and text must relate to its subject, edge, depth, light, evidence or purposeful negative space without obscuring key evidence.

Before any Visual Quality score, run `TYPOGRAPHY_SPATIAL_INTEGRITY` and `TYPOGRAPHIC_BREATHING_ROOM` from actual Renderer geometry plus actual-pixel inspection. A mathematical non-overlap result is necessary but not sufficient: text regions can still visually collide with another text layer, a graphic, a focal subject or an implied reading path. Block on text/text overlap, text/graphic occlusion, visual-region collision, insufficient relative container padding, line/glyph collision, forced tracking, orphan-character breaks, competing primary text or density-forced compression. Image/text interlock is allowed only when glyph integrity and readability remain intact.

Measure breathing room relative to the current type metrics and composition, never through a universal fixed-pixel template. Record resolved font/weight, text and container bounding boxes, line height, tracking, minimum layer gap and title-to-secondary gap ratio. If faithful copy cannot fit, preserve copy and recover in this order: Cover Copy Revision for a cover, Page Composition Revision for a content page, then a new visual attempt. Never silently shrink, squeeze, track or overlap text to preserve a layout.

For a two- or three-direction candidate set, vary composition family, text region, shot scale/viewpoint, asset structure, semantic role, reading path and image-text integration. Changing only image, time of day, filter or color is blocked.

For Painpoint-, Risk- or Question-first covers, the scene must show the problem, show how the Audience recognizes it, or create a valid contrast. Industry relevance alone is insufficient. Locale must reflect Audience/Project region when it materially changes the visible scene.

Do not import commercial-space-only rules into this baseline. It contains no fixed palette, candidate layout, business category, area threshold, person ban or project signature.
