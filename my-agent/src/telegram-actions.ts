import { type Action, type IAgentRuntime, type Memory } from '@elizaos/core';
import { orchestrateCustomerQuery } from './orchestrator';

/**
 * Example action that triggers when a user sends a specific command
 */
export const handleStartCommand: Action = {
   name: 'HANDLE_START_COMMAND',
   description: 'Handles the /start command from Telegram users',
   validate: async (_runtime: IAgentRuntime, message: Memory, _state: any): Promise<boolean> => {
      return message.content.text === '/start' && message.content.source === 'telegram';
   },
   handler: async (runtime: IAgentRuntime, message: Memory, _state: any, _options: any, callback: any): Promise<boolean> => {
      try {
         const welcomeMessage = `👋 Hello! I'm Eliza, your AI assistant. 

I'm here to help you with:
• General questions and information
• Problem solving and troubleshooting  
• Technology and software guidance
• Business and productivity tips
• And much more!

Just send me a message and I'll do my best to help. What can I assist you with today?`;

         await callback({
            text: welcomeMessage,
            buttons: [
               {
                  text: '🤖 About Me',
                  callback_data: 'about_me'
               },
               {
                  text: '❓ Help',
                  callback_data: 'help'
               }
            ]
         });

         return true;
      } catch (error) {
         console.error('Error handling start command:', error);
         return false;
      }
   },
};

/**
 * Example action for handling button callbacks
 */
export const handleButtonCallback: Action = {
   name: 'HANDLE_BUTTON_CALLBACK',
   description: 'Handles button callbacks from Telegram messages',
   validate: async (_runtime: IAgentRuntime, message: Memory, _state: any): Promise<boolean> => {
      return !!(message.content.callback_data && message.content.source === 'telegram');
   },
   handler: async (runtime: IAgentRuntime, message: Memory, _state: any, _options: any, callback: any): Promise<boolean> => {
      try {
         const callbackData = message.content.callback_data;

         switch (callbackData) {
            case 'about_me':
               await callback({
                  text: `I'm Eliza, an AI assistant built with ElizaOS. I can help you with various tasks and answer your questions. I'm always learning and improving to provide better assistance!`,
                  edit: true // Edit the original message instead of sending a new one
               });
               break;

            case 'help':
               await callback({
                  text: `Here are some things I can help you with:

📚 **Knowledge & Information**: Ask me about any topic
🔧 **Problem Solving**: Get help with technical issues
💼 **Business & Productivity**: Tips and strategies
🎨 **Creativity**: Brainstorming and creative projects
📖 **Learning**: Educational content and explanations

Just type your question or request, and I'll assist you!`,
                  edit: true
               });
               break;

            default:
               await callback({
                  text: "I'm not sure how to handle that button. Please try asking me a question instead!",
                  edit: true
               });
         }

         return true;
      } catch (error) {
         console.error('Error handling button callback:', error);
         return false;
      }
   },
};

/**
 * Example action for handling user feedback
 */
export const handleFeedback: Action = {
   name: 'HANDLE_FEEDBACK',
   description: 'Handles user feedback and sentiment',
   validate: async (_runtime: IAgentRuntime, message: Memory, _state: any): Promise<boolean> => {
      const text = message.content.text?.toLowerCase() || '';
      return message.content.source === 'telegram' &&
         (text.includes('thank') || text.includes('thanks') || text.includes('good') || text.includes('bad'));
   },
   handler: async (runtime: IAgentRuntime, message: Memory, _state: any, _options: any, callback: any): Promise<boolean> => {
      try {
         const text = message.content.text?.toLowerCase() || '';

         if (text.includes('thank') || text.includes('thanks')) {
            await callback({
               text: "You're welcome! 😊 I'm glad I could help. Is there anything else you'd like to know?"
            });
         } else if (text.includes('good')) {
            await callback({
               text: "That's great to hear! 🎉 I'm always here to help. Feel free to ask me anything else!"
            });
         } else if (text.includes('bad')) {
            await callback({
               text: "I'm sorry to hear that. 😔 I'm here to help improve the situation. What can I do to assist you better?"
            });
         }

         return true;
      } catch (error) {
         console.error('Error handling feedback:', error);
         return false;
      }
   },
};

export const handleCustomerSupportQuery: Action = {
   name: 'HANDLE_CUSTOMER_SUPPORT_QUERY',
   description: 'Handles customer support queries by routing to the appropriate agent',
   validate: async (_runtime: IAgentRuntime, message: Memory, _state: any): Promise<boolean> => {
      // Only handle plain text messages from Telegram that are not commands or button callbacks
      const text = message.content.text || '';
      return message.content.source === 'telegram' &&
         !text.startsWith('/') && // not a command
         !message.content.callback_data;
   },
   handler: async (_runtime: IAgentRuntime, message: Memory, _state: any, _options: any, callback: any): Promise<boolean> => {
      try {
         const userMessage = message.content.text || '';
         // Try to extract email from the message, else use username
         const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/);
         const id = emailMatch ? emailMatch[0] : (message.content.username || message.content.userId || 'unknown');
         const reply = await orchestrateCustomerQuery(userMessage, id as string);
         await callback({ text: reply });
         return true;
      } catch (error) {
         console.error('Error handling customer support query:', error);
         return false;
      }
   },
};

export const handleSqlCustomerSupportQuery: Action = {
   name: 'HANDLE_SQL_CUSTOMER_SUPPORT_QUERY',
   description: 'Handles customer support queries using the SQL plugin for DB access',
   validate: async (_runtime: IAgentRuntime, message: Memory, _state: any): Promise<boolean> => {
      const text = message.content.text || '';
      return message.content.source === 'telegram' &&
         !text.startsWith('/') &&
         !message.content.callback_data;
   },
   handler: async (runtime: IAgentRuntime, message: Memory, _state: any, _options: any, callback: any): Promise<boolean> => {
      try {
         const userMessage = message.content.text || '';
         const emailMatch = userMessage.match(/[\w.-]+@[\w.-]+\.[A-Za-z]{2,}/);
         const id = emailMatch ? emailMatch[0] : (message.content.username || message.content.userId || 'unknown');
         let response = '';
         if (userMessage.toLowerCase().includes('order')) {
            const rows = await (runtime as any).query('sql', { sql: `SELECT * FROM orders WHERE user = ? OR email = ? LIMIT 1`, params: [id, id] });
            if (rows && rows.length > 0) {
               const order = rows[0];
               response = `Order status: ${order.status}, ETA: ${order.eta}`;
            } else {
               response = 'No order found for you.';
            }
         } else if (userMessage.toLowerCase().includes('kyc')) {
            const rows = await (runtime as any).query('sql', { sql: `SELECT * FROM kyc WHERE user = ? OR email = ? LIMIT 1`, params: [id, id] });
            if (rows && rows.length > 0) {
               const kyc = rows[0];
               response = `KYC status: ${kyc.status}, Date: ${kyc.date}`;
            } else {
               response = 'No KYC record found for you.';
            }
         } else if (userMessage.toLowerCase().includes('payment')) {
            const rows = await (runtime as any).query('sql', { sql: `SELECT * FROM payments WHERE user = ? OR email = ? LIMIT 1`, params: [id, id] });
            if (rows && rows.length > 0) {
               const payment = rows[0];
               response = `Payment status: ${payment.status}, Reason: ${payment.reason}`;
            } else {
               response = 'No payment record found for you.';
            }
         } else {
            response = "Sorry, I couldn't understand your request. Please try again.";
         }
         await callback({ text: response });
         return true;
      } catch (error) {
         console.error('Error handling SQL customer support query:', error);
         await callback({ text: 'An error occurred while processing your request.' });
         return false;
      }
   },
};

// Export all actions
export const telegramActions = [
   handleStartCommand,
   handleButtonCallback,
   handleFeedback,
   handleCustomerSupportQuery,
   handleSqlCustomerSupportQuery,
]; 