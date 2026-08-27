# ADR-0012: Project locking and atomic writes

**Status:** Accepted

## Context

Concurrent writers, process death, path traversal, symlink escape, and partial file writes can corrupt a project runtime even when domain validation is correct.

## Decision

Use one project-level write lock created with exclusive file creation. The lock binds project, run, process label, redacted host label, timestamps, version, and status. Release and heartbeat verify ownership. Stale locks are inspected and recovered only through an explicit operation that records reason/history; unknown active locks are never deleted.

Atomic JSON writes use a same-directory temporary file, restricted permissions where POSIX is supported, flush/file sync where possible, rename, read-back, schema verification, and hash comparison. JSONL is append-only, flushes each complete line, and verifies its tail. Canonical absolute resolution plus relative containment protects roots; string prefix alone is insufficient. Existing symlink components are resolved and escape is rejected. Failure never deletes historical runs or logs.

## Consequences

Single-project writes serialize and crash artifacts are detectable. Filesystem semantics vary, so unsupported permission guarantees become diagnostics instead of fabricated success.

## Alternatives considered

In-memory locks, direct overwrites, broad recursive cleanup, prefix-only path checks, automatic stale-file deletion, and a heavy database/locking dependency were rejected.

## Follow-up

Distributed locking is out of scope until a real multi-host runtime is proposed.
