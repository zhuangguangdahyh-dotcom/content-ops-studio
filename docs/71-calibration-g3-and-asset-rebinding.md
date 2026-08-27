# Calibration G3 and existing-asset rebinding

For fictional local `CAL-*` projects, a Content Package G3 approval is valid only for the exact Package ID, Package SHA-256, Content Fingerprint, Quality Report, pending Review Request, Source Run and Page Count. A different Package hash cannot reuse the approval.

After G3, the Version Allocator selects the next `VV-*` and `FPV-*`. An already approved PNG may be reused only when current Page 1 copy, promise, role and intent are equivalent; the PNG exists at the expected 1242 by 1660 canvas; its SHA-256 is unchanged; its attention strategy is still suitable; Universal Calibration remains valid; and no current Cover constraint conflicts.

Reuse creates a new logical First Page and Asset binding. It never rewrites the historical FPV Manifest. The new binding records `REUSED_VERIFIED_ASSET`, the source Asset and path, the unchanged checksum and a new 21-check current-version QA binding. Historical QA may be used as computation evidence, but every result is explicitly rebound to the current Content, Copy, Visual Plan, First Page and Asset identity.

The resulting G4 request remains `AWAITING_USER_APPROVAL / PENDING_OPERATOR`. It authorizes neither a Style Lock nor remaining-page production. Calibration remains local-only with `production_workspace_write_eligible=false`; Renderer, ImageGen and Feishu write counts remain zero.
