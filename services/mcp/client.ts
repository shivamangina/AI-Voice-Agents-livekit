import { Tool } from "ai";
import { getDefaultStore } from "jotai";
import {
  toolsAtom,
  isMcpLoadingAtom,
  errorAtom,
  breakdownAtom,
  isMcpConfigOpenAtom,
  serverConfigAtom,
} from "./atoms";

class MCPClient {
  private get state() {
    const store = getDefaultStore();
    return store;
  }
  private setTools(tools: Record<string, Record<string, Tool>>) {
    this.state.set(toolsAtom, tools);
  }
  private setIsLoading(isLoading: boolean) {
    this.state.set(isMcpLoadingAtom, isLoading);
  }
  private setError(error: string) {
    this.state.set(errorAtom, error);
  }
  private setBreakdown(breakdown: Record<string, Record<string, Tool>>) {
    this.state.set(breakdownAtom, breakdown);
  }

  private setServerConfig(serverConfig: Record<string, unknown>) {
    this.state.set(serverConfigAtom, serverConfig);
  }

  public async getTools(): Promise<void> {
    try {
      const response = await fetch("/api/tools");
      if (!response.ok) {
        throw new Error("Failed to fetch tools");
      }
      const data = await response.json();

      this.setTools(data);
      this.setBreakdown(data.breakdown);
      this.setServerConfig(data.config || { mcpServers: {} });
    } catch (err) {
      this.setError(
        err instanceof Error ? err.message : "Failed to load tools"
      );
    } finally {
      this.setIsLoading(false);
    }
  }
}

const mcpClient = new MCPClient();
export default mcpClient;
