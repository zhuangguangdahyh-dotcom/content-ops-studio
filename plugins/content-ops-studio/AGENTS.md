# Plugin runtime instructions

1. Never save customer runtime data in the Plugin root.
2. Treat the Plugin installation as read-only; write runtime data only under `CONTENT_OPS_HOME`.
3. Every Skill follows the shared execution protocol and state machine.
4. Skills never construct Feishu HTTP requests.
5. Access external services only through an Adapter or MCP boundary.
6. Keep `SKILL.md` focused and place shared detail in `references/`.
7. Do not copy a complete state machine into multiple Skills.
8. Do not maintain conflicting Schema sources of truth.
9. Never automatically modify industry packs, platform packs, or core Skills.
10. Version 0.2.0 is the current release. If a required Adapter, Schema, or tool is not implemented, return `BLOCKED`; never fabricate completion.
11. Version 0.2.0 supports Node.js 24 LTS only (`>=24 <25`). Node 20 is EOL/unsupported; Node 22/25/26 are unclaimed until real project evidence exists.
12. Local Runtime or offline Feishu readiness never implies live Workspace, image, Renderer, attachment, publishing, or MCP production readiness.

Runtime-critical rules also live in each Skill and the shared references because development-scoped instructions are not sufficient after installation.
