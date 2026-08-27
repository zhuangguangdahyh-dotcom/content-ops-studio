# Architecture difference report

## DEV-001: Repo marketplace category

- Original requirement: use a marketplace entry without `category`.
- Actual implementation: added `"category": "Productivity"`.
- Reason: current official OpenAI repo-marketplace examples and the installed Plugin Creator contract require category on generated entries.
- Official-spec driven: yes.
- Risk: low; the field only supplies marketplace presentation metadata.
- Follow-up: retain the field unless current official validation removes or changes the requirement.

## DEV-002: TypeScript script launcher

- Original requirement: package scripts invoke `tsx scripts/<name>.ts`.
- Actual implementation: package scripts invoke `node --import tsx scripts/<name>.ts` while keeping all public `pnpm <script>` commands unchanged.
- Reason: the `tsx` CLI creates an IPC socket that the managed local sandbox rejects with `EPERM`; the Node import hook executes the same TypeScript files without that IPC server.
- Official-spec driven: no; environment compatibility.
- Risk: low; Node.js 20+ supports `--import`, and CI/public commands remain unchanged.
- Follow-up: retain unless the managed sandbox later permits the `tsx` CLI or the repository adopts a compile-before-run script flow.

## DEV-003: Installed legacy Plugin validator disagreement

- Original requirement: prefer the current official minimum manifest and omit unverified publisher/interface fields.
- Actual implementation: retained the official four-field manifest (`name`, `version`, `description`, and `skills`).
- Reason: current official OpenAI documentation presents this exact minimal structure, while the locally installed Plugin Creator Python validator additionally requires `author` and `interface`. Adding those fields would contradict the task boundary and current official minimum.
- Official-spec driven: yes.
- Risk: the bundled legacy validator reports two errors, but the repository validator and current official structure validation pass.
- Follow-up: re-run the bundled validator after its schema is updated; do not add publication metadata until a later authorized release phase.

No other material architecture deviations are known at bootstrap construction time.
