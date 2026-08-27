import { describe, expect, it } from "vitest";
import {
  compileCalibrationRemainingPageHtml,
  type CalibrationRemainingPageSpec,
} from "../../packages/renderer/src/calibration-remaining-pages.js";

const source = Buffer.from("verified-master-raster");
const specs: CalibrationRemainingPageSpec[] = [
  {
    pageNumber: 2,
    pageRole: "PROBLEM",
    pageIntent: "CONTENT_EDITORIAL",
    compositionFamily: "EDITORIAL_SPLIT",
    section: "",
    primary: "门头真正的问题，\n不是好不好看",
    supporting: "而是顾客第一眼能不能看懂：\n你是谁、卖什么、值不值得进去。",
    core: [],
  },
  {
    pageNumber: 3,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "DIAGNOSTIC_COMPOSITION",
    section: "第一查：品类",
    primary: "不进店，\n能一眼看懂你卖什么吗？",
    supporting: "如果门头只能传达“好看”，\n却看不出经营内容，\n顾客就需要花更多力气理解你。",
    core: [],
  },
  {
    pageNumber: 4,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "EVIDENCE_DOMINANT",
    section: "第二查：定位",
    primary: "看起来像你真正\n想吸引的那类顾客吗？",
    supporting: "材质、比例、灯光和信息密度，\n都在提前告诉顾客：\n这家店适不适合我。",
    core: [],
  },
  {
    pageNumber: 5,
    pageRole: "ANALYSIS",
    pageIntent: "DIAGNOSTIC_PAGE",
    compositionFamily: "IMAGE_DOMINANT",
    section: "第三查：入口",
    primary: "顾客知道从哪里进，\n也愿意靠近吗？",
    supporting: "入口太退、太暗、被陈列遮挡，\n都会增加顾客靠近和进入之前的犹豫。",
    core: [],
  },
  {
    pageNumber: 6,
    pageRole: "SUMMARY",
    pageIntent: "SUMMARY_PAGE",
    compositionFamily: "MULTI_EVIDENCE_EDITORIAL",
    section: "",
    primary: "门头先解决这3件事",
    supporting: "漂亮只是结果。\n让顾客第一眼更快完成判断，\n才是门头真正要解决的问题。",
    core: ["看懂品类", "感知定位", "找到入口"],
  },
];

describe("Calibration remaining-page renderer", () => {
  it("keeps every approved CV-2 copy fragment inside Renderer-owned text layers", () => {
    for (const spec of specs) {
      const html = compileCalibrationRemainingPageHtml(spec, source);
      for (const fragment of [spec.section, spec.primary, spec.supporting, ...spec.core]) {
        if (!fragment) continue;
        for (const line of fragment.split("\n")) expect(html).toContain(line);
      }
      expect(html).toContain('class="canvas"');
      expect(html).toContain("Songti SC");
    }
  });

  it("uses five materially different composition structures", () => {
    const html = specs.map((spec) => compileCalibrationRemainingPageHtml(spec, source));
    expect(html[0]).toContain('class="paper"');
    expect(html[1]).toContain('class="focus"');
    expect(html[2]).toContain('class="source crop-c"');
    expect(html[3]).toContain('class="entrance"');
    expect(html[4]).toContain('class="core text-layer"');
    expect(new Set(html.map((value) => value.match(/\.primary\{[^}]+/u)?.[0])).size).toBe(5);
  });

  it("keeps formal Chinese out of the source raster and avoids Cover-scale inner-page type", () => {
    for (const spec of specs) {
      const html = compileCalibrationRemainingPageHtml(spec, source);
      expect(html).toContain(source.toString("base64"));
      expect(html).not.toContain("font-size:172px");
      expect(html).not.toContain("font-size:190px");
    }
  });
});
