# @content-ops/cli

The Phase 2C MCP composition reuses `runCli` with captured structured I/O. It supports both repository cwd and an installed Plugin root; raw stdout/stderr is never returned to MCP callers.

Feishu commands are `feishu doctor`, `feishu permissions`, `feishu workspace plan|provision|inspect|verify|repair`, and `project init`. Plan defaults to no write; repair defaults to dry-run. Provision/repair require Production mode, an explicit Home, environment opt-in and `--confirm-live-write`. Secret/token CLI flags are rejected.

Local command boundary for the recoverable V0.1.0 Mock Runtime. It requires Node.js 24 LTS (`>=24 <25`) and exposes doctor, Pack resolution, project inspection/creation, run start/status/approval/resume/verify, and working-tree baseline commands.

`content-ops doctor --mode MOCK` has stable text output; add `--json` for the Runtime Diagnostic contract. Doctor reports current Runtime, project range, upstream snapshot, local evidence, cross-platform CI evidence, and Production Integration readiness independently. Node 24 local readiness does not make Feishu, image, Renderer, attachment, publishing, or MCP integrations ready.
