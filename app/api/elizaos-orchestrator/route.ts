import { NextRequest, NextResponse } from 'next/server';

const ELIZA_SERVER_URL = process.env.ELIZA_SERVER_URL || 'http://localhost:5174';

export async function POST(request: NextRequest) {
   const { action, ...body } = await request.json();
   let endpoint = '';
   if (action === 'start-call') endpoint = '/start-call';
   else if (action === 'process-input') endpoint = '/process-input';
   else if (action === 'end-call') endpoint = '/end-call';
   else return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

   try {
      const res = await fetch(`${ELIZA_SERVER_URL}${endpoint}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
   } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: errorMessage }, { status: 500 });
   }
} 