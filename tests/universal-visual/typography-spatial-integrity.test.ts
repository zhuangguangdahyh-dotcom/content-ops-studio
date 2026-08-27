import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import {
  DIVERSITY_WEIGHTS,
  evaluateCandidateSetVisualDiversity,
  evaluateTypographyBreathingRoom,
  evaluateTypographySpatialIntegrity,
  planCommercialSpaceCalibrationRound3,
  resolveTypographyOverflowRecovery,
  resolveTypographyStrategy,
  runVisualQualityAfterTypographyGate,
  type TextLayerMeasurement,
  type TypographySpatialIntegrityInput,
} from "../../packages/core/src/visual-baseline/index.js";
import { loadSchemaRegistry } from "../../packages/contracts/src/validation/index.js";

const rect = (x: number, y: number, width: number, height: number) => ({
  x,
  y,
  width,
  height,
});

function layer(
  id: string,
  role: TextLayerMeasurement["role"],
  box: ReturnType<typeof rect>,
  overrides: Partial<TextLayerMeasurement> = {},
): TextLayerMeasurement {
  const title = role === "TITLE";
  return {
    layer_id: id,
    role,
    text: title ? "门店老板，\n你的门头在劝退顾客吗" : "先查品类、定位、入口这3处",
    lines: title ? ["门店老板，", "你的门头在劝退顾客吗"] : ["先查品类、定位、入口这3处"],
    rect: box,
    container_rect: null,
    container_padding_required: false,
    font_family: "Songti SC",
    font_size_px: title ? 112 : 56,
    font_weight: title ? 700 : 400,
    line_height_px: title ? 112 : 70,
    letter_spacing_px: title ? -3 : 0,
    z_index: 3,
    visibility: "VISIBLE",
    primary_visual_weight: title ? 1 : 0.45,
    forced_compression: false,
    glyph_collision_detected: false,
    ...overrides,
  };
}

function passInput(): TypographySpatialIntegrityInput {
  return {
    text_layers: [
      layer("title", "TITLE", rect(80, 180, 820, 224)),
      layer("secondary", "SECONDARY", rect(120, 480, 620, 70)),
    ],
    graphic_layers: [],
    visual_collision_pairs: [],
    intentional_image_text_interlocks: [],
  };
}

function textPair(
  input: TypographySpatialIntegrityInput,
): [TextLayerMeasurement, TextLayerMeasurement] {
  const [titleLayer, secondaryLayer] = input.text_layers;
  if (!titleLayer || !secondaryLayer) throw new Error("TEST_TEXT_PAIR_REQUIRED");
  return [titleLayer, secondaryLayer];
}

describe("Typography Spatial Integrity hard gate", () => {
  it("detects immutable historical F even though its former typography policy passed", async () => {
    const fixture = JSON.parse(
      await readFile("tests/fixtures/typography-spatial/historical-round2-f.json", "utf8"),
    ) as TypographySpatialIntegrityInput & {
      historical_asset_sha256: string;
      prior_typography_policy_result: string;
    };
    const result = evaluateTypographySpatialIntegrity(fixture);
    expect(fixture.historical_asset_sha256).toBe(
      "d418af622f1c0d6930418b55bf419b20a6e62298454643b26684f5887df46791",
    );
    expect(fixture.prior_typography_policy_result).toBe("PASS");
    expect(result.result).toBe("BLOCKED");
    expect(result.hard_blocks).toContain("TEXT_REGION_COLLISION");
  });

  it("retains historical D as a typography-only positive reference", async () => {
    const fixture = JSON.parse(
      await readFile("tests/fixtures/typography-spatial/historical-round2-d.json", "utf8"),
    ) as TypographySpatialIntegrityInput & { historical_asset_sha256: string };
    const result = evaluateTypographySpatialIntegrity(fixture);
    expect(fixture.historical_asset_sha256).toBe(
      "60fdeaf029abc177e4bb7f09a543c8631e08b612af2d2abf60874464eb7dc0e8",
    );
    expect(result.result).toBe("PASS");
  });

  it("hard-blocks formal text/text overlap", () => {
    const input = passInput();
    input.text_layers[1] = layer("secondary", "SECONDARY", rect(120, 350, 620, 70));
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain("TEXT_TEXT_OVERLAP");
  });

  it("hard-blocks graphic occlusion that damages text", () => {
    const input = passInput();
    input.graphic_layers.push({
      graphic_id: "crop",
      rect: rect(100, 220, 300, 140),
      z_index: 4,
      visibility: "VISIBLE",
      occludes_text_layer_ids: ["title"],
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "TEXT_GRAPHIC_OCCLUSION",
    );
  });

  it("blocks visually colliding regions without mathematical overlap", () => {
    const input = passInput();
    input.text_layers[1] = layer("secondary", "SECONDARY", rect(120, 430, 620, 70));
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "TEXT_REGION_COLLISION",
    );
  });

  it("blocks font-relative container padding that is too small", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(105, 205, 790, 214), {
      container_rect: rect(100, 200, 800, 224),
      container_padding_required: true,
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "INSUFFICIENT_CONTAINER_PADDING",
    );
  });

  it("blocks line-height and glyph collision", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(80, 180, 820, 180), {
      line_height_px: 80,
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain("LINE_GLYPH_COLLISION");
  });

  it("blocks an orphan Chinese character line", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(80, 180, 820, 336), {
      lines: ["门店老板，", "你的门头在劝退顾客", "吗"],
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "ORPHAN_CHARACTER_BREAK",
    );
  });

  it("blocks forced tracking distortion", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(80, 180, 820, 224), {
      letter_spacing_px: -15,
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "FORCED_TRACKING_DISTORTION",
    );
  });

  it("blocks competing primary text regions", () => {
    const input = passInput();
    input.text_layers[1] = layer("secondary", "SECONDARY", rect(120, 480, 620, 70), {
      primary_visual_weight: 0.9,
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "COMPETING_PRIMARY_TEXT",
    );
  });

  it("allows high-density typography when geometry remains intact", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(64, 120, 980, 224), {
      font_size_px: 108,
      line_height_px: 108,
    });
    input.text_layers[1] = layer("secondary", "SECONDARY", rect(96, 412, 760, 68), {
      font_size_px: 54,
      line_height_px: 68,
    });
    expect(evaluateTypographySpatialIntegrity(input).result).toBe("PASS");
  });

  it("blocks high-density layout when it relies on compression", () => {
    const input = passInput();
    input.text_layers[0] = layer("title", "TITLE", rect(64, 120, 980, 180), {
      forced_compression: true,
    });
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain(
      "DENSITY_FORCED_COMPRESSION",
    );
  });

  it("allows intentional image/text interlock when every glyph stays readable", () => {
    const input = passInput();
    input.graphic_layers.push({
      graphic_id: "image-edge",
      rect: rect(60, 180, 80, 224),
      z_index: 4,
      visibility: "VISIBLE",
      occludes_text_layer_ids: ["title"],
    });
    input.intentional_image_text_interlocks.push({
      text_layer_id: "title",
      graphic_id: "image-edge",
      glyphs_fully_readable: true,
    });
    expect(evaluateTypographySpatialIntegrity(input).result).toBe("PASS");
  });

  it("does not allow intentional-design labeling to excuse text/text overlap", () => {
    const input = passInput();
    input.text_layers[1] = layer("secondary", "SECONDARY", rect(120, 350, 620, 70));
    input.visual_collision_pairs.push(["title", "secondary"]);
    expect(evaluateTypographySpatialIntegrity(input).hard_blocks).toContain("TEXT_TEXT_OVERLAP");
  });

  it("returns Cover Copy Revision before typography compression", () => {
    expect(
      resolveTypographyOverflowRecovery({
        cover_copy_revision_allowed: true,
        composition_revision_available: true,
      }),
    ).toBe("COVER_COPY_REVISION_REQUIRED");
  });

  it("returns Page Composition Revision when fixed copy cannot fit", () => {
    expect(
      resolveTypographyOverflowRecovery({
        cover_copy_revision_allowed: false,
        composition_revision_available: true,
      }),
    ).toBe("PAGE_COMPOSITION_REVISION_REQUIRED");
  });

  it("plans G/H as two materially different Round 3 composition families", () => {
    const concepts = planCommercialSpaceCalibrationRound3();
    expect(concepts.map((item) => item.candidateId)).toEqual([
      "CCC-CAL-SPACE-001-G",
      "CCC-CAL-SPACE-001-H",
    ]);
    expect(new Set(concepts.map((item) => item.compositionFamily)).size).toBe(2);
    const scores = Object.fromEntries(
      Object.entries(DIVERSITY_WEIGHTS).map(([name, weight]) => [name, weight === 15 ? 14 : 9]),
    ) as never;
    expect(
      evaluateCandidateSetVisualDiversity({
        scores,
        compositionFamilies: concepts.map((item) => item.compositionFamily),
        textRegions: concepts.map((item) => item.textRegion),
        assetStructures: concepts.map((item) => item.assetStructure),
        readingPaths: concepts.map((item) => item.readingPath),
        nearTemplateDuplicateRisk: "LOW",
      }).result,
    ).toBe("PASS_PENDING_OPERATOR");
  });

  it("keeps the existing Universal serif fallback behavior unchanged", () => {
    expect(
      resolveTypographyStrategy({
        globalDefaultEnabled: true,
        availableFonts: [{ family: "Songti SC", weights: [400, 700], chineseSerif: true }],
      }).resolved_font_family,
    ).toBe("Songti SC");
  });

  it("keeps commercial-only rules excluded from the Universal baseline", async () => {
    const policy = JSON.parse(
      await readFile("plugins/content-ops-studio/config/universal-visual-default-v1.json", "utf8"),
    ) as { industry_specific_rules_excluded: string[] };
    expect(policy.industry_specific_rules_excluded).toEqual(
      expect.arrayContaining(["HIGH_TICKET_COMMERCIAL_RENOVATION", "MITUNDAO_BRAND_SIGNATURE"]),
    );
  });

  it("keeps the Project Visual Profile contract backward-valid", async () => {
    const [registry, fixture] = await Promise.all([
      loadSchemaRegistry(),
      readFile(
        "tests/fixtures/contracts/1.0/project-visual-profile/valid/complete.json",
        "utf8",
      ).then((value) => JSON.parse(value) as unknown),
    ]);
    expect(
      registry.validateBySchemaId(
        "https://content-ops-studio.local/schemas/1.0/project-visual-profile.schema.json",
        fixture,
      ),
    ).toEqual({ valid: true, errors: [] });
  });

  it("blocks breathing room that is visually compressed", () => {
    const input = passInput();
    const [titleLayer] = textPair(input);
    const result = evaluateTypographyBreathingRoom({
      title_layer: titleLayer,
      secondary_layer: layer("secondary", "SECONDARY", rect(120, 424, 620, 70)),
      minimum_text_to_image_distance_px: 18,
      information_groups_visually_distinct: false,
      visual_pressure_detected: true,
    });
    expect(result.result).toBe("BLOCKED");
    expect(result.hard_blocks).toContain("TYPOGRAPHIC_BREATHING_ROOM_WEAK");
  });

  it("prevents Visual Quality calculation until both typography gates pass", () => {
    const input = passInput();
    const [titleLayer, secondaryLayer] = textPair(input);
    const spatial = evaluateTypographySpatialIntegrity(input);
    const breathing = evaluateTypographyBreathingRoom({
      title_layer: titleLayer,
      secondary_layer: secondaryLayer,
      minimum_text_to_image_distance_px: 64,
      information_groups_visually_distinct: true,
      visual_pressure_detected: false,
    });
    let calls = 0;
    const pass = runVisualQualityAfterTypographyGate(spatial, breathing, () => {
      calls += 1;
      return 92;
    });
    expect(pass).toEqual({ evaluated: true, value: 92 });
    expect(calls).toBe(1);

    const blockedSpatial = evaluateTypographySpatialIntegrity({
      ...input,
      visual_collision_pairs: [["title", "secondary"]],
    });
    const blocked = runVisualQualityAfterTypographyGate(blockedSpatial, breathing, () => {
      calls += 1;
      return 100;
    });
    expect(blocked).toEqual({ evaluated: false, value: null });
    expect(calls).toBe(1);
  });
});
