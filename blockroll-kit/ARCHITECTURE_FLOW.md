# 🏗️ BlockRoll SDK → Backend → Blockchain Architecture Flow

**Complete request flow from SDK to blockchain**

---

## 🎯 Yes, SDK Makes Requests to Your Backend!

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer's App                           │
│                  (React/Vue/CDN)                             │
│                                                              │
│  const { uploadFile } = useBlockRoll();                     │
│  await uploadFile({ file, accessType: 'private' });         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP Request
                           │ x-api-key: YOUR_API_KEY
                           │ POST /api/v1/file/upload
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BlockRoll Backend (Node.js/Express)             │
│                  http://api.blockroll.io                     │
│                                                              │
│  1. Verify API key ✅                                        │
│  2. Check permissions ✅                                     │
│  3. Encrypt file (AES-256-GCM) 🔒                           │
│  4. Upload to IPFS → Get hash                               │
│  5. Store metadata in MongoDB                               │
│  6. Record on BlockDAG blockchain                           │
│  7. Send WebSocket notification 📡                          │
│  8. Return response                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    MongoDB        IPFS          BlockDAG       WebSocket
   (Metadata)    (Files)      (Blockchain)    (Real-time)
```

---

## 📡 Request Flow Details

### **Example: File Upload**

```
Step 1: User calls SDK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend (React):
  const { uploadFile } = useBlockRoll();
  await uploadFile({ 
    file: myFile.pdf, 
    accessType: 'private' 
  });

Step 2: SDK sends HTTP request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HTTP POST https://api.blockroll.io/v1/file/upload
Headers:
  x-api-key: pk_live_abc123...
  Content-Type: multipart/form-data
Body:
  file: [binary data]
  accessType: private
  encryption: true

Step 3: Backend receives request
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend (Express):
  1. authenticateApiKey middleware
     → Verify API key in database
     → Get owner wallet from API key
     → Attach to req.user
  
  2. FileController.uploadFile
     → Get file from req.file
     → Get wallet from req.user (from API key!)
  
  3. FileService.uploadFile
     → Encrypt file (AES-256-GCM)
     → Upload to IPFS
     → Get IPFS hash
  
  4. Save to MongoDB
     → Store metadata
     → owner: req.user.walletAddress (from API key!)
  
  5. Record on BlockDAG
     → Call smart contract
     → fileRegistry.registerFile()
     → Get transaction hash
  
  6. Emit WebSocket event
     → SocketService.emitToUser()
     → Real-time notification
  
  7. Return response

Step 4: SDK receives response
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Response:
  {
    success: true,
    file: {
      id: '507f1f77bcf86cd799439011',
      name: 'myFile.pdf',
      ipfsHash: 'QmX5g7...',
      encryptedHash: '0x8f3a...',
      txHash: '0x9d2b...',
      owner: '0xYourWallet' (from API key!)
    }
  }

Step 5: Frontend updates UI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React:
  - uploadFile() resolves
  - State updates automatically
  - UI re-renders
  - Shows success message
```

---

## 🔑 API Key Flow (Critical!)

### **How API Key Identifies You:**

```
1. You create API key in dashboard
   ↓
   Dashboard stores in database:
   {
     _id: '507f1f77bcf86cd799439011',
     key: 'pk_live_abc123...' (hashed),
     owner: '0xYourWalletAddress',
     permissions: ['upload', 'download', 'share'],
     sdkType: 'react'
   }

2. SDK sends request with API key
   ↓
   Headers: { 'x-api-key': 'pk_live_abc123...' }

3. Backend verifies API key
   ↓
   authenticateApiKey middleware:
   - Looks up API key in database
   - Finds owner: '0xYourWalletAddress'
   - Attaches to request: req.user = { 
       userId, 
       walletAddress: '0xYourWallet' 
     }

4. Backend uses YOUR wallet for all operations
   ↓
   FileService:
   - owner: req.user.walletAddress
   - Smart contract called with YOUR wallet
   - Files saved under YOUR ownership

5. SDK receives response
   ↓
   Response includes YOUR files, YOUR wallet
```

**That's why developers never pass their wallet - it's in the API key!** ✨

---

## 📊 Complete Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Developer's Frontend                    │
│              React/Vue/CDN with BlockRoll SDK             │
│                                                           │
│  User uploads file using SDK                             │
└──────────────────────────────────────────────────────────┘
                           │
                           │ HTTP/HTTPS Request
                           │ x-api-key: pk_live_abc123...
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│              BlockRoll Backend API Server                 │
│          https://api.blockroll.io/v1                     │
│          (Node.js + Express + TypeScript)                │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 1. API Key Middleware                           │    │
│  │    → Verify API key                             │    │
│  │    → Get wallet from API key                    │    │
│  │    → Attach to request                          │    │
│  └─────────────────────────────────────────────────┘    │
│                      │                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 2. File Controller                              │    │
│  │    → Handle request                             │    │
│  │    → Call FileService                           │    │
│  └─────────────────────────────────────────────────┘    │
│                      │                                    │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 3. File Service                                 │    │
│  │    → Encrypt file (AES-256-GCM)                │    │
│  │    → Upload to IPFS                             │    │
│  │    → Save to MongoDB                            │    │
│  │    → Call smart contract                        │    │
│  │    → Emit WebSocket event                       │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
└──────────────────────────────────────────────────────────┘
         │              │              │              │
         ▼              ▼              ▼              ▼
    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
    │MongoDB │    │  IPFS  │    │BlockDAG│    │WebSocket│
    │        │    │        │    │        │    │        │
    │Metadata│    │Encrypted│   │Smart   │    │Real-time│
    │Storage │    │Files   │    │Contract│    │Events  │
    └────────┘    └────────┘    └────────┘    └────────┘
```

---

## 🔄 Real-World Request Examples

### **1. Upload File**

**SDK Call:**
```typescript
const result = await uploadFile({
  file: myDocument.pdf,
  accessType: 'private',
  encryption: true,
});
```

**HTTP Request:**
```http
POST https://api.blockroll.io/v1/file/upload
Headers:
  x-api-key: pk_live_abc123...
  Content-Type: multipart/form-data
Body:
  file: [myDocument.pdf binary]
  accessType: private
  encryption: true
```

**Backend Process:**
```
1. API key middleware → Identifies wallet: 0xYourWallet
2. FileController → Receives file
3. FileService → Encrypts file
4. Upload to IPFS → Returns: QmX5g7...
5. Save MongoDB → owner: 0xYourWallet
6. BlockDAG contract → fileRegistry.registerFile()
7. WebSocket → Emit "file:uploaded" to 0xYourWallet
8. Return response
```

**SDK Response:**
```json
{
  "success": true,
  "file": {
    "id": "507f1f77bcf86cd799439011",
    "name": "myDocument.pdf",
    "ipfsHash": "QmX5g7...",
    "encryptedHash": "0x8f3a...",
    "txHash": "0x9d2b...",
    "owner": "0xYourWallet"
  }
}
```

---

### **2. Share File**

**SDK Call:**
```typescript
await shareFile({
  fileId: '507f1f77bcf86cd799439011',
  recipientWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  accessLevel: 'view',
});
```

**HTTP Request:**
```http
POST https://api.blockroll.io/v1/file/507f1f77bcf86cd799439011/share
Headers:
  x-api-key: pk_live_abc123...
Body:
  {
    "recipientWallet": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "accessLevel": "view"
  }
```

**Backend Process:**
```
1. API key → Your wallet: 0xYourWallet
2. Check file ownership (must be YOUR file)
3. Add to accessList in MongoDB
4. Call smart contract: accessControl.grantAccess()
5. Emit WebSocket to RECIPIENT: "file:shared"
6. Emit WebSocket to YOU: "file:share_sent"
7. Return success
```

**WebSocket Events:**
```
Recipient gets:
  event: "file:shared"
  data: {
    fileId: '507f...',
    fileName: 'myDocument.pdf',
    sharedBy: '0xYourWallet',
    accessLevel: 'view'
  }

You get:
  event: "file:share_sent"
  data: {
    fileId: '507f...',
    sharedWith: '0x742d35Cc...',
    success: true
  }
```

---

### **3. Download File**

**SDK Call:**
```typescript
const blob = await downloadFile('507f1f77bcf86cd799439011');
```

**HTTP Request:**
```http
GET https://api.blockroll.io/v1/file/507f1f77bcf86cd799439011/download
Headers:
  x-api-key: pk_live_abc123...
```

**Backend Process:**
```
1. API key → Your wallet: 0xYourWallet
2. Check permissions (owner OR in accessList)
3. Get file metadata from MongoDB
4. Fetch encrypted file from IPFS
5. Decrypt file (AES-256-GCM)
6. Stream back to client
```

**SDK Response:**
```
Blob (decrypted file ready to download)
```

---

## 🌐 Endpoint Mapping

### **SDK Methods → Backend Endpoints**

| SDK Method | HTTP Method | Backend Endpoint | Backend Handler |
|------------|-------------|------------------|-----------------|
| `uploadFile()` | POST | `/file/upload` | `FileController.uploadFile` |
| `listFiles()` | GET | `/file/my-files` | `FileController.getMyFiles` |
| `downloadFile()` | GET | `/file/:id/download` | `FileController.downloadFile` |
| `shareFile()` | POST | `/file/:id/share` | `FileController.shareFile` |
| `revokeAccess()` | POST | `/file/:id/revoke` | `FileController.revokeAccess` |
| `deleteFile()` | DELETE | `/file/:id` | `FileController.deleteFile` |
| `createWorkspace()` | POST | `/workspace/create` | `WorkspaceController.createWorkspace` |
| `addMember()` | POST | `/workspace/:id/members` | `WorkspaceController.addMember` |
| `getNotifications()` | GET | `/notifications` | `NotificationController.getNotifications` |
| `markAsRead()` | POST | `/notifications/:id/read` | `NotificationController.markAsRead` |
| `createApiKey()` | POST | `/sdk/create` | `ApiKeyController.createApiKey` |

**Total:** 20+ SDK methods → 48 Backend endpoints

---

## 🔐 Authentication Flow

### **API Key Verification:**

```
SDK Request:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GET /file/my-files
Headers: {
  'x-api-key': 'pk_live_abc123def456...'
}

Backend Process:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. authenticateApiKey middleware (middleware/auth.middleware.ts)
   
   const apiKey = req.headers['x-api-key'];
   
   // Hash the key
   const hashedKey = hashApiKey(apiKey);
   
   // Find in database
   const apiKeyDoc = await ApiKey.findOne({ 
     key: hashedKey,
     isActive: true 
   }).populate('owner');
   
   if (!apiKeyDoc) {
     throw new AuthenticationError('Invalid API key');
   }
   
   // Check permissions
   const requiredPermission = getRequiredPermission(req.path);
   if (!apiKeyDoc.permissions.includes(requiredPermission)) {
     throw new AuthorizationError('Insufficient permissions');
   }
   
   // Attach user to request
   req.user = {
     userId: apiKeyDoc.owner._id,
     walletAddress: apiKeyDoc.owner.walletAddress  // ← YOUR WALLET!
   };
   
   next();

2. FileController.getMyFiles (controllers/FileController.ts)
   
   const userId = req.user.userId;  // From API key!
   const files = await FileService.getUserFiles(userId);
   
   return res.json({ success: true, files });

Backend Response:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "success": true,
  "files": [
    {
      "id": "507f...",
      "name": "document.pdf",
      "owner": "0xYourWallet",  // From API key!
      "ipfsHash": "QmX5g7...",
      ...
    }
  ]
}
```

---

## 🎯 Why This Architecture?

### **Advantages:**

✅ **Security**
- API keys are safer than passing wallets
- Backend validates every request
- Encryption happens server-side
- Smart contract calls are server-signed

✅ **Simplicity**
- Developer just passes API key
- No wallet management in frontend
- No Web3 provider needed
- No transaction signing in SDK

✅ **Performance**
- Backend handles heavy operations
- File encryption server-side
- IPFS uploads server-side
- Blockchain calls server-side

✅ **Reliability**
- Backend can retry failed operations
- Better error handling
- Transaction management
- Consistent state

---

## 🔄 WebSocket Flow

### **Real-Time Notifications:**

```
1. SDK connects to WebSocket
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend:
  const blockroll = new BlockRollCore({ apiKey: 'pk_live_...' });
  blockroll.websocket.connect();

WebSocket Connection:
  wss://api.blockroll.io
  Auth: { apiKey: 'pk_live_...' }

2. Backend authenticates WebSocket
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend (config/socket.ts):
  io.use(async (socket, next) => {
    const apiKey = socket.handshake.auth.apiKey;
    
    // Verify API key
    const apiKeyDoc = await ApiKey.findOne({ ... });
    
    // Get wallet from API key
    socket.data.userId = apiKeyDoc.owner._id;
    socket.data.walletAddress = apiKeyDoc.owner.walletAddress;
    
    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);
    
    next();
  });

3. Events are sent to YOUR room
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Backend (when something happens):
  // Someone shares file with you
  SocketService.emitToUser(yourUserId, 'file:shared', {
    fileId: '...',
    sharedBy: '0xTheirWallet',
  });

4. SDK receives event
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend:
  socket.on('file:shared', (data) => {
    // React: State updates automatically
    // Vue: Ref updates automatically
    // CDN: Call your callback
  });
```

---

## 🗺️ Backend API Endpoints (Your Server)

### **Base URL:**
```
Production: https://api.blockroll.io/v1
Development: http://localhost:5000/api/v1
```

### **File Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/file/upload` | Upload encrypted file |
| GET | `/file/my-files` | List user's files |
| GET | `/file/:id` | Get file metadata |
| GET | `/file/:id/download` | Download file |
| POST | `/file/:id/share` | Share with wallet |
| POST | `/file/:id/revoke` | Revoke access |
| DELETE | `/file/:id` | Delete file |

### **Workspace Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/workspace/create` | Create workspace |
| GET | `/workspace/my-workspaces` | List workspaces |
| POST | `/workspace/:id/members` | Add member |
| DELETE | `/workspace/:id/members/:wallet` | Remove member |

### **Notification Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/notifications` | Get notifications |
| GET | `/notifications/unread-count` | Get count |
| POST | `/notifications/:id/read` | Mark as read |

### **SDK Endpoints:**

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/sdk/create` | Create API key |
| GET | `/sdk/my-keys` | List API keys |
| DELETE | `/sdk/revoke/:id` | Revoke API key |

---

## 💻 SDK Implementation (Core)

### **HTTP Client (Simplified):**

```typescript
// @blockroll/core/src/client.ts
import axios from 'axios';

export class BlockRollClient {
  private client: AxiosInstance;

  constructor(apiKey: string, baseURL: string) {
    this.client = axios.create({
      baseURL: baseURL,  // https://api.blockroll.io/v1
      headers: {
        'x-api-key': apiKey,  // Your API key sent with every request!
      },
      timeout: 30000,
    });
  }

  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }
}
```

### **File Operations (Simplified):**

```typescript
// @blockroll/core/src/files.ts
export class FileOperations {
  constructor(private client: BlockRollClient) {}

  async upload(options: UploadOptions): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', options.file);
    formData.append('accessType', options.accessType);
    formData.append('encryption', String(options.encryption ?? true));

    // Makes request to YOUR backend!
    return this.client.post('/file/upload', formData);
  }

  async list(options?: ListOptions): Promise<FileList> {
    // Makes request to YOUR backend!
    return this.client.get('/file/my-files', options);
  }

  async share(options: ShareOptions): Promise<ShareResult> {
    // Makes request to YOUR backend!
    return this.client.post(`/file/${options.fileId}/share`, {
      recipientWallet: options.recipientWallet,
      accessLevel: options.accessLevel,
    });
  }
}
```

---

## 🎯 Complete Flow Diagram

```
Developer's App (React)
    │
    │ SDK Call: uploadFile({ file, accessType: 'private' })
    ▼
SDK (@blockroll/react-sdk)
    │
    │ useBlockRoll() hook
    ▼
Core SDK (@blockroll/core)
    │
    │ HTTP POST /file/upload
    │ Headers: x-api-key
    ▼
Your Backend (api.blockroll.io)
    │
    ├─→ Verify API key ✅
    ├─→ Get wallet from API key
    ├─→ Encrypt file
    ├─→ Upload to IPFS
    ├─→ Save to MongoDB
    ├─→ Call BlockDAG smart contract
    └─→ Emit WebSocket event
    │
    │ Response: { fileId, ipfsHash, txHash }
    ▼
SDK receives response
    │
    │ Returns to developer's app
    ▼
React state updates
    │
    ▼
UI re-renders with new file!
```

---

## ✅ Summary

**Yes, SDK makes requests to YOUR backend!**

### **SDK's Job:**
- ✅ Provide easy API for developers
- ✅ Handle authentication (API key)
- ✅ Make HTTP requests to backend
- ✅ Handle WebSocket connections
- ✅ Manage state (React/Vue)
- ✅ Handle errors gracefully

### **Backend's Job:**
- ✅ Verify API keys
- ✅ Identify user from API key
- ✅ Encrypt/decrypt files
- ✅ Upload/download from IPFS
- ✅ Interact with smart contracts
- ✅ Manage database
- ✅ Send WebSocket events
- ✅ Handle security

### **Smart Contract's Job:**
- ✅ Store file metadata on blockchain
- ✅ Record ownership
- ✅ Manage access control
- ✅ Provide immutable audit trail

---

**🎉 The SDK is a beautiful wrapper around your backend API!** ✨

It makes developer experience **10x better** while your backend handles all the heavy lifting! 🚀

