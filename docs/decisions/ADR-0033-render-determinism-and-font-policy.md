# ADR-0033: Render Determinism and Font Policy

Status: Accepted. Date: 2026-08-25.

## Decision

Determinism means repeatable DOM, HTML, CSS, graphic, layout and PNG/pixel output for identical input in the same platform, architecture, Chromium and resolved-font environment. It is not a cross-OS universal screenshot hash promise.

Freeze canvas, device scale, locale, timezone, color scheme, reduced motion, animations, caret, network, time-derived content and random values. Wait for `document.fonts.ready`, record computed family by typography role and block when no readable Chinese font exists. Font files are neither downloaded, committed, shared nor embedded.

## Consequences

Environment evidence records only versions, family names, options and hashes—never absolute browser/font paths, font bytes, Home paths or environment dumps. Snapshot evidence is keyed by platform, browser and font profile.
