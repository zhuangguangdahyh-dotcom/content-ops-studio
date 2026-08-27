# Feishu templates

`workspace-v1.json` is the machine-readable, fictional four-table Workspace Blueprint. It contains stable logical keys and display metadata but no real Base, table, field, view, URL, or credential values.

Run `pnpm workspace-blueprint:generate-field-map` to derive `config/field-map-template.json`, then `pnpm workspace-blueprint:validate` to validate both files and their cross-file invariants. Do not hand-maintain a second logical-field list.
