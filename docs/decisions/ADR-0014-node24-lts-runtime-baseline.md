# ADR-0014: Node 24 LTS runtime baseline

- Status: Accepted
- Date: 2026-08-24

## Context

V0.1.0 originally declared Node 20+ and Phase 2A carried missing Node 20 execution as a compatibility blocker. The upstream lifecycle snapshot incorporated on 2026-08-24 marks Node 20 EOL, while Node 24 is LTS and is the Runtime on which this repository has actually passed its complete local verification. Keeping an EOL line as a release gate would weaken rather than improve the maintained baseline.

Node 22 may remain upstream-supported, and Node 26 may become LTS later, but this project has not executed its required contract, Runtime, recovery, and security matrix on either line. Runtime support must also remain distinct from Feishu, image, Renderer, attachment, publishing, or MCP production readiness.

## Decision

V0.1.0 supports only Node.js 24 LTS with the bounded range `>=24 <25`.

- Node 20 and earlier are outside project policy; Node 20 is additionally recorded as `UPSTREAM_EOL` and needs no compatibility probe.
- Node 22, 25, and 26 are `UNCLAIMED`, not declared incapable. They are blocked by default until actual project validation supports a policy amendment.
- `package.json`, `.node-version`, `.nvmrc`, CI, current documentation, Runtime Config, and `runtime-support-policy.json` must agree.
- Runtime support policy and execution evidence are separate. Generic `RuntimeEvidence` records policy status independently from execution status.
- Runtime composition enforces supported versions by default, including MOCK; tests may inject an explicit fake Runtime version.
- Runtime Diagnostic reports local Runtime readiness independently from Production Integration readiness.
- The unpublished, version-specific `node20_evidence` diagnostic field is removed as a documented pre-release correction. Historical Node 20 reports and machine evidence remain unchanged except for explanatory addenda.
- The Node 20 probe script and command are removed rather than retained as a compatibility wrapper.

## Consequences

- Local execution on a matching Node 24 version can establish declared Runtime compatibility without Node 20 evidence.
- Node 20 returns `UNSUPPORTED_RUNTIME`; Node 22/25/26 return `UNCLAIMED_RUNTIME` by default.
- Installation is intentionally narrower than the previous `>=20` declaration.
- CI uses explicit Node 24 jobs on Ubuntu and macOS, but configuration alone is not remote CI evidence.
- Production Workspace, image, Renderer, and publishing capabilities remain blocked regardless of Runtime success.
- The generic evidence model can represent future Runtime versions without another version-specific Schema.

## Alternatives considered

1. Continue requiring Node 20 evidence: rejected because it preserves an EOL release as a current target.
2. Support Node 22 and Node 24 together: rejected because this project lacks actual Node 22 execution evidence.
3. Use `>=24` without an upper bound: rejected because it would silently claim future major versions.
4. Keep the old Node 20 probe as the primary command: rejected because it would preserve obsolete policy semantics.
5. Mark local Runtime success as full production readiness: rejected because production integrations remain unimplemented.

## Follow-up

Before adding another Node major version, re-check upstream lifecycle, amend the policy through an accepted ADR, execute generated-type, Schema, Runtime, recovery, safety, and security checks on that actual Runtime, and record local or CI evidence. Re-verify the upstream lifecycle snapshot before any release.
