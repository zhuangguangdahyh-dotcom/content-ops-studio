# Content Ops Studio repository instructions

## Repository purpose

This repository develops `content-ops-studio`, a multi-industry image-post content production Plugin. Version 0.1.0 is a contract and engineering bootstrap with a gated Feishu China Workspace Adapter; live readiness requires explicit sandbox evidence. It does not provide production research, image-generation, rendering, publishing, MCP, or attachment-upload behavior.

Use the terms **Operator** (the person operating the Plugin), **Subject** (the person, brand, organization, store, or product represented), and **Audience** (the people the content is intended to influence). Do not collapse these roles into the ambiguous word "user".

## Source hierarchy

1. Current mandatory official OpenAI technical requirements.
2. Accepted ADRs under `docs/decisions/`.
3. This `AGENTS.md`.
4. Directory-scoped `AGENTS.md` files.
5. The concrete task request.

A concrete task may change implementation details, but it may not bypass safety, data protection, factual accuracy, tool permissions, or the accepted state machine.

## Core engineering rules

1. Read the relevant documents and accepted ADRs before changing core behavior.
2. Never commit real customer data, Feishu credentials, API keys, access tokens, private images, real chat logs, or non-anonymized business material.
3. Every future external write must have a `run_id`, idempotency key, pre-write state check, post-write read verification, and traceable error report.
4. Validate every state change against the state machine.
5. Every Schema change requires migration notes and a migration test.
6. Never overwrite approved content.
7. Never implement failure rollback by deleting history.
8. Explain the necessity of any new production dependency before adding it.
9. Test deterministic core logic.
10. Keep all examples fictional, anonymized, or sanitized.
11. Never write project runtime data into the Plugin installation directory.
12. Never treat chat memory as a project data source.
13. Never fabricate tool success, external writes, or image-generation results.
14. Never automatically modify a core Skill, platform pack, or industry pack.
15. Version 0.1.0 supports only Node.js 24 LTS (`>=24 <25`); Runtime support must never be conflated with production integration readiness.

## Required commands

Run these before declaring work complete:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm validate:plugin
pnpm verify:bootstrap
pnpm scan:secrets
pnpm runtime-policy:validate
pnpm runtime-evidence:validate
```

For bootstrap or example changes, also run `pnpm sanitize:examples`.

## Definition of Done

A completed change has an implementation, tests, passing type checks, updated relevant documentation, no secrets, and no unexplained architecture drift.
