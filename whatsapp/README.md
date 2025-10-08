# BlockSend WhatsApp Bot - Professional Modular Architecture

A professional, enterprise-grade WhatsApp bot built with TypeScript for BlockSend global payment platform, featuring AI-powered responses, clean modular architecture, comprehensive error handling, and extensive testing capabilities.

## 🏗️ Architecture Overview

This project follows a professional senior-level architecture with clear separation of concerns:

```
src/
├── ai/                     # AI integration layer
│   ├── types.ts           # AI type definitions
│   ├── config.ts          # Gemini API configuration
│   ├── client.ts          # Gemini client with retry logic
│   ├── parsers.ts         # Message parsing and analysis
│   ├── support.ts         # AI-powered customer support
│   └── index.ts           # AI exports
├── app/                    # Application layer
│   ├── WhatsAppBot.ts     # Main bot orchestrator
│   └── index.ts           # App exports
├── commands/               # Command definitions
│   ├── CustomCommands.ts  # BlockSend-specific commands
│   └── index.ts           # Command exports
├── config/                 # Configuration management
│   └── index.ts           # Config manager and singleton
├── handlers/               # Event handling layer
│   ├── EventHandlers.ts   # Event handler implementations
│   └── index.ts           # Handler exports
├── middleware/             # Cross-cutting concerns
│   ├── ErrorHandler.ts    # Error handling utilities
│   ├── ProcessManager.ts  # Process lifecycle management
│   └── index.ts           # Middleware exports
├── services/               # Business logic layer
│   ├── WhatsAppService.ts # WhatsApp Web.js wrapper
│   ├── MessageService.ts  # Message processing logic
│   ├── MediaService.ts    # Media handling logic
│   └── index.ts           # Service exports
├── types/                  # TypeScript definitions
│   └── index.ts           # All type definitions
├── utils/                  # Utility functions
│   ├── helpers.ts         # Helper functions
│   ├── logger.ts          # Professional logging
│   └── index.ts           # Utility exports
└── index.ts               # Main entry point
```

## ✨ Features

### 🎯 Core Features
- **AI-Powered Responses**: Gemini AI integration for intelligent message parsing and responses
- **BlockSend Integration**: Specialized for global payments, escrow, and wallet services
- **Modular Architecture**: Clean separation of concerns with dependency injection
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Professional Logging**: Structured logging with multiple output formats
- **Error Handling**: Comprehensive error handling with graceful degradation
- **Configuration Management**: Flexible configuration with validation
- **Process Management**: Graceful shutdown and lifecycle management

### 🤖 Bot Features
- **AI Commands**: Intelligent commands for payments, wallets, and support
- **Smart Parsing**: AI-powered message analysis and intent recognition
- **Customer Support**: Automated support with escalation to human agents
- **Payment Processing**: BlockSend-specific payment and escrow commands
- **Command System**: Extensible command system with admin controls
- **Media Support**: Full media handling with validation and processing
- **Event System**: Pluggable event handlers for custom functionality
- **Session Persistence**: Automatic session management with LocalAuth
- **Group Support**: Group chat functionality with permission controls

### 🛠️ Development Features
- **Testing**: Comprehensive test suite with Jest
- **Linting**: ESLint configuration for code quality
- **Hot Reload**: Development mode with automatic reloading
- **Type Checking**: Strict TypeScript configuration
- **Documentation**: Comprehensive inline documentation

## 🚀 Quick Start

### Prerequisites
- **Node.js v18+** (required by WhatsApp Web.js)
- **npm** or **yarn** package manager
- **WhatsApp mobile app** for QR code scanning
- **Gemini API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd whatsapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

### Usage

#### Development Mode (Recommended)
```bash
npm run dev
```

#### Production Mode
   ```bash
   npm run build
   npm start
 ```

#### Watch Mode (Auto-rebuild)
```bash
npm run watch
```

## 📱 First Run Setup

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Scan QR Code:**
   - A QR code will appear in your terminal
   - Open WhatsApp on your mobile device
   - Go to Settings > Linked Devices
   - Tap "Link a Device"
   - Scan the QR code displayed in the terminal

3. **Authentication:**
   - After scanning, the bot will authenticate and show "Client is ready!"
   - Your session will be saved for future runs (no need to scan QR again)

## 🤖 Available Commands

### BlockSend AI Commands
- `!send` - Send money globally with BlockSend
- `!balance` - Check your BlockSend wallet balance
- `!wallet` - Create or manage your BlockSend wallet
- `!support` - Get BlockSend customer support
- `!ai` - Ask BlockSend AI assistant anything

### Default Commands
- `!info` - Get chat and contact information
- `!commands` - List all available commands
- `!status` - Get bot status information (admin only)
- `!help` - Show help message

### Auto-Reply Features
- `ping` → Bot replies "Pong!"
- `hello`/`hi` → Bot greets you
- `help` → Shows available commands
- `time` → Shows current time

### Adding Custom Commands

```typescript
import { WhatsAppBot } from './src/app/WhatsAppBot';

const bot = new WhatsAppBot();

// Register a custom command
bot.registerCommand({
  trigger: 'weather',
  description: 'Get weather information',
  handler: async (message, args) => {
    const location = args.join(' ');
    await message.reply(`Weather for ${location}: Sunny, 25°C`);
  }
});
```

## ⚙️ Configuration

### Configuration File
Create a `config.json` file in the project root:

```json
{
  "whatsapp": {
    "authStrategy": {
      "dataPath": "./sessions"
    },
    "puppeteer": {
      "headless": true,
      "args": ["--no-sandbox", "--disable-setuid-sandbox"]
    }
  },
  "logging": {
    "level": "info",
    "enableConsole": true,
    "enableFile": false,
    "filePath": "./logs/whatsapp-bot.log"
  },
  "bot": {
    "autoReply": true,
    "adminNumbers": ["1234567890"]
  }
}
```

### Environment Variables
You can also use environment variables:
```bash
export WHATSAPP_LOG_LEVEL=debug
export WHATSAPP_ADMIN_NUMBERS=1234567890,0987654321
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Individual component testing
- **Integration Tests**: Service interaction testing
- **Mocking**: Comprehensive mocking for external dependencies

## 📊 Monitoring & Logging

### Log Levels
- `debug`: Detailed debugging information
- `info`: General information messages
- `warn`: Warning messages
- `error`: Error messages

### Log Output
- **Console**: Colored output for development
- **File**: Structured logging to file (configurable)
- **Structured**: JSON format for log aggregation

### Process Monitoring
- **Memory Usage**: Automatic memory leak detection
- **Uptime Tracking**: Process uptime monitoring
- **Health Checks**: Built-in health check endpoints

## 🔧 Development

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Project Scripts
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run the compiled application
- `npm run dev` - Run with ts-node (development)
- `npm run watch` - Watch for changes and rebuild
- `npm run clean` - Remove compiled files

## 🏗️ Architecture Patterns

### Service Layer Pattern
- **WhatsAppService**: Handles WhatsApp Web.js operations
- **MessageService**: Manages message processing and commands
- **MediaService**: Handles media download and validation

### Event-Driven Architecture
- **Event Handlers**: Pluggable event processing
- **Event Manager**: Centralized event routing
- **Middleware**: Cross-cutting concerns

### Dependency Injection
- **Singleton Pattern**: Configuration and logger management
- **Factory Pattern**: Service instantiation
- **Strategy Pattern**: Configurable authentication strategies

## 🛡️ Security & Best Practices

### Security Features
- **Input Validation**: Comprehensive input sanitization
- **Error Handling**: Secure error messages
- **Rate Limiting**: Built-in rate limiting capabilities
- **Admin Controls**: Role-based access control

### Best Practices
- **Type Safety**: Strict TypeScript configuration
- **Error Boundaries**: Graceful error handling
- **Resource Management**: Proper cleanup and shutdown
- **Testing**: Comprehensive test coverage

## 📚 API Reference

### WhatsAppBot Class
Main application class that orchestrates all services.

```typescript
const bot = new WhatsAppBot();
await bot.initialize();

// Register custom command
bot.registerCommand({
  trigger: 'custom',
  description: 'Custom command',
  handler: async (message, args) => {
    // Command logic
  }
});
```

### Service Classes
- **WhatsAppService**: WhatsApp Web.js client wrapper
- **MessageService**: Message processing and command handling
- **MediaService**: Media download and validation

### Event Handlers
- **BaseEventHandler**: Abstract base class for event handlers
- **MessageEventHandler**: Message processing events
- **AuthEventHandler**: Authentication events

## 🚨 Troubleshooting

### Common Issues

1. **Node.js Version Error:**
   - Ensure you have Node.js v18 or higher
   - Check version: `node --version`

2. **QR Code Not Appearing:**
   - Make sure Chrome/Chromium is installed
   - Try running with `--no-sandbox` flag

3. **Authentication Issues:**
   - Delete the `sessions/` folder and try again
   - Ensure WhatsApp mobile app is up to date

4. **Memory Issues:**
   - Check memory usage in logs
   - Restart the application periodically

### Debug Mode
     ```bash
# Enable debug logging
export WHATSAPP_LOG_LEVEL=debug
npm run dev
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the test examples

## 🔮 Roadmap

- [ ] Web dashboard for bot management
- [ ] Database integration for command persistence
- [ ] Plugin system for custom functionality
- [ ] REST API for external integrations
- [ ] Docker containerization
- [ ] Kubernetes deployment configurations

---

**Built with ❤️ by Team Bravo**

*Professional WhatsApp Bot Architecture - Enterprise Ready*