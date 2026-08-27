# Stage 11 Plugin V1 release-readiness ExecPlan

## Objective

Freeze the existing V1 feature surface, produce an auditable release package, install it into a repository-external clean environment, validate the installed Plugin and deterministic V1 chain, and prepare Git/release state without inventing an Operator license, identity or remote.

## Non-goals

- No feature, visual rule, industry pack, learning logic or Finalization expansion.
- No ImageGen call and no new visual asset production.
- No Feishu write, attachment upload, public HTTP MCP or publication.
- No guessed license, Git identity, GitHub repository, remote or push.

## Execution order

1. Freeze the Stage 10 baseline and complete `RELEASE_GAP_AUDIT`.
2. Repair only release-blocking packaging, documentation, path, CI and installed-state defects.
3. build and inspect the canonical release package twice.
4. install from the tarball outside the repository and run installed validation/E2E.
5. run the complete repository verification and release scans.
6. create release evidence and determine the honest readiness level.
7. create the initial commit only if every technical gate passes and Git identity is already available.

## Implementation record

- 2026-08-27: Stage 10 baseline frozen at 1,757 measured files and aggregate `1f6f68a2517cd0c17adc04b2290c6027eba7fc527c32d81760e0222f0b840783`.
- 2026-08-27: Release Gap Audit completed before implementation.
- 2026-08-27: Kept and froze version `0.1.0`; the repository already defines it as the first locally installable V1 development release, so no unsupported `1.0.0` bump was made.
- 2026-08-27: Repaired only release-blocking documentation, package boundaries, path/privacy scans, cross-platform checks and the release workflow `.mcp.json` policy.
- 2026-08-27: Built the local pre-license package twice after the final MCP rebuild. Both archives contained 486 files and had identical bytes.
- 2026-08-27: Installed the tarball outside the repository and passed Plugin discovery, 8 Skills, 158 strict schemas, 159 generated TypeScript files, 71 tools, MCP start, Renderer Doctor, installed rendering, promotion boundary, Group QA, finalization, archive and replay checks.
- 2026-08-27: Complete `CI=true pnpm check` passed with 81 test files and 466 tests; Secret Scan and example sanitization passed.
- 2026-08-27: The Operator selected MIT and authorized public release `v0.1.0`. Repository-local identity was derived from the authenticated GitHub account using its username and official noreply format; global Git configuration was not changed.
- 2026-08-27: MIT release audit, complete `pnpm check`, deterministic pack and clean-install E2E passed. The final package contains 489 files, SHA-256 `3f478f1d3d9b6abb9cab32f276f3e939d006d098e1aa74bb1bbb2c9a9334e44a` and canonical fingerprint `2fe01c2dd1126e37b9f46d5e3de385e0675451725bc5b8f247dfa5ac73de6702`.

## Final result

`RELEASE_READY`. Public repository, initial commit, annotated tag, GitHub Release and fresh-clone verification are authorized as the final Stage 11 publication operations.
