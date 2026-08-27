import { checkGeneratedContracts } from "./lib/contracts-generation.js";

await checkGeneratedContracts();
console.log("Generated contract declarations are fresh.");
