# Phase 2A.1 Runtime Support Matrix

Upstream lifecycle snapshot date: 2026-08-24. Refresh it before release.

| Runtime | Upstream Status Snapshot | Project Support Status       | Execution Evidence                      | CI Evidence  | Allowed in V0.1.0 | Notes                                                         |
| ------- | ------------------------ | ---------------------------- | --------------------------------------- | ------------ | ----------------- | ------------------------------------------------------------- |
| Node 20 | EOL                      | `UPSTREAM_EOL` / unsupported | `NOT_REQUIRED`                          | Not required | No                | Historical probe remains accurate but is no longer a blocker. |
| Node 22 | LTS                      | `UNCLAIMED`                  | `NOT_RUN`                               | `UNVERIFIED` | No                | Upstream support does not create a project support claim.     |
| Node 24 | LTS                      | `SUPPORTED`                  | Local `PASSED` on 24.19.0, darwin/arm64 | `UNVERIFIED` | Yes               | Sole V0.1.0 baseline, range `>=24 <25`.                       |
| Node 26 | Current                  | `UNCLAIMED`                  | `NOT_RUN`                               | `UNVERIFIED` | No                | Reassess after LTS transition and real project validation.    |

Runtime support is independent of production integration readiness. Feishu, production image generation, Production Renderer, attachment upload, publishing, and official MCP remain blocked or unimplemented on every Runtime.
