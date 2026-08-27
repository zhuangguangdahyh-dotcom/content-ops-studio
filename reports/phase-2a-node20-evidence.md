# Phase 2A Node 20 Evidence

## Result

- Status: **NOT_AVAILABLE**.
- Probe command: `CI=true pnpm node20:probe`.
- Probe exit: 0; this means the bounded probe completed, not that Node 20 passed.
- Probe timestamp: 2026-08-23T15:59:24.233Z.
- Existing tools checked: `node20`, `node-20`, `mise`, `fnm`, `volta`, `asdf`, `docker`, `podman`, and `brew`.
- Existing tools found: none.
- Node 20 selected: no.
- Node 20 validation commands executed: none.
- System installation, shell mutation, or binary download attempted: no.
- Compatibility gap closed: no.

The machine executed the repository under Node 24.19.0 and the complete `CI=true pnpm check` passed. That is not evidence of Node 20 compatibility. Repository compatibility therefore remains `PARTIAL` until a real Node 20 run or remote CI result passes the required command set. Machine-readable evidence is in `reports/verification/node-20-evidence.json`.

## Phase 2A.1 runtime-policy addendum

Node 20 was subsequently removed from the supported Runtime target after its upstream EOL status was formally incorporated into ADR-0014. The historical probe result and compatibility status above remain accurate for their execution date but are no longer a release or Phase 2B blocker. Current status is defined by the Phase 2A.1 reports.
