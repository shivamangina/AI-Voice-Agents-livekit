import { Tool, tool, experimental_createMCPClient } from "ai";
import { Experimental_StdioMCPTransport } from "ai/mcp-stdio";

const transport = new Experimental_StdioMCPTransport({
  command: "uv",
  args: [
    "run",
    "--with",
    "fastmcp",
    "fastmcp",
    "run",
    "/Users/shivakumarmangina/Desktop/mcpserver/elizaos-hackathon/mcp-servers/dice-server/dice.py",
  ],
});

const stdioClient = await experimental_createMCPClient({
  transport,
});

const stdioTools = await stdioClient.tools();

import { z } from "zod";

const tools: Record<string, Tool> = {
  weatherTool: tool({
    description: "Get the weather for a given location.",
    parameters: z.object({
      location: z
        .string()
        .describe("The city and state, e.g. San Francisco, CA"),
    }),
    execute: async ({ location }) => {
      // Mock weather data
      const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy", "Partly Cloudy"];
      const temperature = Math.floor(Math.random() * 35) + 40; // 40-75°F
      const humidity = Math.floor(Math.random() * 50) + 30; // 30-80%

      return {
        location,
        temperature,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity,
        timestamp: new Date().toISOString(),
      };
    },
  }),
};

export const getTools = async () => {
  try {
    return {
      tools: {
        ...tools,
        ...stdioTools,
      },
      breakdown: {},
      closeClients: async () => {},
    };
  } catch (error) {
    console.error("Error initializing MCP client:", error);
    // Fallback to just the local tools if MCP client fails
    return {
      tools,
      closeClients: async () => {},
    };
  }
};
