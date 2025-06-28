import { AgentRuntime, Project } from '@elizaos/core';
import { transcriberAgent } from './agents/transcriber';
import { sentimentAgent } from './agents/sentiment';
import { intentAgent } from './agents/intent';
import { complianceAgent } from './agents/compliance';
import { salesAgent } from './agents/sales';

export interface CallSession {
   callId: string;
   customerId: string;
   agentId: string;
   startTime: Date;
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

export class CustomerSupportOrchestrator {
   private runtime: AgentRuntime;
   private project: Project;
   private activeSessions: Map<string, CallSession> = new Map();

   constructor() {
      this.runtime = new AgentRuntime();
      this.project = new Project({
         name: 'Customer Support Agent Swarm',
         description: 'Multi-agent orchestration for customer support augmentation',
         agents: [transcriberAgent, sentimentAgent, intentAgent, complianceAgent, salesAgent],
         settings: {
            secrets: {
               OPENAI_API_KEY: process.env.OPENAI_API_KEY,
               ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
            },
         },
      });
   }

   /**
    * Start a new customer support call session
    */
   async startCall(customerId: string, agentId: string): Promise<string> {
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const session: CallSession = {
         callId,
         customerId,
         agentId,
         startTime: new Date(),
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

      this.activeSessions.set(callId, session);

      // Log call start on blockchain
      await this.logOnchainEvent(callId, 'call_started', {
         customerId,
         agentId,
         timestamp: session.startTime.toISOString(),
      });

      return callId;
   }

   /**
    * Process incoming audio/text and coordinate all agents
    */
   async processInput(callId: string, input: string, speaker: 'customer' | 'agent'): Promise<any> {
      const session = this.activeSessions.get(callId);
      if (!session || !session.isActive) {
         throw new Error('Call session not found or inactive');
      }

      // Update transcript
      session.transcript += `\n[${speaker.toUpperCase()}] ${input}`;

      // Parallel agent processing
      const [transcription, sentiment, intent, compliance, sales] = await Promise.all([
         this.processTranscription(callId, input, speaker),
         this.processSentiment(callId, input, speaker),
         this.processIntent(callId, input, speaker),
         this.processCompliance(callId, input, speaker),
         this.processSales(callId, input, speaker),
      ]);

      // Update session analyses
      session.analyses = {
         sentiment,
         intent,
         compliance,
         sales,
      };

      // Check for critical events that need immediate attention
      const criticalEvents = this.detectCriticalEvents(session);

      // Log significant events on blockchain
      if (criticalEvents.length > 0) {
         await this.logOnchainEvents(callId, criticalEvents);
      }

      return {
         callId,
         timestamp: new Date().toISOString(),
         analyses: session.analyses,
         criticalEvents,
         recommendations: this.generateRecommendations(session),
      };
   }

   /**
    * Process transcription with the Transcriber agent
    */
   private async processTranscription(callId: string, input: string, speaker: string): Promise<any> {
      const response = await this.runtime.run(transcriberAgent, {
         messages: [{
            role: 'user',
            content: `Process this input: "${input}" from speaker: ${speaker}`,
         }],
      });

      return JSON.parse(response.content);
   }

   /**
    * Process sentiment analysis
    */
   private async processSentiment(callId: string, input: string, speaker: string): Promise<any> {
      const response = await this.runtime.run(sentimentAgent, {
         messages: [{
            role: 'user',
            content: `Analyze sentiment for: "${input}" from ${speaker}`,
         }],
      });

      return JSON.parse(response.content);
   }

   /**
    * Process intent classification
    */
   private async processIntent(callId: string, input: string, speaker: string): Promise<any> {
      const response = await this.runtime.run(intentAgent, {
         messages: [{
            role: 'user',
            content: `Classify intent for: "${input}" from ${speaker}`,
         }],
      });

      return JSON.parse(response.content);
   }

   /**
    * Process compliance checking
    */
   private async processCompliance(callId: string, input: string, speaker: string): Promise<any> {
      const response = await this.runtime.run(complianceAgent, {
         messages: [{
            role: 'user',
            content: `Check compliance for: "${input}" from ${speaker}`,
         }],
      });

      return JSON.parse(response.content);
   }

   /**
    * Process sales opportunities
    */
   private async processSales(callId: string, input: string, speaker: string): Promise<any> {
      const response = await this.runtime.run(salesAgent, {
         messages: [{
            role: 'user',
            content: `Analyze sales opportunities in: "${input}" from ${speaker}`,
         }],
      });

      return JSON.parse(response.content);
   }

   /**
    * Detect critical events that require immediate attention
    */
   private detectCriticalEvents(session: CallSession): any[] {
      const events = [];

      // Check for high-severity compliance violations
      if (session.analyses.compliance?.flags) {
         const criticalFlags = session.analyses.compliance.flags.filter(
            (flag: any) => flag.severity === 'critical' || flag.severity === 'high'
         );
         if (criticalFlags.length > 0) {
            events.push({
               type: 'compliance_violation',
               severity: 'critical',
               details: criticalFlags,
            });
         }
      }

      // Check for extreme sentiment
      if (session.analyses.sentiment?.customer_sentiment?.intensity === 'high') {
         events.push({
            type: 'customer_escalation',
            severity: 'high',
            details: session.analyses.sentiment.customer_sentiment,
         });
      }

      // Check for high-value sales opportunities
      if (session.analyses.sales?.sales_opportunities) {
         const highValueOpportunities = session.analyses.sales.sales_opportunities.filter(
            (opp: any) => opp.estimated_value > 1000 && opp.confidence > 0.8
         );
         if (highValueOpportunities.length > 0) {
            events.push({
               type: 'high_value_sales',
               severity: 'medium',
               details: highValueOpportunities,
            });
         }
      }

      return events;
   }

   /**
    * Generate recommendations for the support agent
    */
   private generateRecommendations(session: CallSession): string[] {
      const recommendations = [];

      // Sentiment-based recommendations
      if (session.analyses.sentiment?.customer_sentiment?.emotion === 'frustrated') {
         recommendations.push('Show empathy and acknowledge the customer\'s frustration');
      }

      // Intent-based recommendations
      if (session.analyses.intent?.primary_intent?.urgency === 'high') {
         recommendations.push('Prioritize this request and provide immediate assistance');
      }

      // Sales-based recommendations
      if (session.analyses.sales?.sales_opportunities?.length > 0) {
         recommendations.push('Consider discussing upgrade options based on customer needs');
      }

      // Compliance-based recommendations
      if (session.analyses.compliance?.compliance_status === 'warning') {
         recommendations.push('Review compliance guidelines and ensure proper disclosures');
      }

      return recommendations;
   }

   /**
    * Log events on blockchain via Chainlink
    */
   private async logOnchainEvent(callId: string, eventType: string, data: any): Promise<void> {
      // This would integrate with your smart contract
      const event = {
         callId,
         eventType,
         data,
         timestamp: new Date().toISOString(),
      };

      const session = this.activeSessions.get(callId);
      if (session) {
         session.onchainEvents.push(event);
      }

      // TODO: Implement actual blockchain logging
      console.log('Onchain Event:', event);
   }

   /**
    * Log multiple events on blockchain
    */
   private async logOnchainEvents(callId: string, events: any[]): Promise<void> {
      for (const event of events) {
         await this.logOnchainEvent(callId, event.type, event);
      }
   }

   /**
    * End a call session
    */
   async endCall(callId: string, satisfaction: number, upsell: boolean): Promise<void> {
      const session = this.activeSessions.get(callId);
      if (!session) {
         throw new Error('Call session not found');
      }

      session.isActive = false;

      // Log call completion on blockchain
      await this.logOnchainEvent(callId, 'call_completed', {
         satisfaction,
         upsell,
         duration: Date.now() - session.startTime.getTime(),
      });

      this.activeSessions.delete(callId);
   }

   /**
    * Get session data
    */
   getSession(callId: string): CallSession | undefined {
      return this.activeSessions.get(callId);
   }

   /**
    * Get all active sessions
    */
   getActiveSessions(): CallSession[] {
      return Array.from(this.activeSessions.values());
   }
} 