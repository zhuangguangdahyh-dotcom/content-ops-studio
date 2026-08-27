# Tool policy

Use only the eight Content MCP tools plus existing `content_ops_submit_approval`. Context, plan, list, get, verify, and revision plan are read-only. Draft submission is local-only. Finalization and approval are explicit open-world writes with environment and confirmation gates. Never invoke raw Lark CLI from this Skill.
