# ADR-0047: Editorial knowledge and Cover Attention are separate from style templates

- Status: Accepted
- Date: 2026-08-26

## Context

Typography, semantic relevance and technical readability can all pass while a Cover remains visually inert. Conversely, applying Cover-scale type or scroll-stopping contrast to every inner page damages editorial reading and group pacing. Named publication references also create imitation risk if reduced to fixed layouts.

## Decision

Introduce `EDITORIAL_DESIGN_KNOWLEDGE_V1` as a sourced, versioned, non-template knowledge layer. Separate `COVER_ENTRY` from five inner-page intents. Require a candidate-specific Cover Attention Plan, grayscale-first color strategy, measured visual-mass hierarchy and typography-as-form evidence. Run `COVER_ATTENTION_DOMINANCE` only after the existing typography spatial gates and before G4. Runtime does not browse the source material.

Cold-start candidates must differ materially across at least three strategy axes. Project learning remains explicit, versioned, revocable and Operator-confirmed. Future Style Lock contracts distinguish cover-only, group-shared and content-page variation rules.

## Consequences

- A readable Cover can still fail stopping power.
- Color cannot rescue weak grayscale structure.
- Cover and inner pages no longer share one undifferentiated scale/density rule.
- Public design work informs principles and limitations, not copied templates.
- Passing candidates remain unselected and cannot create FPV, G4 or Style Lock by score.
- G/H remain preserved typography references and Cover Attention insufficiency evidence rather than failed images.
