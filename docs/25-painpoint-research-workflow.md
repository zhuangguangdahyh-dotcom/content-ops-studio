# Painpoint Research Workflow

The Research Adapter is a persistence and validation boundary, not a network client. The workflow is Project Profile DISCOVER, Research Plan, Host/manual source acquisition, Source Manifest, Evidence, scored candidates, report, existing-Workspace write, read verification and G2 pause.

- `HostNativeResearchAdapter` accepts source summaries and citations acquired by the Host's native research capability. It never performs network access itself.
- `ManualSourceResearchAdapter` accepts bounded Operator-provided sources or project-relative references.
- `FixtureResearchAdapter` exists only for deterministic tests and is rejected in production mode.

Every Adapter supports capability probing, plan validation, session creation, source normalization, evidence validation, candidate validation, report construction, batch finalization, inspection and recovery. Artifacts are written atomically under the external Project Home and read back after each write.

The Plugin Schema root is explicitly injected when the bundled MCP server runs from the Plugin directory. This prevents repository-relative path assumptions and is covered by a bundled-runtime regression test. A deterministic plan identity permits retrying the same plan even when an observational timestamp changes; a changed semantic plan hash remains a conflict.

Only `PAINPOINT_CONFIRMED` records may feed Phase 3B. Research Evidence and the selected Painpoint version remain bound into the Content Creation Plan; Phase 3B may not silently research a replacement Painpoint or alter G2 decisions.
