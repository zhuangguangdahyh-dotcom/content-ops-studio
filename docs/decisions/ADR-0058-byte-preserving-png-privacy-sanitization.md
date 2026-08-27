# ADR-0058: Byte-preserving PNG privacy sanitization and managed export

- Status: Accepted
- Date: 2026-08-27

## Decision

Finalization always removes privacy-bearing PNG chunks `caBX`, `eXIf`, and `tIME`; textual `tEXt`, `zTXt`, and `iTXt` chunks are removed only when their metadata matches privacy provenance. Non-private text is preserved. The Runtime parses every chunk, validates bounds and CRC, copies all retained chunk bytes verbatim, and proves that IHDR dimensions/bit depth/color type and the concatenated compressed IDAT byte stream are unchanged. It never decodes or re-encodes pixels.

The immutable Final Manifest and G5 continue to bind the original approved source checksums. Delivery records the sanitized checksums and a strict `png-metadata-sanitization-report`. An explicit MCP export action copies only the sanitized final pages to a managed leaf below an Operator-specified absolute directory.

## Consequences

- A malformed PNG, bad CRC, trailing bytes, changed source checksum or changed IDAT stream fails closed.
- Candidate, historical and source assets are not modified.
- Export cleanup can delete only Plugin-owned temporary files and stale final-page names inside a matching marker-owned export leaf; unknown user files are preserved.
- ImageGen, Renderer, Feishu and attachment-upload calls remain zero in Finalization.
