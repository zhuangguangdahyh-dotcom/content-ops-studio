# Release and distribution

Version `0.2.0` is the current locally installable release; `0.1.0` remains the preserved first V1 release. The version is synchronized across root package, workspace packages, Runtime policy and Plugin metadata. The supported Runtime remains Node.js `>=24 <25`. The release package contains the read-only Plugin, bundled STDIO MCP, strict Schemas/configs, Skills/references, generated contracts and Operator documentation. It excludes dependencies, browsers, Project Homes, runtime output, reports, caches, secrets and historical raster evidence.

Stage 11 requires an actual pack inspection, repository-external clean install, installed Plugin validation, installed deterministic V1 E2E, cross-platform static checks, security/privacy/path scans and full `pnpm check`. Artifact byte determinism is claimed only if observed; canonical file-list/content fingerprint stability is always verified.

Versions `0.1.0` and `0.2.0` are licensed under MIT and authorized for public GitHub distribution. The checked-in release workflow validates a tag but does not publish; repository push and GitHub Release publication remain explicit Operator-authorized release operations.

The `0.2.0` upgrade adds Workspace Blueprint `1.1.0`, Chinese Feishu display labels, safe new-Base default-field cleanup and byte-preserving PNG privacy sanitization. Existing Project Homes and approval history are not rewritten. Installed Plugin migration uses a clean versioned copy; live Base relabeling or column movement requires a separately approved, audited workspace migration because ordinary repair remains add-only.

Public HTTP MCP, universal directory submission and automatic publishing are not part of V1. They require separate authentication, availability, monitoring, privacy and public-review work.

Feishu final metadata sync remains `PARTIAL`, while attachment upload remains `DEFERRED`. These boundaries do not block local Finalization or local package readiness.
