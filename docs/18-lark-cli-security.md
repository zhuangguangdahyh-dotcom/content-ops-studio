# Official Lark CLI security boundary

`LarkCliRunner` invokes only the configured executable with `spawn(binary, argv, {shell:false})`. User and remote text can occupy data arguments but cannot select commands. Timeout and cancellation are mandatory, stdout and stderr stay separate, and persisted diagnostics are redacted.

Allowed operations cover configuration/login/status/scope/schema probes and the non-delete Base create/read/update commands required by the Blueprint. Delete commands, arbitrary raw API, shell/eval/rm, Secret arguments and `config risk-control off` are rejected. Field PUT is only used by the narrow default-primary-field adoption path: the current field is read first, the official high-risk confirmation is explicit, and the result is read back. Ordinary Repair never changes a conflicting field type.

The Runtime does not read keychain content, persist tokens, copy official auth files or log authorization headers. OAuth URLs and device codes are ephemeral and never committed. Complete Base/table/field/record identifiers remain under `CONTENT_OPS_HOME`; repository evidence stores only hashes and counts.
