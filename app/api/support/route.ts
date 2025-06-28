import { NextRequest, NextResponse } from 'next/server';
import { CustomerSupportOrchestrator } from '@/eliza-agent/src/orchestrator';

// Initialize the orchestrator (in production, this would be a singleton)
const orchestrator = new CustomerSupportOrchestrator();

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { action, data } = body;

      switch (action) {
         case 'start_call':
            const { customerId, agentId } = data;
            const callId = await orchestrator.startCall(customerId, agentId);
            return NextResponse.json({
               success: true,
               callId,
               message: 'Call started successfully'
            });

         case 'process_input':
            const { callId: inputCallId, text, speaker } = data;
            const result = await orchestrator.processInput(inputCallId, text, speaker);
            return NextResponse.json({
               success: true,
               result,
               message: 'Input processed successfully'
            });

         case 'end_call':
            const { callId: endCallId, satisfaction, upsell } = data;
            await orchestrator.endCall(endCallId, satisfaction, upsell);
            return NextResponse.json({
               success: true,
               message: 'Call ended successfully'
            });

         case 'get_session':
            const { callId: sessionCallId } = data;
            const session = orchestrator.getSession(sessionCallId);
            return NextResponse.json({
               success: true,
               session,
               message: 'Session retrieved successfully'
            });

         case 'get_active_sessions':
            const activeSessions = orchestrator.getActiveSessions();
            return NextResponse.json({
               success: true,
               sessions: activeSessions,
               message: 'Active sessions retrieved successfully'
            });

         default:
            return NextResponse.json(
               { success: false, message: 'Invalid action' },
               { status: 400 }
            );
      }
   } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
         { success: false, message: 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const action = searchParams.get('action');

      switch (action) {
         case 'active_sessions':
            const activeSessions = orchestrator.getActiveSessions();
            return NextResponse.json({
               success: true,
               sessions: activeSessions
            });

         case 'session':
            const callId = searchParams.get('callId');
            if (!callId) {
               return NextResponse.json(
                  { success: false, message: 'Call ID required' },
                  { status: 400 }
               );
            }
            const session = orchestrator.getSession(callId);
            return NextResponse.json({
               success: true,
               session
            });

         default:
            return NextResponse.json(
               { success: false, message: 'Invalid action' },
               { status: 400 }
            );
      }
   } catch (error) {
      console.error('API Error:', error);
      return NextResponse.json(
         { success: false, message: 'Internal server error' },
         { status: 500 }
      );
   }
} 