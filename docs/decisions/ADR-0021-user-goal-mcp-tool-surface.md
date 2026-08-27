# ADR-0021: Expose narrow user-goal MCP tools

Status: Accepted  
Date: 2026-08-24

## Context

Generic shell, raw OpenAPI or universal mode tools would bypass Runtime contracts, confuse authorization and enlarge the prompt-injection surface. Domain operations already have explicit planning, approval, recovery and verification boundaries.

## Decision

Expose exactly fifteen `content_ops_` user-goal tools covering diagnostics, Feishu setup, project discovery, initialization planning/execution, Workspace inspection/verification/add-only repair, Run status/resume and explicit approval. Do not expose delete, shell, arbitrary file, raw API, token/keychain, risk-control or arbitrary-Home tools.

Every tool has strict Zod input and output schemas, an accurate read/write annotation set, structured plus human-readable output and stable errors. Write tools require explicit confirmation, an idempotency/request key and a plan/version binding. MCP boundary validation supplements but never replaces canonical Ajv domain validation. G1 is never inferred or auto-approved; only `content_ops_submit_approval` records an explicit approval.

## Consequences

The model sees a smaller, auditable and safer surface aligned to Operator goals. Some multi-step tasks require multiple calls, but plan-before-write, read-after-write and approval boundaries remain visible instead of being hidden in an all-purpose command.
