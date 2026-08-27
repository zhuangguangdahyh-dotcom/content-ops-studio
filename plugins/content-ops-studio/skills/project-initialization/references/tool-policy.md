# Tool policy

The Skill calls Runtime and the configured Workspace Adapter; it never builds HTTP, reads secrets, bypasses project locks, or falls back from Production to Mock. DISCOVER and planning are local/read-only. Live writes require both gates. Dry-run, inspect and verify do not write. No DELETE/DROP/destructive replace operations are available. It may hand a confirmed active profile to painpoint research, but it does not itself create painpoints.
