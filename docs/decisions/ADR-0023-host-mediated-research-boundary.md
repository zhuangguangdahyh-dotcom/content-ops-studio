# ADR-0023: Keep public research host-mediated

Status: Accepted  
Date: 2026-08-24

## Context

The bundled stdio MCP server runs locally and must not receive a generic browser, shell, file, or arbitrary network capability. At the same time, painpoint research needs current public evidence and verifiable citations.

## Decision

The host performs public-source discovery with its native search and fetch tools. The Plugin supplies a bounded research context and query plan, then accepts only structured source submissions through `content_ops_submit_research_sources`. Submitted sources must include a public locator, retrieval metadata, supported claims, confidence, limitations, and a content hash. The Plugin validates and persists them under the current project Run before analysis.

The bundled MCP server performs no autonomous internet request. Manual sources use the same evidence contract. Fixtures are test-only and require an explicit test flag. No arbitrary Search, Fetch, Shell, File, or raw Feishu MCP tool is exposed.

## Consequences

Research remains current without widening the Plugin's authority. Host and Plugin responsibilities are explicit, source provenance survives recovery, and a missing host research capability produces an honest blocked or manual-source path instead of fabricated evidence.
