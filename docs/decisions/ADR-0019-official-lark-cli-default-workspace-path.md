# ADR-0019: Official Lark CLI as the default Workspace path

Status: Accepted  
Date: 2026-08-24

## Context

The Direct Feishu Adapter requires an Operator-managed self-built tenant app and application secret. That remains appropriate for advanced enterprise deployments, but it is an avoidable credential burden for ordinary Operators. The official `@larksuite/cli` provides browser-based user OAuth, keychain-owned credentials, structured output, capability discovery and official risk controls.

## Decision

`AUTO` and `LARK_CLI` select `LarkCliWorkspaceAdapter` with explicit `--as user`. `DIRECT_FEISHU` remains an explicit advanced mode, and `MOCK` remains test-only. AUTO never falls through to Direct or Mock.

Content Ops Studio retains the Blueprint, state machine, idempotency keys, project lock, Journal, Write Log, Checkpoints, reconciliation and read-after-write verification. The official CLI owns OAuth, credential storage and OpenAPI transport. Runtime code depends on the executable and strict JSON contracts, not on automatic Skill activation; official `lark-base` and `lark-shared` Skills are command guidance only and are neither copied nor modified.

The tested CLI version is pinned to `1.0.63`. Older versions are rejected and newer unclaimed versions require a capability/test cycle. Default identity is user. Bot identity is only allowed after an explicit enterprise selection. The Runner uses argv arrays with `shell:false`, a closed command allowlist, timeouts, cancellation, redaction and no delete/raw fallback. Official risk controls are never disabled.

## Consequences

Ordinary Operators do not provide App ID or App Secret to Content Ops Studio. Missing or stale OAuth pauses as `AWAITING_USER_AUTHORIZATION`; permission errors never trigger an identity or Adapter fallback. Attachment upload remains deferred. Direct Adapter readiness and Lark CLI Adapter readiness are reported separately, and neither makes the whole Plugin production-ready while Research, image, Renderer, MCP and publishing integrations remain absent.
