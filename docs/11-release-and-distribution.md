# Release and distribution

Version `0.1.0` is the repository's defined first locally installable V1 and is frozen across root package, workspace packages and Plugin metadata. The supported Runtime remains Node.js `>=24 <25`. The release package contains the read-only Plugin, bundled STDIO MCP, strict Schemas/configs, Skills/references, generated contracts and Operator documentation. It excludes dependencies, browsers, Project Homes, runtime output, reports, caches, secrets and historical raster evidence.

Stage 11 requires an actual pack inspection, repository-external clean install, installed Plugin validation, installed deterministic V1 E2E, cross-platform static checks, security/privacy/path scans and full `pnpm check`. Artifact byte determinism is claimed only if observed; canonical file-list/content fingerprint stability is always verified.

Version `0.1.0` is licensed under MIT and authorized for public GitHub distribution. The checked-in release workflow validates a tag but does not publish; repository creation, push and GitHub Release publication are explicit Operator-authorized release operations.

Public HTTP MCP, universal directory submission and automatic publishing are not part of V1. They require separate authentication, availability, monitoring, privacy and public-review work.

Feishu final metadata sync remains `PARTIAL`, while attachment upload remains `DEFERRED`. These boundaries do not block local Finalization or local package readiness.
