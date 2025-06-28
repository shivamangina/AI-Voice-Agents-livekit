#!/bin/bash

echo "🚀 Setting up Customer Support Agent Swarm for Chromion Hackathon"
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env.local
    echo "⚠️  Please edit .env.local with your API keys and configuration"
    echo "   Required: OPENAI_API_KEY, ANTHROPIC_API_KEY, SEPOLIA_RPC_URL, PRIVATE_KEY"
fi

# Install contract dependencies
echo "📦 Installing smart contract dependencies..."
cd contracts
pnpm install
cd ..

# Install ElizaOS dependencies
echo "📦 Installing ElizaOS dependencies..."
cd eliza-agent
pnpm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Edit .env.local with your API keys and blockchain configuration"
echo "2. Deploy smart contracts: cd contracts && pnpm deploy:sepolia"
echo "3. Start ElizaOS agents: cd eliza-agent && pnpm dev"
echo "4. Start frontend: pnpm dev"
echo "5. Visit http://localhost:3000/support-dashboard"
echo ""
echo "🔗 Useful links:"
echo "- Chromion Hackathon: https://chromion-chainlink-hackathon.devfolio.co/"
echo "- ElizaOS Docs: https://eliza.how/docs/core/project"
echo "- Chainlink Docs: https://docs.chain.link/"
echo ""
echo "🏆 Good luck with your hackathon submission!" 