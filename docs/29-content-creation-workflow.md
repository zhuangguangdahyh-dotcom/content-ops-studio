# Content Creation Workflow

Phase 3B turns one `PAINPOINT_CONFIRMED` record into one evidence-grounded Content Package. It does not perform research, visual planning, image generation, rendering or publishing.

The deterministic sequence is: read Project/Profile/Rules/Platform Pack/Industry Pack/Painpoint/Evidence; produce at least three angle candidates; select one angle and one structure; resolve 4–8 pages; classify every claim; run exact and assessed near-semantic duplication checks; score the fixed quality gate; compile one Feishu Content row; update the primary Painpoint to `PAINPOINT_CONTENT_IN_PROGRESS`; read-verify both records; then stop at G3 `CONTENT_COPY`.

One Content has exactly one primary Painpoint, one core problem and one core viewpoint. One Painpoint may have multiple Contents only when each alternate has a materially different angle or conclusion. G3 approval is explicit and version-bound; even approval does not start Visual Planning automatically.

Runtime data stays under the external `CONTENT_OPS_HOME`. Every write uses a Run ID, idempotency key, pre-write lookup, read-after-write verification, Write Log and Checkpoint. Partial success is resumed additively; no remote record is deleted as rollback.

After explicit G3 approval, the exact frozen pages may become a Visual Planning input. The visual phase cannot alter copy or page count; overflow or structural change returns here as a new Content Revision and requires a new G3.
