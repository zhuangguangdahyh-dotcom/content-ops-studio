# ADR-0034: First-Page G4 and Style Lock

Status: Accepted. Date: 2026-08-25.

## Decision

Each render has an immutable First-Page Version. A detailed Review is local evidence; the formal Approval Event is the state-machine authority. G4 binds Content/Copy/Visual/First-Page versions, asset checksum, Renderer Environment and approval source. Runtime may create Style Lock only after an explicit current G4 APPROVE.

Style Lock binds the approved asset and checksum, environment, canvas/safe area, typography/resolved fonts, colors, grid, image treatment, layout, brand/page rules and approval. G4 does not generate pages 2–6. REJECT retains all history; REVISE creates a new First-Page Version. Page/global direction changes return to Visual Plan Revision; copy changes return to Content Revision.
