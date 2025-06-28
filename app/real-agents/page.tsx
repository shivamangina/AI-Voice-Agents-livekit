'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, MessageSquare, Brain, Zap } from 'lucide-react';

interface AgentAnalysis {
   analysis: string;
   agent: string;
   modelUsed: string;
   timestamp: string;
   message: string;
}

const AGENTS = [
   { id: 'transcriber', name: 'Transcriber', description: 'Transcribes customer messages' },
   { id: 'sentiment', name: 'Sentiment', description: 'Analyzes customer emotions' },
   { id: 'intent', name: 'Intent', description: 'Classifies customer intentions' },
   { id: 'knowledge', name: 'Knowledge', description: 'Suggests relevant information' },
   { id: 'sales', name: 'Sales Coach', description: 'Provides sales insights' },
   { id: 'compliance', name: 'Compliance', description: 'Checks for compliance issues' }
];

export default function RealAgentsPage() {
   const [message, setMessage] = useState('');
   const [selectedAgent, setSelectedAgent] = useState('transcriber');
   const [analyses, setAnalyses] = useState<AgentAnalysis[]>([]);
   const [loading, setLoading] = useState(false);
   const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'present' | 'missing'>('checking');

   // Check API key status on component mount
   useState(() => {
      // This is a client-side check - the actual API key validation happens server-side
      setApiKeyStatus('checking');
      // We'll determine the actual status when we make the first API call
   });

   const analyzeMessage = async () => {
      if (!message.trim()) return;

      setLoading(true);
      try {
         const response = await fetch('/api/real-agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, agent: selectedAgent })
         });

         if (!response.ok) {
            throw new Error('Failed to analyze message');
         }

         const result: AgentAnalysis = await response.json();
         setAnalyses(prev => [result, ...prev]);

         // Update API key status based on model used
         if (result.modelUsed.includes('OpenAI')) {
            setApiKeyStatus('present');
         } else {
            setApiKeyStatus('missing');
         }
      } catch (error) {
         console.error('Error analyzing message:', error);
         alert('Failed to analyze message. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const getModelBadgeColor = (modelUsed: string) => {
      if (modelUsed.includes('OpenAI')) return 'bg-green-100 text-green-800';
      if (modelUsed.includes('Local')) return 'bg-blue-100 text-blue-800';
      return 'bg-gray-100 text-gray-800';
   };

   return (
      <div className="container mx-auto p-6 max-w-6xl">
         <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Real AI Agents</h1>
            <p className="text-gray-600">
               Interact with real AI models for customer support analysis.
               Uses OpenAI if API key is available, otherwise falls back to local models.
            </p>
         </div>

         {/* API Key Status */}
         <Card className="mb-6">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  API Key Status
               </CardTitle>
            </CardHeader>
            <CardContent>
               {apiKeyStatus === 'checking' && (
                  <div className="flex items-center gap-2">
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span>Checking API key status...</span>
                  </div>
               )}
               {apiKeyStatus === 'present' && (
                  <div className="flex items-center gap-2">
                     <Badge className="bg-green-100 text-green-800">OpenAI API Key Found</Badge>
                     <span className="text-sm text-gray-600">Using OpenAI GPT-3.5-turbo</span>
                  </div>
               )}
               {apiKeyStatus === 'missing' && (
                  <div className="flex items-center gap-2">
                     <Badge className="bg-blue-100 text-blue-800">Using Local Models</Badge>
                     <span className="text-sm text-gray-600">OpenAI API key not found - using ElizaOS local models</span>
                  </div>
               )}
            </CardContent>
         </Card>

         {/* Input Section */}
         <Card className="mb-6">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Customer Message
               </CardTitle>
               <CardDescription>
                  Enter a customer message to analyze with AI agents
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Input
                  placeholder="Enter customer message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && analyzeMessage()}
               />

               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {AGENTS.map((agent) => (
                     <Button
                        key={agent.id}
                        variant={selectedAgent === agent.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedAgent(agent.id)}
                        className="text-xs"
                     >
                        {agent.name}
                     </Button>
                  ))}
               </div>

               <Button
                  onClick={analyzeMessage}
                  disabled={loading || !message.trim()}
                  className="w-full"
               >
                  {loading ? (
                     <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                     </>
                  ) : (
                     <>
                        <Brain className="mr-2 h-4 w-4" />
                        Analyze with {AGENTS.find(a => a.id === selectedAgent)?.name}
                     </>
                  )}
               </Button>
            </CardContent>
         </Card>

         {/* Results Section */}
         {analyses.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Brain className="h-5 w-5" />
                     Analysis Results
                  </CardTitle>
                  <CardDescription>
                     Recent AI agent analyses
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     {analyses.map((analysis, index) => (
                        <div key={index} className="border rounded-lg p-4">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                 <Badge variant="outline">
                                    {AGENTS.find(a => a.id === analysis.agent)?.name}
                                 </Badge>
                                 <Badge className={getModelBadgeColor(analysis.modelUsed)}>
                                    {analysis.modelUsed}
                                 </Badge>
                              </div>
                              <span className="text-xs text-gray-500">
                                 {new Date(analysis.timestamp).toLocaleTimeString()}
                              </span>
                           </div>

                           <div className="mb-2">
                              <p className="text-sm text-gray-600 mb-1">Message:</p>
                              <p className="text-sm bg-gray-50 p-2 rounded">
                                 &ldquo;{analysis.message}&rdquo;
                              </p>
                           </div>

                           <Separator className="my-2" />

                           <div>
                              <p className="text-sm text-gray-600 mb-1">Analysis:</p>
                              <p className="text-sm">{analysis.analysis}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Instructions */}
         <Card className="mt-6">
            <CardHeader>
               <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
               <p><strong>With OpenAI API Key:</strong></p>
               <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>Add your OpenAI API key to <code className={`bg-gray-100 px-1 rounded`}>.env.local</code></li>
                  <li>Restart the development server</li>
                  <li>Enter a customer message and select an agent</li>
                  <li>Click "Analyze" to get real AI insights</li>
               </ol>

               <Separator className="my-4" />

               <p><strong>Without API Key (Local Fallback):</strong></p>
               <ol className="list-decimal list-inside ml-4 space-y-1">
                  <li>No setup required - works out of the box</li>
                  <li>Uses ElizaOS local models for analysis</li>
                  <li>Provides simulated but realistic responses</li>
               </ol>
            </CardContent>
         </Card>
      </div>
   );
} 