import { access, readFile } from "node:fs/promises";
import path from "node:path";

const required = [
  "docs/research/feishu-openapi-snapshot-2026-08-24.md",
  "docs/13-feishu-app-setup.md",
  "docs/14-feishu-live-test.md",
  "docs/15-feishu-troubleshooting.md",
  "docs/decisions/ADR-0015-feishu-auth-and-transport.md",
  "docs/decisions/ADR-0016-feishu-provisioning-and-reconciliation.md",
  "docs/decisions/ADR-0017-feishu-field-identity-and-record-writes.md",
  "docs/decisions/ADR-0018-live-feishu-write-gates.md",
];
for (const file of required) await access(path.resolve(file));
const snapshotFile = required[0];
if (!snapshotFile) throw new Error("Feishu snapshot path is missing.");
const snapshot = await readFile(path.resolve(snapshotFile), "utf8");
for (const fact of [
  "tenant_access_token/internal",
  "field-name payload",
  "default_table_id",
  "1,000",
  "UNKNOWN_REQUIRES_RUNTIME_CONFIRMATION",
])
  if (!snapshot.includes(fact)) throw new Error(`Feishu snapshot omits ${fact}.`);
console.log(`Feishu documentation passed: ${required.length} required files.`);
