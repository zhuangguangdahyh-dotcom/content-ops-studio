import { describe, expect, it } from "vitest";
import {
  compileContrastRevisedFormalCalibrationCoverHtml,
  compileFormalCalibrationCoverHtml,
} from "../../packages/renderer/src/formal-calibration-cover.js";

describe("formal calibration cover renderer contract", () => {
  const backgroundBytes = Buffer.from("formal-calibration-background");

  it("keeps the approved calibration copy inside Renderer-owned text layers", () => {
    const html = compileFormalCalibrationCoverHtml({
      backgroundBytes,
      primaryCopy: "门头没说清，顾客就走了",
      supportingCopy: "门店老板先查品类、定位和入口",
    });
    expect(html).toContain("门头没说清，");
    expect(html).toContain("顾客就走了");
    expect(html).toContain("门店老板先查品类、");
    expect(html).toContain("定位和入口");
    expect(html).toContain('data-role="PRIMARY"');
    expect(html).toContain('data-role="SUPPORTING"');
  });

  it("uses natural negative space without a default panel or gradient mask", () => {
    const html = compileFormalCalibrationCoverHtml({
      backgroundBytes,
      primaryCopy: "门头没说清，顾客就走了",
      supportingCopy: "门店老板先查品类、定位和入口",
    });
    expect(html).not.toContain("linear-gradient");
    expect(html).not.toContain('class="panel"');
    expect(html).not.toContain('class="mask"');
  });

  it("rejects copy drift before Chromium is launched", () => {
    expect(() =>
      compileFormalCalibrationCoverHtml({
        backgroundBytes,
        primaryCopy: "门头没说清",
        supportingCopy: "门店老板先查品类、定位和入口",
      }),
    ).toThrow("FORMAL_CALIBRATION_PRIMARY_COPY_DRIFT");
  });

  it("keeps revised secondary copy fully opaque and uses a restrained local correction", () => {
    const html = compileContrastRevisedFormalCalibrationCoverHtml({
      backgroundBytes,
      primaryCopy: "门头没说清，顾客就走了",
      supportingCopy: "门店老板先查品类、定位和入口",
    });
    expect(html).toContain("color:#111111;opacity:1");
    expect(html).toContain('class="local-value-correction"');
    expect(html).not.toContain('class="panel"');
    expect(html).not.toContain("rgba(255,255,255,1)");
    expect(html).toContain("font-size:172px");
    expect(html).toContain("font-size:96px");
  });
});
