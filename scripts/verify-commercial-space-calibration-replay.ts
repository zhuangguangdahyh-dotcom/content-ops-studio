import { createHash } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const mode = process.argv[2];
if (mode !== "--capture" && mode !== "--verify") throw new Error("Use --capture or --verify.");
const home =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br2";
const runRoot = path.join(
  home,
  "projects/CAL-COMMERCIAL-SPACE-001/runs/RUN-20260826-131500-CAL2/image-production",
);
const relativeFiles = [
  "cover-concepts/candidate-A-full.png",
  "cover-concepts/candidate-A-310x414.png",
  "cover-concepts/candidate-A-186x248.png",
  "cover-concepts/candidate-B-full.png",
  "cover-concepts/candidate-B-310x414.png",
  "cover-concepts/candidate-B-186x248.png",
  "cover-concepts/candidate-C-full.png",
  "cover-concepts/candidate-C-310x414.png",
  "cover-concepts/candidate-C-186x248.png",
  "contact-sheets/cover-concepts-full-contact-sheet.png",
  "contact-sheets/cover-concepts-310-contact-sheet.png",
  "contact-sheets/cover-concepts-186-contact-sheet.png",
];
const hashes: Record<string, string> = {};
for (const relativeFile of relativeFiles) {
  hashes[relativeFile] = createHash("sha256")
    .update(await readFile(path.join(runRoot, relativeFile)))
    .digest("hex");
}
const baselineFile = path.join(runRoot, "deterministic-replay-baseline.json");
const reportFile = path.join(runRoot, "deterministic-replay-report.json");
if (mode === "--capture") {
  const temporary = `${baselineFile}.tmp-${process.pid}`;
  await writeFile(
    temporary,
    `${JSON.stringify({ environment: "Playwright Chromium 151 controlled cache", hashes }, null, 2)}\n`,
    { mode: 0o600 },
  );
  await rename(temporary, baselineFile);
  process.stdout.write(
    `${JSON.stringify({ status: "CAPTURED", asset_count: relativeFiles.length })}\n`,
  );
} else {
  const baseline = JSON.parse(await readFile(baselineFile, "utf8")) as {
    environment: string;
    hashes: Record<string, string>;
  };
  const mismatches = relativeFiles.filter(
    (relativeFile) => baseline.hashes[relativeFile] !== hashes[relativeFile],
  );
  const report = {
    status: mismatches.length ? "FAILED" : "PASSED",
    environment: baseline.environment,
    asset_count: relativeFiles.length,
    matching_count: relativeFiles.length - mismatches.length,
    mismatches,
    hashes,
    verified_at: "2026-08-26T05:30:00.000Z",
  };
  const temporary = `${reportFile}.tmp-${process.pid}`;
  await writeFile(temporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o600 });
  await rename(temporary, reportFile);
  if (mismatches.length) throw new Error("CALIBRATION_DETERMINISTIC_REPLAY_FAILED");
  process.stdout.write(`${JSON.stringify(report)}\n`);
}
