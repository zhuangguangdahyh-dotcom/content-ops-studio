# Security policy

## Local MCP boundary

The bundled MCP exposes only fifteen user-goal tools with strict unknown-key rejection and accurate read/write annotations. No delete, shell, arbitrary file, raw Lark/Feishu, credential or risk-control tool exists. Write tools require explicit confirmation plus an idempotency/request key and current plan/version binding. STDIO stdout is protocol-only and structured errors are redacted.

## Official Lark CLI boundary

The default Workspace path never receives App Secrets or tokens. The official CLI owns browser OAuth and system-keychain storage. Content Ops Studio uses argv-only subprocess execution, a closed non-delete allowlist, strict JSON normalization, timeouts, cancellation and redaction. Official risk controls must not be disabled.

## Feishu Phase 2B

`FEISHU_APP_SECRET` is accepted only from a credential provider, never a CLI flag or repository file. Tenant tokens are process-memory only. API origin and paths are allowlisted, errors/log events are redacted, retries are bounded, and writes require both `CONTENT_OPS_ENABLE_LIVE_FEISHU=1` and `--confirm-live-write`. Report suspected credential exposure by rotating the app secret before sharing redacted diagnostics.

Do not commit credentials, customer material, private media, or runtime project data. Credentials may eventually come only from environment variables, operating-system secure storage, or an Operator-connected MCP integration.

Report suspected exposure privately to the repository owner. Rotate exposed credentials before cleaning history. Do not paste secret values into issues, reports, tests, or scanner output.

Phase 3A permits bounded public-source summaries through a Host-native Research bridge and painpoint records through the existing official Lark CLI Workspace Adapter. The MCP server has no generic search, fetch, browser, shell, arbitrary file, delete or raw Feishu tool. Full page bodies, restricted sources, secrets and real customer material remain forbidden.

Phase 3B Content tools accept only strict identifiers, hashes, bounded copy artifacts and explicit approval inputs. They expose no shell, raw Feishu, delete, secret or generic network surface. Unsupported factual Claims, fabricated cases, high duplication and stale G3 versions are blocking failures. Remote identifiers remain hashed in repository evidence.

Phase 4A Visual tools bind exact approved copy/version/hash and expose only one bounded remote update path. Allowed Content fields are background direction, visual summary/version, `VISUAL_PLANNING`, Run and timestamp; copy, Painpoint, image, first-page, final and sync fields are read-verified unchanged. Planned assets cannot be reported as generated, and no image/G4/Style Lock/delete/raw-Feishu tool exists.

Version 0.2.0 includes bounded Host ImageGen handoff and production rendering, but remains blocked as a complete production integration because Feishu attachment upload and automatic publishing are not implemented.

# Renderer security boundary

The Production Renderer accepts structured contracts, not arbitrary HTML, CSS, JavaScript, URLs, navigation targets, browser arguments or executable paths. It escapes Text Layers, uses a closed component/property set, applies CSP, aborts network requests, disables downloads and service workers, and launches an isolated Playwright-managed Chromium context without profiles, cookies or extensions. Browser bytes live outside immutable Plugin Root. Renderer errors and evidence never expose browser paths, environment dumps, font files or remote identifiers.

# Host ImageGen security boundary

The Host bridge requests no API key and exposes no image API, arbitrary URL download, shell, browser, or generic file MCP tool. It accepts only an existing local PNG/JPEG/WebP handoff, rejects temporary URLs and unsafe destinations, materializes atomically under Project Home, verifies bytes and checksum, and never falls back to Mock in Production.
