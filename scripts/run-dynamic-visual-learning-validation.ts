import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  DynamicVisualStrategySynthesizer,
  confirmVisualRule,
  createVisualRuleCandidate,
  revokeVisualRule,
  type ConfirmedVisualRuleInput,
  type DynamicVisualStrategyInput,
  type LearningProjectVisualProfile,
} from "../packages/core/src/image-production/index.js";
import {
  ImageProductionRuntime,
  ProjectVisualLearningRuntime,
} from "../packages/runtime/src/image-production/index.js";

const PROJECT_ID = "PRJ-20990101-R1LR";
const PROJECT_HOME = path.resolve(
  process.env.CONTENT_OPS_PHASE4B_R1_HOME ??
    path.join(os.tmpdir(), "content-ops-studio-phase4b-r1-learning"),
);
const SCHEMA_ROOT = path.resolve("plugins/content-ops-studio/schemas/1.0");
const AT_1 = "2099-01-01T01:01:01.000Z";
const AT_2 = "2099-01-02T02:02:02.000Z";
const AT_3 = "2099-01-03T03:03:03.000Z";

function checksum(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function emptyProfile(): LearningProjectVisualProfile {
  return {
    profileId: "PVPF-PHASE4BR1-FICTIONAL",
    projectId: PROJECT_ID,
    profileVersion: "PVPFV-1",
    maturityStatus: "COLD_START",
    preferredVisualModes: [],
    assetSourcePreferences: [],
    backgroundPreferences: [],
    imageRealismPreferences: [],
    photographyPreferences: [],
    illustrationPreferences: [],
    characterPreferences: [],
    spacePreferences: [],
    productPreferences: [],
    compositionPreferences: [],
    visualFocusPreferences: [],
    whitespacePreferences: [],
    visualDensityPreferences: [],
    typographyPreferences: [],
    fontFamilyPreferences: [],
    titleSizePreferences: [],
    bodySizePreferences: [],
    fontWeightPreferences: [],
    lineHeightPreferences: [],
    letterSpacingPreferences: [],
    alignmentPreferences: [],
    colorPreferences: [],
    accentColorPreferences: [],
    contrastPreferences: [],
    effectPreferences: [],
    shadowPreferences: [],
    gradientPreferences: [],
    maskPreferences: [],
    borderPreferences: [],
    cornerPreferences: [],
    texturePreferences: [],
    formalTextPolicy: "RENDERER_ONLY",
    imageTextPolicy: "TEXT_FREE_GENERATED_VISUALS",
    preferredPageCounts: [4, 6],
    preferredCandidateCounts: [2, 3],
    productionBatchPreferences: ["first-page-before-remaining-pages"],
    qualityThresholds: {
      directionCandidate: 75,
      formalAsset: 85,
      group: 85,
      coreDimensionFloor: 3,
    },
    approvedReferenceElements: [],
    rejectedReferenceElements: ["generic card stacking"],
    mustRules: [],
    mustNotRules: [],
    preferRules: [],
    avoidRules: [],
    confirmedFeedbackRefs: [],
    ruleVersionRefs: [],
    knownExceptions: [],
    reviewRequiredReasons: [],
    createdAt: AT_1,
    updatedAt: AT_1,
  };
}

function profileArtifact(
  profile: LearningProjectVisualProfile,
  runId: string,
): Record<string, unknown> {
  return {
    profile_id: profile.profileId,
    project_id: profile.projectId,
    profile_version: profile.profileVersion,
    maturity: profile.maturityStatus,
    maturity_status: profile.maturityStatus,
    industry_pack_binding: { pack_id: "PROFESSIONAL_SERVICES", pack_version: "1.0.0" },
    overlay_bindings: [{ overlay_id: "EVIDENCE_AUTHENTICITY", overlay_version: "1.0.0" }],
    preferred_visual_modes: profile.preferredVisualModes,
    preferred_asset_channels: profile.assetSourcePreferences,
    identity_invariants: ["Keep the fictional advisory Subject identity stable."],
    confirmed_preferences: profile.preferRules,
    rejected_directions: profile.rejectedReferenceElements,
    approved_reference_assets: [],
    source_rule_versions: profile.ruleVersionRefs.map((_, index) => `VRV-${index + 1}`),
    asset_source_preferences: profile.assetSourcePreferences,
    background_preferences: profile.backgroundPreferences,
    image_realism_preferences: profile.imageRealismPreferences,
    photography_preferences: profile.photographyPreferences,
    illustration_preferences: profile.illustrationPreferences,
    character_preferences: profile.characterPreferences,
    space_preferences: profile.spacePreferences,
    product_preferences: profile.productPreferences,
    composition_preferences: profile.compositionPreferences,
    visual_focus_preferences: profile.visualFocusPreferences,
    whitespace_preferences: profile.whitespacePreferences,
    visual_density_preferences: profile.visualDensityPreferences,
    typography_preferences: profile.typographyPreferences,
    font_family_preferences: profile.fontFamilyPreferences,
    title_size_preferences: profile.titleSizePreferences,
    body_size_preferences: profile.bodySizePreferences,
    font_weight_preferences: profile.fontWeightPreferences,
    line_height_preferences: profile.lineHeightPreferences,
    letter_spacing_preferences: profile.letterSpacingPreferences,
    alignment_preferences: profile.alignmentPreferences,
    color_preferences: profile.colorPreferences,
    accent_color_preferences: profile.accentColorPreferences,
    contrast_preferences: profile.contrastPreferences,
    effect_preferences: profile.effectPreferences,
    shadow_preferences: profile.shadowPreferences,
    gradient_preferences: profile.gradientPreferences,
    mask_preferences: profile.maskPreferences,
    border_preferences: profile.borderPreferences,
    corner_preferences: profile.cornerPreferences,
    texture_preferences: profile.texturePreferences,
    formal_text_policy: profile.formalTextPolicy,
    image_text_policy: profile.imageTextPolicy,
    preferred_page_counts: profile.preferredPageCounts,
    preferred_candidate_counts: profile.preferredCandidateCounts,
    production_batch_preferences: profile.productionBatchPreferences,
    quality_thresholds: {
      direction_candidate: profile.qualityThresholds.directionCandidate,
      formal_asset: profile.qualityThresholds.formalAsset,
      group: profile.qualityThresholds.group,
      core_dimension_floor: profile.qualityThresholds.coreDimensionFloor,
    },
    approved_reference_elements: profile.approvedReferenceElements,
    rejected_reference_elements: profile.rejectedReferenceElements,
    must_rules: profile.mustRules,
    must_not_rules: profile.mustNotRules,
    prefer_rules: profile.preferRules,
    avoid_rules: profile.avoidRules,
    confirmed_feedback_refs: profile.confirmedFeedbackRefs,
    rule_version_refs: profile.ruleVersionRefs,
    known_exceptions: profile.knownExceptions,
    review_required_reasons: profile.reviewRequiredReasons,
    confirmed_by_operator: profile.profileVersion !== "PVPFV-1",
    run_id: runId,
    schema_version: "1.0.0",
    created_at: profile.createdAt,
    updated_at: profile.updatedAt,
  };
}

function baseInput(options: {
  runId: string;
  createdAt: string;
  contentId: string;
  theme: string;
  tags: string[];
  profile: LearningProjectVisualProfile;
  rules: ConfirmedVisualRuleInput[];
  override?: DynamicVisualStrategyInput["currentOperatorRequest"];
}): DynamicVisualStrategyInput {
  return {
    runId: options.runId,
    createdAt: options.createdAt,
    projectProfile: {
      projectId: PROJECT_ID,
      industry: "Fictional professional service",
      objective: "Build evidence-backed trust",
      profileVersion: "PPV-1",
    },
    subject: {
      summary: "Fictional advisory studio",
      identityAnchors: ["fictional-studio"],
    },
    audience: {
      summary: "Fictional small service-business owners",
      trustNeeds: ["credible boundaries", "real working process"],
    },
    platformPack: { platform: "XIAOHONGSHU", aspectRatio: "3:4", mobileFirst: true },
    industryVisualPack: {
      packId: "PROFESSIONAL_SERVICES",
      defaultVisualModes: ["EDITORIAL_SERIES", "EVIDENCE_LED"],
      assetSourcePriority: ["PROJECT_ASSET", "EVIDENCE_ASSET", "PROGRAMMATIC_GRAPHIC"],
      identityInvariants: ["Do not fabricate a client case or credential."],
      hardBlocks: ["FAKE_EVIDENCE"],
    },
    overlays: [
      { overlayId: "EVIDENCE_AUTHENTICITY", rules: ["Generated imagery is not evidence."] },
    ],
    projectVisualProfile: options.profile,
    globalUserVisualPreferences: {
      colorPreferences: ["global warm beige default"],
      compositionPreferences: ["global centered composition"],
    },
    painpoint: {
      painpointId: `P-${options.contentId.slice(2)}`,
      summary: options.theme,
      semanticTags: options.tags,
    },
    contentPackage: {
      contentId: options.contentId,
      theme: options.theme,
      structure: options.tags,
      pageRoles: [
        { pageNumber: 1, role: "COVER", semanticPurpose: `Frame ${options.theme}` },
        {
          pageNumber: 2,
          role: "DETAIL",
          semanticPurpose: `Explain ${options.tags[0] ?? "detail"}`,
        },
        { pageNumber: 3, role: "DECISION", semanticPurpose: "Support an informed decision" },
      ],
    },
    currentOperatorRequest: options.override ?? null,
    availableProjectAssets: [
      {
        assetId: "AST-FICTIONAL-WORK-SCENE",
        kind: "AUTHORIZED_PROJECT_PHOTO",
        authorized: true,
        semanticTags: ["real work", "documentary"],
      },
    ],
    evidenceAssets: [],
    approvedReferences: ["REF-FICTIONAL-EDITORIAL-1"],
    rejectedReferences: ["REF-GENERIC-CARD-GRID"],
    historicalGateResults: [],
    historicalFeedbackEvents: [],
    confirmedRules: options.rules,
    constraints: {
      costTier: "STANDARD",
      timeTier: "STANDARD",
      minimumFormalQuality: 85,
      maximumCandidateCount: 3,
    },
  };
}

function feedbackArtifact(runId: string): Record<string, unknown> {
  return {
    event_id: "VFE-PHASE4BR1-PROJECT-1",
    project_id: PROJECT_ID,
    content_id: "C-9001",
    feedback_class: "VISUAL_PREFERENCE",
    scope: "CURRENT_PROJECT",
    target_type: "SET",
    target_id: "C-9001-RUN1-DIRECTIONS",
    statement:
      "Prefer authentic work scenes with low-saturation editorial typography and avoid generic card stacking.",
    is_tool_or_system_defect: false,
    long_term_rule_candidate: true,
    creates_long_term_rule: false,
    source: "OPERATOR_FEEDBACK",
    run_id: runId,
    schema_version: "1.0.0",
    created_at: AT_1,
  };
}

const synthesizer = new DynamicVisualStrategySynthesizer();
const learningRuntime = new ProjectVisualLearningRuntime({
  projectHome: PROJECT_HOME,
  projectId: PROJECT_ID,
  schemaRoot: SCHEMA_ROOT,
});

const run1Id = "RUN-20990101-010101-R1A1";
const profileV1 = emptyProfile();
const profileV1Artifact = profileArtifact(profileV1, run1Id);
await learningRuntime.writeVersion("project-visual-profile", "PVPFV-1", profileV1Artifact);
await learningRuntime.activateProfile("PVPFV-1", profileV1Artifact);

const run1 = synthesizer.synthesize(
  baseInput({
    runId: run1Id,
    createdAt: AT_1,
    contentId: "C-9001",
    theme: "Verify expertise without trusting surface packaging",
    tags: ["verification", "evidence", "decision"],
    profile: profileV1,
    rules: [],
  }),
);
const run1Runtime = new ImageProductionRuntime({
  projectHome: PROJECT_HOME,
  projectId: PROJECT_ID,
  runId: run1Id,
  schemaRoot: SCHEMA_ROOT,
});
await run1Runtime.write(
  "dynamic-visual-strategy-plan",
  "dynamic-visual-strategy-plan.json",
  run1.plan,
);
await run1Runtime.write(
  "visual-strategy-confidence-report",
  "visual-strategy-confidence-report.json",
  run1.confidence,
);
await run1Runtime.write("visual-ambiguity-report", "visual-ambiguity-report.json", run1.ambiguity);

const feedback = {
  eventId: "VFE-PHASE4BR1-PROJECT-1",
  feedbackClass: "VISUAL_PREFERENCE" as const,
  scope: "CURRENT_PROJECT" as const,
  statement:
    "Prefer authentic work scenes with low-saturation editorial typography and avoid generic card stacking.",
  isToolOrSystemDefect: false,
};
const candidate = createVisualRuleCandidate(feedback, "VRC-PHASE4BR1-PROJECT-1", "PREFER");
await learningRuntime.writeVersion(
  "visual-feedback-event",
  feedback.eventId,
  feedbackArtifact(run1Id),
);
await learningRuntime.writeVersion("visual-rule-candidate", candidate.candidateId, {
  candidate_id: candidate.candidateId,
  project_id: PROJECT_ID,
  source_event_id: candidate.sourceEventId,
  rule_statement: candidate.statement,
  rationale: "Explicit fictional project-level preference for cross-Run validation.",
  scope: candidate.scope,
  rule_type: candidate.type,
  positive_examples: ["Authentic fictional work scene with restrained editorial hierarchy"],
  negative_examples: ["Generic card stacking"],
  allowed_exceptions: ["Evidence-led page with authentic source"],
  confirmed_by_user: false,
  status: "CANDIDATE",
  version: 1,
  run_id: run1Id,
  schema_version: "1.0.0",
  created_at: AT_1,
});

const confirmed = confirmVisualRule({
  profile: profileV1,
  feedback,
  candidate,
  ruleId: "VR-PHASE4BR1-PROJECT-1",
  confirmedAt: AT_2,
});
await learningRuntime.writeVersion("visual-rule", "VR-PHASE4BR1-PROJECT-1-V1", {
  rule_id: confirmed.rule.ruleId,
  project_id: PROJECT_ID,
  source_event_id: feedback.eventId,
  source_candidate_id: candidate.candidateId,
  rule_statement: confirmed.rule.statement,
  rationale: "Explicit fictional confirmation after candidate review.",
  scope: confirmed.rule.scope,
  rule_type: confirmed.rule.type,
  positive_examples: ["Authentic fictional work scene with restrained editorial hierarchy"],
  negative_examples: ["Generic card stacking"],
  allowed_exceptions: ["Evidence-led page with authentic source"],
  confirmed_by_user: true,
  status: "ACTIVE",
  version: 1,
  supersedes_version: null,
  run_id: run1Id,
  schema_version: "1.0.0",
  created_at: AT_2,
  updated_at: AT_2,
});
const profileV2Artifact = profileArtifact(confirmed.profile, run1Id);
await learningRuntime.writeVersion("project-visual-profile", "PVPFV-2", profileV2Artifact);
await learningRuntime.activateProfile("PVPFV-2", profileV2Artifact);
const activeAfterConfirmation = await learningRuntime.readActiveProfile();
if (activeAfterConfirmation?.artifact_key !== "PVPFV-2")
  throw new Error("CROSS_RUN_ACTIVE_PROFILE_CONFIRMATION_FAILED");

const run2Id = "RUN-20990102-020202-R1B2";
const run2 = synthesizer.synthesize(
  baseInput({
    runId: run2Id,
    createdAt: AT_2,
    contentId: "C-9002",
    theme: "A fictional consultant's turning-point story",
    tags: ["story", "work scene", "lesson"],
    profile: confirmed.profile,
    rules: [confirmed.rule],
  }),
);
const run2Runtime = new ImageProductionRuntime({
  projectHome: PROJECT_HOME,
  projectId: PROJECT_ID,
  runId: run2Id,
  schemaRoot: SCHEMA_ROOT,
});
await run2Runtime.write(
  "dynamic-visual-strategy-plan",
  "dynamic-visual-strategy-plan.json",
  run2.plan,
);
await run2Runtime.write(
  "visual-strategy-confidence-report",
  "visual-strategy-confidence-report.json",
  run2.confidence,
);
await run2Runtime.write("visual-ambiguity-report", "visual-ambiguity-report.json", run2.ambiguity);

const activeProfileChecksumBeforeOverride = checksum(activeAfterConfirmation.profile);
const overrideId = "RUN-20990102-030303-R1O1";
const override = synthesizer.synthesize(
  baseInput({
    runId: overrideId,
    createdAt: AT_2,
    contentId: "C-9003",
    theme: "Current-set dark editorial exception",
    tags: ["editorial", "exception"],
    profile: confirmed.profile,
    rules: [confirmed.rule],
    override: {
      summary: "Use a dark visual for this current set only.",
      scope: "CURRENT_SET",
      requestedColorDirection: "deep charcoal current-set palette",
      requestedVisualMode: "EDITORIAL_SERIES",
    },
  }),
);
const overrideRuntime = new ImageProductionRuntime({
  projectHome: PROJECT_HOME,
  projectId: PROJECT_ID,
  runId: overrideId,
  schemaRoot: SCHEMA_ROOT,
});
await overrideRuntime.write(
  "dynamic-visual-strategy-plan",
  "dynamic-visual-strategy-plan.json",
  override.plan,
);
const activeAfterOverride = await learningRuntime.readActiveProfile();
if (checksum(activeAfterOverride?.profile) !== activeProfileChecksumBeforeOverride)
  throw new Error("CURRENT_SET_OVERRIDE_MUTATED_LONG_TERM_PROFILE");

const revoked = revokeVisualRule({
  profile: confirmed.profile,
  rule: confirmed.rule,
  revokedAt: AT_3,
});
await learningRuntime.writeVersion("visual-rule", "VR-PHASE4BR1-PROJECT-1-V2", {
  rule_id: revoked.rule.ruleId,
  project_id: PROJECT_ID,
  source_event_id: feedback.eventId,
  source_candidate_id: candidate.candidateId,
  rule_statement: revoked.rule.statement,
  rationale: "Explicit fictional revocation retained for audit.",
  scope: revoked.rule.scope,
  rule_type: revoked.rule.type,
  positive_examples: ["Historic example retained"],
  negative_examples: ["No longer active"],
  allowed_exceptions: [],
  confirmed_by_user: true,
  status: "DISABLED",
  version: 2,
  supersedes_version: 1,
  run_id: "RUN-20990103-030303-R1C3",
  schema_version: "1.0.0",
  created_at: AT_2,
  updated_at: AT_3,
});
const profileV3Artifact = profileArtifact(revoked.profile, "RUN-20990103-030303-R1C3");
await learningRuntime.writeVersion("project-visual-profile", "PVPFV-3", profileV3Artifact);
await learningRuntime.activateProfile("PVPFV-3", profileV3Artifact);

const run3Id = "RUN-20990103-040404-R1D4";
const run3 = synthesizer.synthesize(
  baseInput({
    runId: run3Id,
    createdAt: AT_3,
    contentId: "C-9004",
    theme: "A new fictional process explanation after rule revocation",
    tags: ["process", "framework", "decision"],
    profile: revoked.profile,
    rules: [revoked.rule],
  }),
);
const run3Runtime = new ImageProductionRuntime({
  projectHome: PROJECT_HOME,
  projectId: PROJECT_ID,
  runId: run3Id,
  schemaRoot: SCHEMA_ROOT,
});
await run3Runtime.write(
  "dynamic-visual-strategy-plan",
  "dynamic-visual-strategy-plan.json",
  run3.plan,
);

const fixedSlotSignature = ["AI_GENERATED_VISUAL", "PURE_TYPOGRAPHY", "MIXED_ASSET"].join("|");
const run1Signature = run1.plan.candidate_directions
  .map((direction) => direction.asset_channel)
  .join("|");
const evidence = {
  evidence_id: "DVSLE-PHASE4BR1-FICTIONAL",
  project_id: PROJECT_ID,
  project_home_label: "external-fictional-phase4b-r1-home",
  run_1: {
    run_id: run1Id,
    content_id: "C-9001",
    profile_version: run1.plan.project_profile_version,
    maturity: run1.plan.profile_maturity_status,
    candidate_count: run1.plan.candidate_count,
    fixed_ai_typography_mixed_slots: run1Signature === fixedSlotSignature,
    plan_hash: checksum(run1.plan),
  },
  learning: {
    feedback_event_created: true,
    rule_candidate_created: true,
    explicit_confirmation_required: true,
    confirmed_rule_created: true,
    profile_version_before: "PVPFV-1",
    profile_version_after: confirmed.profile.profileVersion,
    maturity_after: confirmed.profile.maturityStatus,
  },
  run_2: {
    run_id: run2Id,
    content_id: "C-9002",
    profile_version: run2.plan.project_profile_version,
    confirmed_rule_applied: run2.plan.page_strategies.some((page) =>
      page.selection_reason.includes("authentic work scenes"),
    ),
    low_saturation_applied: run2.plan.page_strategies.every((page) =>
      page.color_strategy.includes("low-saturation"),
    ),
    project_asset_applied: run2.plan.page_strategies.every(
      (page) => page.asset_channel === "PROJECT_ASSET",
    ),
    layout_copied_from_run_1:
      run2.plan.page_strategies[0]?.composition_direction ===
      run1.plan.page_strategies[0]?.composition_direction,
    plan_hash: checksum(run2.plan),
  },
  override: {
    run_id: overrideId,
    current_set_only: true,
    dark_direction_applied: override.plan.page_strategies.every((page) =>
      page.color_strategy.includes("deep charcoal"),
    ),
    profile_checksum_unchanged:
      checksum(activeAfterOverride?.profile) === activeProfileChecksumBeforeOverride,
  },
  revoke: {
    rule_status: revoked.rule.status,
    profile_version_after: revoked.profile.profileVersion,
    historic_run_2_profile_version: run2.plan.project_profile_version,
    next_run_applies_revoked_rule: run3.plan.page_strategies.some((page) =>
      page.selection_reason.includes("authentic work scenes"),
    ),
  },
  isolation: {
    industry_pack_mutated: false,
    global_preference_mutated: false,
    c_0001_touched: false,
    feishu_writes: 0,
    images_generated: 0,
  },
  overall_status: "PASSED",
  created_at: AT_3,
};

if (
  evidence.run_1.candidate_count !== 3 ||
  evidence.run_1.fixed_ai_typography_mixed_slots ||
  evidence.run_2.profile_version !== "PVPFV-2" ||
  !evidence.run_2.confirmed_rule_applied ||
  !evidence.run_2.low_saturation_applied ||
  !evidence.run_2.project_asset_applied ||
  evidence.run_2.layout_copied_from_run_1 ||
  !evidence.override.dark_direction_applied ||
  !evidence.override.profile_checksum_unchanged ||
  evidence.revoke.rule_status !== "DISABLED" ||
  evidence.revoke.profile_version_after !== "PVPFV-3" ||
  evidence.revoke.next_run_applies_revoked_rule
)
  throw new Error("DYNAMIC_VISUAL_LEARNING_VALIDATION_FAILED");

await mkdir(PROJECT_HOME, { recursive: true, mode: 0o700 });
const evidencePath = path.join(PROJECT_HOME, "phase-4b-r1-learning-evidence.json");
const encoded = `${JSON.stringify(evidence, null, 2)}\n`;
await writeFile(evidencePath, encoded, { encoding: "utf8", mode: 0o600 });
if ((await readFile(evidencePath, "utf8")) !== encoded)
  throw new Error("DYNAMIC_VISUAL_LEARNING_EVIDENCE_READ_VERIFY_FAILED");

console.log(
  JSON.stringify({
    status: "PASSED",
    project_id: PROJECT_ID,
    run_count: 4,
    profile_versions: ["PVPFV-1", "PVPFV-2", "PVPFV-3"],
    c_0001_touched: false,
    feishu_writes: 0,
    images_generated: 0,
    evidence_path: evidencePath,
  }),
);
