# ADR-0057: Feishu default-field cleanup and Chinese display contract

- Status: Accepted
- Date: 2026-08-27

## Decision

Workspace Blueprint `1.1.0` keeps stable English `logicalKey` and option `code` values for programmatic identity, while every Feishu-visible field label and predefined option label is Chinese. Column order is part of the Blueprint: Project Config begins with 项目名称、所属行业、细分领域、目标客户画像; Painpoints begins with 痛点名称、痛点ID; Contents begins with 内容主题、内容ID、发布标题、发布正文.

During a newly created Base provisioning Run only, the provisioner may delete Feishu's exact seeded auxiliary fields `单选` (type 3), `日期` (type 5), and `附件` (type 17) from the exact persisted default table. It must verify the primary field ID, require an unambiguous name/type match, persist each completed operation and read-verify absence.

## Consequences

- Existing workspaces are not silently reordered or destructively migrated.
- Add-only repair remains add-only; it never deletes an extra or user-created field.
- Renamed fields, type mismatches, duplicate matches and primary fields are never deleted.
- Existing workspaces may adopt Chinese labels through an explicit, separately reviewed migration with read-after-write evidence.
- Internal codes remain stable and are translated to Chinese only at the Feishu display boundary.
