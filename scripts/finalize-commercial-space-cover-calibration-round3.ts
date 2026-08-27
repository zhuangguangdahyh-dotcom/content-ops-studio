import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ImageProductionRuntime } from "../packages/runtime/src/image-production/index.js";

if (!process.argv.includes("--confirm-actual-visual-pass"))
  throw new Error("CALIBRATION_R3_ACTUAL_VISUAL_CONFIRMATION_REQUIRED");

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const schemaRoot = path.join(repositoryRoot, "plugins/content-ops-studio/schemas/1.0");
const projectHome =
  process.env.CONTENT_OPS_HOME ??
  "/Users/zhuangguangda/Desktop/content-ops-studio-runtime-phase4br22";
const projectId = "CAL-COMMERCIAL-SPACE-001";
const contentId = "C-9001";
const runId = "RUN-20260826-164000-CR06";
const at = "2026-08-26T08:46:00.000Z";
const imageRoot = path.join(projectHome, "projects", projectId, "runs", runId, "image-production");
const runtime = new ImageProductionRuntime({ projectHome, projectId, runId, schemaRoot });

type CandidateEvidence = {
  candidate_id: string;
  full_preview_ref: string;
  full_checksum: string;
  [key: string]: unknown;
};

type CandidateSetEvidence = {
  candidates: CandidateEvidence[];
  contact_sheets: { full: string; thumbnail_310: string; thumbnail_186: string };
  candidate_set_diversity_score: number;
  [key: string]: unknown;
};

type SpatialReport = {
  report_id: string;
  candidate_id: string;
  visual_spatial_qa_result: string;
  [key: string]: unknown;
};

function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function writeOnce(file: string, value: unknown): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const encoded = `${JSON.stringify(value, null, 2)}\n`;
  try {
    await writeFile(file, encoded, { encoding: "utf8", mode: 0o600, flag: "wx" });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
    if ((await readFile(file, "utf8")) !== encoded)
      throw new Error(`CALIBRATION_R3_FINAL_EVIDENCE_CONFLICT:${file}`, { cause: error });
  }
}

const candidateSet = JSON.parse(
  await readFile(path.join(imageRoot, "calibration-round3-candidate-set.json"), "utf8"),
) as CandidateSetEvidence;
if (candidateSet.candidates.length !== 2)
  throw new Error("CALIBRATION_R3_FINAL_CANDIDATE_COUNT_INVALID");

for (const candidate of candidateSet.candidates) {
  const full = path.join(projectHome, candidate.full_preview_ref);
  if (sha256(await readFile(full)) !== candidate.full_checksum)
    throw new Error(`CALIBRATION_R3_FINAL_CHECKSUM_CONFLICT:${candidate.candidate_id}`);
  const letter = candidate.candidate_id.endsWith("-G") ? "G" : "H";
  const prior = (await runtime.read(`TSIR-CAL-SPACE-001-${letter}.json`)) as SpatialReport | null;
  if (!prior || prior.visual_spatial_qa_result !== "PENDING")
    throw new Error(`CALIBRATION_R3_SPATIAL_REPORT_STATE_INVALID:${letter}`);
  await runtime.write(
    "typography-spatial-integrity-report",
    `TSIR-CAL-SPACE-001-${letter}-ACTUAL.json`,
    {
      ...prior,
      report_id: `TSIR-CAL-SPACE-001-${letter}-ACTUAL`,
      visual_spatial_qa_result: "PASS",
      result: "PASS",
      visual_quality_eligible: true,
      created_at: at,
    },
  );
}

const inspections = [
  {
    candidate_id: "CCC-CAL-SPACE-001-G",
    actual_pixel_result: "PASS",
    verified: [
      "no text-text overlap or visual region collision",
      "no graphic occlusion or clipped glyph",
      "title and supporting copy remain clearly grouped",
      "186x248 title remains recognizable",
    ],
    retained_aesthetic_risk:
      "The pale translucent editorial field is intentionally large and requires Operator taste judgment; it is not a spatial defect or saved template.",
  },
  {
    candidate_id: "CCC-CAL-SPACE-001-H",
    actual_pixel_result: "PASS",
    verified: [
      "no text-text overlap or visual region collision",
      "the semantic unit 入口 remains on one supporting-copy line",
      "title remains the only primary visual entry",
      "186x248 title remains recognizable",
    ],
    retained_aesthetic_risk:
      "The road-surface negative-space placement is restrained and legible but gives the cover a cooler, more austere tone.",
  },
] as const;

await writeOnce(path.join(imageRoot, "actual-visual-inspection-final.json"), {
  status: "PASS_PENDING_OPERATOR",
  inspection_order: [
    "MECHANICAL_GEOMETRY",
    "TYPOGRAPHY_SPATIAL_INTEGRITY",
    "TYPOGRAPHIC_BREATHING_ROOM",
    "ACTUAL_PIXEL_VISUAL_SPATIAL_QA",
    "VISUAL_QUALITY_ACCEPTANCE",
  ],
  inspected_assets: candidateSet.candidates.map((candidate) => candidate.full_preview_ref),
  contact_sheets: Object.values(candidateSet.contact_sheets),
  candidates: inspections,
  hard_blocks: [],
  run_id: runId,
  inspected_at: at,
});

await writeOnce(path.join(imageRoot, "calibration-round3-final-evidence.json"), {
  candidate_set_id: "CCCS-CAL-SPACE-001-R3",
  project_id: projectId,
  content_id: contentId,
  status: "AWAITING_USER_SELECTION",
  candidates: candidateSet.candidates.map((candidate) => ({
    ...candidate,
    visual_spatial_qa: "PASS",
    actual_pixel_qa: "PASS",
  })),
  contact_sheets: candidateSet.contact_sheets,
  candidate_set_diversity_score: candidateSet.candidate_set_diversity_score,
  f_regression_detection: "PASS",
  round_1_preserved: true,
  round_2_preserved: true,
  round_3_generated: true,
  formal_fpv_count: 0,
  g4_count: 0,
  style_lock_count: 0,
  remaining_pages_created: 0,
  feishu_write_count: 0,
  project_visual_profile_mutated: false,
  industry_pack_mutated: false,
  run_id: runId,
  finalized_at: at,
});

process.stdout.write(
  `${JSON.stringify({ status: "AWAITING_USER_SELECTION", typography_spatial_integrity: "PASSED", typography_breathing_room: "PASSED", f_regression_detection: "PASSED", candidate_set_diversity_score: candidateSet.candidate_set_diversity_score, candidates: inspections, formal_fpv_count: 0, g4_count: 0, style_lock_count: 0, feishu_write_count: 0 })}\n`,
);
