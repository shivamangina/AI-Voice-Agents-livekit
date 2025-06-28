"use client";

import { useState } from 'react';

export default function DemoPage() {
   const [messages, setMessages] = useState<string[]>([]);
   const [input, setInput] = useState('');
   const [isCallActive, setIsCallActive] = useState(false);
   const [agentAnalyses, setAgentAnalyses] = useState<any[]>([]);
   const [blockchainEvents, setBlockchainEvents] = useState<any[]>([]);

   const startCall = () => {
      setIsCallActive(true);
      setMessages([]);
      setAgentAnalyses([]);
      setBlockchainEvents([]);

      // Simulate blockchain event
      addBlockchainEvent('Call Started', {
         callId: `call_${Date.now()}`,
         timestamp: new Date().toISOString()
      });
   };

   const endCall = () => {
      setIsCallActive(false);
      addBlockchainEvent('Call Completed', {
         satisfaction: 8,
         upsell: true,
         timestamp: new Date().toISOString()
      });
   };

   const addMessage = (text: string, speaker: 'Customer' | 'Agent') => {
      const newMessage = `[${speaker}] ${text}`;
      setMessages(prev => [...prev, newMessage]);

      // Simulate agent analysis
      setTimeout(() => {
         const analyses = [
            {
               agent: 'Sentiment',
               analysis: speaker === 'Customer' ? 'Customer appears frustrated' : 'Agent maintaining calm tone',
               confidence: 0.85,
               timestamp: new Date().toISOString()
            },
            {
               agent: 'Intent',
               analysis: 'Technical support request detected',
               confidence: 0.92,
               timestamp: new Date().toISOString()
            },
            {
               agent: 'Compliance',
               analysis: 'No compliance issues detected',
               confidence: 0.95,
               timestamp: new Date().toISOString()
            },
            {
               agent: 'Sales',
               analysis: 'Potential upsell opportunity: Premium support plan',
               confidence: 0.75,
               timestamp: new Date().toISOString()
            }
         ];

         setAgentAnalyses(prev => [...prev, ...analyses]);

         // Add blockchain event for sales opportunity
         if (analyses[3].confidence > 0.7) {
            addBlockchainEvent('Sales Opportunity', {
               product: 'Premium Support Plan',
               estimatedValue: 500,
               timestamp: new Date().toISOString()
            });
         }
      }, 1000);
   };

   const addBlockchainEvent = (type: string, data: any) => {
      const event = {
         id: `event_${Date.now()}`,
         type,
         data,
         blockNumber: Math.floor(Math.random() * 1000000) + 5000000,
         timestamp: new Date().toISOString()
      };
      setBlockchainEvents(prev => [event, ...prev]);
   };

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && isCallActive) {
         addMessage(input, 'Customer');
         setInput('');
      }
   };

   const simulateAgentResponse = () => {
      if (isCallActive) {
         const responses = [
            "I understand your frustration. Let me help you resolve this issue.",
            "I can see you're having trouble with the login process. Let me guide you through it.",
            "Based on what you've described, this sounds like a configuration issue.",
            "I'd be happy to help you upgrade to our premium support plan for faster resolution."
         ];
         const randomResponse = responses[Math.floor(Math.random() * responses.length)];
         addMessage(randomResponse, 'Agent');
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 p-6">
         <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  🚀 Customer Support Agent Swarm Demo
               </h1>
               <p className="text-xl text-gray-600">
                  Real-time multi-agent orchestration with blockchain integration
               </p>
               <p className="text-sm text-gray-500 mt-2">
                  Built for Chromion Chainlink Hackathon
               </p>
            </div>

            {/* Call Controls */}
            <div className="text-center mb-8">
               {!isCallActive ? (
                  <button
                     onClick={startCall}
                     className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                     🎯 Start Customer Support Call
                  </button>
               ) : (
                  <button
                     onClick={endCall}
                     className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                     ⏹️ End Call
                  </button>
               )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Conversation Area */}
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-lg border">
                     <div className="p-6 border-b bg-blue-50">
                        <h2 className="text-2xl font-bold text-blue-900">
                           💬 Live Conversation
                        </h2>
                        <p className="text-blue-700">
                           {isCallActive ? '🔴 Call in progress' : '⏸️ No active call'}
                        </p>
                     </div>

                     <div className="p-6">
                        {/* Messages */}
                        <div className="h-96 overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50">
                           {messages.length === 0 ? (
                              <div className="text-gray-500 text-center py-8">
                                 {isCallActive ? 'Start the conversation...' : 'Click "Start Call" to begin'}
                              </div>
                           ) : (
                              <div className="space-y-3">
                                 {messages.map((message, index) => (
                                    <div key={index} className="p-3 bg-white rounded-lg border shadow-sm">
                                       <div className="font-medium text-gray-900">{message}</div>
                                       <div className="text-xs text-gray-500 mt-1">
                                          {new Date().toLocaleTimeString()}
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>

                        {/* Input */}
                        {isCallActive && (
                           <form onSubmit={handleSubmit} className="space-y-4">
                              <div className="flex gap-2">
                                 <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message as customer..."
                                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 />
                                 <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                 >
                                    Send
                                 </button>
                              </div>
                              <button
                                 type="button"
                                 onClick={simulateAgentResponse}
                                 className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                 🤖 Simulate Agent Response
                              </button>
                           </form>
                        )}
                     </div>
                  </div>
               </div>

               {/* Agent Analysis Panel */}
               <div className="space-y-6">
                  {/* Agent Status */}
                  <div className="bg-white rounded-lg shadow-lg border">
                     <div className="p-6 border-b bg-purple-50">
                        <h2 className="text-xl font-bold text-purple-900">
                           🤖 Agent Status
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="space-y-3">
                           {[
                              { name: 'Transcriber', emoji: '💬', status: 'Active' },
                              { name: 'Sentiment', emoji: '📊', status: 'Active' },
                              { name: 'Intent', emoji: '🎯', status: 'Active' },
                              { name: 'Compliance', emoji: '🛡️', status: 'Active' },
                              { name: 'Sales', emoji: '💰', status: 'Active' }
                           ].map((agent, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                 <div className="flex items-center gap-3">
                                    <span className="text-2xl">{agent.emoji}</span>
                                    <span className="font-medium">{agent.name}</span>
                                 </div>
                                 <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    {agent.status}
                                 </span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Real-time Analysis */}
                  <div className="bg-white rounded-lg shadow-lg border">
                     <div className="p-6 border-b bg-green-50">
                        <h2 className="text-xl font-bold text-green-900">
                           📊 Real-time Analysis
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="h-64 overflow-y-auto space-y-3">
                           {agentAnalyses.length === 0 ? (
                              <div className="text-gray-500 text-center py-8">
                                 Agent analysis will appear here...
                              </div>
                           ) : (
                              agentAnalyses.slice(-8).map((analysis, index) => (
                                 <div key={index} className="p-3 border rounded-lg bg-gray-50">
                                    <div className="font-medium text-blue-600">
                                       {analysis.agent} Agent
                                    </div>
                                    <div className="text-sm text-gray-700 mt-1">
                                       {analysis.analysis}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                       Confidence: {(analysis.confidence * 100).toFixed(0)}%
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Blockchain Events */}
                  <div className="bg-white rounded-lg shadow-lg border">
                     <div className="p-6 border-b bg-orange-50">
                        <h2 className="text-xl font-bold text-orange-900">
                           ⛓️ Blockchain Events
                        </h2>
                     </div>
                     <div className="p-6">
                        <div className="h-48 overflow-y-auto space-y-3">
                           {blockchainEvents.length === 0 ? (
                              <div className="text-gray-500 text-center py-8">
                                 Blockchain events will appear here...
                              </div>
                           ) : (
                              blockchainEvents.slice(-5).map((event) => (
                                 <div key={event.id} className="p-3 border rounded-lg bg-orange-50">
                                    <div className="font-medium text-orange-600">
                                       {event.type}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                       Block: {event.blockNumber}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                       {new Date(event.timestamp).toLocaleTimeString()}
                                    </div>
                                 </div>
                              ))
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Demo Instructions */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6">
               <h3 className="text-lg font-bold text-blue-900 mb-3">
                  🎮 How to Demo
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                     <h4 className="font-semibold text-blue-800 mb-2">1. Start the Call</h4>
                     <ul className="text-blue-700 space-y-1">
                        <li>• Click "Start Customer Support Call"</li>
                        <li>• Watch blockchain event appear</li>
                        <li>• All 5 agents become active</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-semibold text-blue-800 mb-2">2. Simulate Conversation</h4>
                     <ul className="text-blue-700 space-y-1">
                        <li>• Type messages as customer</li>
                        <li>• Click "Simulate Agent Response"</li>
                        <li>• Watch real-time agent analysis</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-semibold text-blue-800 mb-2">3. Monitor Agents</h4>
                     <ul className="text-blue-700 space-y-1">
                        <li>• Sentiment: Analyzes emotional tone</li>
                        <li>• Intent: Classifies customer goals</li>
                        <li>• Compliance: Checks for violations</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-semibold text-blue-800 mb-2">4. Blockchain Integration</h4>
                     <ul className="text-blue-700 space-y-1">
                        <li>• Sales opportunities logged on-chain</li>
                        <li>• Compliance events recorded</li>
                        <li>• Transparent audit trail</li>
                     </ul>
                  </div>
               </div>
            </div>

            {/* Hackathon Info */}
            <div className="mt-6 text-center">
               <p className="text-gray-600">
                  Built for <span className="font-semibold">Chromion Chainlink Hackathon</span> -
                  Multi-agent & Orchestration Track ($16,500 Prize)
               </p>
               <p className="text-sm text-gray-500 mt-2">
                  Using ElizaOS for agent orchestration + Chainlink for blockchain integration
               </p>
            </div>
         </div>
      </div>
   );
} 