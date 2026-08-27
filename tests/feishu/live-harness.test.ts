import { describe, expect, it } from "vitest";
import {
  PHASE_2B1_SAFE_OMITTED_FIELD,
  buildPhase2B1LiveIdentity,
  phase2B1Approval,
  phase2B1ProjectDraft,
} from "../../scripts/lib/feishu-phase-2b1-live.js";
import blueprint from "../../plugins/content-ops-studio/templates/feishu/workspace-v1.json" with { type: "json" };

describe("Phase 2B.1 live harness configuration", () => {
  it("uses isolated titles and the mandated fictional project data", () => {
    const identity = buildPhase2B1LiveIdentity(1234567890);
    expect(identity.primaryBaseTitle).toBe(
      "ContentOpsStudio｜Phase2B1沙箱｜RUN-PHASE2B1-1234567890",
    );
    expect(identity.repairBaseTitle).toContain("Phase2B1沙箱");
    expect(identity.repairBaseTitle).not.toBe(identity.primaryBaseTitle);
    expect(phase2B1ProjectDraft()).toMatchObject({
      projectConfigSubjectName: "栖序示例咨询",
      projectConfigSubjectType: "BRAND",
      projectConfigIndustry: "通用专业服务",
      projectConfigIndustrySubfields: ["虚构内容咨询服务"],
      projectConfigServiceRegion: ["示例城市"],
      projectConfigAudienceProfile: "虚构的小型服务企业经营者",
      projectConfigProfessionalAdvantages: "结构化内容规划与长期内容管理",
      projectConfigTargetPlatforms: ["小红书"],
      projectConfigPrimaryPlatform: "小红书",
    });
  });

  it("limits repair injection to an optional non-primary non-relation field", () => {
    const field = blueprint.tables
      .flatMap((table) => table.fields)
      .find((candidate) => candidate.logicalKey === PHASE_2B1_SAFE_OMITTED_FIELD);
    expect(field).toMatchObject({
      required: false,
      primary: false,
      fieldType: "LONG_TEXT",
    });
    expect(field?.logicalKey).not.toBe("projectConfigProjectId");
    expect(field?.logicalKey).not.toBe("projectConfigRecordUniqueKey");
  });

  it("binds the explicit G1 approval to the project and source run", () => {
    expect(
      phase2B1Approval("RUN-PHASE2B1-123", "PRJ-PHASE2B1-123", "2099-01-01T00:00:00.000Z"),
    ).toMatchObject({
      gate: "PROJECT_PROFILE",
      target_type: "PROJECT",
      target_id: "PRJ-PHASE2B1-123",
      target_version: "PROJECT-PROFILE-V1",
      decision: "APPROVE",
      source_run_id: "RUN-PHASE2B1-123",
    });
  });
});
