# 🎨 BlockRoll Kit - SDK Design & Usage Examples

**Complete Developer Integration Guide**

> **Note:** API Key-based authentication - Your wallet is automatically tied to your API key. No need to pass wallet addresses in SDK calls!

---

## 📦 Three Integration Options

1. **React SDK** - For React/Next.js applications
2. **Vue SDK** - For Vue.js applications  
3. **CDN Bundle** - Vanilla JavaScript (Plug & Play)

---

## 🔑 Core Concept

**API Key = Your Identity**

```
When you create an API key:
  ├─ API Key is generated
  ├─ Tied to YOUR wallet address
  ├─ Has specific permissions
  └─ Used for ALL SDK operations

SDK automatically knows:
  ✅ Who you are (your wallet)
  ✅ What you can do (permissions)
  ✅ Your files, workspaces, etc.
```

**You never pass your wallet address in SDK calls!**

---

## 🎯 1. React SDK Usage Examples

### **Installation**

```bash
npm install @blockroll/react-sdk
# or
yarn add @blockroll/react-sdk
```

### **Basic Setup**

```tsx
// app/layout.tsx or pages/_app.tsx
import { BlockRollProvider } from '@blockroll/react-sdk';

export default function App({ children }) {
  return (
    <BlockRollProvider apiKey={process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY}>
      {children}
    </BlockRollProvider>
  );
}
```

### **Example 1: Upload File**

```tsx
'use client';

import { useBlockRoll } from '@blockroll/react-sdk';
import { useState } from 'react';

export default function UploadPage() {
  const { uploadFile, loading, error } = useBlockRoll();
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      const result = await uploadFile({
        file: file,
        accessType: 'private', // 'private' | 'public' | 'restricted'
        encryption: true,
        expiryDate: new Date('2025-12-31'), // Optional
      });

      console.log('File uploaded:', result);
      // {
      //   fileId: '507f1f77bcf86cd799439011',
      //   ipfsHash: 'Qm...',
      //   encryptedHash: '0x...',
      //   txHash: '0x...',
      //   url: 'https://ipfs.io/ipfs/Qm...'
      // }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload File'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

### **Example 2: List My Files**

```tsx
import { useMyFiles } from '@blockroll/react-sdk';

export default function MyFiles() {
  const { files, loading, refetch } = useMyFiles({
    page: 1,
    limit: 10,
    status: 'active', // 'active' | 'deleted' | 'expired'
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Files ({files.total})</h2>
      {files.data.map((file) => (
        <div key={file.id}>
          <h3>{file.name}</h3>
          <p>Size: {file.size} bytes</p>
          <p>Type: {file.type}</p>
          <p>Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
          <p>Status: {file.status}</p>
        </div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### **Example 3: Share File**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

export default function ShareFile({ fileId }: { fileId: string }) {
  const { shareFile } = useBlockRoll();

  const handleShare = async () => {
    try {
      const result = await shareFile({
        fileId: fileId,
        recipientWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', // Recipient's wallet
        accessLevel: 'view', // 'view' | 'edit' | 'download'
        expiryDate: new Date('2025-06-30'), // Optional
      });

      console.log('File shared:', result);
      // {
      //   success: true,
      //   shareId: '507f1f77bcf86cd799439012',
      //   txHash: '0x...',
      //   notificationSent: true
      // }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return <button onClick={handleShare}>Share with User</button>;
}
```

### **Example 4: Download File**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

export default function DownloadFile({ fileId }: { fileId: string }) {
  const { downloadFile, loading } = useBlockRoll();

  const handleDownload = async () => {
    try {
      const blob = await downloadFile(fileId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'file.pdf'; // Or get filename from metadata
      a.click();
      
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <button onClick={handleDownload} disabled={loading}>
      {loading ? 'Downloading...' : 'Download File'}
    </button>
  );
}
```

### **Example 5: Real-Time Notifications**

```tsx
import { useNotifications } from '@blockroll/react-sdk';

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

  // Real-time WebSocket subscription
  useEffect(() => {
    const unsubscribe = subscribe((notification) => {
      console.log('New notification:', notification);
      // Show toast, update UI, etc.
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="notification-bell">
      <button>
        🔔 Notifications {unreadCount > 0 && <span>({unreadCount})</span>}
      </button>
      
      <div className="dropdown">
        {notifications.map((notif) => (
          <div key={notif.id} onClick={() => markAsRead(notif.id)}>
            <p>{notif.message}</p>
            <small>{notif.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **Example 6: Team Workspace**

```tsx
import { useWorkspace } from '@blockroll/react-sdk';

export default function TeamWorkspace() {
  const { createWorkspace, addMember, workspaces } = useWorkspace();

  const handleCreateWorkspace = async () => {
    const workspace = await createWorkspace({
      name: 'Marketing Team',
      description: 'Marketing materials and campaigns',
    });

    // Add team member
    await addMember({
      workspaceId: workspace.id,
      memberWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      role: 'editor', // 'owner' | 'admin' | 'editor' | 'viewer'
    });
  };

  return (
    <div>
      <button onClick={handleCreateWorkspace}>Create Workspace</button>
      
      {workspaces.map((workspace) => (
        <div key={workspace.id}>
          <h3>{workspace.name}</h3>
          <p>Members: {workspace.members.length}</p>
          <p>Files: {workspace.fileCount}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Example 7: Emergency Access Setup**

```tsx
import { useEmergencyAccess } from '@blockroll/react-sdk';

export default function EmergencyAccessSetup({ fileId }: { fileId: string }) {
  const { setupEmergencyAccess } = useEmergencyAccess();

  const handleSetup = async () => {
    await setupEmergencyAccess({
      fileId: fileId,
      trustedContacts: [
        {
          wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          inactivityPeriod: 30, // days
        },
      ],
      scope: 'full', // 'full' | 'specific'
    });

    console.log('Emergency access configured');
  };

  return (
    <button onClick={handleSetup}>
      Setup Emergency Access
    </button>
  );
}
```

---

## 🎨 2. Vue SDK Usage Examples

### **Installation**

```bash
npm install @blockroll/vue-sdk
# or
yarn add @blockroll/vue-sdk
```

### **Basic Setup**

```ts
// main.ts
import { createApp } from 'vue';
import { BlockRollPlugin } from '@blockroll/vue-sdk';
import App from './App.vue';

const app = createApp(App);

app.use(BlockRollPlugin, {
  apiKey: import.meta.env.VITE_BLOCKROLL_API_KEY,
});

app.mount('#app');
```

### **Example 1: Upload File (Composition API)**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const { uploadFile, loading, error } = useBlockRoll();
const file = ref<File | null>(null);

const handleUpload = async () => {
  if (!file.value) return;

  try {
    const result = await uploadFile({
      file: file.value,
      accessType: 'private',
      encryption: true,
    });

    console.log('Uploaded:', result);
  } catch (err) {
    console.error(err);
  }
};
</script>

<template>
  <div>
    <input type="file" @change="file = $event.target.files[0]" />
    <button @click="handleUpload" :disabled="loading">
      {{ loading ? 'Uploading...' : 'Upload' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>
```

### **Example 2: List Files (Composition API)**

```vue
<script setup lang="ts">
import { useMyFiles } from '@blockroll/vue-sdk';

const { files, loading, refetch } = useMyFiles({
  page: 1,
  limit: 10,
});
</script>

<template>
  <div>
    <h2>My Files ({{ files?.total || 0 }})</h2>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else>
      <div v-for="file in files.data" :key="file.id" class="file-card">
        <h3>{{ file.name }}</h3>
        <p>Size: {{ file.size }} bytes</p>
        <p>Uploaded: {{ new Date(file.createdAt).toLocaleString() }}</p>
      </div>
    </div>
    
    <button @click="refetch">Refresh</button>
  </div>
</template>
```

### **Example 3: Share File**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const props = defineProps<{ fileId: string }>();
const { shareFile } = useBlockRoll();

const recipientWallet = ref('');
const accessLevel = ref<'view' | 'edit' | 'download'>('view');

const handleShare = async () => {
  const result = await shareFile({
    fileId: props.fileId,
    recipientWallet: recipientWallet.value,
    accessLevel: accessLevel.value,
  });

  alert('File shared successfully!');
};
</script>

<template>
  <div class="share-modal">
    <h3>Share File</h3>
    
    <input
      v-model="recipientWallet"
      placeholder="Recipient wallet (0x...)"
    />
    
    <select v-model="accessLevel">
      <option value="view">View Only</option>
      <option value="edit">Can Edit</option>
      <option value="download">Can Download</option>
    </select>
    
    <button @click="handleShare">Share</button>
  </div>
</template>
```

### **Example 4: Real-Time Notifications**

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useNotifications } from '@blockroll/vue-sdk';

const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  // Subscribe to real-time notifications
  unsubscribe = subscribe((notification) => {
    // Show toast or update UI
    console.log('New notification:', notification);
  });
});

onUnmounted(() => {
  unsubscribe?.();
});
</script>

<template>
  <div class="notification-bell">
    <button class="bell-icon">
      🔔 <span v-if="unreadCount > 0">{{ unreadCount }}</span>
    </button>
    
    <div class="notifications-dropdown">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        @click="markAsRead(notif.id)"
      >
        <p>{{ notif.message }}</p>
        <small>{{ notif.createdAt }}</small>
      </div>
    </div>
  </div>
</template>
```

---

## 🌐 3. CDN Bundle (Vanilla JavaScript - Plug & Play)

### **Installation**

```html
<!-- Add to your HTML <head> -->
<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
```

### **Example 1: Initialize & Upload**

```html
<!DOCTYPE html>
<html>
<head>
  <title>BlockRoll Integration</title>
  <script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
</head>
<body>
  <input type="file" id="fileInput" />
  <button onclick="uploadFile()">Upload</button>
  
  <div id="status"></div>

  <script>
    // Initialize BlockRoll
    const blockroll = new BlockRoll({
      apiKey: 'YOUR_API_KEY_HERE',
      network: 'blockdag-mainnet', // or 'blockdag-testnet'
    });

    async function uploadFile() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Please select a file');
        return;
      }

      try {
        document.getElementById('status').textContent = 'Uploading...';
        
        const result = await blockroll.files.upload({
          file: file,
          accessType: 'private',
          encryption: true,
        });

        document.getElementById('status').textContent = 
          `Uploaded! File ID: ${result.fileId}`;
        
        console.log('Upload result:', result);
      } catch (error) {
        document.getElementById('status').textContent = 
          `Error: ${error.message}`;
      }
    }
  </script>
</body>
</html>
```

### **Example 2: List & Display Files**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
</head>
<body>
  <h2>My Files</h2>
  <div id="files-list"></div>
  <button onclick="loadFiles()">Load Files</button>

  <script>
    const blockroll = new BlockRoll({
      apiKey: 'YOUR_API_KEY_HERE',
    });

    async function loadFiles() {
      try {
        const files = await blockroll.files.list({
          page: 1,
          limit: 20,
        });

        const container = document.getElementById('files-list');
        container.innerHTML = '';

        files.data.forEach((file) => {
          const div = document.createElement('div');
          div.innerHTML = `
            <h3>${file.name}</h3>
            <p>Size: ${file.size} bytes</p>
            <p>Type: ${file.type}</p>
            <button onclick="downloadFile('${file.id}')">Download</button>
            <button onclick="shareFile('${file.id}')">Share</button>
          `;
          container.appendChild(div);
        });
      } catch (error) {
        console.error('Error loading files:', error);
      }
    }

    async function downloadFile(fileId) {
      try {
        const blob = await blockroll.files.download(fileId);
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'file';
        a.click();
        
        URL.revokeObjectURL(url);
      } catch (error) {
        alert('Download failed: ' + error.message);
      }
    }

    function shareFile(fileId) {
      const wallet = prompt('Enter recipient wallet address:');
      if (!wallet) return;

      blockroll.files.share({
        fileId: fileId,
        recipientWallet: wallet,
        accessLevel: 'view',
      })
      .then(() => alert('File shared successfully!'))
      .catch((error) => alert('Share failed: ' + error.message));
    }
  </script>
</body>
</html>
```

### **Example 3: Real-Time Notifications**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
</head>
<body>
  <div id="notification-bell">
    🔔 <span id="unread-count">0</span>
  </div>
  
  <div id="notifications"></div>

  <script>
    const blockroll = new BlockRoll({
      apiKey: 'YOUR_API_KEY_HERE',
      realtime: true, // Enable WebSocket
    });

    // Subscribe to real-time notifications
    blockroll.notifications.subscribe((notification) => {
      // Update unread count
      const count = document.getElementById('unread-count');
      count.textContent = parseInt(count.textContent) + 1;

      // Add to notifications list
      const div = document.createElement('div');
      div.className = 'notification';
      div.innerHTML = `
        <p>${notification.message}</p>
        <small>${new Date(notification.createdAt).toLocaleString()}</small>
      `;
      
      document.getElementById('notifications').prepend(div);

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('BlockRoll', {
          body: notification.message,
          icon: 'https://blockroll.io/icon.png',
        });
      }
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  </script>
</body>
</html>
```

### **Example 4: Team Workspace**

```html
<script>
  const blockroll = new BlockRoll({ apiKey: 'YOUR_API_KEY' });

  // Create workspace
  async function createWorkspace() {
    const workspace = await blockroll.workspace.create({
      name: 'Development Team',
      description: 'Project files and docs',
    });

    console.log('Workspace created:', workspace);

    // Add member
    await blockroll.workspace.addMember({
      workspaceId: workspace.id,
      memberWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      role: 'editor',
    });

    console.log('Member added');
  }

  // List workspaces
  async function listWorkspaces() {
    const workspaces = await blockroll.workspace.list();
    
    workspaces.forEach((workspace) => {
      console.log(`${workspace.name}: ${workspace.members.length} members`);
    });
  }
</script>
```

---

## 🔐 API Key Management

### **Creating API Keys (React)**

```tsx
import { useApiKeys } from '@blockroll/react-sdk';

export default function ApiKeyManagement() {
  const { createApiKey, keys, revokeKey } = useApiKeys();

  const handleCreate = async () => {
    const key = await createApiKey({
      name: 'Production API Key',
      permissions: ['upload', 'download', 'share', 'delete'],
      sdkType: 'react', // 'react' | 'vue' | 'cdn' | 'custom'
      rateLimit: 1000, // requests per hour
    });

    alert(`API Key Created: ${key.key}\n\n⚠️ Save this! It won't be shown again.`);
  };

  return (
    <div>
      <button onClick={handleCreate}>Create New API Key</button>
      
      <h3>Your API Keys</h3>
      {keys.map((key) => (
        <div key={key.id}>
          <p>Name: {key.name}</p>
          <p>Type: {key.sdkType}</p>
          <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
          <p>Last Used: {key.lastUsed || 'Never'}</p>
          <button onClick={() => revokeKey(key.id)}>Revoke</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Complete API Surface

### **Files API**

```typescript
// Upload file
uploadFile(options: {
  file: File;
  accessType: 'private' | 'public' | 'restricted';
  encryption?: boolean;
  expiryDate?: Date;
  tags?: string[];
}): Promise<UploadResult>

// List files
listFiles(options: {
  page?: number;
  limit?: number;
  status?: 'active' | 'deleted' | 'expired';
  tags?: string[];
}): Promise<FileList>

// Get file by ID
getFile(fileId: string): Promise<File>

// Download file
downloadFile(fileId: string): Promise<Blob>

// Share file
shareFile(options: {
  fileId: string;
  recipientWallet: string;
  accessLevel: 'view' | 'edit' | 'download';
  expiryDate?: Date;
}): Promise<ShareResult>

// Revoke access
revokeAccess(options: {
  fileId: string;
  wallet: string;
}): Promise<void>

// Delete file
deleteFile(fileId: string): Promise<void>
```

### **Workspace API**

```typescript
// Create workspace
createWorkspace(options: {
  name: string;
  description?: string;
}): Promise<Workspace>

// Add member
addMember(options: {
  workspaceId: string;
  memberWallet: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
}): Promise<void>

// Remove member
removeMember(workspaceId: string, memberWallet: string): Promise<void>

// List workspaces
listWorkspaces(): Promise<Workspace[]>
```

### **Notifications API**

```typescript
// Get notifications
getNotifications(options: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<NotificationList>

// Mark as read
markAsRead(notificationId: string): Promise<void>

// Subscribe to real-time
subscribe(callback: (notification: Notification) => void): () => void
```

### **Emergency Access API**

```typescript
// Setup emergency access
setupEmergencyAccess(options: {
  fileId: string;
  trustedContacts: Array<{
    wallet: string;
    inactivityPeriod: number; // days
  }>;
  scope: 'full' | 'specific';
}): Promise<void>
```

---

## 🎯 Key Advantages

### **Developer Experience**

✅ **No Wallet Management** - API key handles everything  
✅ **Type-Safe** - Full TypeScript support  
✅ **React Hooks** - Modern React patterns  
✅ **Vue Composables** - Composition API  
✅ **Plug & Play** - CDN for instant integration  
✅ **Real-Time** - WebSocket built-in  
✅ **Error Handling** - Comprehensive error types  

### **Security**

✅ **API Key Auth** - No private keys in frontend  
✅ **Permissions** - Granular access control  
✅ **Rate Limiting** - Built-in protection  
✅ **CORS** - Configurable origins  
✅ **Encryption** - End-to-end by default  

---

## 🚀 Next Steps

1. **Choose your SDK** (React/Vue/CDN)
2. **Get API Key** from dashboard
3. **Install SDK** in your project
4. **Start building!** 🎉

---

**Questions? Check docs.blockroll.io** 📚

