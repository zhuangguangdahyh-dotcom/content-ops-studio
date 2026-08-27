# Stage 11 Pack Inspection Report

Status: `PASSED`

## Canonical artifact

- Version: `0.1.0`
- Filename: `content-ops-studio-0.1.0.tgz`
- Packed files: 489
- Package size: 1,897,198 bytes
- SHA-256: `3f478f1d3d9b6abb9cab32f276f3e939d006d098e1aa74bb1bbb2c9a9334e44a`
- Canonical content fingerprint: `2fe01c2dd1126e37b9f46d5e3de385e0675451725bc5b8f247dfa5ac73de6702`

## Repeatability

Two independent `pnpm pack` operations used repository-external staging directories. File-list equality, canonical content equality and archive-byte equality all passed. The second archive SHA-256 equals the canonical artifact SHA-256.

## Inclusion and exclusion

- Required release files present: 12/12
- Strict schemas: 158
- Generated TypeScript files: 159, including the generated index
- Skills: 8
- Forbidden package files: 0
- First-party license: MIT
- Third-party Playwright Core license: Apache-2.0, retained with notices
- `node_modules`, tests, reports, scripts, runtime Project Homes, browser caches, logs and local environment files are excluded.

Machine-readable evidence: `reports/verification/stage-11-pack-inspection.json`.
