import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  evaluateCandidateSetVisualDiversity,
  evaluateEditorialSpatialComposition,
  evaluateImageTextIntegration,
  evaluateLocaleSceneFit,
  evaluatePainpointSceneCongruence,
  planCommercialSpaceCalibrationRound2,
  resolveTypographyStrategy,
} from "../../packages/core/src/visual-baseline/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";

describe("Universal Visual Default Baseline V1", () => {
  it("resolves a Renderer-verified Songti with real title and text weights", () => {
    const result = resolveTypographyStrategy({
      globalDefaultEnabled: true,
      availableFonts: [
        { family: "PingFang SC", weights: [400, 600], chineseSerif: false },
        { family: "Songti SC", weights: [300, 400, 700, 900], chineseSerif: true },
      ],
    });
    expect(result).toMatchObject({
      source: "UNIVERSAL_DEFAULT",
      resolved_font_family: "Songti SC",
      resolved_title_weight: 700,
      resolved_subtitle_weight: 400,
      synthetic_bold: false,
      font_downloaded: false,
      silent_pingfang_fallback: false,
    });
  });

  it("honors current Operator typography above Project and universal defaults", () => {
    const result = resolveTypographyStrategy({
      currentOperatorFont: "Operator Serif",
      projectFont: "Project Serif",
      globalDefaultEnabled: true,
      availableFonts: [
        { family: "Operator Serif", weights: [400, 800], chineseSerif: true },
        { family: "Project Serif", weights: [400, 700], chineseSerif: true },
        { family: "Songti SC", weights: [400, 700], chineseSerif: true },
      ],
    });
    expect(result.source).toBe("CURRENT_OPERATOR");
    expect(result.resolved_font_family).toBe("Operator Serif");
  });

  it("fails closed when no verified Chinese serif exists", () => {
    expect(() =>
      resolveTypographyStrategy({
        globalDefaultEnabled: true,
        availableFonts: [{ family: "PingFang SC", weights: [400, 600], chineseSerif: false }],
      }),
    ).toThrowError(expect.objectContaining({ code: "SONGTI_FONT_UNAVAILABLE" }));
  });

  it("skips an unusable Songti and resolves the next verified serif without downloading", () => {
    const result = resolveTypographyStrategy({
      globalDefaultEnabled: true,
      availableFonts: [
        { family: "Songti SC", weights: [300, 400], chineseSerif: true },
        { family: "Source Han Serif SC", weights: [400, 700], chineseSerif: true },
      ],
    });
    expect(result.resolved_font_family).toBe("Source Han Serif SC");
    expect(result.resolved_title_weight).toBe(700);
    expect(result.resolved_subtitle_weight).toBe(400);
    expect(result.font_downloaded).toBe(false);
  });

  it("validates the committed fallback policies against strict contracts", async () => {
    const [registry, universal, typography] = await Promise.all([
      loadSchemaRegistry(),
      readFile("plugins/content-ops-studio/config/universal-visual-default-v1.json", "utf8").then(
        (value) => JSON.parse(value) as unknown,
      ),
      readFile("plugins/content-ops-studio/config/typography-default-v1.json", "utf8").then(
        (value) => JSON.parse(value) as unknown,
      ),
    ]);
    expect(
      registry.validateBySchemaId(
        "https://content-ops-studio.local/schemas/1.0/universal-visual-default-policy.schema.json",
        universal,
      ),
    ).toEqual({ valid: true, errors: [] });
    expect(
      registry.validateBySchemaId(
        "https://content-ops-studio.local/schemas/1.0/typography-default-policy.schema.json",
        typography,
      ),
    ).toEqual({ valid: true, errors: [] });
  });

  it("passes editorial composition only with multiple spatial relationships", () => {
    const result = evaluateEditorialSpatialComposition({
      scores: {
        HIERARCHY: 9,
        SPATIAL_AXIS: 9,
        ASYMMETRY: 8,
        PROPORTION: 8,
        NEGATIVE_SPACE_PURPOSE: 9,
        SUBJECT_CROP: 8,
        DEPTH: 8,
        IMAGE_TEXT_RELATION: 9,
        TENSION: 8,
        READING_PATH: 9,
      },
      spatialRelationships: ["IMAGE_TEXT_INTERLOCK", "EDGE_TENSION"],
      genericTextOverPhoto: false,
      purposefulNegativeSpace: true,
    });
    expect(result.total_score).toBe(85);
    expect(result.result).toBe("PASS_PENDING_OPERATOR");
    expect(result.operator_approval_required).toBe(true);
  });

  it("blocks generic text-over-photo and weak negative space", () => {
    const result = evaluateEditorialSpatialComposition({
      scores: {
        HIERARCHY: 10,
        SPATIAL_AXIS: 10,
        ASYMMETRY: 10,
        PROPORTION: 10,
        NEGATIVE_SPACE_PURPOSE: 10,
        SUBJECT_CROP: 10,
        DEPTH: 10,
        IMAGE_TEXT_RELATION: 10,
        TENSION: 10,
        READING_PATH: 10,
      },
      spatialRelationships: ["ASYMMETRIC_BALANCE"],
      genericTextOverPhoto: true,
      purposefulNegativeSpace: false,
    });
    expect(result.result).toBe("BLOCKED");
    expect(result.hard_blocks).toEqual(
      expect.arrayContaining([
        "GENERIC_TEXT_OVER_PHOTO_LAYOUT",
        "EDITORIAL_SPATIAL_TENSION_WEAK",
        "NEGATIVE_SPACE_PURPOSE_WEAK",
      ]),
    );
  });

  it("requires an explicit image-text anchor and visible evidence", () => {
    const pass = evaluateImageTextIntegration({
      scores: {
        SUBJECT_OR_EDGE_RELATION: 18,
        NEGATIVE_SPACE_RELATION: 18,
        FOCUS_COOPERATION: 17,
        EVIDENCE_VISIBILITY: 18,
        READING_PATH_INTEGRATION: 17,
      },
      anchorRelationships: ["title edge aligns to storefront entrance axis"],
      genericTextOverPhoto: false,
      keyEvidenceObscured: false,
    });
    expect(pass.result).toBe("PASS_PENDING_OPERATOR");
    const blocked = evaluateImageTextIntegration({
      scores: {
        SUBJECT_OR_EDGE_RELATION: 20,
        NEGATIVE_SPACE_RELATION: 20,
        FOCUS_COOPERATION: 20,
        EVIDENCE_VISIBILITY: 20,
        READING_PATH_INTEGRATION: 20,
      },
      anchorRelationships: [],
      genericTextOverPhoto: false,
      keyEvidenceObscured: true,
    });
    expect(blocked.hard_blocks).toContain("IMAGE_TEXT_INTEGRATION_WEAK");
  });

  it("scores three materially different candidates and blocks template repetition", () => {
    const scores = {
      COMPOSITION_FAMILY_DIVERSITY: 14,
      TEXT_REGION_DIVERSITY: 9,
      SHOT_SCALE_DIVERSITY: 9,
      CAMERA_VIEWPOINT_DIVERSITY: 9,
      ASSET_STRUCTURE_DIVERSITY: 14,
      SEMANTIC_ROLE_DIVERSITY: 9,
      VISUAL_READING_PATH_DIVERSITY: 9,
      IMAGE_TEXT_INTEGRATION_DIVERSITY: 9,
      NEAR_TEMPLATE_DUPLICATE_RISK: 9,
    } as const;
    const pass = evaluateCandidateSetVisualDiversity({
      scores,
      compositionFamilies: [
        "IMAGE_TEXT_INTERLOCK",
        "DIAGNOSTIC_COMPOSITION",
        "MULTI_EVIDENCE_EDITORIAL",
      ],
      textRegions: ["right edge", "lower-left axis", "central negative-space hinge"],
      assetStructures: ["single scene", "marked scene", "master with three crops"],
      readingPaths: ["scene to title", "title to markers", "master to crop evidence"],
      nearTemplateDuplicateRisk: "LOW",
    });
    expect(pass.total_score).toBe(91);
    expect(pass.result).toBe("PASS_PENDING_OPERATOR");
    const blocked = evaluateCandidateSetVisualDiversity({
      scores,
      compositionFamilies: ["IMAGE_TEXT_INTERLOCK"],
      textRegions: ["top-left"],
      assetStructures: ["single scene"],
      readingPaths: ["top-left to bottom-right"],
      nearTemplateDuplicateRisk: "BLOCKING",
    });
    expect(blocked.result).toBe("BLOCKED");
  });

  it("blocks painpoint-first scenes that contradict the visible painpoint", () => {
    const result = evaluatePainpointSceneCongruence({
      strategy: "PAINPOINT_FIRST",
      relation: "CONTRADICTS_PAINPOINT",
      scores: {
        VISIBLE_PAINPOINT_EVIDENCE: 30,
        COPY_SCENE_RELATION: 25,
        BUSINESS_SCENE_RECOGNITION: 20,
        CONTRAST_OR_DIAGNOSTIC_VALIDITY: 25,
      },
      visibleEvidence: ["perfectly clear category", "obvious entrance"],
      diagnosticMarkers: [],
      storefrontGeneric: false,
    });
    expect(result.hard_blocks).toContain("PAINPOINT_SCENE_CONTRADICTION");
    expect(result.result).toBe("BLOCKED");
  });

  it("blocks generic category imagery and unexplained diagnostic markers", () => {
    const result = evaluatePainpointSceneCongruence({
      strategy: "QUESTION_FIRST",
      relation: "NEUTRAL_CATEGORY_RELEVANCE",
      scores: {
        VISIBLE_PAINPOINT_EVIDENCE: 20,
        COPY_SCENE_RELATION: 20,
        BUSINESS_SCENE_RECOGNITION: 20,
        CONTRAST_OR_DIAGNOSTIC_VALIDITY: 20,
      },
      visibleEvidence: ["generic storefront"],
      diagnosticMarkers: [{ explained: false }],
      storefrontGeneric: true,
    });
    expect(result.hard_blocks).toEqual(
      expect.arrayContaining([
        "PAINPOINT_VISUAL_EVIDENCE_WEAK",
        "GENERIC_STOREFRONT_VISUAL",
        "DIAGNOSTIC_MARKER_UNEXPLAINED",
      ]),
    );
  });

  it("requires locale evidence and asks only when region materially changes the scene", () => {
    expect(
      evaluateLocaleSceneFit({
        audienceLocale: "中国城市商业街",
        projectRegion: "成都",
        resolvedSceneLocale: "成都城市商业街",
        localeEvidence: ["中文城市街区尺度", "本地常见沿街店铺界面"],
        regionMateriallyChangesScene: true,
      }).result,
    ).toBe("PASS_PENDING_OPERATOR");
    const blocked = evaluateLocaleSceneFit({
      audienceLocale: "中国城市商业街",
      projectRegion: null,
      resolvedSceneLocale: "中国城市商业街",
      localeEvidence: ["中文城市街区尺度", "沿街店铺界面"],
      regionMateriallyChangesScene: true,
    });
    expect(blocked.region_question_required).toBe(true);
    expect(blocked.result).toBe("BLOCKED");
  });

  it("plans D E F with fixed copy and materially different visual logic", () => {
    const concepts = planCommercialSpaceCalibrationRound2();
    expect(concepts.map((item) => item.candidateId)).toEqual([
      "CCC-CAL-SPACE-001-D",
      "CCC-CAL-SPACE-001-E",
      "CCC-CAL-SPACE-001-F",
    ]);
    expect(new Set(concepts.map((item) => item.compositionFamily)).size).toBe(3);
    expect(new Set(concepts.map((item) => item.assetStructure)).size).toBe(3);
    expect(concepts.every((item) => item.hook === "门店老板，\n你的门头在劝退顾客吗")).toBe(true);
    expect(concepts.every((item) => item.secondary === "先查品类、定位、入口这3处")).toBe(true);
  });
});
