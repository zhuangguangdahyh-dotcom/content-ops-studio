export const REQUIRED_LARK_BASE_COMMANDS = [
  "+base-create",
  "+base-get",
  "+table-list",
  "+table-create",
  "+table-get",
  "+table-update",
  "+field-list",
  "+field-get",
  "+field-create",
  "+field-delete",
  "+record-list",
  "+record-search",
  "+record-get",
  "+record-upsert",
  "+record-batch-create",
  "+view-list",
  "+view-create",
  "+view-rename",
] as const;

export interface LarkCliCapabilityReport {
  status: "READY" | "BLOCKED";
  requiredCommands: string[];
  availableCommands: string[];
  missingCommands: string[];
  rawApiFallbackEnabled: false;
}

export class LarkCliCapabilityProbe {
  inspectHelp(help: string): LarkCliCapabilityReport {
    const availableCommands = [
      ...new Set([...help.matchAll(/\+(?:[a-z]+-)+[a-z]+/g)].map((match) => match[0])),
    ].sort();
    const missingCommands = REQUIRED_LARK_BASE_COMMANDS.filter(
      (command) => !availableCommands.includes(command),
    );
    return {
      status: missingCommands.length ? "BLOCKED" : "READY",
      requiredCommands: [...REQUIRED_LARK_BASE_COMMANDS],
      availableCommands,
      missingCommands,
      rawApiFallbackEnabled: false,
    };
  }
}
