export type SupportAgent = {
   name: string;
   handle: (message: string, id: string) => Promise<string>;
};

const API_BASE = 'http://localhost:4000';

export const orderStatusAgent: SupportAgent = {
   name: 'order_status_agent',
   handle: async (_message: string, id: string) => {
      const res = await fetch(`${API_BASE}/order/${id}`);
      if (res.ok) {
         const data = (await res.json()) as { status: string; eta: string };
         await fetch(`${API_BASE}/metrics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'order_status_agent', user: id, query: _message, response: JSON.stringify(data) }) });
         return `Order status: ${data.status}, ETA: ${data.eta}`;
      } else {
         return 'No order found for you.';
      }
   }
};

export const kycStatusAgent: SupportAgent = {
   name: 'kyc_status_agent',
   handle: async (_message: string, id: string) => {
      const res = await fetch(`${API_BASE}/kyc/${id}`);
      if (res.ok) {
         const data = (await res.json()) as { status: string; date: string };
         await fetch(`${API_BASE}/metrics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'kyc_status_agent', user: id, query: _message, response: JSON.stringify(data) }) });
         return `KYC status: ${data.status}, Date: ${data.date}`;
      } else {
         return 'No KYC record found for you.';
      }
   }
};

export const paymentIssueAgent: SupportAgent = {
   name: 'payment_issue_agent',
   handle: async (_message: string, id: string) => {
      const res = await fetch(`${API_BASE}/payment/${id}`);
      if (res.ok) {
         const data = (await res.json()) as { status: string; reason: string };
         await fetch(`${API_BASE}/metrics`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ agent: 'payment_issue_agent', user: id, query: _message, response: JSON.stringify(data) }) });
         return `Payment status: ${data.status}, Reason: ${data.reason}`;
      } else {
         return 'No payment record found for you.';
      }
   }
};

export const agents = {
   order_status: orderStatusAgent,
   kyc_status: kycStatusAgent,
   payment_issue: paymentIssueAgent
}; 