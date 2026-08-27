export const TYPOGRAPHY_SPATIAL_ERROR_CODES = [
  "TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED",
  "TEXT_TEXT_OVERLAP",
  "TEXT_GRAPHIC_OCCLUSION",
  "TEXT_REGION_COLLISION",
  "INSUFFICIENT_CONTAINER_PADDING",
  "LINE_GLYPH_COLLISION",
  "FORCED_TRACKING_DISTORTION",
  "ORPHAN_CHARACTER_BREAK",
  "COMPETING_PRIMARY_TEXT",
  "DENSITY_FORCED_COMPRESSION",
  "TYPOGRAPHIC_BREATHING_ROOM_WEAK",
] as const;

export type TypographySpatialErrorCode = (typeof TYPOGRAPHY_SPATIAL_ERROR_CODES)[number];

export interface SpatialRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TextLayerMeasurement {
  layer_id: string;
  role: "TITLE" | "SECONDARY" | "BODY" | "SIGNATURE" | "PAGE_NUMBER";
  text: string;
  lines: string[];
  rect: SpatialRect;
  container_rect: SpatialRect | null;
  container_padding_required: boolean;
  font_family: string;
  font_size_px: number;
  font_weight: number;
  line_height_px: number;
  letter_spacing_px: number;
  z_index: number;
  visibility: "VISIBLE" | "HIDDEN";
  primary_visual_weight: number;
  forced_compression: boolean;
  glyph_collision_detected: boolean;
}

export interface GraphicLayerMeasurement {
  graphic_id: string;
  rect: SpatialRect;
  z_index: number;
  visibility: "VISIBLE" | "HIDDEN";
  occludes_text_layer_ids: string[];
}

export interface TypographySpatialIntegrityInput {
  text_layers: TextLayerMeasurement[];
  graphic_layers: GraphicLayerMeasurement[];
  visual_collision_pairs: Array<[string, string]>;
  intentional_image_text_interlocks: Array<{
    text_layer_id: string;
    graphic_id: string;
    glyphs_fully_readable: boolean;
  }>;
}

function assertFiniteRect(rect: SpatialRect, label: string): void {
  for (const [key, value] of Object.entries(rect)) {
    if (!Number.isFinite(value) || value < 0)
      throw new Error(`TYPOGRAPHY_SPATIAL_MEASUREMENT_INVALID:${label}:${key}`);
  }
}

function overlaps(left: SpatialRect, right: SpatialRect): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
  );
}

function horizontalProjectionOverlaps(left: SpatialRect, right: SpatialRect): boolean {
  return left.x < right.x + right.width && left.x + left.width > right.x;
}

function verticalGap(left: SpatialRect, right: SpatialRect): number {
  if (left.y <= right.y) return Math.max(0, right.y - (left.y + left.height));
  return Math.max(0, left.y - (right.y + right.height));
}

function containerPadding(layer: TextLayerMeasurement): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} | null {
  const container = layer.container_rect;
  if (!container) return null;
  return {
    top: layer.rect.y - container.y,
    right: container.x + container.width - (layer.rect.x + layer.rect.width),
    bottom: container.y + container.height - (layer.rect.y + layer.rect.height),
    left: layer.rect.x - container.x,
  };
}

function normalizedHanLine(value: string): string {
  return value.replace(/[\s，。！？、；：,.!?;:“”‘’（）()《》【】[\]—…-]/gu, "");
}

export function evaluateTypographySpatialIntegrity(input: TypographySpatialIntegrityInput) {
  if (input.text_layers.length === 0) throw new Error("TYPOGRAPHY_SPATIAL_TEXT_LAYER_REQUIRED");
  for (const layer of input.text_layers) {
    assertFiniteRect(layer.rect, layer.layer_id);
    if (layer.container_rect) assertFiniteRect(layer.container_rect, `${layer.layer_id}:container`);
    if (
      !Number.isFinite(layer.font_size_px) ||
      !Number.isFinite(layer.line_height_px) ||
      !Number.isFinite(layer.letter_spacing_px) ||
      layer.font_size_px <= 0 ||
      layer.line_height_px <= 0 ||
      layer.primary_visual_weight < 0 ||
      layer.primary_visual_weight > 1
    )
      throw new Error(`TYPOGRAPHY_SPATIAL_FONT_METRIC_INVALID:${layer.layer_id}`);
  }
  const hardBlocks = new Set<TypographySpatialErrorCode>();
  const findings: Array<{
    code: TypographySpatialErrorCode;
    layer_ids: string[];
    reason: string;
  }> = [];
  const add = (code: TypographySpatialErrorCode, layerIds: string[], reason: string) => {
    hardBlocks.add(code);
    findings.push({ code, layer_ids: layerIds, reason });
  };

  const visibleText = input.text_layers.filter((layer) => layer.visibility === "VISIBLE");
  for (let leftIndex = 0; leftIndex < visibleText.length; leftIndex += 1) {
    const left = visibleText[leftIndex];
    if (!left) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < visibleText.length; rightIndex += 1) {
      const right = visibleText[rightIndex];
      if (!right) continue;
      if (overlaps(left.rect, right.rect)) {
        add(
          "TEXT_TEXT_OVERLAP",
          [left.layer_id, right.layer_id],
          "Formal text bounding boxes overlap.",
        );
        continue;
      }
      const visuallyDeclared = input.visual_collision_pairs.some(
        ([first, second]) =>
          (first === left.layer_id && second === right.layer_id) ||
          (first === right.layer_id && second === left.layer_id),
      );
      const gap = verticalGap(left.rect, right.rect);
      const visualSeparationFloor = Math.min(left.line_height_px, right.line_height_px) * 0.5;
      if (
        visuallyDeclared ||
        (horizontalProjectionOverlaps(left.rect, right.rect) && gap < visualSeparationFloor)
      )
        add(
          "TEXT_REGION_COLLISION",
          [left.layer_id, right.layer_id],
          `Visual text-region separation ${gap.toFixed(2)}px is below the relative floor ${visualSeparationFloor.toFixed(2)}px.`,
        );
    }
  }

  for (const graphic of input.graphic_layers.filter((layer) => layer.visibility === "VISIBLE")) {
    assertFiniteRect(graphic.rect, graphic.graphic_id);
    for (const textLayerId of graphic.occludes_text_layer_ids) {
      const layer = visibleText.find((item) => item.layer_id === textLayerId);
      if (!layer || !overlaps(layer.rect, graphic.rect)) continue;
      const readableInterlock = input.intentional_image_text_interlocks.some(
        (item) =>
          item.text_layer_id === textLayerId &&
          item.graphic_id === graphic.graphic_id &&
          item.glyphs_fully_readable,
      );
      if (!readableInterlock)
        add(
          "TEXT_GRAPHIC_OCCLUSION",
          [textLayerId, graphic.graphic_id],
          "A higher visual layer intersects and damages the formal text region.",
        );
    }
  }

  for (const layer of visibleText) {
    const padding = containerPadding(layer);
    if (layer.container_padding_required) {
      const floor = Math.max(layer.font_size_px * 0.18, layer.line_height_px * 0.16);
      if (!padding || Math.min(padding.top, padding.right, padding.bottom, padding.left) < floor)
        add(
          "INSUFFICIENT_CONTAINER_PADDING",
          [layer.layer_id],
          `Container padding is below the font-relative floor ${floor.toFixed(2)}px.`,
        );
    }
    if (layer.glyph_collision_detected || layer.line_height_px < layer.font_size_px * 0.88)
      add(
        "LINE_GLYPH_COLLISION",
        [layer.layer_id],
        "Rendered line-height or visual glyph evidence indicates adjacent glyph collision.",
      );
    const letterSpacingEm = layer.letter_spacing_px / layer.font_size_px;
    if (
      letterSpacingEm < -0.08 ||
      letterSpacingEm > 0.12 ||
      /[\p{Script=Han}] [\p{Script=Han}]/u.test(layer.text)
    )
      add(
        "FORCED_TRACKING_DISTORTION",
        [layer.layer_id],
        `Letter spacing ${letterSpacingEm.toFixed(3)}em or inserted Han spacing distorts normal reading.`,
      );
    if (layer.lines.some((line) => normalizedHanLine(line).length === 1))
      add(
        "ORPHAN_CHARACTER_BREAK",
        [layer.layer_id],
        "A core Chinese character is isolated on its own rendered line.",
      );
    if (layer.forced_compression)
      add(
        "DENSITY_FORCED_COMPRESSION",
        [layer.layer_id],
        "Typography was compressed to preserve the existing layout.",
      );
  }

  const primaryLayers = visibleText.filter((layer) => layer.primary_visual_weight >= 0.82);
  if (primaryLayers.length > 1)
    add(
      "COMPETING_PRIMARY_TEXT",
      primaryLayers.map((layer) => layer.layer_id),
      "More than one formal text region carries near-primary visual weight.",
    );

  if (hardBlocks.size > 0) hardBlocks.add("TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED");
  return {
    measurements: input.text_layers,
    findings,
    hard_blocks: [...hardBlocks],
    result: hardBlocks.size > 0 ? ("BLOCKED" as const) : ("PASS" as const),
    visual_quality_eligible: hardBlocks.size === 0,
    mechanical_geometry_checked: true as const,
    visual_spatial_qa_required: true as const,
  };
}

export interface TypographyBreathingRoomInput {
  title_layer: TextLayerMeasurement;
  secondary_layer: TextLayerMeasurement;
  minimum_text_to_image_distance_px: number;
  information_groups_visually_distinct: boolean;
  visual_pressure_detected: boolean;
}

export function evaluateTypographyBreathingRoom(input: TypographyBreathingRoomInput) {
  const titleToSecondaryDistance = verticalGap(input.title_layer.rect, input.secondary_layer.rect);
  const titleToSecondaryRatio = titleToSecondaryDistance / input.title_layer.line_height_px;
  const titlePadding = containerPadding(input.title_layer);
  const secondaryPadding = containerPadding(input.secondary_layer);
  const paddingValues = [titlePadding, secondaryPadding]
    .filter((value): value is NonNullable<typeof value> => value !== null)
    .flatMap((value) => [value.top, value.right, value.bottom, value.left]);
  const minimumContainerPaddingPx = paddingValues.length ? Math.min(...paddingValues) : null;
  const textToImageRatio =
    input.minimum_text_to_image_distance_px / input.title_layer.line_height_px;
  const hardBlocks: TypographySpatialErrorCode[] = [];
  if (
    titleToSecondaryRatio < 0.5 ||
    textToImageRatio < 0.25 ||
    !input.information_groups_visually_distinct ||
    input.visual_pressure_detected
  )
    hardBlocks.push("TYPOGRAPHIC_BREATHING_ROOM_WEAK");
  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Math.min(1, titleToSecondaryRatio / 0.75) * 40 +
          Math.min(1, textToImageRatio / 0.5) * 30 +
          (input.information_groups_visually_distinct ? 20 : 0) +
          (input.visual_pressure_detected ? 0 : 10),
      ),
    ),
  );
  return {
    title_to_secondary_distance_px: Number(titleToSecondaryDistance.toFixed(2)),
    title_to_secondary_ratio: Number(titleToSecondaryRatio.toFixed(3)),
    reference_soft_range: { minimum: 0.5, maximum: 1, fixed_pixel_rule: false as const },
    minimum_container_padding_px:
      minimumContainerPaddingPx === null ? null : Number(minimumContainerPaddingPx.toFixed(2)),
    minimum_text_to_image_distance_px: Number(input.minimum_text_to_image_distance_px.toFixed(2)),
    text_to_image_distance_ratio: Number(textToImageRatio.toFixed(3)),
    information_groups_visually_distinct: input.information_groups_visually_distinct,
    visual_pressure_detected: input.visual_pressure_detected,
    score,
    hard_blocks: hardBlocks,
    result: hardBlocks.length ? ("BLOCKED" as const) : ("PASS" as const),
  };
}

export function resolveTypographyOverflowRecovery(input: {
  cover_copy_revision_allowed: boolean;
  composition_revision_available: boolean;
}) {
  if (input.cover_copy_revision_allowed) return "COVER_COPY_REVISION_REQUIRED" as const;
  if (input.composition_revision_available) return "PAGE_COMPOSITION_REVISION_REQUIRED" as const;
  return "TYPOGRAPHY_SPATIAL_INTEGRITY_BLOCKED" as const;
}

export function runVisualQualityAfterTypographyGate<T>(
  spatial: ReturnType<typeof evaluateTypographySpatialIntegrity>,
  breathing: ReturnType<typeof evaluateTypographyBreathingRoom>,
  calculateVisualQuality: () => T,
): { evaluated: true; value: T } | { evaluated: false; value: null } {
  if (spatial.result !== "PASS" || breathing.result !== "PASS")
    return { evaluated: false, value: null };
  return { evaluated: true, value: calculateVisualQuality() };
}
