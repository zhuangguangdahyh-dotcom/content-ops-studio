import { GENERATED_ROOT, renderGeneratedContracts } from "./lib/contracts-generation.js";

const files = await renderGeneratedContracts(GENERATED_ROOT);
console.log(`Generated ${files.length} TypeScript contract files.`);
