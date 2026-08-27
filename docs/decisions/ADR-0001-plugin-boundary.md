# ADR-0001: Plugin boundary

**Status:** Accepted

## Context

Development assets, tests, and services should not enlarge or confuse the installable Plugin.

## Decision

Separate the Git repository from the distributable Plugin. The Plugin root is `plugins/content-ops-studio/`.

## Consequences

Packaging must explicitly select Plugin files; runtime customer data stays outside both boundaries.

## Alternatives considered

Using the repository root as the Plugin root was rejected because development-only files would be bundled implicitly.

## Follow-up

Keep package validation and distribution-copy tests current.
