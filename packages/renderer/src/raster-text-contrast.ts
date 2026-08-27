import type { Page } from "playwright-core";

export interface RasterContrastRegion {
  text_layer_id: string;
  role:
    "PRIMARY_HOOK" | "SECONDARY_SIGNAL" | "BODY" | "LABEL" | "CAPTION" | "BRAND" | "PAGE_NUMBER";
  foreground_color: string;
  foreground_opacity: number;
  text_bbox: { x: number; y: number; width: number; height: number };
  resolved_font: string;
  resolved_weight: number;
}

export interface RasterContrastMeasurement extends RasterContrastRegion {
  background_region: { x: number; y: number; width: number; height: number };
  background_luminance_distribution: {
    minimum: number;
    percentile_10: number;
    median: number;
    percentile_90: number;
    maximum: number;
  };
  local_contrast_distribution: {
    minimum: number;
    percentile_10: number;
    median: number;
    percentile_90: number;
    maximum: number;
  };
  minimum_local_contrast: number;
  low_percentile_local_contrast: number;
  median_local_contrast: number;
  low_contrast_area_ratio: number;
  contrast_variance: number;
  background_complexity: number;
  foreground_background_edge_conflict: number;
  worst_local_region: {
    x: number;
    y: number;
    width: number;
    height: number;
    median_contrast: number;
  };
}

export async function analyzeRasterTextBackgroundContrast(
  page: Page,
  backgroundPng: Buffer,
  regions: RasterContrastRegion[],
): Promise<RasterContrastMeasurement[]> {
  // tsx may annotate nested functions passed to Playwright with this harmless helper.
  await page.evaluate("globalThis.__name = globalThis.__name || ((target) => target)");
  return page.evaluate(
    async ({ encoded, inputs }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${encoded}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("RASTER_CONTRAST_CANVAS_UNAVAILABLE");
      context.drawImage(image, 0, 0);

      const linear = (value: number) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      };
      const luminance = (red: number, green: number, blue: number) =>
        0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
      const parseColor = (value: string) => {
        const normalized = value.replace("#", "");
        if (!/^[0-9a-fA-F]{6}$/u.test(normalized))
          throw new Error(`RASTER_CONTRAST_COLOR_INVALID:${value}`);
        return [
          Number.parseInt(normalized.slice(0, 2), 16),
          Number.parseInt(normalized.slice(2, 4), 16),
          Number.parseInt(normalized.slice(4, 6), 16),
        ];
      };
      const contrast = (left: number, right: number) =>
        (Math.max(left, right) + 0.05) / (Math.min(left, right) + 0.05);
      const quantile = (values: number[], ratio: number) => {
        const sorted = [...values].sort((left, right) => left - right);
        return (
          sorted[
            Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * ratio)))
          ] ?? 0
        );
      };
      const round = (value: number, places = 4) => Number(value.toFixed(places));

      return inputs.map((input) => {
        const x = Math.max(0, Math.floor(input.text_bbox.x));
        const y = Math.max(0, Math.floor(input.text_bbox.y));
        const width = Math.max(1, Math.min(canvas.width - x, Math.ceil(input.text_bbox.width)));
        const height = Math.max(1, Math.min(canvas.height - y, Math.ceil(input.text_bbox.height)));
        const pixels = context.getImageData(x, y, width, height).data;
        const [red, green, blue] = parseColor(input.foreground_color);
        const foregroundLuminance = luminance(red ?? 0, green ?? 0, blue ?? 0);
        const luminances: number[] = [];
        const contrasts: number[] = [];
        let edgeCount = 0;
        let neighborCount = 0;
        const grid = new Float64Array(width * height);
        for (let row = 0; row < height; row += 1) {
          for (let column = 0; column < width; column += 1) {
            const pixelIndex = (row * width + column) * 4;
            const value = luminance(
              pixels[pixelIndex] ?? 0,
              pixels[pixelIndex + 1] ?? 0,
              pixels[pixelIndex + 2] ?? 0,
            );
            grid[row * width + column] = value;
            luminances.push(value);
            contrasts.push(contrast(foregroundLuminance, value));
            if (column > 0) {
              neighborCount += 1;
              if (Math.abs(value - (grid[row * width + column - 1] ?? value)) > 0.08)
                edgeCount += 1;
            }
            if (row > 0) {
              neighborCount += 1;
              if (Math.abs(value - (grid[(row - 1) * width + column] ?? value)) > 0.08)
                edgeCount += 1;
            }
          }
        }
        const medianContrast = quantile(contrasts, 0.5);
        const meanContrast = contrasts.reduce((sum, value) => sum + value, 0) / contrasts.length;
        const variance =
          contrasts.reduce((sum, value) => sum + (value - meanContrast) ** 2, 0) / contrasts.length;
        const threshold = input.role === "PRIMARY_HOOK" ? 3.5 : 4;
        const lowArea = contrasts.filter((value) => value < threshold).length / contrasts.length;
        const tileSize = 24;
        let worst = {
          x,
          y,
          width: Math.min(tileSize, width),
          height: Math.min(tileSize, height),
          median_contrast: 21,
        };
        for (let tileY = 0; tileY < height; tileY += tileSize) {
          for (let tileX = 0; tileX < width; tileX += tileSize) {
            const tile: number[] = [];
            const tileWidth = Math.min(tileSize, width - tileX);
            const tileHeight = Math.min(tileSize, height - tileY);
            for (let row = tileY; row < tileY + tileHeight; row += 1)
              for (let column = tileX; column < tileX + tileWidth; column += 1)
                tile.push(contrast(foregroundLuminance, grid[row * width + column] ?? 0));
            const tileMedian = quantile(tile, 0.5);
            if (tileMedian < worst.median_contrast)
              worst = {
                x: x + tileX,
                y: y + tileY,
                width: tileWidth,
                height: tileHeight,
                median_contrast: tileMedian,
              };
          }
        }
        const edgeRatio = neighborCount ? edgeCount / neighborCount : 0;
        const luminanceDistribution = {
          minimum: round(quantile(luminances, 0)),
          percentile_10: round(quantile(luminances, 0.1)),
          median: round(quantile(luminances, 0.5)),
          percentile_90: round(quantile(luminances, 0.9)),
          maximum: round(quantile(luminances, 1)),
        };
        const contrastDistribution = {
          minimum: round(quantile(contrasts, 0)),
          percentile_10: round(quantile(contrasts, 0.1)),
          median: round(medianContrast),
          percentile_90: round(quantile(contrasts, 0.9)),
          maximum: round(quantile(contrasts, 1)),
        };
        return {
          ...input,
          background_region: { x, y, width, height },
          background_luminance_distribution: luminanceDistribution,
          local_contrast_distribution: contrastDistribution,
          minimum_local_contrast: contrastDistribution.minimum,
          low_percentile_local_contrast: contrastDistribution.percentile_10,
          median_local_contrast: contrastDistribution.median,
          low_contrast_area_ratio: round(lowArea),
          contrast_variance: round(variance),
          background_complexity: round(edgeRatio),
          foreground_background_edge_conflict: round(edgeRatio),
          worst_local_region: { ...worst, median_contrast: round(worst.median_contrast) },
        };
      });
    },
    { encoded: backgroundPng.toString("base64"), inputs: regions },
  );
}
