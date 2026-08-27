# ADR-0006: Project data location

**Status:** Accepted

## Context

Customer state must survive Plugin updates without entering source control.

## Decision

Store local project data under `CONTENT_OPS_HOME`, not the Plugin directory or Git repository.

## Consequences

Installation can be treated as read-only; backup and retention can be managed independently.

## Alternatives considered

Plugin-local runtime directories and chat-memory recovery were rejected.

## Follow-up

Define registry, retention, and migration contracts before runtime implementation.
