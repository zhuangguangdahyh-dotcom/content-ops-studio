# ADR-0031: First-page production handoff before Style Lock

- Status: Accepted
- Date: 2026-08-24

## Context

A complete planning decision is needed before costly visual production, but Phase 4A cannot validate a real first-page image or Renderer output and therefore cannot establish G4 or Style Lock.

## Decision

Phase 4A creates a Visual Handoff Package and a bounded First-Page Production Handoff; it does not generate the Cover. The next phase must produce page 1 first, obtain explicit G4 approval, and only then create Style Lock for the remaining pages.

The handoff binds current Content, Copy and Visual Plan versions and contains the selected direction, complete Visual System, exact page-one Copy Snapshot/hash, page plan, canvas, Safe Area, typography/color/grid tokens, asset requirement, Text Layers, image treatment, negative constraints and required capabilities. It contains no G4 event, Style Lock, generated asset, attachment, render manifest, fake output path or claimed image result.

The producer must execute this package and may not reinterpret the copy or visual direction. Any requested copy/page-count change returns to Content Creation; a visual-only change becomes a retained Visual Plan revision.

## Consequences

Quality and layout gates can make the first page production-ready without pretending it has been produced. Subsequent production has one auditable source and cannot silently replace the approved plan.
