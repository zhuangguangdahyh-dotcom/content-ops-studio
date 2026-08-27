import { describe, expect, it } from "vitest";
import {
  DynamicVisualStrategySynthesizer,
  confirmVisualRule,
  createVisualRuleCandidate,
  forgetVisualRule,
  revokeVisualRule,
  type DynamicVisualStrategyInput,
  type LearningProjectVisualProfile,
} from "../../packages/core/src/image-production/index.js";

const AT = "2099-01-01T00:00:00.000Z";

function profile(
  maturityStatus: LearningProjectVisualProfile["maturityStatus"] = "COLD_START",
): LearningProjectVisualProfile {
  return {
    profileId: "PVPF-DYNAMIC-DEMO",
    projectId: "PRJ-20990101-DYN1",
    profileVersion: "PVPFV-1",
    maturityStatus,
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
    preferredPageCounts: [6],
    preferredCandidateCounts: [2, 3],
    productionBatchPreferences: ["cover-first"],
    qualityThresholds: {
      directionCandidate: 75,
      formalAsset: 85,
      group: 85,
      coreDimensionFloor: 3,
    },
    approvedReferenceElements: [],
    rejectedReferenceElements: [],
    mustRules: [],
    mustNotRules: [],
    preferRules: [],
    avoidRules: [],
    confirmedFeedbackRefs: [],
    ruleVersionRefs: [],
    knownExceptions: [],
    reviewRequiredReasons: [],
    createdAt: AT,
    updatedAt: AT,
  };
}

function input(overrides: Partial<DynamicVisualStrategyInput> = {}): DynamicVisualStrategyInput {
  const base: DynamicVisualStrategyInput = {
    runId: "RUN-20990101-010101-DYN1",
    createdAt: AT,
    projectProfile: {
      projectId: "PRJ-20990101-DYN1",
      industry: "Fictional professional advisory",
      objective: "Build evidence-backed trust",
      profileVersion: "PPV-1",
    },
    subject: { summary: "A fictional expert service", identityAnchors: ["fictional-subject"] },
    audience: { summary: "Small service-business owners", trustNeeds: ["verifiable boundaries"] },
    platformPack: { platform: "XIAOHONGSHU", aspectRatio: "3:4", mobileFirst: true },
    industryVisualPack: {
      packId: "PROFESSIONAL_SERVICES",
      defaultVisualModes: ["EDITORIAL_SERIES", "EVIDENCE_LED"],
      assetSourcePriority: ["EVIDENCE_ASSET", "PROJECT_ASSET", "PROGRAMMATIC_GRAPHIC"],
      identityInvariants: ["Do not fabricate credentials."],
      hardBlocks: ["FAKE_EVIDENCE"],
    },
    overlays: [{ overlayId: "EVIDENCE_AUTHENTICITY", rules: ["Verified evidence only"] }],
    projectVisualProfile: profile(),
    globalUserVisualPreferences: {
      colorPreferences: ["global warm beige"],
      fontFamilyPreferences: ["global rounded sans"],
    },
    painpoint: {
      painpointId: "P-DYN-1",
      summary: "How can the audience verify expertise rather than trust packaging?",
      semanticTags: ["verification", "evidence"],
    },
    contentPackage: {
      contentId: "C-DYN-1",
      theme: "Verification boundaries",
      structure: ["claim", "criteria", "decision"],
      pageRoles: [
        { pageNumber: 1, role: "COVER", semanticPurpose: "Frame the verification problem" },
        { pageNumber: 2, role: "EVIDENCE", semanticPurpose: "Show authentic proof criteria" },
      ],
    },
    currentOperatorRequest: null,
    availableProjectAssets: [],
    evidenceAssets: [],
    approvedReferences: [],
    rejectedReferences: ["generic card grid"],
    historicalGateResults: [],
    historicalFeedbackEvents: [],
    confirmedRules: [],
    constraints: {
      costTier: "STANDARD",
      timeTier: "STANDARD",
      minimumFormalQuality: 85,
      maximumCandidateCount: 3,
    },
  };
  return { ...base, ...overrides };
}

describe("DynamicVisualStrategySynthesizer", () => {
  const synthesizer = new DynamicVisualStrategySynthesizer();

  it("produces different strategies for the same painpoint in different industries", () => {
    const advisory = synthesizer.synthesize(input());
    const commercial = synthesizer.synthesize(
      input({
        projectProfile: {
          projectId: "PRJ-20990101-DYN1",
          industry: "Commercial space and hospitality",
          objective: "Show spatial business value",
          profileVersion: "PPV-1",
        },
        industryVisualPack: {
          packId: "COMMERCIAL_SPACE_HOSPITALITY",
          defaultVisualModes: ["SCENE_SERIES"],
          assetSourcePriority: ["PROJECT_ASSET", "EVIDENCE_ASSET"],
          identityInvariants: ["Preserve spatial DNA."],
          hardBlocks: ["SPATIAL_STRUCTURE_DRIFT"],
        },
      }),
    );
    expect(advisory.plan.candidate_directions[0]?.subject_direction).not.toBe(
      commercial.plan.candidate_directions[0]?.subject_direction,
    );
    expect(commercial.plan.page_strategies[0]?.visual_mode).toBe("SCENE_SERIES");
  });

  it("changes strategy for different content in the same industry without copying layout", () => {
    const evidence = synthesizer.synthesize(input());
    const story = synthesizer.synthesize(
      input({
        runId: "RUN-20990101-020202-DYN2",
        contentPackage: {
          contentId: "C-DYN-2",
          theme: "Founder turning-point story",
          structure: ["story", "turning point", "lesson"],
          pageRoles: [
            { pageNumber: 1, role: "COVER", semanticPurpose: "Open the founder story" },
            { pageNumber: 2, role: "STORY", semanticPurpose: "Show the decisive moment" },
          ],
        },
        painpoint: {
          painpointId: "P-DYN-2",
          summary: "Why did the fictional founder change the service model?",
          semanticTags: ["story", "journey"],
        },
      }),
    );
    expect(evidence.plan.page_strategies[0]?.composition_direction).not.toBe(
      story.plan.page_strategies[0]?.composition_direction,
    );
    expect(evidence.plan.strategy_summary).not.toBe(story.plan.strategy_summary);
  });

  it.each([
    ["COLD_START", 3],
    ["LEARNING", 2],
    ["MATURE", 1],
  ] as const)("derives candidate count from %s maturity", (maturity, count) => {
    const result = synthesizer.synthesize(input({ projectVisualProfile: profile(maturity) }));
    expect(result.plan.candidate_count).toBe(count);
  });

  it("blocks Profile reuse at REVIEW_REQUIRED", () => {
    const review = profile("REVIEW_REQUIRED");
    review.reviewRequiredReasons = ["Audience changed materially."];
    const result = synthesizer.synthesize(input({ projectVisualProfile: review }));
    expect(result.plan.synthesis_status).toBe("BLOCKED_REVIEW_REQUIRED");
    expect(result.plan.candidate_count).toBe(0);
    expect(result.ambiguity.blocking).toBe(true);
  });

  it("blocks a generic lead-generation cover context with one concrete question", () => {
    const result = synthesizer.synthesize(
      input({
        accountGoal: "LEAD_GENERATION",
        subject: { summary: "通用专业服务", identityAnchors: [] },
        audience: { summary: "", trustNeeds: [] },
        painpoint: { painpointId: "P-DYN-GENERIC", summary: "", semanticTags: [] },
      }),
    );
    expect(result.plan.synthesis_status).toBe("BLOCKED_REVIEW_REQUIRED");
    expect(result.plan.candidate_count).toBe(0);
    expect(result.ambiguity.major_ambiguities[0]?.code).toBe("COVER_CONTEXT_INSUFFICIENT");
    expect(result.ambiguity.recommended_clarification_questions[0]).toContain(
      "具体代表哪类业务主体",
    );
    expect(result.plan.cover_click_clarity_target).toBe(85);
    expect(result.plan.semantic_relevance_target).toBe(80);
  });

  it("applies Project Profile above global preference and current override above both", () => {
    const learned = profile("LEARNING");
    learned.colorPreferences = ["project low-saturation warm editorial"];
    learned.fontFamilyPreferences = ["project humanist sans"];
    const normal = synthesizer.synthesize(input({ projectVisualProfile: learned }));
    expect(normal.plan.page_strategies[0]?.color_strategy).toBe(
      "project low-saturation warm editorial",
    );
    expect(normal.plan.page_strategies[0]?.typography.font_character).toBe("project humanist sans");
    const profileBefore = structuredClone(learned);
    const override = synthesizer.synthesize(
      input({
        projectVisualProfile: learned,
        currentOperatorRequest: {
          summary: "Use a dark visual for this set only.",
          scope: "CURRENT_SET",
          requestedColorDirection: "deep charcoal current-set palette",
          requestedVisualMode: "EDITORIAL_SERIES",
        },
      }),
    );
    expect(override.plan.current_override_applied).toBe(true);
    expect(override.plan.page_strategies[0]?.color_strategy).toBe(
      "deep charcoal current-set palette",
    );
    expect(learned).toEqual(profileBefore);
    expect(override.plan.long_term_profile_mutated).toBe(false);
  });

  it("uses the universal serif only as fallback and exposes policy versions", () => {
    const cold = profile("COLD_START");
    cold.fontFamilyPreferences = [];
    const fallback = synthesizer.synthesize(
      input({
        projectVisualProfile: cold,
        globalUserVisualPreferences: {},
        universalVisualDefaultVersion: "UVDPV-1",
        typographyDefaultPolicyVersion: "TDPV-1",
        editorialSpatialPolicyVersion: "ESCPV-1",
      }),
    );
    expect(fallback.plan.resolved_typography_strategy).toBe(
      "modern Chinese serif cold-start fallback",
    );
    expect(fallback.plan.universal_visual_default_version).toBe("UVDPV-1");
    expect(fallback.plan.typography_default_policy_version).toBe("TDPV-1");
    expect(fallback.plan.editorial_spatial_policy_version).toBe("ESCPV-1");

    cold.fontFamilyPreferences = ["Project Sans Serif"];
    const project = synthesizer.synthesize(input({ projectVisualProfile: cold }));
    expect(project.plan.resolved_typography_strategy).toBe("Project Sans Serif");
    const operator = synthesizer.synthesize(
      input({
        projectVisualProfile: cold,
        currentOperatorRequest: {
          summary: "Use the specified font for this set.",
          scope: "CURRENT_SET",
          requestedFontFamily: "Operator Display Serif",
        },
      }),
    );
    expect(operator.plan.resolved_typography_strategy).toBe("Operator Display Serif");
    expect(operator.plan.long_term_profile_mutated).toBe(false);
  });

  it("keeps Pack as a prior and lets per-content evidence needs decide the page", () => {
    const result = synthesizer.synthesize(
      input({
        evidenceAssets: [
          { assetId: "AST-EVIDENCE-1", verified: true, semanticTags: ["credential"] },
        ],
        industryVisualPack: {
          packId: "PROFESSIONAL_SERVICES",
          defaultVisualModes: ["PURE_TYPOGRAPHY"],
          assetSourcePriority: ["PURE_TYPOGRAPHY"],
          identityInvariants: ["Do not fabricate credentials."],
          hardBlocks: ["FAKE_EVIDENCE"],
        },
      }),
    );
    expect(result.plan.page_strategies[1]?.asset_channel).toBe("EVIDENCE_ASSET");
    expect(result.plan.page_strategies[1]?.visual_mode).toBe("EVIDENCE_LED");
    expect(result.plan.industry_pack_mutated).toBe(false);
  });

  it("learns granular typography, color, density, composition and effects from Profile", () => {
    const learned = profile("MATURE");
    learned.fontFamilyPreferences = ["learned editorial grotesk"];
    learned.titleSizePreferences = ["learned 12-character mobile title scale"];
    learned.bodySizePreferences = ["learned compact readable body"];
    learned.fontWeightPreferences = ["learned 700/400 contrast"];
    learned.lineHeightPreferences = ["learned 1.35 body line height"];
    learned.letterSpacingPreferences = ["learned neutral CJK tracking"];
    learned.alignmentPreferences = ["learned optical left alignment"];
    learned.visualDensityPreferences = ["learned 40:60 text-image ratio"];
    learned.compositionPreferences = ["learned asymmetric editorial focus"];
    learned.colorPreferences = ["learned low-saturation ink and ivory"];
    learned.effectPreferences = ["learned translucent boundary mask"];
    learned.maskPreferences = ["learned soft clipping mask"];
    const page = synthesizer.synthesize(input({ projectVisualProfile: learned })).plan
      .page_strategies[0];
    expect(page?.typography).toMatchObject({
      font_character: "learned editorial grotesk",
      title_size_strategy: "learned 12-character mobile title scale",
      body_size_strategy: "learned compact readable body",
      font_weight: "learned 700/400 contrast",
      line_height: "learned 1.35 body line height",
      letter_spacing: "learned neutral CJK tracking",
      alignment: "learned optical left alignment",
      text_image_ratio: "learned 40:60 text-image ratio",
    });
    expect(page?.composition_direction).toBe("learned asymmetric editorial focus");
    expect(page?.effects.effects).toContain("learned translucent boundary mask");
  });
});

describe("project visual learning lifecycle", () => {
  const feedback = {
    eventId: "VFE-DYNAMIC-DEMO-1",
    feedbackClass: "VISUAL_PREFERENCE" as const,
    scope: "CURRENT_PROJECT" as const,
    statement:
      "Prefer authentic work scenes with low-saturation editorial typography and avoid generic card stacking.",
    isToolOrSystemDefect: false,
  };

  it("requires Feedback → Candidate → explicit confirmation and increments Profile version", () => {
    const candidate = createVisualRuleCandidate(feedback, "VRC-DYNAMIC-DEMO-1", "PREFER");
    expect(candidate.confirmed).toBe(false);
    const before = profile();
    expect(before.preferRules).toEqual([]);
    const confirmed = confirmVisualRule({
      profile: before,
      feedback,
      candidate,
      ruleId: "VR-DYNAMIC-DEMO-1",
      confirmedAt: "2099-01-02T00:00:00.000Z",
    });
    expect(confirmed.profile.profileVersion).toBe("PVPFV-2");
    expect(confirmed.profile.maturityStatus).toBe("LEARNING");
    expect(confirmed.profile.preferRules).toContain(feedback.statement);
    expect(confirmed.rule.status).toBe("ACTIVE");
    expect(before.preferRules).toEqual([]);
  });

  it("rejects system bugs and production feedback as long-term learning", () => {
    expect(() =>
      createVisualRuleCandidate(
        { ...feedback, feedbackClass: "QUALITY_DEFECT", isToolOrSystemDefect: true },
        "VRC-BUG-1",
        "AVOID",
      ),
    ).toThrow("VISUAL_FEEDBACK_NOT_ELIGIBLE_FOR_LONG_TERM_RULE");
    expect(() =>
      createVisualRuleCandidate(
        { ...feedback, feedbackClass: "PRODUCTION_FEEDBACK" },
        "VRC-PRODUCTION-1",
        "PREFER",
      ),
    ).toThrow("VISUAL_FEEDBACK_NOT_ELIGIBLE_FOR_LONG_TERM_RULE");
  });

  it("revokes and forgets rules without mutating historic Profile versions", () => {
    const candidate = createVisualRuleCandidate(feedback, "VRC-DYNAMIC-DEMO-1", "PREFER");
    const confirmed = confirmVisualRule({
      profile: profile(),
      feedback,
      candidate,
      ruleId: "VR-DYNAMIC-DEMO-1",
      confirmedAt: "2099-01-02T00:00:00.000Z",
    });
    const historic = structuredClone(confirmed.profile);
    const revoked = revokeVisualRule({
      profile: confirmed.profile,
      rule: confirmed.rule,
      revokedAt: "2099-01-03T00:00:00.000Z",
    });
    expect(revoked.rule.status).toBe("DISABLED");
    expect(revoked.profile.profileVersion).toBe("PVPFV-3");
    expect(revoked.profile.preferRules).not.toContain(feedback.statement);
    expect(confirmed.profile).toEqual(historic);
    const forgotten = forgetVisualRule({
      profile: revoked.profile,
      rule: revoked.rule,
      forgottenAt: "2099-01-04T00:00:00.000Z",
    });
    expect(forgotten.rule.status).toBe("FORGOTTEN");
    expect(forgotten.rule.statement).toMatch(/^\[FORGOTTEN:[a-f0-9]{12}\]$/u);
    expect(forgotten.profile.profileVersion).toBe("PVPFV-4");
  });

  it("does not mutate Profile merely because G4/G5 history exists", () => {
    const before = profile("LEARNING");
    const snapshot = structuredClone(before);
    new DynamicVisualStrategySynthesizer().synthesize(
      input({
        projectVisualProfile: before,
        historicalGateResults: [
          { gate: "G4", decision: "APPROVE", profileVersion: "PVPFV-1" },
          { gate: "G5", decision: "APPROVE", profileVersion: "PVPFV-1" },
        ],
      }),
    );
    expect(before).toEqual(snapshot);
  });
});
