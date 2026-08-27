# Privacy boundary

The MCP bundle is installed under immutable Plugin Root; mutable Runs, mappings, approvals and full remote identifiers belong under Plugin Data or an explicitly configured external `CONTENT_OPS_HOME`. MCP results expose counts and stable project/Run IDs only, never tokens, secrets, keychain content, raw identity data, full remote IDs or CLI stdout/stderr.

The default official CLI path does not read keychain entries, copy authentication files or persist OAuth tokens. Authorization URLs and device codes are ephemeral. Repository evidence contains no remote identifiers; complete identifiers stay only in the Operator's external `CONTENT_OPS_HOME`.

Feishu project identifiers, field maps and provisioning state belong only under the Operator-selected `CONTENT_OPS_HOME`. Repository fixtures and reports use fictional identifiers or hashes. App secrets, access tokens, authorization headers, real Base tokens, private records and full remote error bodies are prohibited from source, fixtures, journals and reports.

The Plugin repository and installation directory are never customer-data stores.

- Feishu is the future source of truth for structured business records, confirmation state, progress, rules, and feedback.
- `CONTENT_OPS_HOME` is the future source of truth for local assets, prompts, manifests, hashes, QA, synchronization logs, and recovery checkpoints.
- Current Operator instructions guide one run but do not automatically become long-term project rules.
- Chat context is not a project database; recovery must reload project configuration, workspace data, effective rules, and run state.

All committed examples are fictional. Phase 3A may store bounded public-source metadata and sanitized summaries under an external Project Home and may write fictional painpoints to an explicitly retained Feishu sandbox. Phase 3B may store fictional Content Packages and full copy only in that external Home and existing sandbox; repository reports contain only sanitized copy/evidence and hashed remote identity. Phase 4A keeps full Workspace mapping and Live evidence only in external `CONTENT_OPS_HOME`; repository evidence uses hashes/counts. It stores references, asset requirements and copy snapshots but no copyrighted full page, secret, arbitrary absolute path or generated-image claim. Complete remote identifiers remain outside the repository. Version 0.2.0 keeps generated/rendered assets outside the Plugin, strips privacy-bearing PNG metadata from delivery bytes without pixel re-encoding, and still performs no attachment upload or automatic publishing.

# Renderer privacy boundary

Rendering is local and network-isolated. The repository stores no output PNG, browser binary, font file, user Home path or complete remote identifier. Project artifacts remain under the Operator-selected external `CONTENT_OPS_HOME`; browser cache remains under Plugin Data or an explicit external cache. Environment evidence records only bounded version/platform/font-family metadata and hashes.

Host-generated images, candidate previews, Project Visual Profiles, feedback and rule history remain external Project Home data. The repository may retain only sanitized hashes, counts, relative references and capability evidence; it does not retain user image bytes, Host temporary URLs, credentials or complete remote identifiers.
