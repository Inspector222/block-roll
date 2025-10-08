# BlockRoll Server API

Professional, TypeScript-based backend API for BlockRoll - Non-custodial data exchange and storage platform.

## 🏗️ Architecture

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # MongoDB connection
│   │   ├── logger.ts        # Winston logger
│   │   └── index.ts         # App configuration
│   │
│   ├── models/              # Mongoose models
│   │   ├── User.model.ts
│   │   ├── File.model.ts
│   │   ├── ApiKey.model.ts
│   │   ├── Workspace.model.ts
│   │   ├── Notification.model.ts
│   │   ├── Admin.model.ts
│   │   └── index.ts
│   │
│   ├── controllers/         # Route controllers
│   │   ├── BaseController.ts
│   │   └── ...
│   │
│   ├── services/            # Business logic layer
│   │   ├── BaseService.ts
│   │   └── ...
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── index.ts
│   │
│   ├── routes/              # API routes
│   │   └── ...
│   │
│   ├── utils/               # Utility functions
│   │   ├── errors.ts        # Custom error classes
│   │   ├── response.ts      # Response handlers
│   │   ├── encryption.ts    # Encryption service
│   │   ├── validators.ts    # Validation utilities
│   │   ├── jwt.ts           # JWT service
│   │   └── index.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── ...
│   │
│   └── index.ts             # App entry point
│
├── logs/                    # Log files
├── uploads/                 # Temporary file uploads
├── package.json
├── tsconfig.json
└── README.md
```

## ✨ Features

### Core Technologies
- **Node.js** with **TypeScript** for type safety
- **Express** for API framework
- **Mongoose** for MongoDB ODM
- **JWT** for authentication
- **Winston** for logging
- **Express Rate Limit** for rate limiting

### Architecture Patterns
- ✅ **Class-based** controllers and services
- ✅ **Modular** design with clear separation of concerns
- ✅ **BaseController** and **BaseService** for code reuse
- ✅ **Centralized error handling**
- ✅ **Standardized API responses**
- ✅ **Middleware-based authentication and validation**

## 📦 Models

### User Model
- Wallet address-based authentication
- Role management (user/admin)
- API keys and workspaces references

### File Model
- File metadata and encryption references
- Access control lists
- Emergency access configuration
- Expiry and status management

### ApiKey Model
- SDK/CDN integration support
- Hashed key storage
- Usage tracking
- Permission-based access

### Workspace Model
- Team collaboration
- Member roles (owner/admin/editor/viewer)
- File sharing within teams

### Notification Model
- Multiple notification types
- Priority levels
- Read/unread status
- Expiry support

### Admin Model
- Admin permissions
- Platform statistics
- Activity logging

## 🔧 Utilities

### Encryption Service
- AES-256-GCM encryption/decryption
- File hashing
- Key generation
- Secure key storage

### JWT Service
- Access and refresh token generation
- Token verification
- Token extraction from headers

### Validators
- Wallet address validation
- Email validation
- File validation
- Pagination validation
- Date range validation

### Response Handler
- Standardized success responses
- Standardized error responses
- Paginated responses
- HTTP status code helpers

### Custom Errors
- `AppError` - Base error class
- `ValidationError` - 400 errors
- `AuthenticationError` - 401 errors
- `AuthorizationError` - 403 errors
- `NotFoundError` - 404 errors
- `ConflictError` - 409 errors
- `BlockchainError` - Blockchain-related errors
- `EncryptionError` - Encryption-related errors

## 🛡️ Middleware

### Authentication
- `authenticate` - JWT token authentication
- `authenticateApiKey` - API key authentication
- `optionalAuth` - Optional authentication
- `requireAdmin` - Admin role check
- `requirePermissions` - Permission-based authorization
- `requireWalletOwnership` - Wallet ownership verification

### Error Handling
- Global error handler
- 404 handler
- Async error wrapper

### Validation
- Request validation using express-validator
- File upload validation
- Body sanitization

### Rate Limiting
- General rate limiter
- Strict limiter for sensitive endpoints
- Upload limiter
- API key limiter

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 5.0
- Redis (optional, for session management)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Environment Variables

See `.env.example` for all required environment variables.

Key variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `BLOCKDAG_RPC_URL` - BlockDAG network RPC URL
- `BLOCKDAG_CONTRACT_ADDRESS` - Deployed contract address
- `ENCRYPTION_KEY` - 32-character encryption key

## 📡 API Routes

### Authentication Routes
- `POST /auth/connect-wallet` - Connect wallet
- `GET /auth/verify-session` - Verify session
- `POST /auth/refresh` - Refresh token

### File Routes
- `POST /file/upload` - Upload file
- `GET /file/:id` - Get file metadata
- `POST /file/:id/decrypt` - Decrypt file
- `POST /file/share` - Share file
- `POST /file/:id/revoke` - Revoke access
- `POST /file/emergency/access` - Emergency access

### SDK Routes
- `POST /sdk/create` - Create API key
- `POST /sdk/verify` - Verify API key
- `DELETE /sdk/revoke/:id` - Revoke API key

### Workspace Routes
- `POST /workspace/create` - Create workspace
- `GET /workspace/:id` - Get workspace
- `POST /workspace/:id/add-member` - Add member
- `POST /workspace/:id/remove-member` - Remove member
- `GET /workspace/:id/files` - List workspace files

### Notification Routes
- `GET /notifications` - Get notifications
- `POST /notifications/:id/read` - Mark as read
- `POST /notifications/mark-all-read` - Mark all as read

### Admin Routes
- `GET /admin/stats` - Platform statistics
- `GET /admin/users` - List users
- `GET /admin/files` - List files
- `DELETE /admin/revoke-api/:id` - Revoke API key

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 Code Style

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🔒 Security

- JWT-based authentication
- API key hashing
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection protection (MongoDB)
- XSS protection
- CORS configuration
- Helmet security headers

## 📊 Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## 🤝 Contributing

1. Follow TypeScript best practices
2. Extend `BaseController` for new controllers
3. Extend `BaseService` for new services
4. Use custom error classes from `utils/errors`
5. Use `ResponseHandler` for consistent responses
6. Add validation middleware to routes
7. Document all public methods
8. Write unit tests for new features

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for BlockRoll**
