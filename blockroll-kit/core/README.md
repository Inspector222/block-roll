# @blockroll/core

**Core SDK for BlockRoll - Secure data exchange platform**

This is the foundation package used by all BlockRoll SDKs (React, Vue, CDN).

---

## 📦 Installation

```bash
npm install @blockroll/core axios socket.io-client
```

---

## ⚡ Quick Start

```typescript
import { BlockRollCore } from '@blockroll/core';

const blockroll = new BlockRollCore({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://api.blockroll.io/v1',  // optional
  realtime: true,  // Enable WebSocket (default: true)
});

// Upload file
const result = await blockroll.files.upload({
  file: myFile,
  accessType: 'private',
  encryption: true,
});

console.log('Uploaded:', result.fileId);
```

---

## 🎯 Features

- ✅ File operations (upload, download, share, delete)
- ✅ Workspace management
- ✅ Real-time notifications via WebSocket
- ✅ API key authentication
- ✅ Full TypeScript support
- ✅ Error handling
- ✅ Progress tracking

---

## 📚 API Reference

See parent README for complete API documentation.

---

## 🔧 Development

```bash
# Build
npm run build

# Watch mode
npm run dev

# Test
npm test

# Type check
npm run typecheck
```

---

## 📄 License

MIT License

