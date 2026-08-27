import { describe, expect, it } from "vitest";
import {
  buildDirectionContactSheetHtml,
  buildDirectionPreviewHtml,
  DIRECTION_CONTACT_SHEET_CANVAS,
  DIRECTION_PREVIEW_CANVAS,
} from "../../packages/renderer/src/direction-comparison.js";

const title = "先别急着相信“专业”";
const body = "真正值得判断的，不是包装有多满，而是身份、资质和服务边界能不能被核验。";
const background = "data:image/png;base64,AA==";
const prohibited = ["专业身份，先看这3点", "CTA", "TRUST", "IDENTITY", "QUALIFICATION", "BOUNDARY"];

describe("direction comparison Renderer templates", () => {
  it("uses identical approved copy and no extra information text in A, B, or C", () => {
    for (const candidate of ["A", "B", "C"] as const) {
      const html = buildDirectionPreviewHtml({
        candidate,
        title,
        body,
        ...(candidate === "B" ? {} : { backgroundDataUri: background }),
      });
      expect(html.replace('<span class="nowrap">', "").replace("</span>", "")).toContain(title);
      expect(html).toContain(body);
      expect(html).toContain('<span class="nowrap">“专业”</span>');
      for (const text of prohibited) expect(html).not.toContain(text);
      expect(html.match(/data-approved-copy=/gu)).toHaveLength(2);
    }
    expect(DIRECTION_PREVIEW_CANVAS).toEqual({ width: 1242, height: 1660 });
  });

  it("requires existing backgrounds only for A and C", () => {
    expect(() => buildDirectionPreviewHtml({ candidate: "A", title, body })).toThrow(
      /BACKGROUND_REQUIRED/,
    );
    expect(() =>
      buildDirectionPreviewHtml({ candidate: "B", title, body, backgroundDataUri: background }),
    ).toThrow(/PURE_TYPOGRAPHY_BACKGROUND_FORBIDDEN/);
  });

  it("keeps comparison labels outside three equally scaled candidate images", () => {
    const html = buildDirectionContactSheetHtml({
      previews: (["A", "B", "C"] as const).map((candidate) => ({
        candidate,
        candidateId: `VDC-C-0001-${candidate}`,
        dataUri: background,
      })),
    });
    expect(html.match(/class="label"/gu)).toHaveLength(3);
    expect(html.match(/<img /gu)).toHaveLength(3);
    expect(html).toContain("grid-template-columns:repeat(3, 675px)");
    expect(DIRECTION_CONTACT_SHEET_CANVAS).toEqual({ width: 2400, height: 1180 });
  });
});
