# NPM Scripts Quick Reference

All scripts can be run with `pnpm run <script-name>` or `pnpm <script-name>`

## 🚀 Development Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Start Next.js development server |
| `eliza:start` | `pnpm eliza:start` | Start ElizaOS local server for AI agents |
| `start-all` | `pnpm start-all` | Start both Next.js and ElizaOS servers |
| `demo` | `pnpm demo` | Start demo mode (same as dev) |
| `real-agents` | `pnpm real-agents` | Start Real AI Agents page |
| `support-dashboard` | `pnpm support-dashboard` | Start Support Dashboard |

## 📦 Setup & Installation

| Script | Command | Description |
|--------|---------|-------------|
| `setup` | `pnpm setup` | Run the main setup script |
| `full-setup` | `pnpm full-setup` | Install all dependencies (Next.js + ElizaOS + Contracts) |
| `eliza:install` | `pnpm eliza:install` | Install ElizaOS dependencies |
| `contracts:install` | `pnpm contracts:install` | Install smart contract dependencies |

## 🏗️ Build & Test

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `pnpm build` | Build Next.js application |
| `eliza:build` | `pnpm eliza:build` | Build ElizaOS application |
| `eliza:test` | `pnpm eliza:test` | Run ElizaOS tests |
| `contracts:compile` | `pnpm contracts:compile` | Compile smart contracts |
| `contracts:test` | `pnpm contracts:test` | Run smart contract tests |

## 🔗 Blockchain & Deployment

| Script | Command | Description |
|--------|---------|-------------|
| `contracts:deploy` | `pnpm contracts:deploy` | Deploy contracts to Sepolia testnet |

## 🧹 Maintenance

| Script | Command | Description |
|--------|---------|-------------|
| `clean` | `pnpm clean` | Remove all node_modules and build files |
| `reset` | `pnpm reset` | Clean everything and reinstall all dependencies |
| `check-env` | `pnpm check-env` | Check environment variables status |
| `help` | `pnpm help` | Show all available scripts |

## 🎯 Common Workflows

### Quick Start (Local Models Only)
```bash
pnpm full-setup    # Install everything
pnpm start-all     # Start both servers
# Visit http://localhost:3000/real-agents
```

### Quick Start (With OpenAI)
```bash
# Add your API key to .env.local first
echo "OPENAI_API_KEY=sk-your-key" > .env.local
pnpm start-all     # Start both servers
# Visit http://localhost:3000/real-agents
```

### Development Workflow
```bash
pnpm dev           # Start Next.js only
# In another terminal:
pnpm eliza:start   # Start ElizaOS only
```

### Smart Contract Development
```bash
pnpm contracts:install   # Install contract dependencies
pnpm contracts:compile   # Compile contracts
pnpm contracts:test      # Run contract tests
pnpm contracts:deploy    # Deploy to Sepolia (requires env vars)
```

### Reset Everything
```bash
pnpm reset         # Clean and reinstall everything
```

## 🔧 Environment Variables

Check your environment setup:
```bash
pnpm check-env
```

This will show:
- Whether OPENAI_API_KEY is set
- Current NODE_ENV
- Other important variables

## 📁 Project Structure

```
coinbase-hackathon/
├── app/                    # Next.js frontend
├── eliza-agent/           # ElizaOS AI agents
├── contracts/             # Smart contracts
├── scripts/               # Setup scripts
└── package.json           # All npm scripts
```

## 🆘 Troubleshooting

### If scripts fail:
1. **Permission issues**: Make sure scripts are executable
   ```bash
   chmod +x scripts/*.sh
   ```

2. **Missing dependencies**: Run full setup
   ```bash
   pnpm full-setup
   ```

3. **Port conflicts**: Check if ports are in use
   ```bash
   lsof -i :3000  # Check Next.js port
   lsof -i :5173  # Check ElizaOS port
   ```

4. **Environment issues**: Check environment
   ```bash
   pnpm check-env
   ```

### Get help anytime:
```bash
pnpm help
``` 