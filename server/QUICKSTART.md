# BlockRoll Server - Quick Start Guide

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Set Up Environment

Create a `.env` file in the `server` directory:

```env
# Server
NODE_ENV=development
PORT=5000
HOST=localhost

# Database
MONGODB_URI=mongodb://localhost:27017/blockroll

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=30d

# BlockDAG
BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
BLOCKDAG_CHAIN_ID=1
BLOCKDAG_CONTRACT_ADDRESS=0x... # Your deployed contract address

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
```

### 4. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Authentication

- **POST** `/api/v1/auth/connect-wallet` - Connect wallet
- **POST** `/api/v1/auth/refresh` - Refresh token
- **GET** `/api/v1/auth/verify-session` - Verify session
- **GET** `/api/v1/auth/me` - Get current user
- **PATCH** `/api/v1/auth/email` - Update email
- **POST** `/api/v1/auth/logout` - Logout

### Files

- **POST** `/api/v1/file/upload` - Upload file
- **GET** `/api/v1/file/my-files` - Get user's files
- **GET** `/api/v1/file/:id` - Get file by ID
- **POST** `/api/v1/file/:id/share` - Share file
- **POST** `/api/v1/file/:id/revoke` - Revoke access
- **DELETE** `/api/v1/file/:id` - Delete file
- **POST** `/api/v1/file/:id/emergency-access` - Enable emergency access

### SDK / API Keys

- **POST** `/api/v1/sdk/create` - Create API key
- **GET** `/api/v1/sdk/my-keys` - Get user's API keys
- **DELETE** `/api/v1/sdk/revoke/:id` - Revoke API key
- **PATCH** `/api/v1/sdk/:id/permissions` - Update permissions
- **GET** `/api/v1/sdk/:id/stats` - Get usage stats
- **POST** `/api/v1/sdk/verify` - Verify API key

### Workspaces

- **POST** `/api/v1/workspace/create` - Create workspace
- **GET** `/api/v1/workspace/my-workspaces` - Get user's workspaces
- **GET** `/api/v1/workspace/:id` - Get workspace by ID
- **POST** `/api/v1/workspace/:id/add-member` - Add member
- **POST** `/api/v1/workspace/:id/remove-member` - Remove member
- **PATCH** `/api/v1/workspace/:id/member-role` - Update member role
- **GET** `/api/v1/workspace/:id/files` - Get workspace files
- **DELETE** `/api/v1/workspace/:id` - Delete workspace

### Notifications

- **GET** `/api/v1/notifications` - Get notifications
- **GET** `/api/v1/notifications/unread` - Get unread notifications
- **GET** `/api/v1/notifications/unread-count` - Get unread count
- **POST** `/api/v1/notifications/:id/read` - Mark as read
- **POST** `/api/v1/notifications/mark-all-read` - Mark all as read
- **DELETE** `/api/v1/notifications/:id` - Delete notification

### Admin

- **GET** `/api/v1/admin/stats` - Get platform stats
- **GET** `/api/v1/admin/users` - Get all users
- **GET** `/api/v1/admin/files` - Get all files
- **POST** `/api/v1/admin/users/:id/suspend` - Suspend user
- **DELETE** `/api/v1/admin/api-keys/:id` - Revoke API key
- **DELETE** `/api/v1/admin/files/:id` - Delete file
- **POST** `/api/v1/admin/create` - Create admin

## 🔐 Authentication

### Wallet Connection Example

```bash
curl -X POST http://localhost:5000/api/v1/auth/connect-wallet \
  -H "Content-Type: application/json" \
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

Response:

```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {...},
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "isNewUser": false
  }
}
```

### Using Access Token

```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📤 File Upload Example

```bash
curl -X POST http://localhost:5000/api/v1/file/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/file.pdf" \
  -F "fileName=document.pdf" \
  -F "receiver=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

## 🔑 API Key Usage (SDK/CDN)

### 1. Create API Key

```bash
curl -X POST http://localhost:5000/api/v1/sdk/create \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sdkType": "react",
    "permissions": ["upload", "read", "share"]
  }'
```

### 2. Use API Key

```bash
curl -X POST http://localhost:5000/api/v1/sdk/verify \
  -H "x-api-key: br_your_api_key_here"
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Code Quality

```bash
# Lint
npm run lint

# Format
npm run format
```

## 🏗️ Build for Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 🔄 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 🐛 Troubleshooting

### MongoDB Connection Error

Make sure MongoDB is running:

```bash
# Check MongoDB status
mongosh --eval "db.serverStatus().ok"
```

### Port Already in Use

Change the port in `.env`:

```env
PORT=5001
```

### TypeScript Errors

Clear build cache:

```bash
rm -rf dist node_modules package-lock.json
npm install
npm run build
```

## 📚 Additional Resources

- [Full API Documentation](./README.md)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Express Documentation](https://expressjs.com/)

---

**Happy Coding! 🚀**
