# ADR-0039: Direction selection, G4, and Style Lock

- Status: Accepted
- Date: 2026-08-25

## Decision

A new or visually immature project receives two or three materially different visual direction candidates. They are preview assets, not First Page Versions, formal delivery assets, G4 submissions, or Style Lock sources. Only the Operator selects a direction. Selection permits a non-destructive Visual Plan revision and formal first-page production; it is not G4 approval.

G4 separately evaluates mechanical quality, visual quality, and project fit. Mechanical success never approves aesthetics. A Style Lock is created only from the current formally approved first page and is divided into `locked_rules`, `allowed_variations`, and `prohibited_deviations`. It locks a visual language—not the cover's exact coordinates, background, subject, ornament, or typography size copied mechanically to every page.

Revision classification is `ELEMENT_ONLY`, `RENDER_ONLY`, `PAGE_COMPOSITION`, `GLOBAL_VISUAL_DIRECTION`, or `CONTENT_COPY`. Global direction returns to Visual Plan revision; copy or page-count changes return to Content revision.
