# ADR-0032: Playwright Production Renderer

Status: Accepted. Date: 2026-08-25.

## Decision

Use exact `playwright-core@1.62.1` at Runtime and exact `playwright@1.62.1` for explicit setup/development. Render with the matching Playwright-managed Chromium only. Browser installation is an explicit confirmed setup into Plugin Data or a repository-external cache; it never occurs at server startup or ordinary render time. Only Chromium is installed.

## Rationale

HTML/CSS provides mature Chinese typography and real DOM measurements while Chromium supplies a reproducible screenshot protocol. A system browser is unversioned and may inherit profiles/extensions. Native Canvas adds a large platform-specific dependency and weaker text-layout inspection. Satori/SVG remain useful graphic primitives but are not the sole text renderer. Browser bytes do not belong in immutable Plugin Root or the MCP bundle; installed copies resolve the same external cache policy.

## Consequences

Production never falls back to `MockRendererAdapter`. Setup uses fixed argv with `shell=false`, accepts no arbitrary version/package/command/executable path, and failure leaves Renderer BLOCKED.
