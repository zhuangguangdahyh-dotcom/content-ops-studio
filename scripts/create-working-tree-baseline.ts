import path from "node:path";
import { createBaseline } from "./lib/working-tree-baseline.js";

const root = path.resolve(process.cwd());
const baseline = await createBaseline(root);
console.log(
  JSON.stringify({
    status: "READY",
    baseline_id: baseline.baseline_id,
    file_count: baseline.file_count,
    aggregate_hash: baseline.aggregate_hash,
  }),
);
