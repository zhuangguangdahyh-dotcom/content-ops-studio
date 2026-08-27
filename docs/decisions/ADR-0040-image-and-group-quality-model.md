# ADR-0040: Image and group quality model

- Status: Accepted
- Date: 2026-08-25

## Decision

Every image passes five independent layers: authenticity and integrity, mechanical quality, visual quality, mode and project fit, and Operator aesthetic approval. Hard blocks—including copy error, fake evidence, wrong identity, unreadable text, malformed anatomy or structure, low resolution, severe crop, prohibited direction, and authorization failure—cannot be offset by a score.

The 100-point model weights content and semantic fit 20; composition and focus 15; hierarchy and readability 15; asset quality and integrity 15; project and Audience fit 10; uniqueness and anti-template quality 10; Visual Mode execution 10; platform/mobile performance 5. Direction candidates require 75; formal assets require 85 and no core dimension below 3. Scores never approve G4 or G5.

Specialized asset QA augments the common gate. Retries are bounded and retained. Group QA separately tests system and subject consistency, meaningful page difference, near duplicates, source reuse, mode-specific coherence, and a contact sheet. Single-page failures revise that page; systemic group failures return to batch or global-direction planning.
