# ADR-0002: TypeScript runtime

**Status:** Accepted

## Context

The system needs shared typed contracts and deterministic validation across packages.

## Decision

Use Node.js, strict TypeScript, a pnpm workspace, Vitest, ESLint, and Prettier. ADR-0014 supersedes the original Node 20+ version assumption and sets the unpublished V0.1.0 baseline to Node.js 24 LTS (`>=24 <25`).

## Consequences

All packages share strict compiler options and remain runnable without production service dependencies.

## Alternatives considered

Single-package JavaScript and mixed runtimes were rejected due to contract drift and operational complexity.

## Follow-up

Revisit build output only when a real runtime package is implemented. Future Node major support requires actual validation evidence and an accepted policy amendment under ADR-0014.
