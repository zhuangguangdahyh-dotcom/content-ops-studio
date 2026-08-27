import path from "node:path";
import { compareWithBaseline } from "./lib/working-tree-baseline.js";

const difference = await compareWithBaseline(path.resolve(process.cwd()));
console.log(JSON.stringify({ status: "READY", ...difference }, null, 2));
