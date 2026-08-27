# ADR-0038: Formal text and Renderer boundary

- Status: Accepted
- Date: 2026-08-25

## Decision

All formal informational text—including titles, body copy, labels, data, steps, evidence notes, CTA, page numbers, brand names, footnotes, and disclaimers—is typeset by the deterministic Renderer. Generated backgrounds do not carry readable Chinese information. Native text in an authentic screenshot, package, sign, drawing, or evidence source may remain when its context and authorization are preserved.

Programmatic Graphic is responsible for accurate structure, relationship, sequence, comparison, timeline, data, and evidence annotation. The Renderer may crop, scale, mask, grade, blur, relight, composite, add simple geometry, and place formal text. It may not change a real subject's identity, a product form, a space structure, a project fact, evidence meaning, approved copy, or the global visual direction.
