# Formal Visual Planning workflow

Phase 4A accepts only current G3-approved copy. The bounded sequence is Doctor → context → direction candidates → Host-authored Visual System/Page Plans/references/assets/layout/quality → local submit → explicit Feishu finalize → read verification → First-Page Handoff. Copy and page count never change; image generation, G4 and Style Lock never run.

Runtime stores every artifact under external `CONTENT_OPS_HOME`, checks exact versions/hashes, journals the bounded update, verifies protected Content fields and checkpoints `FIRST_PAGE_HANDOFF_READY`. Replay with the same key/input performs zero updates; conflicting input blocks.

# Production handoff consumer

Phase 4B consumes the current Handoff without changing VV-1. Text Layers, canvas, safe area, typography/color tokens, asset strategy and negative constraints are immutable Renderer inputs. A change to page/global direction must return to Visual Plan Revision.

Direction Candidates may inspect VV-1 but cannot mutate it. An explicit Candidate selection produces a separate Selection Artifact; only the next Visual Planning operation may create VV-2. Candidate generation never produces FPV-2, G4, Style Lock or formal Workspace state.
