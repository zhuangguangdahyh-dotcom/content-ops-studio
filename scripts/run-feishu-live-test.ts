import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadSchemaRegistry } from "../packages/contracts/src/validation/index.js";
import {
  ApprovalProcessor,
  DeterministicIdFactory,
  RunJournal,
  nodeHashProvider,
  systemClock,
} from "../packages/runtime/src/index.js";
import {
  CompositeFeishuCredentialProvider,
  EnvironmentFeishuCredentialProvider,
  FeishuProjectProvisioner,
  FeishuTokenProvider,
  FeishuWorkspaceAdapter,
  FileFeishuProvisioningStateStore,
  NodeFetchFeishuTransport,
  buildFeishuReconciliationReport,
  evaluateFeishuLiveWriteGate,
  planSafeFeishuRepairs,
  redactFeishuText,
  requireFeishuCredentials,
  type FeishuBlueprint,
} from "../packages/workspace-adapters/src/index.js";
import {
  PHASE_2B1_SAFE_OMITTED_FIELD,
  buildPhase2B1LiveIdentity,
  phase2B1Approval,
  phase2B1ProjectDraft,
} from "./lib/feishu-phase-2b1-live.js";

const confirmed = process.argv.includes("--confirm-live-write");
const environment = process.env;
const configured = Boolean(
  environment.FEISHU_APP_ID &&
  environment.FEISHU_APP_SECRET &&
  environment.FEISHU_TEST_PARENT_FOLDER_TOKEN &&
  environment.CONTENT_OPS_ENABLE_LIVE_FEISHU === "1",
);

if (!configured || !confirmed) {
  console.log(
    JSON.stringify({
      overall_status: "NOT_CONFIGURED",
      configured,
      cli_confirmed: confirmed,
      writes_attempted: 0,
      sensitive_data_redacted: true,
    }),
  );
  process.exitCode = 0;
} else {
  const home = environment.CONTENT_OPS_HOME;
  if (!home) {
    console.log(
      JSON.stringify({
        overall_status: "BLOCKED",
        reason: "CONTENT_OPS_HOME_REQUIRED",
        writes_attempted: 0,
        sensitive_data_redacted: true,
      }),
    );
    process.exitCode = 2;
  } else {
    const gate = evaluateFeishuLiveWriteGate({ environment, cliConfirmed: confirmed });
    if (!gate.allowed) throw new Error("Live gate unexpectedly closed.");

    const requestedTimestamp = Number(environment.CONTENT_OPS_PHASE2B1_RUN_STAMP ?? Date.now());
    if (!Number.isSafeInteger(requestedTimestamp) || requestedTimestamp <= 0)
      throw new Error("CONTENT_OPS_PHASE2B1_RUN_STAMP must be a positive integer timestamp.");
    const identity = buildPhase2B1LiveIdentity(requestedTimestamp);
    const blueprint = JSON.parse(
      await readFile(
        path.resolve("plugins/content-ops-studio/templates/feishu/workspace-v1.json"),
        "utf8",
      ),
    ) as FeishuBlueprint;
    const partialBlueprint = structuredClone(blueprint);
    const projectTable = partialBlueprint.tables.find(
      (table) => table.logicalKey === "projectConfig",
    );
    if (!projectTable) throw new Error("Project configuration table is missing.");
    projectTable.fields = projectTable.fields.filter(
      (field) => field.logicalKey !== PHASE_2B1_SAFE_OMITTED_FIELD,
    );

    const primaryStateFile = path.join(
      home,
      "projects",
      identity.projectId,
      "workspace",
      "provisioning-state.json",
    );
    const repairStateFile = path.join(
      home,
      "projects",
      identity.repairProjectId,
      "workspace",
      "provisioning-state.json",
    );
    const primaryStore = new FileFeishuProvisioningStateStore(primaryStateFile);
    const repairStore = new FileFeishuProvisioningStateStore(repairStateFile);
    const credentialsProvider = new CompositeFeishuCredentialProvider([
      new EnvironmentFeishuCredentialProvider(environment),
    ]);
    const credentials = await requireFeishuCredentials(credentialsProvider, true);
    const createAdapter = () =>
      new FeishuWorkspaceAdapter({
        transport: new NodeFetchFeishuTransport({
          tokenProvider: new FeishuTokenProvider({ credentials: credentialsProvider }),
        }),
      });
    const primaryAdapter = createAdapter();
    const repairAdapter = createAdapter();
    const primaryOperations: string[] = [];
    const repairOperations: string[] = [];
    const draft = phase2B1ProjectDraft();
    const parentFolderToken = credentials.testParentFolderToken?.reveal() ?? "";
    const primaryProvisioner = new FeishuProjectProvisioner({
      adapter: primaryAdapter,
      stateStore: primaryStore,
      blueprint,
      projectId: identity.projectId,
      projectName: "ContentOpsStudio Phase2B1 沙箱测试",
      baseTitle: identity.primaryBaseTitle,
      runId: identity.runId,
      parentFolderToken,
      workspaceDirectory: path.dirname(primaryStateFile),
      projectDraft: draft,
      onOperation: (event) => {
        primaryOperations.push(`${event.outcome}:${event.operation}`);
      },
    });
    const repairPartialProvisioner = new FeishuProjectProvisioner({
      adapter: repairAdapter,
      stateStore: repairStore,
      blueprint: partialBlueprint,
      projectId: identity.repairProjectId,
      projectName: "ContentOpsStudio Phase2B1 沙箱修复测试",
      baseTitle: identity.repairBaseTitle,
      runId: identity.repairRunId,
      parentFolderToken,
      workspaceDirectory: path.dirname(repairStateFile),
      projectDraft: draft,
      onOperation: (event) => {
        repairOperations.push(`${event.outcome}:${event.operation}`);
      },
    });
    const repairProvisioner = new FeishuProjectProvisioner({
      adapter: repairAdapter,
      stateStore: repairStore,
      blueprint,
      projectId: identity.repairProjectId,
      projectName: "ContentOpsStudio Phase2B1 沙箱修复测试",
      baseTitle: identity.repairBaseTitle,
      runId: identity.repairRunId,
      parentFolderToken,
      workspaceDirectory: path.dirname(repairStateFile),
      projectDraft: draft,
      onOperation: (event) => {
        repairOperations.push(`${event.outcome}:${event.operation}`);
      },
    });

    const startedAt = new Date().toISOString();
    const schemaRegistry = await loadSchemaRegistry();
    const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
    const countPersistedBases = async () => {
      const states = await Promise.all([primaryStore.load(), repairStore.load()]);
      return states.filter((state) => Boolean(state?.remoteIdentifiers.appToken)).length;
    };
    try {
      const primaryFirst = await primaryProvisioner.provision();
      if (primaryFirst.overallStatus !== "AWAITING_APPROVAL")
        throw new Error("Primary provision did not pause at G1.");

      const approval = phase2B1Approval(
        identity.runId,
        identity.projectId,
        new Date().toISOString(),
      );
      schemaRegistry.assertValid(
        "https://content-ops-studio.local/schemas/1.0/approval-event.schema.json",
        approval,
      );
      const primaryRunDirectory = path.join(
        home,
        "projects",
        identity.projectId,
        "runs",
        identity.runId,
      );
      await mkdir(primaryRunDirectory, { recursive: true, mode: 0o700 });
      const journal = new RunJournal(
        path.join(primaryRunDirectory, "journal.jsonl"),
        systemClock,
        new DeterministicIdFactory(identity.runId),
        nodeHashProvider,
      );
      await journal.appendEvent({
        event_type: "APPROVAL_REQUESTED",
        run_id: identity.runId,
        project_id: identity.projectId,
        workflow_id: "PROJECT_INITIALIZATION_FEISHU_V1",
        step_id: "G1",
        status: "RECORDED",
        payload_summary: { gate: "PROJECT_PROFILE", target_version: "PROJECT-PROFILE-V1" },
      });
      const approvalResult = await new ApprovalProcessor(
        path.join(primaryRunDirectory, "approvals.jsonl"),
        journal,
      ).resumeFromApproval({
        event: approval,
        projectId: identity.projectId,
        workflowId: "PROJECT_INITIALIZATION_FEISHU_V1",
        actorSkill: "content-studio-router",
        expectedGate: "PROJECT_PROFILE",
        expectedTargetType: "PROJECT",
        expectedTargetId: identity.projectId,
        expectedTargetVersion: "PROJECT-PROFILE-V1",
        sourceRunId: identity.runId,
      });
      if (!approvalResult.resumable) throw new Error("G1 approval did not authorize resume.");
      const activated = await primaryProvisioner.activateAfterG1(true);
      if (activated.overallStatus !== "SUCCESS") throw new Error("G1 activation failed.");

      const primaryReplay = await primaryProvisioner.provision();
      if (primaryReplay.overallStatus !== "SUCCESS")
        throw new Error("Primary idempotent replay did not remain successful.");
      const primarySnapshot = await primaryAdapter.inspectSchema();
      const primaryVerification = await primaryAdapter.verifyWorkspace(blueprint);
      if (!primaryVerification.verified) throw new Error("Primary remote verification failed.");
      const primaryProjectTableId = activated.remoteIdentifiers["table:projectConfig"] ?? "";
      primaryAdapter.setFieldMap(activated.fieldMap, activated.mappingVersion);
      const primaryRecord = await primaryAdapter.findRecordByUniqueKey(
        `${identity.projectId}::project-config`,
        {
          tableId: primaryProjectTableId,
          tableLogicalKey: "projectConfig",
          uniqueFieldLogicalKey: "projectConfigRecordUniqueKey",
        },
      );
      const remoteRecordText = JSON.stringify(primaryRecord?.fields ?? {});
      const g1Verified = remoteRecordText.includes("已启用") && remoteRecordText.includes("已确认");
      if (!primaryRecord || !g1Verified) throw new Error("G1 record readback failed.");

      const repairFirst = await repairPartialProvisioner.provision();
      if (repairFirst.overallStatus !== "AWAITING_APPROVAL")
        throw new Error("Repair fixture did not reach its safe incomplete checkpoint.");
      const beforeRepairSnapshot = await repairAdapter.inspectSchema();
      const beforeRepairReport = buildFeishuReconciliationReport(
        blueprint,
        beforeRepairSnapshot,
        repairFirst.fieldMap,
      );
      const beforeRepairPlan = planSafeFeishuRepairs(beforeRepairReport);
      if (
        beforeRepairReport.overallStatus !== "REPAIR_AVAILABLE" ||
        !beforeRepairReport.missingFields.includes(PHASE_2B1_SAFE_OMITTED_FIELD) ||
        beforeRepairPlan.length !== 1
      )
        throw new Error("Repair dry run did not produce exactly one safe add operation.");
      const repaired = await repairProvisioner.provision();
      const repairVerification = await repairAdapter.verifyWorkspace(blueprint);
      if (repaired.overallStatus !== "AWAITING_APPROVAL" || !repairVerification.verified)
        throw new Error("Add-only Repair verification failed.");
      const afterRepairSnapshot = await repairAdapter.inspectSchema();
      const secondRepairReport = buildFeishuReconciliationReport(
        blueprint,
        afterRepairSnapshot,
        repaired.fieldMap,
      );
      const secondRepairPlan = planSafeFeishuRepairs(secondRepairReport);
      if (secondRepairReport.overallStatus !== "MATCH" || secondRepairPlan.length !== 0)
        throw new Error("Second Repair was not a no-op.");

      const expectedRelations = blueprint.tables
        .flatMap((table) => table.fields)
        .filter((field) => field.fieldType === "RELATION").length;
      const expectedViews = blueprint.tables.flatMap((table) => table.views).length;
      const primaryRemoteFields = primarySnapshot.tables.flatMap((table) => table.fields).length;
      const repairRemoteFields = afterRepairSnapshot.tables.flatMap((table) => table.fields).length;
      const operationsAttempted = primaryOperations.length + repairOperations.length + 1;
      const evidence = {
        evidence_id: `FLTE-${identity.runId}`,
        run_id: identity.runId,
        provider: "FEISHU",
        region: "CHINA",
        auth_mode: "SELF_BUILT_TENANT_APP",
        test_base_title_hash: sha256(`${identity.primaryBaseTitle}\n${identity.repairBaseTitle}`),
        test_base_identifier_hash: sha256(
          `${activated.remoteIdentifiers.appToken ?? ""}\n${repaired.remoteIdentifiers.appToken ?? ""}`,
        ),
        operations_attempted: operationsAttempted,
        operations_passed: operationsAttempted,
        operations_failed: 0,
        tables_verified: primarySnapshot.tables.filter((table) =>
          blueprint.tables.some((expected) => expected.displayName === table.name),
        ).length,
        fields_verified: activated.fieldMap.length,
        relations_verified: activated.fieldMap.filter((field) => [18, 21].includes(field.fieldType))
          .length,
        views_verified: primarySnapshot.tables
          .flatMap((table) => table.views)
          .filter((view) =>
            blueprint.tables
              .flatMap((table) => table.views)
              .some((expected) => expected.displayName === view.viewName),
          ).length,
        records_verified: primaryRecord ? 1 : 0,
        idempotent_replay_result: "PASSED",
        repair_result: "PASSED",
        cleanup_status: "MANUAL_REQUIRED",
        manual_cleanup_required: true,
        sensitive_data_redacted: true,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        overall_status:
          activated.fieldMap.length === 141 &&
          repaired.fieldMap.length === 141 &&
          expectedRelations === 5 &&
          expectedViews === 4 &&
          primarySnapshot.tables.length >= 4 &&
          g1Verified
            ? "PASSED"
            : "FAILED",
        schema_version: "1.0.0",
        extensions: {
          base_count: 2,
          primary_state_file: path.relative(home, primaryStateFile),
          repair_state_file: path.relative(home, repairStateFile),
          blueprint_fields: blueprint.tables.flatMap((table) => table.fields).length,
          primary_remote_total_fields: primaryRemoteFields,
          repair_remote_total_fields: repairRemoteFields,
          repair_omitted_logical_key: PHASE_2B1_SAFE_OMITTED_FIELD,
          repair_add_only_operations: beforeRepairPlan.length,
          second_repair_operations: secondRepairPlan.length,
          g1_pause: "PASSED",
          g1_approval: "PASSED",
          g1_remote_update: "PASSED",
          g1_read_verification: "PASSED",
          named_view_configuration: "NAME_ONLY",
        },
      };
      schemaRegistry.assertValid(
        "https://content-ops-studio.local/schemas/1.0/feishu-live-test-evidence.schema.json",
        evidence,
      );
      await mkdir(path.join(home, "evidence"), { recursive: true, mode: 0o700 });
      await writeFile(
        path.join(home, "evidence", `feishu-live-${identity.runId}.json`),
        `${JSON.stringify(evidence, null, 2)}\n`,
        { mode: 0o600 },
      );
      await mkdir(path.resolve("reports/verification"), { recursive: true });
      await writeFile(
        path.resolve("reports/verification/phase-2b1-feishu-live-evidence.json"),
        `${JSON.stringify(evidence, null, 2)}\n`,
      );
      console.log(JSON.stringify(evidence));
      process.exitCode = evidence.overall_status === "PASSED" ? 0 : 1;
    } catch (error) {
      const basesWithPersistedIdentifiers = await countPersistedBases();
      console.log(
        JSON.stringify({
          overall_status: "FAILED",
          error: {
            code: (error as { code?: string }).code ?? "FEISHU_API_ERROR",
            message: redactFeishuText((error as Error).message, [
              credentials.appSecret.reveal(),
              credentials.testParentFolderToken?.reveal() ?? "",
            ]),
          },
          sensitive_data_redacted: true,
          bases_with_persisted_identifiers: basesWithPersistedIdentifiers,
          manual_cleanup_required: basesWithPersistedIdentifiers > 0,
        }),
      );
      process.exitCode = 1;
    }
  }
}
