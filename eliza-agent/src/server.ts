import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { CustomerSupportOrchestrator } from './orchestrator.ts';

const app = express();
const port = process.env.ELIZA_SERVER_PORT || 5174;

app.use(cors());
app.use(bodyParser.json());

const orchestrator = new CustomerSupportOrchestrator();

// Start a new call session
app.post('/start-call', async (req, res) => {
   const { customerId, agentId } = req.body;
   try {
      const callId = await orchestrator.startCall(customerId, agentId);
      res.json({ callId });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// Process input (message) through all agents
app.post('/process-input', async (req, res) => {
   const { callId, input, speaker } = req.body;
   try {
      const result = await orchestrator.processInput(callId, input, speaker);
      res.json(result);
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

// End a call session
app.post('/end-call', async (req, res) => {
   const { callId, satisfaction, upsell } = req.body;
   try {
      await orchestrator.endCall(callId, satisfaction, upsell);
      res.json({ success: true });
   } catch (err) {
      res.status(500).json({ error: err.message });
   }
});

app.listen(port, () => {
   console.log(`ElizaOS Orchestrator server running on http://localhost:${port}`);
}); 