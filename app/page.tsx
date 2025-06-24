import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ChatHistory from "@/components/ChatHistory";
import Chat from "@/components/Chat";
import Tools from "@/components/Tools";
import ToolsInvocations from "@/components/ToolsInvocations";

export default function Home() {
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      <ResizablePanel className="h-screen" defaultSize={20}>
        <div className="text-3xl font-bold p-4">LOGO</div>
        <ChatHistory />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="h-screen" defaultSize={50}>
        <Chat />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <Tools />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <ToolsInvocations />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
