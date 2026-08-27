# Host-native ImageGen bridge

The Skill invokes a Host-native image generation capability; MCP never exposes a raw image API. The Operator supplies no API key. A structured request states purpose, prompt, negative constraints, dimensions, destination and the `RENDERER_ONLY` text boundary.

The bridge accepts only a real local file, detects PNG/JPEG/WebP signatures, copies atomically into Project Home, reads it back, calculates SHA-256 and records provider/model only when reported. Temporary URLs are rejected as durable assets. Missing or unsafe results return `HOST_IMAGE_ASSET_UNMATERIALIZABLE`. Production Mock fallback is forbidden.

Formal first-page planning records the materialized raster as `AI_GENERATED_VISUAL`, requires `contains_formal_copy=false` and `contains_remote_url=false`, and binds its checksum before Renderer execution. A native 3:4 Host output may differ from the formal pixel canvas; the Renderer performs the deterministic fit while the formal PNG remains exactly 1242×1660.
