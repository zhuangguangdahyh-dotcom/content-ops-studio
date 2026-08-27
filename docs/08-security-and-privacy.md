# Security and privacy

The local MCP server rejects unknown input keys, arbitrary paths, shell text as operations, secrets, tokens and Authorization fields. It has no delete/raw execution tool. STDIO stdout is protocol-only; errors are redacted. Full remote identifiers and live evidence remain below external `CONTENT_OPS_HOME`, while repository reports contain hashes and counts only.

Phase 2B fixes the API origin to `https://open.feishu.cn`, allowlists paths, rejects CLI secrets, keeps tokens in memory, redacts authorization and remote bodies, and uses bounded retries. Production writes need environment opt-in plus CLI confirmation; sandbox writes also need a dedicated folder token. Extra remote data is preserved.

The primary risks are credential leakage, customer-data leakage, implicit external side effects, stale approval, Schema drift, and fabricated success.

Controls include repository secret scanning, sanitized examples, Plugin/runtime separation, Adapter-only external access, version-scoped approval events, deterministic state validation, immutable IDs, idempotency keys, write verification, and traceable errors. Scanner output reports file and rule type without echoing matched secret material.

Production credentials are never written to project manifests, reports, Feishu rows, or Git. No real customer content, images, chats, identifiers, or links belong in this repository.

Version 0.1.0 has no Hooks, `.app.json`, `.mcp.json`, live MCP server, Feishu connection, image provider, publishing integration, or attachment upload.

Phase 2A adds path containment and symlink-escape checks, `0600` atomic runtime files, append-only Journal integrity hashes, non-secret registry validation, redacted event summaries, and explicit Mock/Production separation. The CLI refuses to create a default Home and never accepts fixture workflows as production capability. Recovery preserves prior files and blocks on Journal corruption.

Runtime Evidence records only allowlisted versions, platform/architecture labels, timestamps, relative report paths, command names, and exit codes. It never stores environment dumps, stdout/stderr bodies, absolute personal paths, credentials, or project data. Runtime evidence collection installs and downloads nothing.

# Browser Renderer controls

The Renderer uses a managed Chromium, isolated context, strict CSP, blocked network, no login/profile/extensions/downloads and no arbitrary HTML/CSS/JS/navigation surface. Output and cache paths are controlled outside Plugin Root; evidence is sanitized and contains no executable/font absolute path.
