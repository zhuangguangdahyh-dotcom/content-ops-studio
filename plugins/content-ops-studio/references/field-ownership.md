# Field and side-effect ownership

- Create Feishu Base and tables → `project-initialization`.
- Create painpoint records → `painpoint-research`.
- Create content records → `content-creation`.
- Create visual plans → `visual-planning`.
- Create images and Style Locks → `image-set-production`.
- Finalize and synchronize attachments → `content-finalization`.
- Create rule/feedback records → `project-learning`.
- Write human approval state → `content-studio-router`.

Phase 1B artifact ownership:

- Visual System and Page Visual Plans → `visual-planning`.
- Generation Manifests and Style Lock → `image-set-production`.
- Render Reports, QA Reports, and Final Manifests → `content-finalization`.
- G4/G5 approval events → `content-studio-router` only.
- Asset bytes and checksums → Adapter/Asset Store boundary; Skills receive references and never fabricate files.

Immutable after creation: project ID, painpoint ID, content ID, rule-feedback ID, record unique key, and creation time.

System-maintained: title character count, content fingerprint, produced-content count, Schema version, last run ID, and last update time.

Operator-owned: notes, human supplemental explanation, and manually revised content. Automated work must not overwrite Operator-owned fields.

Feishu `logicalKey` is stable ownership identity, `field_id` is remote identity, and `field_name` is mutable display state. Renames refresh mappings only. Extra remote fields and Operator-owned values are preserved; conflicting field types block rather than update.

Runtime-owned local fields include Run Plan cursors, Journal hashes, checkpoint heads, write attempts, lock leases, idempotency snapshots, and Mock IDs. Pack source files and core Skills remain maintainer-owned and are never automatically modified by Runtime. The Operator remains the source of approval decisions; Runtime only validates and records them.
