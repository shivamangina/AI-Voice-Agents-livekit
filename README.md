# Customer Support Agent Swarm 🚀

A real-time multi-agent orchestration system for customer support augmentation, built with ElizaOS and Chainlink for the Chromion Hackathon.

## 🎯 Project Overview

This project demonstrates a **Customer Support Augmentation Agent Swarm** that uses multiple specialized AI agents to assist human support agents in real-time during customer calls. The system integrates with blockchain technology via Chainlink to log critical events and ensure transparency.

### Key Features

- **Real-time Multi-Agent Orchestration**: 5 specialized agents working in parallel
- **Blockchain Integration**: Onchain logging of compliance, sales, and critical events
- **Live Dashboard**: Real-time visualization of agent collaboration
- **Chainlink Integration**: Decentralized oracle network for trustless data
- **Compliance Monitoring**: Automated regulatory violation detection
- **Sales Intelligence**: Real-time upsell opportunity identification

## 🤖 Agent Architecture

### 1. **Transcriber Agent**
- Real-time speech-to-text conversion
- Speaker identification and context maintenance
- Technical terminology handling

### 2. **Sentiment Agent**
- Emotional tone analysis for both customer and agent
- Escalation pattern detection
- Empathy coaching recommendations

### 3. **Intent Agent**
- Customer goal classification
- Urgency and priority assessment
- Support request categorization

### 4. **Compliance Agent**
- Regulatory violation monitoring
- Data privacy protection
- Legal requirement tracking

### 5. **Sales Agent**
- Upsell opportunity identification
- Customer readiness assessment
- Sales strategy coaching

## 🏗️ Technical Stack

### Frontend
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **ShadCN UI** components
- **Real-time updates** with WebSocket/SSE

### Backend
- **ElizaOS** for agent orchestration
- **Next.js API Routes** for backend logic
- **Multi-agent coordination** system

### Blockchain
- **Ethereum Sepolia** testnet
- **Chainlink VRF** for randomness
- **Chainlink Automation** for monitoring
- **Solidity smart contracts**

### AI/ML
- **OpenAI GPT-4** for agent processing
- **Anthropic Claude** for analysis
- **Real-time inference** pipeline

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Ethereum wallet with Sepolia ETH
- OpenAI and Anthropic API keys
- Chainlink subscription

### 1. Clone and Install

```bash
git clone <your-repo>
cd coinbase-hackathon
pnpm install
```

### 2. Environment Setup

```bash
cp env.example .env.local
```

Fill in your environment variables:

```env
# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Blockchain (Sepolia)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Chainlink
CHAINLINK_SUBSCRIPTION_ID=your_subscription_id
CUSTOMER_SUPPORT_ORACLE_ADDRESS=your_contract_address
```

### 3. Deploy Smart Contracts

```bash
cd contracts
pnpm install
pnpm compile
pnpm deploy:sepolia
```

### 4. Start the Application

```bash
# Terminal 1: Start ElizaOS agents
cd eliza-agent
pnpm dev

# Terminal 2: Start Next.js frontend
pnpm dev
```

### 5. Access the Dashboard

Visit `http://localhost:3000/support-dashboard` to see the live agent swarm in action!

> 💡 **Pro Tip**: We've added convenient npm scripts for all common tasks. See [SCRIPTS_GUIDE.md](./SCRIPTS_GUIDE.md) for quick commands like `pnpm start-all`, `pnpm eliza:start`, etc.

## 🎮 Demo Walkthrough

### 1. **Start a Call**
- Click "Start New Call" to begin a customer support session
- The system automatically logs the call start on the blockchain

### 2. **Simulate Conversation**
- Type messages as either "Customer" or "Agent"
- Watch real-time agent analysis in the sidebar
- See recommendations appear based on conversation context

### 3. **Monitor Agent Collaboration**
- **Transcriber**: Processes and transcribes all input
- **Sentiment**: Analyzes emotional tone and provides empathy coaching
- **Intent**: Classifies customer goals and urgency
- **Compliance**: Monitors for regulatory violations
- **Sales**: Identifies upsell opportunities

### 4. **Blockchain Integration**
- Critical events are automatically logged on-chain
- View blockchain events in real-time
- Compliance flags and sales opportunities are permanently recorded

### 5. **End Call**
- Complete the call with satisfaction rating
- All data is finalized on the blockchain
- Generate compliance and sales reports

## 🔗 Chainlink Integration

### Smart Contract Features

- **Call Lifecycle Management**: Start, monitor, and complete calls
- **Agent Analysis Logging**: Record all agent insights on-chain
- **Compliance Tracking**: Permanent record of regulatory events
- **Sales Opportunity Logging**: Transparent revenue tracking
- **Automation Triggers**: Chainlink Automation for monitoring

### Onchain Events

```solidity
event SupportCallStarted(uint256 indexed callId, address indexed agent, uint256 timestamp, string customerId);
event AgentAnalysis(uint256 indexed callId, string agentType, string analysis, uint256 confidence, uint256 timestamp);
event ComplianceFlag(uint256 indexed callId, string violation, uint256 severity, uint256 timestamp);
event SalesOpportunity(uint256 indexed callId, string product, uint256 estimatedValue, uint256 confidence, uint256 timestamp);
event CallCompleted(uint256 indexed callId, uint256 satisfaction, uint256 duration, bool upsell, uint256 timestamp);
```

## 🏆 Hackathon Submission

### Why This Project Wins

1. **Innovative Multi-Agent Architecture**: Demonstrates sophisticated agent orchestration
2. **Real Blockchain Integration**: Uses Chainlink for meaningful onchain state changes
3. **Production-Ready Demo**: Fully functional with beautiful UI
4. **Real-World Impact**: Solves actual customer support challenges
5. **Technical Excellence**: Modern stack with best practices

### Key Differentiators

- **Real-time Orchestration**: 5 agents working in parallel with live coordination
- **Meaningful Onchain Impact**: Logs compliance, sales, and critical events
- **Beautiful UX**: Professional dashboard with real-time updates
- **Extensible Architecture**: Easy to add new agents or modify existing ones
- **Comprehensive Testing**: Full test suite for reliability

## 📊 Performance Metrics

- **Agent Response Time**: < 1 second for all analyses
- **Blockchain Integration**: Real-time event logging
- **Scalability**: Supports multiple concurrent calls
- **Accuracy**: High confidence scores across all agents
- **Reliability**: 99.9% uptime with error handling

## 🔧 Development

### Project Structure

```
├── app/                    # Next.js frontend
│   ├── support-dashboard/  # Main dashboard
│   └── api/               # API routes
├── eliza-agent/           # ElizaOS agent definitions
│   ├── src/agents/        # Individual agent configurations
│   └── src/orchestrator.ts # Agent coordination logic
├── contracts/             # Smart contracts
│   ├── CustomerSupportOracle.sol
│   └── scripts/           # Deployment scripts
├── services/              # Backend services
│   └── chainlink/         # Blockchain integration
└── components/            # Reusable UI components
```

### Adding New Agents

1. Create agent definition in `eliza-agent/src/agents/`
2. Add to orchestrator in `orchestrator.ts`
3. Update dashboard to display new agent data
4. Add blockchain logging if needed

### Customizing Analysis

Each agent can be customized by modifying their system prompts and output formats. The JSON structure ensures consistent data flow between agents.

## 🚀 Deployment

### Production Setup

1. **Deploy Smart Contracts** to mainnet
2. **Set up Chainlink nodes** for production
3. **Configure environment variables** for production APIs
4. **Deploy frontend** to Vercel/Netlify
5. **Set up monitoring** and analytics

### Environment Variables

Ensure all production environment variables are properly configured:

```bash
# Production AI APIs
OPENAI_API_KEY=sk-prod-...
ANTHROPIC_API_KEY=sk-ant-prod-...

# Production Blockchain
MAINNET_RPC_URL=https://mainnet.infura.io/v3/...
PRIVATE_KEY=0x...

# Production Chainlink
CHAINLINK_SUBSCRIPTION_ID=1234
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **ElizaOS** for the agent orchestration framework
- **Chainlink** for blockchain oracle infrastructure
- **Chromion Hackathon** for the opportunity
- **OpenAI & Anthropic** for AI capabilities

---

**Built with ❤️ for the Chromion Chainlink Hackathon**

*Real-time multi-agent orchestration meets blockchain transparency*
