# Workflow

Context → plan → host/manual source acquisition → structured source submission → source normalization/hash dedup → evidence validation → host semantic analysis → candidate submission → deterministic score/identity/evidence checks → report → confirmed idempotent Feishu write → read verification → G2 pause → item review artifact → generic G2 approval → remote status update → read verification.

Host-native mode never performs network work inside the Adapter. Manual mode accepts HTTPS locations or project-relative artifacts. Fixture mode is test-only and cannot be selected in Production.
