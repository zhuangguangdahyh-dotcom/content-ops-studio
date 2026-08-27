import { mkdir } from "node:fs/promises";
import path from "node:path";
import type {
  RunPlan,
  TaskEnvelope,
  TaskResult,
} from "../../../contracts/src/generated/1.0/index.js";
import { AtomicJsonStore } from "../storage/index.js";

export class RunStore {
  constructor(readonly runDirectory: string) {}

  async initialize(request: TaskEnvelope, plan: RunPlan): Promise<void> {
    await mkdir(this.runDirectory, { recursive: true, mode: 0o700 });
    await new AtomicJsonStore(path.join(this.runDirectory, "request.json")).write(request, {
      nonOverwrite: true,
    });
    await new AtomicJsonStore(path.join(this.runDirectory, "plan.json")).write(plan, {
      nonOverwrite: true,
    });
  }

  readPlan(): Promise<RunPlan> {
    return new AtomicJsonStore<RunPlan>(path.join(this.runDirectory, "plan.json")).read();
  }
  writePlan(plan: RunPlan): Promise<{ sha256: string }> {
    return new AtomicJsonStore<RunPlan>(path.join(this.runDirectory, "plan.json")).write(plan);
  }
  readResult(): Promise<TaskResult> {
    return new AtomicJsonStore<TaskResult>(path.join(this.runDirectory, "result.json")).read();
  }
  writeResult(result: TaskResult): Promise<{ sha256: string }> {
    return new AtomicJsonStore<TaskResult>(path.join(this.runDirectory, "result.json")).write(
      result,
    );
  }
}
