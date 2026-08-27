# ADR-0015: Feishu authentication and transport

Status: Accepted  
Date: 2026-08-24

## Context

Phase 2B needs a self-built tenant-app token, exact redaction, fake-clock expiry tests, single-flight refresh, bounded retry evidence and a mockable transport on Node 24. The current official `@larksuiteoapi/node-sdk` is 1.73.0 and covers the required Bitable methods, but its client owns token caching, HTTP behavior and error logging. A hybrid would create two token/retry stacks.

## Decision

Use Node 24 native `fetch` behind a narrow `FeishuTransport`. The origin is fixed to `https://open.feishu.cn`; paths are operation-allowlisted. Token acquisition is isolated in `FeishuTokenProvider`; tokens remain in process memory. The official SDK generated source is the payload/method cross-check, but no SDK type enters Core and no production dependency is added.

## Consequences

We own validation, pagination, bounded retry, rate-limit response handling and redaction and can test them deterministically. The implementation must be refreshed against official docs when capabilities change. Switching to the SDK later requires a new ADR and equivalent lifecycle/security evidence.
