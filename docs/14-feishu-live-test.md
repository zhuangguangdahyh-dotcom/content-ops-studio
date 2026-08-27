# Feishu live sandbox test

Lark CLI live evidence and Direct Adapter live evidence are independent. A user OAuth authorization gate is `AWAITING_USER_AUTHORIZATION`, not failure and never PASSED. No test Base is deleted automatically.

The live harness is explicit, uses fictional data, and is not part of `pnpm test`, `pnpm check`, or ordinary CI. It requires all four credential/gate variables, an absolute `CONTENT_OPS_HOME`, and CLI confirmation:

```bash
CONTENT_OPS_ENABLE_LIVE_FEISHU=1 pnpm feishu:live-test -- --confirm-live-write
```

The harness creates `ContentOpsStudio｜Phase2B测试｜RUN-ID`, provisions 4 tables, stages 141 fields and 5 relations, creates the four named Blueprint views, writes a pending fictional project draft, read-verifies it, fills an intentionally omitted safe field as an add-only repair, and replays provisioning to check duplicate protection. It stores complete identifiers only under `CONTENT_OPS_HOME`; output/repository evidence contains hashes.

Without complete configuration or CLI confirmation it returns `NOT_CONFIGURED`, performs zero writes, and does not claim pass. The test Base is never automatically deleted. The Operator must inspect and manually remove it when evidence is no longer needed; `manual_cleanup_required` remains true.
