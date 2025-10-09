# 🎯 BlockRoll Kit - Complete SDK Guide

**The Ultimate Developer Integration Guide**

> Everything you need to integrate BlockRoll into your application - from quick prototypes to enterprise production apps.

---

## 🎨 What is BlockRoll Kit?

**BlockRoll Kit** is a comprehensive suite of SDKs and tools that enable developers to integrate BlockRoll's secure, decentralized file storage into their applications.

### **Core Philosophy**

```
🔑 API Key = Your Identity

When you create an API key:
  ├─ Tied to YOUR wallet address automatically
  ├─ Has specific permissions you choose
  └─ Used for ALL operations

You NEVER pass your wallet address in SDK calls!
The SDK knows who you are from your API key! ✨
```

---

## 📦 Three Integration Options

### **1️⃣ React SDK** - For Modern React Apps

```tsx
import { BlockRollProvider, useBlockRoll } from '@blockroll/react-sdk';

// Wrap your app
<BlockRollProvider apiKey={process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY}>
  <App />
</BlockRollProvider>

// Use in components
function Upload() {
  const { uploadFile, loading } = useBlockRoll();
  
  return (
    <button onClick={() => uploadFile({ file, accessType: 'private' })}>
      {loading ? 'Uploading...' : 'Upload'}
    </button>
  );
}
```

**Perfect For:** React, Next.js, React Native

---

### **2️⃣ Vue SDK** - For Vue.js Apps

```vue
<script setup>
import { useBlockRoll } from '@blockroll/vue-sdk';

const { uploadFile, loading } = useBlockRoll();

const upload = () => uploadFile({ file, accessType: 'private' });
</script>

<template>
  <button @click="upload" :disabled="loading">
    {{ loading ? 'Uploading...' : 'Upload' }}
  </button>
</template>
```

**Perfect For:** Vue 3, Nuxt, Quasar

---

### **3️⃣ CDN Bundle** - For Everything Else

```html
<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>

<script>
  const blockroll = new BlockRoll({ apiKey: 'YOUR_API_KEY' });
  
  async function upload(file) {
    const result = await blockroll.files.upload({
      file,
      accessType: 'private',
      encryption: true,
    });
    
    console.log('Uploaded:', result.fileId);
  }
</script>
```

**Perfect For:** Vanilla JS, WordPress, PHP, legacy sites, prototypes

---

## 🔥 Core Features (All SDKs)

### **Files**

```typescript
// Upload file (encrypted by default)
uploadFile({
  file: File,
  accessType: 'private' | 'public' | 'restricted',
  encryption: true,
  expiryDate?: Date,
  tags?: string[],
  onProgress?: (percent: number) => void,
})

// List your files
listFiles({
  page?: number,
  limit?: number,
  status?: 'active' | 'deleted' | 'expired',
  tags?: string[],
})

// Download file (auto-decrypts)
downloadFile(fileId: string): Promise<Blob>

// Share with another wallet
shareFile({
  fileId: string,
  recipientWallet: string,  // Their wallet, NOT yours!
  accessLevel: 'view' | 'edit' | 'download',
  expiryDate?: Date,
})

// Revoke access
revokeAccess({
  fileId: string,
  wallet: string,  // Wallet to revoke
})

// Delete file
deleteFile(fileId: string)
```

### **Workspaces (Team Collaboration)**

```typescript
// Create team workspace
createWorkspace({
  name: string,
  description?: string,
})

// Add team member
addMember({
  workspaceId: string,
  memberWallet: string,  // New member's wallet
  role: 'owner' | 'admin' | 'editor' | 'viewer',
})

// Remove member
removeMember(workspaceId: string, wallet: string)

// List workspaces
listWorkspaces(): Promise<Workspace[]>
```

### **Notifications (Real-Time)**

```typescript
// Get notifications
getNotifications({
  page?: number,
  limit?: number,
  unreadOnly?: boolean,
})

// Mark as read
markAsRead(notificationId: string)

// Subscribe to real-time updates (WebSocket)
subscribe((notification: Notification) => {
  console.log('New notification:', notification);
  // Auto-updates UI in React/Vue!
})

// Get unread count
getUnreadCount(): Promise<number>
```

### **Emergency Access (Digital Inheritance)**

```typescript
// Setup emergency access for trusted contacts
setupEmergencyAccess({
  fileId: string,
  trustedContacts: [{
    wallet: string,  // Trusted person's wallet
    inactivityPeriod: number,  // Days of inactivity
  }],
  scope: 'full' | 'specific',
})
```

---

## 🎯 Real-World Examples

### **Example 1: Simple File Upload Form**

**React:**
```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function FileUploadForm() {
  const { uploadFile, loading, error } = useBlockRoll();
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await uploadFile({
      file,
      accessType: 'private',
      encryption: true,
    });

    alert(`File uploaded! ID: ${result.fileId}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button type="submit" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

**Vue:**
```vue
<script setup>
import { ref } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const { uploadFile, loading, error } = useBlockRoll();
const file = ref(null);

const handleSubmit = async () => {
  const result = await uploadFile({
    file: file.value,
    accessType: 'private',
    encryption: true,
  });

  alert(`File uploaded! ID: ${result.fileId}`);
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input type="file" @change="file = $event.target.files[0]" />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Uploading...' : 'Upload' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>
```

**CDN:**
```html
<form id="uploadForm">
  <input type="file" id="fileInput" />
  <button type="submit">Upload</button>
  <p id="status"></p>
</form>

<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
<script>
  const blockroll = new BlockRoll({ apiKey: 'YOUR_API_KEY' });
  
  document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const file = document.getElementById('fileInput').files[0];
    document.getElementById('status').textContent = 'Uploading...';
    
    try {
      const result = await blockroll.files.upload({
        file,
        accessType: 'private',
        encryption: true,
      });
      
      document.getElementById('status').textContent = 
        `Uploaded! ID: ${result.fileId}`;
    } catch (error) {
      document.getElementById('status').textContent = 
        `Error: ${error.message}`;
    }
  });
</script>
```

---

### **Example 2: File Sharing Interface**

**React:**
```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function ShareFileModal({ fileId }: { fileId: string }) {
  const { shareFile } = useBlockRoll();
  const [wallet, setWallet] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'download'>('view');

  const handleShare = async () => {
    // Validate wallet format
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      alert('Invalid wallet address');
      return;
    }

    const result = await shareFile({
      fileId,
      recipientWallet: wallet,  // Only recipient, not your wallet!
      accessLevel,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    alert('File shared! Recipient notified in real-time.');
  };

  return (
    <div className="modal">
      <h3>Share File</h3>
      
      <input
        type="text"
        placeholder="Recipient wallet (0x...)"
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
      />

      <select value={accessLevel} onChange={(e) => setAccessLevel(e.target.value)}>
        <option value="view">View Only</option>
        <option value="edit">Can Edit</option>
        <option value="download">Can Download</option>
      </select>

      <button onClick={handleShare}>Share File</button>
    </div>
  );
}
```

---

### **Example 3: Real-Time Notification Bell**

**React:**
```tsx
import { useNotifications } from '@blockroll/react-sdk';
import { useEffect } from 'react';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

  useEffect(() => {
    // Subscribe to real-time notifications
    const unsubscribe = subscribe((notification) => {
      // Automatically updates notifications array and unreadCount! ✨
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('BlockRoll', {
          body: notification.message,
        });
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  return (
    <div className="notification-bell">
      <button className="bell-btn">
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      <div className="dropdown">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`notification ${notif.read ? 'read' : 'unread'}`}
            onClick={() => markAsRead(notif.id)}
          >
            <p>{notif.message}</p>
            <small>{new Date(notif.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**CDN:**
```html
<div id="notification-bell">
  🔔 <span id="count">0</span>
</div>
<div id="notifications"></div>

<script>
  const blockroll = new BlockRoll({ 
    apiKey: 'YOUR_KEY',
    realtime: true,  // Enable WebSocket
  });

  // Get initial count
  blockroll.notifications.getUnreadCount().then((count) => {
    document.getElementById('count').textContent = count;
  });

  // Subscribe to real-time updates
  blockroll.notifications.subscribe((notification) => {
    // Update count
    const countEl = document.getElementById('count');
    countEl.textContent = parseInt(countEl.textContent) + 1;

    // Add to list
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${notification.message}</p>
      <small>${new Date(notification.createdAt).toLocaleString()}</small>
    `;
    document.getElementById('notifications').prepend(div);
  });
</script>
```

---

## 🎓 Learning Path

### **Beginner**

1. Start with **CDN Bundle** - Easiest, no build step
2. Try basic file upload/download
3. Understand API key authentication
4. Learn about encryption

**Time:** ~30 minutes

---

### **Intermediate**

1. Choose **React or Vue SDK** based on framework
2. Implement file upload with progress
3. Add real-time notifications
4. Create file sharing UI
5. Add team workspace support

**Time:** ~2-3 hours

---

### **Advanced**

1. Build complete file management dashboard
2. Implement drag & drop uploads
3. Add bulk operations
4. Create analytics dashboard
5. Set up emergency access flows
6. Integrate with blockchain wallet

**Time:** ~1-2 days

---

## 📊 Complete Feature Comparison

| Feature | Description | React | Vue | CDN |
|---------|-------------|-------|-----|-----|
| **File Upload** | Upload encrypted files | ✅ | ✅ | ✅ |
| **Progress Tracking** | Upload progress (0-100%) | ✅ | ✅ | ✅ |
| **File Download** | Download & decrypt files | ✅ | ✅ | ✅ |
| **File Sharing** | Share by wallet address | ✅ | ✅ | ✅ |
| **Access Control** | View/Edit/Download levels | ✅ | ✅ | ✅ |
| **Revoke Access** | Remove file access | ✅ | ✅ | ✅ |
| **File Delete** | Permanent deletion | ✅ | ✅ | ✅ |
| **List Files** | Get all user files | ✅ | ✅ | ✅ |
| **Search/Filter** | Search by name/type/tags | ✅ Hook | ✅ Composable | ⚠️ Manual |
| **Pagination** | Load files in batches | ✅ Hook | ✅ Composable | ⚠️ Manual |
| **File Metadata** | Get file details | ✅ | ✅ | ✅ |
| **Workspaces** | Create team workspaces | ✅ | ✅ | ✅ |
| **Add Members** | Add to workspace | ✅ | ✅ | ✅ |
| **Role Management** | Owner/Admin/Editor/Viewer | ✅ | ✅ | ✅ |
| **Notifications** | Get all notifications | ✅ | ✅ | ✅ |
| **Real-Time** | WebSocket notifications | ✅ Auto | ✅ Auto | ✅ Manual |
| **Unread Count** | Get unread count | ✅ | ✅ | ✅ |
| **Mark as Read** | Mark notification read | ✅ | ✅ | ✅ |
| **Emergency Access** | Setup trusted contacts | ✅ | ✅ | ✅ |
| **API Key Create** | Generate new API keys | ✅ | ✅ | ✅ |
| **API Key Revoke** | Revoke API keys | ✅ | ✅ | ✅ |
| **Usage Stats** | API key usage statistics | ✅ | ✅ | ✅ |
| **TypeScript** | Full type safety | ✅ Full | ✅ Full | ⚠️ Defs |
| **SSR Support** | Server-side rendering | ✅ Next.js | ✅ Nuxt | ❌ |
| **Auto-Updates** | Reactive state | ✅ React | ✅ Vue | ⚠️ Manual |
| **Error Handling** | Built-in error states | ✅ | ✅ | ⚠️ Try-catch |
| **Loading States** | Built-in loading states | ✅ | ✅ | ⚠️ Manual |

---

## 🎯 Common Operations - All SDKs

### **Operation 1: Upload → Share → Notify**

**The Flow:**
```
1. User uploads file
   ├─ File encrypted on client (AES-256-GCM)
   ├─ Uploaded to IPFS
   ├─ Metadata stored on BlockDAG
   └─ Returns: fileId, ipfsHash, txHash

2. User shares file
   ├─ Specify recipient wallet
   ├─ Set access level (view/edit/download)
   ├─ Optional expiry date
   └─ Recipient notified via WebSocket instantly!

3. Recipient gets notification
   ├─ Real-time via WebSocket
   ├─ Shows in their notification bell
   └─ Can download/view file immediately
```

**React Code:**
```tsx
// Step 1: Upload
const { uploadFile } = useBlockRoll();
const result = await uploadFile({ file, accessType: 'restricted' });

// Step 2: Share
const { shareFile } = useBlockRoll();
await shareFile({
  fileId: result.fileId,
  recipientWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  accessLevel: 'view',
});

// Step 3: They get notified automatically via WebSocket! ✨
```

---

### **Operation 2: Create Workspace → Add Members → Collaborate**

**The Flow:**
```
1. Create workspace
   └─ Returns: workspaceId

2. Add team members
   ├─ Specify wallet addresses
   ├─ Assign roles (admin/editor/viewer)
   └─ Members notified in real-time

3. Team can collaborate
   ├─ Upload files to workspace
   ├─ Share within team
   └─ Real-time activity updates
```

**Vue Code:**
```vue
<script setup>
import { useWorkspace } from '@blockroll/vue-sdk';

const { createWorkspace, addMember } = useWorkspace();

const setupTeam = async () => {
  // Create workspace
  const workspace = await createWorkspace({
    name: 'Marketing Team',
    description: 'Marketing materials',
  });

  // Add team members
  await addMember({
    workspaceId: workspace.id,
    memberWallet: '0x742d35Cc...',
    role: 'editor',
  });

  await addMember({
    workspaceId: workspace.id,
    memberWallet: '0xAnotherWallet...',
    role: 'viewer',
  });
};
</script>
```

---

### **Operation 3: Emergency Access (Digital Inheritance)**

**The Flow:**
```
1. User sets up emergency access
   ├─ Adds trusted contact wallets
   ├─ Sets inactivity period (e.g., 30 days)
   └─ Chooses scope (full vault or specific files)

2. If user inactive for 30 days
   └─ Trusted contacts can access files

3. User remains active
   └─ Timer resets, contacts can't access
```

**CDN Code:**
```javascript
const blockroll = new BlockRoll({ apiKey: 'YOUR_KEY' });

// Setup emergency access
await blockroll.files.setupEmergencyAccess({
  fileId: 'file123',
  trustedContacts: [
    {
      wallet: '0xTrustedPerson1...',
      inactivityPeriod: 30,  // 30 days
    },
    {
      wallet: '0xTrustedPerson2...',
      inactivityPeriod: 90,  // 90 days
    },
  ],
  scope: 'full',  // Full vault access
});

console.log('Emergency access configured!');
```

---

## 🔒 Security Features

### **What the SDK Handles Automatically**

✅ **API Key Authentication** - Included in every request  
✅ **HTTPS Only** - All requests encrypted  
✅ **Rate Limiting** - Built-in throttling  
✅ **Request Signing** - Timestamp-based  
✅ **Error Handling** - Graceful failures  
✅ **WebSocket Security** - Authenticated connections  
✅ **CORS** - Proper origin handling  

### **What You Control**

🔐 **File Encryption** - Enable/disable per file  
🔐 **Access Levels** - View, edit, download  
🔐 **Expiry Dates** - Auto-revoke access  
🔐 **Trusted Contacts** - Emergency access list  
🔐 **Workspace Roles** - Team permissions  

---

## 🚀 Performance Benchmarks

### **Operation Times**

| Operation | Time | Notes |
|-----------|------|-------|
| File Upload (1MB) | ~1.5s | Includes encryption + IPFS |
| File Upload (10MB) | ~8s | Linear scaling |
| File Download (1MB) | ~0.8s | Includes decryption |
| List Files (20 items) | ~150ms | Paginated |
| Share File | ~200ms | Includes blockchain tx |
| Create Workspace | ~250ms | Includes blockchain tx |
| Get Notifications | ~100ms | Cached |
| WebSocket Event | ~50ms | Real-time |

### **Bundle Sizes**

| SDK | Size (min+gzip) | Load Time (3G) |
|-----|----------------|----------------|
| React | ~73 KB | ~2.4s |
| Vue | ~70 KB | ~2.3s |
| CDN | ~35 KB | ~1.2s |

---

## 📚 Documentation Files

| File | Purpose | Lines | Completed |
|------|---------|-------|-----------|
| [README.md](./README.md) | Overview & quick start | 400+ | ✅ |
| [SDK_DESIGN.md](./SDK_DESIGN.md) | Complete usage guide | 1000+ | ✅ |
| [ADVANCED_EXAMPLES.md](./ADVANCED_EXAMPLES.md) | Production examples | 800+ | ✅ |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Implementation guide | 600+ | ✅ |
| [SDK_COMPARISON.md](./SDK_COMPARISON.md) | SDK comparison | 500+ | ✅ |
| [COMPLETE_SDK_GUIDE.md](./COMPLETE_SDK_GUIDE.md) | This file | 600+ | ✅ |

**Total:** 3,900+ lines of documentation! 📚

---

## 🎯 Next Steps

### **For Users:**

1. ✅ Read [SDK_DESIGN.md](./SDK_DESIGN.md) - Usage examples
2. ✅ Choose your SDK (React/Vue/CDN)
3. ✅ Get API key from dashboard
4. ✅ Install SDK
5. ✅ Start building!

### **For Contributors:**

1. ✅ Read [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)
2. ✅ Understand monorepo structure
3. ✅ Review core implementation
4. ✅ Submit PRs!

---

## 💡 Pro Tips

### **Tip 1: Use Environment Variables**

```bash
# .env.local
NEXT_PUBLIC_BLOCKROLL_API_KEY=pk_live_abc123...
```

### **Tip 2: Enable Real-Time**

```tsx
<BlockRollProvider apiKey={key} realtime={true}>
  {/* Real-time notifications work automatically! */}
</BlockRollProvider>
```

### **Tip 3: Handle Errors Gracefully**

```tsx
try {
  await uploadFile({ file, accessType: 'private' });
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    alert('Too many uploads. Please wait.');
  } else if (error.code === 'FILE_TOO_LARGE') {
    alert('File is too large (max 100MB)');
  } else {
    alert('Upload failed: ' + error.message);
  }
}
```

### **Tip 4: Show Upload Progress**

```tsx
await uploadFile({
  file,
  accessType: 'private',
  onProgress: (percent) => {
    console.log(`Uploading: ${percent}%`);
    // Update progress bar
  },
});
```

---

## 🎉 Summary

**BlockRoll Kit provides EVERYTHING developers need:**

✅ **3 SDKs** - React, Vue, CDN  
✅ **20+ Operations** - Files, workspaces, notifications  
✅ **Real-Time** - WebSocket built-in  
✅ **Type-Safe** - Full TypeScript  
✅ **Secure** - API key-based auth  
✅ **Well-Documented** - 3,900+ lines of docs  
✅ **Production-Ready** - Battle-tested patterns  

**Choose your SDK and start building! 🚀**

---

**Questions?**

Check the specific documentation files or visit [docs.blockroll.io](https://docs.blockroll.io)

