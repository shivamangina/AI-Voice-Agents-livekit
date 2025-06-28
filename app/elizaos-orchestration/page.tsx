/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ElizaOSOrchestrationPage() {
   const [callId, setCallId] = useState<string | null>(null);
   const [customerId, setCustomerId] = useState("");
   const [agentId, setAgentId] = useState("");
   const [input, setInput] = useState("");
   const [speaker, setSpeaker] = useState<"customer" | "agent">("customer");
   const [analyses, setAnalyses] = useState<unknown[]>([]);
   const [loading, setLoading] = useState(false);
   const [sessionActive, setSessionActive] = useState(false);

   async function startCall() {
      setLoading(true);
      const res = await fetch("/api/elizaos-orchestrator", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ action: "start-call", customerId, agentId }),
      });
      const data = await res.json();
      setCallId(data.callId);
      setSessionActive(true);
      setAnalyses([]);
      setLoading(false);
   }

   async function sendMessage() {
      if (!callId || !input.trim()) return;
      setLoading(true);
      const res = await fetch("/api/elizaos-orchestrator", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ action: "process-input", callId, input, speaker }),
      });
      const data = await res.json();
      setAnalyses((prev) => [data, ...prev]);
      setInput("");
      setLoading(false);
   }

   async function endCall() {
      if (!callId) return;
      setLoading(true);
      await fetch("/api/elizaos-orchestrator", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ action: "end-call", callId, satisfaction: 5, upsell: false }),
      });
      setSessionActive(false);
      setCallId(null);
      setLoading(false);
   }

   return (
      <div className="container mx-auto p-6 max-w-3xl">
         <h1 className="text-3xl font-bold mb-4">ElizaOS Orchestration Demo</h1>
         <Card className="mb-6">
            <CardHeader>
               <CardTitle>Start a Call Session</CardTitle>
               <CardDescription>Enter customer and agent IDs to begin a new session.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
               <Input placeholder="Customer ID" value={customerId} onChange={e => setCustomerId(e.target.value)} disabled={sessionActive} />
               <Input placeholder="Agent ID" value={agentId} onChange={e => setAgentId(e.target.value)} disabled={sessionActive} />
               <Button onClick={startCall} disabled={sessionActive || loading || !customerId || !agentId} className="w-full">Start Call</Button>
            </CardContent>
         </Card>

         {sessionActive && (
            <Card className="mb-6">
               <CardHeader>
                  <CardTitle>Send Message</CardTitle>
                  <CardDescription>Send a message as customer or agent. All ElizaOS agents will analyze it.</CardDescription>
               </CardHeader>
               <CardContent className="flex flex-col gap-2">
                  <div className="flex gap-2">
                     <Button variant={speaker === "customer" ? "default" : "outline"} onClick={() => setSpeaker("customer")}>Customer</Button>
                     <Button variant={speaker === "agent" ? "default" : "outline"} onClick={() => setSpeaker("agent")}>Agent</Button>
                  </div>
                  <Input placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} />
                  <Button onClick={sendMessage} disabled={loading || !input.trim()} className="w-full">Send</Button>
                  <Button onClick={endCall} variant="destructive" className="w-full mt-2">End Call</Button>
               </CardContent>
            </Card>
         )}

         {analyses.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle>Agent Analyses</CardTitle>
                  <CardDescription>Results from all ElizaOS agents for each message.</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {analyses.map((a, i) => {
                        const analysis: any = a;
                        return (
                           <div key={i} className="border rounded p-3 bg-gray-50">
                              <div className="text-xs text-gray-500 mb-1">{analysis.timestamp}</div>
                              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(analysis.analyses, null, 2)}</pre>
                              {analysis.criticalEvents && analysis.criticalEvents.length > 0 && (
                                 <div className="text-red-600 text-sm mt-2">Critical Events: {JSON.stringify(analysis.criticalEvents)}</div>
                              )}
                              {analysis.recommendations && analysis.recommendations.length > 0 && (
                                 <div className="text-blue-600 text-sm mt-2">Recommendations: {analysis.recommendations.join(", ")}</div>
                              )}
                           </div>
                        );
                     })}
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
} 