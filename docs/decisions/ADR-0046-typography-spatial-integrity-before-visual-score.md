# ADR-0046: Typography spatial integrity before visual score

- Status: Accepted
- Date: 2026-08-26

## Context

Existing typography policy could verify copy, font and conventional layout measurements while still allowing a visually colliding composition. Historical candidate F demonstrated the gap: its earlier typography result was valid for that policy, but the rendered title region and adjacent visual region did not preserve spatial integrity. A high aggregate visual score must not hide that defect.

## Decision

Run `TYPOGRAPHY_SPATIAL_INTEGRITY` and `TYPOGRAPHIC_BREATHING_ROOM` before Visual Quality scoring. Measure real Playwright bounding boxes and computed typography, then require actual-pixel visual inspection. Treat text/text overlap, text/graphic occlusion, visual-region collision, insufficient relative padding, line/glyph collision, forced tracking, orphan breaks, competing primary text and density-forced compression as hard blocks. Measure breathing room relative to the resolved type and composition rather than a fixed-pixel template.

Preserve historical assets and their original evidence. A new policy may classify an old asset under a new report, but may not rewrite the asset or falsify the earlier policy result. If faithful copy cannot fit, return to Cover Copy Revision or Page Composition Revision rather than silently compressing typography.

## Consequences

- Visual Quality scoring is not invoked until both typography gates pass.
- Actual geometry is necessary evidence; actual-pixel inspection remains independently required.
- Image/text interlock may pass when glyph integrity, hierarchy and readability remain intact.
- Historic F remains immutable while the new spatial regression is reproducible.
- Candidate-specific G/H layouts are calibration evidence, not Project, Industry or Global preferences.
- Passing does not select a direction, create an FPV, approve G4 or create a Style Lock.
