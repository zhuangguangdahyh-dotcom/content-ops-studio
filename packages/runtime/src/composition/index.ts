import type { AssetStore } from "../../../core/src/assets/index.js";
import type { ImageGenerationAdapter } from "../../../image-adapters/src/index.js";
import type { RendererAdapter } from "../../../renderer/src/index.js";
import type { ResearchAdapter } from "../../../research-adapters/src/index.js";
import type { WorkspaceAdapter } from "../../../workspace-adapters/src/index.js";
import type { CapabilityRegistry } from "../capabilities/index.js";
import type { CheckpointStore } from "../checkpoints/index.js";
import type { IdempotencyRegistry } from "../idempotency/index.js";
import type { ProjectLockManager } from "../locks/index.js";
import type { ProjectRegistryStore } from "../project-registry/index.js";
import type { RecoveryManager } from "../recovery/index.js";
import type { RunStore } from "../runs/index.js";
import type { RunJournal } from "../journal/index.js";
import type { WriteLogStore } from "../write-log/index.js";
import type { ApprovalProcessor } from "../approvals/index.js";
import type { StepHandlerRegistry, WorkflowRegistry } from "../workflows/index.js";
import type { Clock, HashProvider, IdFactory, RuntimeMode } from "../types.js";
import { assertRuntimeSupported, type RuntimeSupportPolicy } from "../runtime-policy/index.js";

export interface RuntimeComposition {
  mode: RuntimeMode;
  runtimeVersion: string;
  runtimePolicy: RuntimeSupportPolicy;
  clock: Clock;
  idFactory: IdFactory;
  hashProvider: HashProvider;
  projectHomeResolver: (explicit?: string) => string;
  projectRegistryStore: ProjectRegistryStore;
  packLoader: object;
  packResolver: object;
  capabilityRegistry: CapabilityRegistry;
  workspaceAdapter: WorkspaceAdapter;
  researchAdapter: ResearchAdapter;
  imageGenerationAdapter: ImageGenerationAdapter;
  rendererAdapter: RendererAdapter;
  assetStore: AssetStore;
  projectLockManager: ProjectLockManager;
  runStore: RunStore;
  runJournal: RunJournal;
  checkpointStore: CheckpointStore;
  writeLogStore: WriteLogStore;
  workflowRegistry: WorkflowRegistry;
  stepHandlerRegistry: StepHandlerRegistry;
  approvalProcessor: ApprovalProcessor;
  idempotencyRegistry: IdempotencyRegistry;
  recoveryManager: RecoveryManager;
}

export function createRuntimeComposition(dependencies: RuntimeComposition): RuntimeComposition {
  assertRuntimeSupported(dependencies.runtimePolicy, dependencies.runtimeVersion);
  return Object.freeze({ ...dependencies });
}
