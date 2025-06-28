"use client";

import React, { useState, useEffect, useRef } from 'react';

interface AgentAnalysis {
   type: string;
   data: any;
   timestamp: string;
   confidence: number;
}

interface CallSession {
   callId: string;
   customerId: string;
   agentId: string;
   startTime: string;
   isActive: boolean;
   transcript: string;
   analyses: {
      sentiment: any;
      intent: any;
      compliance: any;
      sales: any;
   };
   onchainEvents: any[];
}

export default function SupportDashboard() {
   const [activeCall, setActiveCall] = useState<CallSession | null>(null);
   const [isRecording, setIsRecording] = useState(false);
   const [inputText, setInputText] = useState('');
   const [speaker, setSpeaker] = useState<'customer' | 'agent'>('customer');
   const [realTimeUpdates, setRealTimeUpdates] = useState<AgentAnalysis[]>([]);
   const [blockchainEvents, setBlockchainEvents] = useState<any[]>([]);
   const [recommendations, setRecommendations] = useState<string[]>([]);

   const transcriptRef = useRef<HTMLDivElement>(null);

   // Simulate starting a new call
   const startNewCall = async () => {
      const newCall: CallSession = {
         callId: `call_${Date.now()}`,
         customerId: 'CUST-001',
         agentId: 'AGENT-001',
         startTime: new Date().toISOString(),
         isActive: true,
         transcript: '',
         analyses: {
            sentiment: null,
            intent: null,
            compliance: null,
            sales: null,
         },
         onchainEvents: [],
      };

      setActiveCall(newCall);
      setIsRecording(true);

      // Simulate blockchain event
      addBlockchainEvent('Call Started', {
         callId: newCall.callId,
         customerId: newCall.customerId,
         agentId: newCall.agentId,
      });
   };

   // Simulate ending a call
   const endCall = async () => {
      if (!activeCall) return;

      setIsRecording(false);
      setActiveCall(null);

      // Simulate blockchain event
      addBlockchainEvent('Call Completed', {
         callId: activeCall.callId,
         satisfaction: 8,
         upsell: true,
      });
   };

   // Process input and simulate agent analysis
   const processInput = async () => {
      if (!inputText.trim() || !activeCall) return;

      const newTranscript = `${activeCall.transcript}\n[${speaker.toUpperCase()}] ${inputText}`;
      setActiveCall(prev => prev ? { ...prev, transcript: newTranscript } : null);

      // Simulate real-time agent analysis
      const analysis: AgentAnalysis = {
         type: 'input_processed',
         data: {
            text: inputText,
            speaker,
            timestamp: new Date().toISOString(),
         },
         timestamp: new Date().toISOString(),
         confidence: 0.95,
      };

      setRealTimeUpdates(prev => [...prev, analysis]);

      // Simulate agent responses
      setTimeout(() => {
         const agentResponses = [
            {
               type: 'sentiment_analysis',
               data: {
                  emotion: speaker === 'customer' ? 'frustrated' : 'calm',
                  intensity: 'medium',
                  score: speaker === 'customer' ? -0.6 : 0.3,
               },
               timestamp: new Date().toISOString(),
               confidence: 0.88,
            },
            {
               type: 'intent_classification',
               data: {
                  primary_intent: 'technical_support',
                  urgency: 'medium',
                  confidence: 0.92,
               },
               timestamp: new Date().toISOString(),
               confidence: 0.92,
            },
            {
               type: 'compliance_check',
               data: {
                  status: 'compliant',
                  flags: [],
                  risk_score: 0.1,
               },
               timestamp: new Date().toISOString(),
               confidence: 0.95,
            },
            {
               type: 'sales_opportunity',
               data: {
                  opportunities: [
                     {
                        type: 'upsell',
                        product: 'premium_plan',
                        estimated_value: 500,
                        confidence: 0.75,
                     },
                  ],
               },
               timestamp: new Date().toISOString(),
               confidence: 0.75,
            },
         ];

         setRealTimeUpdates(prev => [...prev, ...agentResponses]);

         // Update recommendations
         setRecommendations([
            'Show empathy for customer frustration',
            'Offer technical solution with step-by-step guidance',
            'Consider premium plan upgrade opportunity',
         ]);

         // Simulate blockchain event for high-value sales opportunity
         if (agentResponses[3].data.opportunities[0].estimated_value > 400) {
            addBlockchainEvent('Sales Opportunity Detected', {
               callId: activeCall.callId,
               product: 'premium_plan',
               estimated_value: 500,
            });
         }
      }, 1000);

      setInputText('');
   };

   const addBlockchainEvent = (eventType: string, data: any) => {
      const event = {
         id: `event_${Date.now()}`,
         type: eventType,
         data,
         timestamp: new Date().toISOString(),
         blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
      };

      setBlockchainEvents(prev => [event, ...prev]);
   };

   // Auto-scroll transcript
   useEffect(() => {
      if (transcriptRef.current) {
         transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
      }
   }, [activeCall?.transcript]);

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Customer Support Agent Swarm
               </h1>
               <p className="text-gray-600">
                  Real-time multi-agent orchestration with blockchain logging
               </p>
            </div>

            {/* Call Controls */}
            <div className="mb-6 flex gap-4">
               {!activeCall ? (
                  <button
                     onClick={startNewCall}
                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                     ▶️ Start New Call
                  </button>
               ) : (
                  <button
                     onClick={endCall}
                     className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                  >
                     ⏹️ End Call
                  </button>
               )}

               {activeCall && (
                  <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 rounded-full text-sm font-medium ${isRecording ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {isRecording ? '🔴 Recording' : '⏸️ Paused'}
                     </span>
                     <span className="text-sm text-gray-600">
                        Call ID: {activeCall.callId}
                     </span>
                  </div>
               )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Main Chat Area */}
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border">
                     <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           💬 Live Conversation
                        </h2>
                     </div>
                     <div className="p-6">
                        {/* Transcript */}
                        <div className="h-96 overflow-y-auto mb-4 border rounded p-4" ref={transcriptRef}>
                           <div className="space-y-2 text-sm">
                              {activeCall?.transcript.split('\n').map((line, index) => (
                                 <div key={index} className="p-2 bg-gray-50 rounded">
                                    {line}
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Input */}
                        {activeCall && (
                           <div className="space-y-4">
                              <div className="flex gap-2">
                                 <button
                                    className={`px-3 py-1 rounded text-sm ${speaker === 'customer'
                                       ? 'bg-blue-600 text-white'
                                       : 'bg-gray-200 text-gray-700'
                                       }`}
                                    onClick={() => setSpeaker('customer')}
                                 >
                                    Customer
                                 </button>
                                 <button
                                    className={`px-3 py-1 rounded text-sm ${speaker === 'agent'
                                       ? 'bg-blue-600 text-white'
                                       : 'bg-gray-200 text-gray-700'
                                       }`}
                                    onClick={() => setSpeaker('agent')}
                                 >
                                    Agent
                                 </button>
                              </div>
                              <div className="flex gap-2">
                                 <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder="Type your message..."
                                    onKeyPress={(e) => e.key === 'Enter' && processInput()}
                                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 />
                                 <button
                                    onClick={processInput}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                                 >
                                    Send
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Agent Analysis Panel */}
               <div className="space-y-6">
                  {/* Real-time Agent Updates */}
                  <div className="bg-white rounded-lg shadow-sm border">
                     <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           📊 Agent Analysis
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="h-64 overflow-y-auto">
                           <div className="space-y-2">
                              {realTimeUpdates.slice(-10).map((update, index) => (
                                 <div key={index} className="p-2 border rounded text-xs">
                                    <div className="font-medium text-blue-600">
                                       {update.type.replace('_', ' ').toUpperCase()}
                                    </div>
                                    <div className="text-gray-600">
                                       Confidence: {(update.confidence * 100).toFixed(0)}%
                                    </div>
                                    <div className="text-gray-500">
                                       {new Date(update.timestamp).toLocaleTimeString()}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-lg shadow-sm border">
                     <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           💡 Recommendations
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="space-y-2">
                           {recommendations.map((rec, index) => (
                              <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                 {rec}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Blockchain Events */}
                  <div className="bg-white rounded-lg shadow-sm border">
                     <div className="p-6 border-b">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                           ⛓️ Blockchain Events
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="h-48 overflow-y-auto">
                           <div className="space-y-2">
                              {blockchainEvents.slice(-5).map((event) => (
                                 <div key={event.id} className="p-2 border rounded text-xs">
                                    <div className="font-medium text-green-600">
                                       {event.type}
                                    </div>
                                    <div className="text-gray-600">
                                       Block: {event.blockNumber}
                                    </div>
                                    <div className="text-gray-500">
                                       {new Date(event.timestamp).toLocaleTimeString()}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Agent Status Dashboard */}
            <div className="mt-8">
               <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-6 border-b">
                     <h2 className="text-xl font-semibold">Agent Status Dashboard</h2>
                  </div>
                  <div className="p-6">
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="text-center p-4 border rounded">
                           <div className="text-2xl mb-2">💬</div>
                           <div className="font-medium">Transcriber</div>
                           <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Active
                           </span>
                        </div>
                        <div className="text-center p-4 border rounded">
                           <div className="text-2xl mb-2">📊</div>
                           <div className="font-medium">Sentiment</div>
                           <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Active
                           </span>
                        </div>
                        <div className="text-center p-4 border rounded">
                           <div className="text-2xl mb-2">🎯</div>
                           <div className="font-medium">Intent</div>
                           <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Active
                           </span>
                        </div>
                        <div className="text-center p-4 border rounded">
                           <div className="text-2xl mb-2">🛡️</div>
                           <div className="font-medium">Compliance</div>
                           <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Active
                           </span>
                        </div>
                        <div className="text-center p-4 border rounded">
                           <div className="text-2xl mb-2">💰</div>
                           <div className="font-medium">Sales</div>
                           <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                              Active
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
} 