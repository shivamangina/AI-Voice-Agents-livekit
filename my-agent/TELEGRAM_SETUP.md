# Telegram Integration Setup Guide

This guide will help you set up your ElizaOS agent to interact with users via Telegram DMs.

## Prerequisites

1. **Telegram Bot Token**: You need to create a bot and get a token from [@BotFather](https://t.me/botfather) on Telegram.

## Step 1: Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token (it looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Configure Environment Variables

Create a `.env` file in your project root with the following content:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# Optional: Other AI provider keys
# ANTHROPIC_API_KEY=your_anthropic_key_here
# OPENAI_API_KEY=your_openai_key_here
# OPENROUTER_API_KEY=your_openrouter_key_here
# GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
# OLLAMA_API_ENDPOINT=http://localhost:11434
```

**Important**: Replace `your_telegram_bot_token_here` with your actual bot token from BotFather.

## Step 3: Update Character Configuration

The project is already configured to use Telegram when the `TELEGRAM_BOT_TOKEN` environment variable is set. The configuration includes:

- **Direct Messages**: Enabled (`allowDirectMessages: true`)
- **Group Restrictions**: Disabled (bot can join any group)
- **Message Tracking**: Limited to 100 messages per chat
- **Custom Templates**: Available for message handling

## Step 4: Install Dependencies

```bash
# Install the Telegram plugin
bun install

# Or if using npm
npm install
```

## Step 5: Start the Agent

```bash
# Start in development mode
bun run dev

# Or start in production mode
bun run start
```

## Step 6: Test Your Bot

1. Find your bot on Telegram (using the username you created)
2. Send `/start` to begin a conversation
3. Your ElizaOS agent should respond with helpful messages

## Configuration Options

You can customize the Telegram behavior by modifying the settings in `src/character.ts`:

### Allow Direct Messages Only
```typescript
allowDirectMessages: true,
shouldOnlyJoinInAllowedGroups: true,
allowedGroupIds: [], // Empty array means no groups allowed
```

### Allow Specific Groups
```typescript
allowDirectMessages: true,
shouldOnlyJoinInAllowedGroups: true,
allowedGroupIds: ["-123456789", "-987654321"], // Add your group IDs
```

### Allow All Interactions
```typescript
allowDirectMessages: true,
shouldOnlyJoinInAllowedGroups: false,
allowedGroupIds: [], // Ignored when shouldOnlyJoinInAllowedGroups is false
```

## Troubleshooting

### Error 409: Conflict
If you see this error:
```
error: 409: Conflict: terminated by other getUpdates request; make sure that only one bot instance is running
```

This means multiple instances of your bot are running. Solutions:
1. Stop all running instances of your bot
2. Ensure only one process is using the bot token
3. Wait a few minutes before restarting

### Bot Not Responding
1. Check that your bot token is correct in the `.env` file
2. Ensure the bot is started and running
3. Try sending `/start` to the bot
4. Check the console logs for any errors

### Environment Variable Not Loading
1. Make sure the `.env` file is in the project root
2. Restart the development server after creating the `.env` file
3. Verify the variable name is exactly `TELEGRAM_BOT_TOKEN`

## Advanced Features

### Custom Message Templates
You can customize how your bot responds by modifying the templates in the character configuration:

```typescript
templates: {
  telegramMessageHandlerTemplate: "Custom welcome message: {{message}}"
}
```

### Integration with Other Plugins
Your bot can use all the other ElizaOS plugins:
- SQL database access
- Local AI processing
- Bootstrap components
- And more...

## Security Best Practices

1. **Never commit your bot token** to version control
2. **Use environment variables** for sensitive data
3. **Restrict bot access** to specific groups if needed
4. **Monitor bot usage** and implement rate limiting if necessary

## Next Steps

Once your bot is working, you can:
1. Customize the character's personality and responses
2. Add more sophisticated conversation flows
3. Integrate with external APIs and services
4. Implement user authentication and personalization
5. Add analytics and monitoring

## Support

If you encounter issues:
1. Check the [ElizaOS documentation](https://eliza.how/docs)
2. Review the [Telegram plugin documentation](https://github.com/elizaos-plugins/plugin-telegram)
3. Check the console logs for error messages
4. Ensure all dependencies are properly installed 