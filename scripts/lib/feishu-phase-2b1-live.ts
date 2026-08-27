import type { ApprovalEvent } from "../../packages/contracts/src/generated/1.0/index.js";

export const PHASE_2B1_SAFE_OMITTED_FIELD = "projectConfigOperatorNotes";

export interface Phase2B1LiveIdentity {
  runId: string;
  projectId: string;
  repairRunId: string;
  repairProjectId: string;
  primaryBaseTitle: string;
  repairBaseTitle: string;
}

export function buildPhase2B1LiveIdentity(timestamp = Date.now()): Phase2B1LiveIdentity {
  const suffix = String(timestamp);
  const runId = `RUN-PHASE2B1-${suffix}`;
  const repairRunId = `RUN-PHASE2B1-REPAIR-${suffix}`;
  return {
    runId,
    projectId: `PRJ-PHASE2B1-${suffix}`,
    repairRunId,
    repairProjectId: `PRJ-PHASE2B1-REPAIR-${suffix}`,
    primaryBaseTitle: `ContentOpsStudio｜Phase2B1沙箱｜${runId}`,
    repairBaseTitle: `ContentOpsStudio｜Phase2B1沙箱｜${repairRunId}`,
  };
}

export function phase2B1ProjectDraft(): Record<string, unknown> {
  return {
    projectConfigSubjectName: "栖序示例咨询",
    projectConfigSubjectType: "BRAND",
    projectConfigIndustry: "通用专业服务",
    projectConfigIndustrySubfields: ["虚构内容咨询服务"],
    projectConfigServiceRegion: ["示例城市"],
    projectConfigAudienceProfile: "虚构的小型服务企业经营者",
    projectConfigProfessionalAdvantages: "结构化内容规划与长期内容管理",
    projectConfigTargetPlatforms: ["小红书"],
    projectConfigPrimaryPlatform: "小红书",
    projectConfigIndustryPack: "generic",
    projectConfigPlatformPack: "xiaohongshu",
    projectConfigDataSource: "MOCK",
  };
}

export function phase2B1Approval(runId: string, projectId: string, at: string): ApprovalEvent {
  return {
    approval_id: `APR-${runId}-PROJECT-PROFILE-APPROVE`,
    gate: "PROJECT_PROFILE",
    target_type: "PROJECT",
    target_id: projectId,
    target_version: "PROJECT-PROFILE-V1",
    decision: "APPROVE",
    comment: "Explicit fictional Phase 2B.1 sandbox approval.",
    source_run_id: runId,
    created_at: at,
    deprecated_at: null,
    schema_version: "1.0.0",
  };
}
