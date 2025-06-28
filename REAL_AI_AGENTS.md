# Real AI Agents - OpenAI + Local Fallback

This page provides real AI analysis using OpenAI models with a fallback to local models via ElizaOS.

## Features

- **Real OpenAI Integration**: Uses GPT-3.5-turbo for actual AI analysis
- **Local Model Fallback**: Falls back to ElizaOS local models when no API key is available
- **Multiple Agent Types**: 6 different AI agents for different analysis tasks
- **Real-time Analysis**: Get instant AI insights for customer messages
- **Model Status Indicator**: Shows whether you're using OpenAI or local models

## Setup Instructions

### Option 1: With OpenAI API Key (Recommended)

1. **Get an OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Add API Key to Environment**:
   ```bash
   # Create .env.local file in project root
   echo "OPENAI_API_KEY=sk-your-api-key-here" > .env.local
   ```

3. **Restart Development Server**:
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   pnpm dev
   ```

4. **Verify Setup**:
   - Go to `/real-agents`
   - You should see "OpenAI API Key Found" status
   - Try analyzing a message to confirm OpenAI is working

### Option 2: Local Models Only (No API Key Required)

1. **Install Bun** (if not already installed):
   ```bash
   # macOS/Linux
   curl -fsSL https://bun.sh/install | bash
   
   # Or visit: https://bun.sh/docs/installation
   ```

2. **Start ElizaOS Local Server**:
   ```bash
   # Use the provided script
   ./scripts/start-eliza-local.sh
   
   # Or manually:
   cd eliza-agent
   bun install
   bun run dev
   ```

3. **Verify Setup**:
   - Go to `/real-agents`
   - You should see "Using Local Models" status
   - Try analyzing a message to confirm local models are working

## Available AI Agents

| Agent | Purpose | Analysis Type |
|-------|---------|---------------|
| **Transcriber** | Transcribes customer messages | Text transcription |
| **Sentiment** | Analyzes customer emotions | Sentiment analysis |
| **Intent** | Classifies customer intentions | Intent classification |
| **Knowledge** | Suggests relevant information | Knowledge base lookup |
| **Sales Coach** | Provides sales insights | Sales coaching |
| **Compliance** | Checks for compliance issues | Compliance review |

## How It Works

### With OpenAI API Key
1. Your message is sent to OpenAI's GPT-3.5-turbo
2. The AI model analyzes the message based on the agent's specific prompt
3. Returns real AI-generated insights
4. Response includes model type and timestamp

### Without API Key (Local Fallback)
1. Your message is processed by ElizaOS local models
2. Uses `@elizaos/plugin-local-ai` for inference
3. Returns simulated but realistic responses
4. No external API calls required

## Usage Examples

### Example 1: Sentiment Analysis
**Input**: "I'm really frustrated with your service lately"
**Agent**: Sentiment
**Output**: "Sentiment: Negative (0.2) - Customer expresses clear frustration and dissatisfaction with service quality"

### Example 2: Intent Classification
**Input**: "How do I reset my password?"
**Agent**: Intent
**Output**: "Intent: Request (0.9) - Customer is seeking assistance with account access"

### Example 3: Sales Coaching
**Input**: "I'm thinking about upgrading my plan"
**Agent**: Sales Coach
**Output**: "Sales Opportunity: High - Customer shows interest in upgrading. Suggest premium features and benefits."

## Troubleshooting

### OpenAI Issues
- **"OpenAI API key not configured"**: Make sure your API key is in `.env.local`
- **"Failed to analyze message"**: Check your internet connection and API key validity
- **Rate limiting**: OpenAI has rate limits - wait a moment and try again

### Local Model Issues
- **"Local model not available"**: Make sure ElizaOS server is running (`./scripts/start-eliza-local.sh`)
- **Bun not found**: Install bun from https://bun.sh/docs/installation
- **Port conflicts**: ElizaOS uses default ports - make sure they're not in use

### General Issues
- **Page not loading**: Restart the Next.js development server
- **API errors**: Check browser console for detailed error messages
- **Slow responses**: Local models may be slower than OpenAI

## API Endpoint

The Real AI Agents page uses the `/api/real-agents` endpoint:

```typescript
POST /api/real-agents
Content-Type: application/json

{
  "message": "Customer message here",
  "agent": "sentiment" // or transcriber, intent, knowledge, sales, compliance
}

// Response
{
  "analysis": "AI analysis result",
  "agent": "sentiment",
  "modelUsed": "OpenAI GPT-3.5-turbo",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "message": "Customer message here"
}
```

## Cost Considerations

### OpenAI Costs
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- Typical analysis: ~100-200 tokens per request
- Estimated cost: ~$0.0002-0.0004 per analysis

### Local Models
- No API costs
- Uses your local computing resources
- May be slower but more private

## Security Notes

- API keys are stored in `.env.local` (not committed to git)
- Local models process data locally (no external API calls)
- No customer data is stored permanently
- All analysis is done in real-time

## Next Steps

1. **Try both modes**: Test with and without API key
2. **Customize prompts**: Modify agent prompts in `/api/real-agents/route.ts`
3. **Add more agents**: Extend the AGENT_PROMPTS object
4. **Integrate with dashboard**: Connect to the main support dashboard
5. **Add persistence**: Store analysis results in a database 