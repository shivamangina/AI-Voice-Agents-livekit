import { agents } from './agents';

export type Intent = keyof typeof agents | 'unknown';

export function classifyIntent(message: string): Intent {
   const text = message.toLowerCase();
   if (text.includes('order')) return 'order_status';
   if (text.includes('kyc')) return 'kyc_status';
   if (text.includes('payment') || text.includes('credit card')) return 'payment_issue';
   return 'unknown';
}

export async function orchestrateCustomerQuery(message: string, id: string): Promise<string> {
   const intent = classifyIntent(message);
   if (intent === 'unknown') {
      return "Sorry, I couldn't understand your request. Please try again.";
   }
   const agent = agents[intent];
   return await agent.handle(message, id);
} 