import { useEffect } from "react";
import mcpClient from "@/services/mcp/client";
import { errorAtom, reloadToolsAtom } from "@/services/mcp/atoms";
import { isMcpLoadingAtom } from "@/services/mcp/atoms";
import { toolsAtom } from "@/services/mcp/atoms";
import { useAtom, useAtomValue } from "jotai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ToolsSidebar() {
  const tools = useAtomValue(toolsAtom);
  const isLoading = useAtomValue(isMcpLoadingAtom);
  const error = useAtomValue(errorAtom);
  const [reloadTools, setReloadTools] = useAtom(reloadToolsAtom);

  useEffect(() => {
    if (reloadTools) {
      mcpClient.getTools();
      setReloadTools(false);
    }
  }, [reloadTools, setReloadTools]);

  return (
    <div className="w-64 border-l flex flex-col h-full bg-sidebar-background dark:bg-sidebar-background">
      <div className="p-4 border-b flex gap-2 items-center">
        <h2 className="text-lg font-semibold">Available Tools</h2>
        <a className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">
          Reset
        </a>
        <a
          className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
          // onClick={async () => {
          //   mcpClient.getTools();
          //   await fetch("/api/tools", { method: "GET" });
          //   setReloadTools(true);
          // }}
        >
          Add
        </a>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Accordion type="single" collapsible className="w-full">
          {isLoading ? (
            <div className="p-4 text-sm text-muted-foreground">
              Loading tools...
            </div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">{error}</div>
          ) : (
            tools &&
            tools.tools &&
            Object.entries(tools.tools).map(([server, tools]) => (
              <AccordionItem key={server} value={server}>
                <div className="p-4 border-b last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <AccordionTrigger>{server}</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      <div key={`${server}-${name}`}>
                        <p className="text-sm font-medium">{"description"}</p>
                        <p className="text-sm text-muted-foreground">
                          {tools.description}
                        </p>
                        <p className="text-sm font-medium">{"Parameters"}</p>
                        <p className="text-sm font-mono  text-muted-foreground">
                          
                          {JSON.stringify(tools.parameters)}
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </div>
    </div>
  );
}
