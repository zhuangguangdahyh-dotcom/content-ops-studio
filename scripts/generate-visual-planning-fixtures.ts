import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaCatalog } from "../packages/contracts/src/schema-catalog.js";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";

const root = path.resolve("tests/fixtures/contracts/1.0");
const projectId = "PRJ-20990101-DEMO";
const contentId = "C-0001";
const runId = "RUN-20990101-010203-DEMO";
const at = "2099-01-01T01:02:03.000Z";
const hash = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value).normalize("NFKC")).digest("hex");
const visualSystem = JSON.parse(
  await readFile(path.join(root, "visual-system/valid/complete.json"), "utf8"),
) as Record<string, unknown>;
const pages = visualSystem.pages as Array<Record<string, unknown>>;
const pageHashes = pages.map((page) => ({
  page_number: page.page_number,
  copy_hash: hash(page.copy_snapshot),
}));
const context = {
  visual_context_id: "VCTX-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  content_status: "COPY_APPROVED",
  content_version: "CV-1",
  copy_version: "CV-1",
  g3_approval_id: "APR-G3-DEMO-001",
  g3_target_version: "CV-1:CV-1",
  content_package_ref: "projects/demo/content/C-0001/content-package.json",
  content_package_hash: hash(pages.map((page) => page.copy_snapshot)),
  page_copy_hashes: pageHashes,
  project_profile_version: 1,
  project_visual_preferences: ["restrained editorial"],
  project_content_style: ["decision guide"],
  project_expression_tone: ["professional"],
  active_project_rules: ["Use approved copy only"],
  rejected_directions: ["fake certification"],
  platform_pack: { id: "xiaohongshu-image-post", version: "1.0.0" },
  industry_pack: { id: "generic-professional-services", version: "1.0.0" },
  historical_visual_plans: [],
  approved_style_refs: [],
  available_project_assets: [],
  available_evidence_assets: [],
  visual_constraints: ["No generated Chinese body copy"],
  user_overrides: [],
  capability_snapshot: {
    programmatic_graphics: true,
    image_generation: false,
    renderer: false,
    attachment_upload: false,
  },
  ready_for_visual_planning: true,
  blocking_reasons: [],
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const candidates = [
  ["A", "EDITORIAL_SERIES", "Restrained editorial series", 92],
  ["B", "EVIDENCE_LED", "Evidence card series", 70],
  ["C", "MIXED", "Editorial and evidence mix", 78],
].map(([id, mode, name, score]) => ({
  candidate_id: `VDC-${id}-001`,
  visual_mode: mode,
  direction_name: name,
  direction_summary: `${name} for a fictional decision guide.`,
  content_fit: "Fits the page task.",
  industry_fit: "Fits professional services.",
  platform_fit: "Fits 3:4 image posts.",
  project_fit: "Matches restrained project rules.",
  asset_feasibility: "Executable without unavailable assets.",
  text_density_fit: "Supports readable hierarchy.",
  background_strategy: "Warm white with blue-gray structure.",
  typography_strategy: "System Chinese sans-serif stack.",
  color_strategy: "Warm white, charcoal and muted blue-gray.",
  layout_strategy: "Generous spacing and page-specific cards.",
  evidence_strategy: "Do not fabricate evidence.",
  strengths: ["Deterministic"],
  limitations: ["Planning evidence only"],
  blocking_risks: [],
  score,
}));
const decision = {
  visual_direction_decision_id: "VDD-DEMO-001",
  visual_context_id: context.visual_context_id,
  candidates,
  selected_candidate_id: "VDC-A-001",
  selection_rationale: "Best fidelity and feasibility.",
  user_fixed_mode: null,
  user_fixed_direction: null,
  user_rejected_modes: [],
  user_rejected_directions: ["fake certification"],
  industry_mode_preferences: ["EDITORIAL_SERIES"],
  platform_constraints: ["3:4 portrait"],
  asset_feasibility: ["Programmatic graphics available"],
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const references = {
  visual_reference_manifest_id: "VRM-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  references: [],
  reference_count: 0,
  reference_type_counts: {},
  approved_count: 0,
  rejected_count: 0,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const assetPages = pages.map((page) => ({
  page_number: page.page_number,
  page_role: page.page_role,
  asset_source_strategy: "PROGRAMMATIC_GRAPHIC",
  asset_purpose: "Support the approved page task.",
  asset_description: "Abstract editorial structure only.",
  required_assets: ["Renderer-built vector structure"],
  optional_assets: [],
  reference_asset_ids: [],
  generation_required: false,
  programmatic_render_required: true,
  evidence_asset_required: false,
  aspect_ratio: "3:4",
  composition: page.composition,
  subject: null,
  environment: null,
  camera_direction: null,
  lighting_direction: null,
  material_direction: null,
  prohibited_content: [
    "people",
    "fake certificates",
    "logos",
    "Chinese text in generated background",
  ],
  informational_text_in_background_allowed: false,
  fallback_strategy: "Use typography and simple geometry only.",
}));
const assets = {
  asset_requirements_plan_id: "ARP-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  pages: assetPages,
  global_asset_rules: ["Renderer owns final Chinese copy"],
  shared_assets: ["Design tokens"],
  unresolved_assets: [],
  generation_required_count: 0,
  programmatic_graphic_count: pages.length,
  project_asset_count: 0,
  evidence_asset_count: 0,
  no_asset_count: 0,
  ready_for_first_page: true,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const pageResults = pages.map((page) => {
  const copy = page.copy_snapshot as { headline: string; body: string; supporting_text: string };
  const counts = [copy.headline.length, copy.body.length, copy.supporting_text.length];
  return {
    page_number: page.page_number,
    page_role: page.page_role,
    headline_codepoints: counts[0],
    body_codepoints: counts[1],
    supporting_codepoints: counts[2],
    total_codepoints: counts.reduce((a, b) => a + b, 0),
    estimated_density: "LOW",
    estimated_line_count: 4,
    available_text_regions: 1,
    typography_token_refs: ["TYPO-TITLE"],
    safe_area_fit: true,
    max_lines_fit: true,
    hierarchy_fit: true,
    contrast_feasibility: true,
    overflow_strategy: "REFLOW",
    status: "PASS",
    warnings: [],
    blocking_reason: null,
  };
});
const layout = {
  layout_feasibility_report_id: "LFR-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  page_results: pageResults,
  total_pages: pages.length,
  pass_count: pages.length,
  warning_count: 0,
  blocked_count: 0,
  overall_status: "PASS",
  copy_revision_required: false,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const hardCheckNames = [
  "CONTENT_COPY_APPROVED",
  "G3_VERSION_VALID",
  "COPY_SNAPSHOT_IDENTICAL",
  "PAGE_COUNT_MATCH",
  "PAGE_SEQUENCE",
  "P1_COVER",
  "TYPOGRAPHY_TOKEN_UNIQUE",
  "COLOR_TOKEN_UNIQUE",
  "TOKEN_REFS_RESOLVE",
  "PAGE_VISUAL_TASK",
  "PAGE_ASSET_STRATEGY",
  "SAFE_AREA_VALID",
  "TEXT_DENSITY_HANDLED",
  "NO_CONTENT_REVISION_REQUIRED",
  "NO_REJECTED_DIRECTION",
  "ASSET_PERMISSION",
  "NO_FAKE_EVIDENCE",
  "BACKGROUND_HAS_NO_FORMAL_COPY",
  "FIRST_PAGE_HANDOFF_COMPLETE",
];
const weights: Record<string, number> = {
  CONTENT_FIDELITY: 20,
  VISUAL_MODE_FIT: 15,
  GROUP_CONSISTENCY: 15,
  PAGE_SPECIFIC_RELEVANCE: 15,
  READABILITY_FEASIBILITY: 15,
  ASSET_FEASIBILITY: 10,
  PROJECT_FIT: 5,
  PLATFORM_FIT: 5,
};
const quality = {
  visual_quality_report_id: "VQR-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  hard_checks: hardCheckNames.map((check_code) => ({
    check_code,
    status: "PASS",
    blocking: true,
    details: "Verified by deterministic fixture.",
  })),
  dimension_scores: Object.entries(weights).map(([dimension, weight]) => ({
    dimension,
    score: 4.5,
    weight,
    rationale: "Fictional ready fixture.",
  })),
  weighted_score: 90,
  blocking_failure_count: 0,
  warning_count: 0,
  passed_count: hardCheckNames.length,
  ready_for_first_page: true,
  limitations: ["Planning estimate, not a Renderer measurement"],
  recommended_changes: [],
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const first = pages[0];
if (!first) throw new Error("Visual System fixture has no first page.");
const firstCopy = first.copy_snapshot as Record<string, string>;
const handoff = {
  visual_handoff_package_id: "VHP-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  content_version: "CV-1",
  copy_version: "CV-1",
  visual_plan_version: "VV-1",
  visual_context_ref: context.visual_context_id,
  visual_direction_decision: decision,
  visual_reference_manifest: references,
  visual_system: visualSystem,
  page_visual_plans: pages,
  asset_requirements_plan: assets,
  layout_feasibility_report: layout,
  visual_quality_report: quality,
  first_page_handoff: {
    page_number: 1,
    page_role: "COVER",
    page_visual_plan_id: first.page_visual_plan_id,
    content_version: "CV-1",
    copy_version: "CV-1",
    visual_plan_version: "VV-1",
    copy_snapshot: {
      headline: firstCopy.headline,
      body: firstCopy.body,
      supporting_text: firstCopy.supporting_text,
    },
    copy_snapshot_hash: hash(first.copy_snapshot),
    canvas: visualSystem.canvas,
    safe_area: visualSystem.safe_area,
    typography_tokens: visualSystem.typography_tokens,
    color_tokens: visualSystem.color_tokens,
    grid_system: visualSystem.grid_system,
    asset_requirement: assetPages[0],
    background_strategy: first.background_direction,
    text_layers: first.text_layers,
    image_treatment: first.image_treatment,
    negative_constraints: first.negative_constraints,
    required_capabilities: ["PROGRAMMATIC_RENDERER"],
    generation_required: false,
    programmatic_render_required: true,
    ready: true,
    blocking_reasons: [],
  },
  platform_pack_version: "1.0.0",
  industry_pack_version: "1.0.0",
  project_rule_snapshot: "APRS-DEMO-001",
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const revision = {
  visual_revision_plan_id: "VRP-DEMO-001",
  project_id: projectId,
  content_id: contentId,
  from_visual_plan_version: "VV-1",
  to_visual_plan_version: "VV-2",
  revision_scope: "COLOR_SYSTEM",
  direction_changes: [],
  mode_changes: [],
  color_changes: ["Evaluate a darker muted blue-gray"],
  typography_changes: [],
  layout_changes: [],
  page_changes: [],
  asset_strategy_changes: [],
  preserved_elements: ["Approved copy", "Page count", "Selected mode"],
  invalidated_artifacts: [],
  requires_content_revision: false,
  requires_new_g3: false,
  requires_first_page_regeneration: false,
  requires_new_g4: false,
  dry_run: true,
  created_at: at,
  run_id: runId,
  schema_version: "1.0.0",
  extensions: {},
};
const fixtures: Record<string, unknown> = {
  "visual-planning-context": context,
  "visual-direction-decision": decision,
  "visual-reference-manifest": references,
  "asset-requirements-plan": assets,
  "layout-feasibility-report": layout,
  "visual-planning-quality-report": quality,
  "visual-handoff-package": handoff,
  "visual-plan-revision": revision,
};
const [catalog, registry] = await Promise.all([loadSchemaCatalog(), loadSchemaRegistry()]);
for (const [logicalName, value] of Object.entries(fixtures)) {
  const entry = catalog.entries.find((item) => item.logicalName === logicalName);
  if (!entry) throw new Error(`Missing ${logicalName} catalog entry.`);
  registry.assertValid(entry.schemaId, value);
  const fixtureRoot = path.join(root, logicalName);
  await mkdir(path.join(fixtureRoot, "valid"), { recursive: true });
  await mkdir(path.join(fixtureRoot, "invalid"), { recursive: true });
  await writeFile(
    path.join(fixtureRoot, "valid/complete.json"),
    `${JSON.stringify(value, null, 2)}\n`,
  );
  const missing = { ...(value as Record<string, unknown>) };
  const firstKey = Object.keys(missing)[0];
  if (!firstKey) throw new Error(`${logicalName} fixture has no required field.`);
  delete missing[firstKey];
  await writeFile(
    path.join(fixtureRoot, "invalid/missing-required.json"),
    `${JSON.stringify(missing, null, 2)}\n`,
  );
  await writeFile(
    path.join(fixtureRoot, "invalid/additional-properties.json"),
    `${JSON.stringify({ ...(value as Record<string, unknown>), undeclared_phase_4a_field: true }, null, 2)}\n`,
  );
}
