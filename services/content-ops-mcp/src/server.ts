import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMcpContext, type McpContext, type McpContextOptions } from "./context.js";
import { errorEnvelope } from "./errors.js";
import { SERVER_INSTRUCTIONS } from "./instructions.js";
import { toolResult } from "./result-envelope.js";
import { TOOL_DEFINITIONS } from "./tool-registry.js";

export interface ContentOpsMcpServer {
  server: McpServer;
  context: McpContext;
}

export function createContentOpsMcpServer(
  contextOptions: McpContextOptions = {},
): ContentOpsMcpServer {
  const context = createMcpContext(contextOptions);
  const server = new McpServer(
    { name: "content-ops-studio", version: "0.2.0" },
    { instructions: SERVER_INSTRUCTIONS, capabilities: { logging: {} } },
  );

  for (const definition of TOOL_DEFINITIONS) {
    server.registerTool(
      definition.name,
      {
        title: definition.title,
        description: definition.description,
        inputSchema: definition.inputSchema,
        outputSchema: definition.outputSchema,
        annotations: definition.annotations,
      },
      async (rawInput, extra) => {
        const progressToken = extra._meta?.progressToken;
        let progress = 0;
        const heartbeat =
          progressToken !== undefined && !definition.annotations.readOnlyHint
            ? setInterval(() => {
                progress += 1;
                void extra
                  .sendNotification({
                    method: "notifications/progress",
                    params: {
                      progressToken,
                      progress,
                      message: `${definition.name} is still running; verified state remains recoverable.`,
                    },
                  })
                  .catch(() => undefined);
              }, 15_000)
            : null;
        try {
          const input = definition.inputSchema.parse(rawInput);
          return toolResult(await definition.handler(context, input));
        } catch (error) {
          return toolResult(errorEnvelope(error, definition.name), true);
        } finally {
          if (heartbeat) clearInterval(heartbeat);
        }
      },
    );
  }

  return { server, context };
}
