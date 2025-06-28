#!/bin/bash

# Script to start ElizaOS local server for AI agent fallback
echo "Starting ElizaOS local server for AI agent fallback..."

# Navigate to eliza-agent directory
cd eliza-agent

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "Error: bun is not installed. Please install bun first."
    echo "Visit: https://bun.sh/docs/installation"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    bun install
fi

# Start ElizaOS development server
echo "Starting ElizaOS development server..."
echo "This will provide local AI model inference for the fallback."
echo "The server will be available at the default ElizaOS port."
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

bun run dev 