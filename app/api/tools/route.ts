import { NextResponse } from "next/server";
import { getTools } from "@/lib/tools";
import { Tool } from "ai";


/**
 * GET handler for the /api/tools route.
 * Serializes and returns the definitions of tools from lib/tools.ts.
 */
export async function GET() {
  try {
    const { tools, breakdown, closeClients } = await getTools();
    await closeClients();
    const serializedTools: Record<string, Tool> = {};

    for (const [name, toolInstance] of Object.entries(tools)) {
      try {
        serializedTools[name] = {
          description: toolInstance.description,
          parameters: toolInstance.parameters,
        };
      } catch (error) {
        console.error(`Error serializing tool ${name}:`, error);
        serializedTools[name] = {
          description: toolInstance.description,
          parameters: {
            error: `Failed to serialize parameters for tool ${name}`,
          },
        };
      }
    }

    return NextResponse.json({
      tools: serializedTools,
      breakdown,
      config: { mcpServers: {} },
    });
  } catch (error) {
    console.error("Error serializing tools:", error);
    return NextResponse.json(
      { error: "Failed to serialize tools" },
      { status: 500 }
    );
  }
}
