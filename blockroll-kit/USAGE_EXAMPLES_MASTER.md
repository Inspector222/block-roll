# 🎨 BlockRoll SDK - All Usage Examples in One Place

**Complete code reference for all three SDKs**

> **Remember:** API Key = Your Identity. Never pass your wallet address!

---

## 📋 Table of Contents

1. [File Upload](#-file-upload)
2. [File Download](#-file-download)
3. [File Sharing](#-file-sharing)
4. [List Files](#-list-files)
5. [Revoke Access](#-revoke-access)
6. [Delete File](#-delete-file)
7. [Team Workspaces](#-team-workspaces)
8. [Real-Time Notifications](#-real-time-notifications)
9. [Emergency Access](#-emergency-access)
10. [API Key Management](#-api-key-management)

---

## 📤 File Upload

### React

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function FileUpload() {
  const { uploadFile, loading, error } = useBlockRoll();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;

    const result = await uploadFile({
      file: file,
      accessType: 'private',  // 'private' | 'public' | 'restricted'
      encryption: true,       // AES-256-GCM encryption
      expiryDate: new Date('2025-12-31'),  // Optional
      tags: ['work', 'important'],         // Optional
      onProgress: (percent) => setProgress(percent),
    });

    console.log('Uploaded!', result);
    // { fileId, ipfsHash, encryptedHash, txHash }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0])} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? `Uploading ${progress}%...` : 'Upload'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const { uploadFile, loading, error } = useBlockRoll();
const file = ref<File | null>(null);
const progress = ref(0);

const handleUpload = async () => {
  if (!file.value) return;

  const result = await uploadFile({
    file: file.value,
    accessType: 'private',
    encryption: true,
    expiryDate: new Date('2025-12-31'),
    tags: ['work', 'important'],
    onProgress: (percent) => { progress.value = percent; },
  });

  console.log('Uploaded!', result);
};
</script>

<template>
  <div>
    <input type="file" @change="file = $event.target.files[0]" />
    <button @click="handleUpload" :disabled="loading">
      {{ loading ? `Uploading ${progress}%...` : 'Upload' }}
    </button>
    <p v-if="error">{{ error }}</p>
  </div>
</template>
```

### CDN

```html
<input type="file" id="fileInput" />
<button onclick="upload()">Upload</button>
<p id="status"></p>

<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
<script>
  const blockroll = new BlockRoll({ apiKey: 'YOUR_API_KEY' });

  async function upload() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) return;

    const statusEl = document.getElementById('status');
    statusEl.textContent = 'Uploading...';

    try {
      const result = await blockroll.files.upload({
        file: file,
        accessType: 'private',
        encryption: true,
        expiryDate: new Date('2025-12-31'),
        tags: ['work', 'important'],
        onProgress: (percent) => {
          statusEl.textContent = `Uploading ${percent}%...`;
        },
      });

      statusEl.textContent = `Uploaded! File ID: ${result.fileId}`;
      console.log('Result:', result);
    } catch (error) {
      statusEl.textContent = `Error: ${error.message}`;
    }
  }
</script>
```

---

## 📥 File Download

### React

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function DownloadButton({ fileId }: { fileId: string }) {
  const { downloadFile, loading } = useBlockRoll();

  const handleDownload = async () => {
    const blob = await downloadFile(fileId);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} disabled={loading}>
      {loading ? 'Downloading...' : 'Download'}
    </button>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { useBlockRoll } from '@blockroll/vue-sdk';

const props = defineProps<{ fileId: string }>();
const { downloadFile, loading } = useBlockRoll();

const handleDownload = async () => {
  const blob = await downloadFile(props.fileId);
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'downloaded-file';
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<template>
  <button @click="handleDownload" :disabled="loading">
    {{ loading ? 'Downloading...' : 'Download' }}
  </button>
</template>
```

### CDN

```javascript
async function download(fileId) {
  try {
    const blob = await blockroll.files.download(fileId);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'downloaded-file';
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Download failed: ' + error.message);
  }
}
```

---

## 🔗 File Sharing

### React

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function ShareFileModal({ fileId }: { fileId: string }) {
  const { shareFile } = useBlockRoll();
  const [recipientWallet, setRecipientWallet] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'download'>('view');

  const handleShare = async () => {
    // Validate wallet
    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientWallet)) {
      alert('Invalid wallet address');
      return;
    }

    const result = await shareFile({
      fileId,
      recipientWallet,  // ONLY recipient - SDK knows YOUR wallet from API key!
      accessLevel,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    alert('File shared! Recipient notified in real-time via WebSocket.');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Recipient wallet (0x...)"
        value={recipientWallet}
        onChange={(e) => setRecipientWallet(e.target.value)}
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

### Vue

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const props = defineProps<{ fileId: string }>();
const { shareFile } = useBlockRoll();

const recipientWallet = ref('');
const accessLevel = ref<'view' | 'edit' | 'download'>('view');

const handleShare = async () => {
  if (!/^0x[a-fA-F0-9]{40}$/.test(recipientWallet.value)) {
    alert('Invalid wallet address');
    return;
  }

  await shareFile({
    fileId: props.fileId,
    recipientWallet: recipientWallet.value,
    accessLevel: accessLevel.value,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  alert('File shared!');
};
</script>

<template>
  <div>
    <input v-model="recipientWallet" placeholder="Recipient wallet (0x...)" />
    
    <select v-model="accessLevel">
      <option value="view">View Only</option>
      <option value="edit">Can Edit</option>
      <option value="download">Can Download</option>
    </select>

    <button @click="handleShare">Share File</button>
  </div>
</template>
```

### CDN

```html
<input id="recipientWallet" placeholder="Recipient wallet (0x...)" />
<select id="accessLevel">
  <option value="view">View Only</option>
  <option value="edit">Can Edit</option>
  <option value="download">Can Download</option>
</select>
<button onclick="shareFile('file123')">Share</button>

<script>
  async function shareFile(fileId) {
    const wallet = document.getElementById('recipientWallet').value;
    const accessLevel = document.getElementById('accessLevel').value;

    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      alert('Invalid wallet address');
      return;
    }

    try {
      await blockroll.files.share({
        fileId: fileId,
        recipientWallet: wallet,
        accessLevel: accessLevel,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      alert('File shared!');
    } catch (error) {
      alert('Share failed: ' + error.message);
    }
  }
</script>
```

---

## 📋 List Files

### React

```tsx
import { useMyFiles } from '@blockroll/react-sdk';

function FileList() {
  const { files, loading, refetch } = useMyFiles({
    page: 1,
    limit: 20,
    status: 'active',
    tags: ['work'], // Optional filter
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Files ({files.total})</h2>
      
      {files.data.map((file) => (
        <div key={file.id} className="file-card">
          <h3>{file.name}</h3>
          <p>Type: {file.type}</p>
          <p>Size: {formatSize(file.size)}</p>
          <p>Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
          <p>Status: {file.status}</p>
          <p>Access: {file.accessType}</p>
        </div>
      ))}

      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { useMyFiles } from '@blockroll/vue-sdk';

const { files, loading, refetch } = useMyFiles({
  page: 1,
  limit: 20,
  status: 'active',
});
</script>

<template>
  <div>
    <h2>My Files ({{ files?.total || 0 }})</h2>
    
    <div v-if="loading">Loading...</div>
    
    <div v-else>
      <div v-for="file in files.data" :key="file.id" class="file-card">
        <h3>{{ file.name }}</h3>
        <p>Type: {{ file.type }}</p>
        <p>Size: {{ formatSize(file.size) }}</p>
        <p>Uploaded: {{ new Date(file.createdAt).toLocaleString() }}</p>
      </div>
    </div>

    <button @click="refetch">Refresh</button>
  </div>
</template>
```

### CDN

```html
<div id="files-list"></div>
<button onclick="loadFiles()">Load Files</button>

<script>
  async function loadFiles() {
    try {
      const result = await blockroll.files.list({
        page: 1,
        limit: 20,
        status: 'active',
      });

      const container = document.getElementById('files-list');
      container.innerHTML = `<h2>My Files (${result.total})</h2>`;

      result.data.forEach((file) => {
        const div = document.createElement('div');
        div.className = 'file-card';
        div.innerHTML = `
          <h3>${file.name}</h3>
          <p>Type: ${file.type}</p>
          <p>Size: ${file.size} bytes</p>
          <p>Uploaded: ${new Date(file.createdAt).toLocaleString()}</p>
        `;
        container.appendChild(div);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
</script>
```

---

## 🚫 Revoke Access

### React

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function RevokeAccessButton({ fileId, wallet }: Props) {
  const { revokeAccess } = useBlockRoll();

  const handleRevoke = async () => {
    if (!confirm(`Revoke access for ${wallet}?`)) return;

    await revokeAccess({
      fileId,
      wallet,  // Wallet to revoke access from
    });

    alert('Access revoked! User notified in real-time.');
  };

  return <button onClick={handleRevoke}>Revoke Access</button>;
}
```

### Vue

```vue
<script setup lang="ts">
import { useBlockRoll } from '@blockroll/vue-sdk';

const props = defineProps<{ fileId: string; wallet: string }>();
const { revokeAccess } = useBlockRoll();

const handleRevoke = async () => {
  if (!confirm(`Revoke access for ${props.wallet}?`)) return;

  await revokeAccess({
    fileId: props.fileId,
    wallet: props.wallet,
  });

  alert('Access revoked!');
};
</script>

<template>
  <button @click="handleRevoke">Revoke Access</button>
</template>
```

### CDN

```javascript
async function revokeAccess(fileId, wallet) {
  if (!confirm(`Revoke access for ${wallet}?`)) return;

  try {
    await blockroll.files.revoke(fileId, wallet);
    alert('Access revoked!');
  } catch (error) {
    alert('Revoke failed: ' + error.message);
  }
}
```

---

## 🗑️ Delete File

### React

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

function DeleteButton({ fileId }: { fileId: string }) {
  const { deleteFile } = useBlockRoll();

  const handleDelete = async () => {
    if (!confirm('Delete this file permanently?')) return;

    await deleteFile(fileId);
    alert('File deleted permanently');
  };

  return <button onClick={handleDelete} className="danger">Delete</button>;
}
```

### Vue

```vue
<script setup lang="ts">
import { useBlockRoll } from '@blockroll/vue-sdk';

const props = defineProps<{ fileId: string }>();
const { deleteFile } = useBlockRoll();

const handleDelete = async () => {
  if (!confirm('Delete this file permanently?')) return;
  
  await deleteFile(props.fileId);
  alert('File deleted');
};
</script>

<template>
  <button @click="handleDelete" class="danger">Delete</button>
</template>
```

### CDN

```javascript
async function deleteFile(fileId) {
  if (!confirm('Delete permanently?')) return;

  try {
    await blockroll.files.delete(fileId);
    alert('File deleted');
  } catch (error) {
    alert('Delete failed: ' + error.message);
  }
}
```

---

## 👥 Team Workspaces

### React

```tsx
import { useWorkspace } from '@blockroll/react-sdk';

function WorkspaceManager() {
  const { createWorkspace, addMember, workspaces } = useWorkspace();

  const handleCreateWorkspace = async () => {
    // Create workspace
    const workspace = await createWorkspace({
      name: 'Marketing Team',
      description: 'Marketing materials and campaigns',
    });

    // Add team member
    await addMember({
      workspaceId: workspace.id,
      memberWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      role: 'editor',  // 'owner' | 'admin' | 'editor' | 'viewer'
    });

    alert('Workspace created and member added!');
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

### Vue

```vue
<script setup lang="ts">
import { useWorkspace } from '@blockroll/vue-sdk';

const { createWorkspace, addMember, workspaces } = useWorkspace();

const handleCreate = async () => {
  const workspace = await createWorkspace({
    name: 'Marketing Team',
    description: 'Marketing materials',
  });

  await addMember({
    workspaceId: workspace.id,
    memberWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    role: 'editor',
  });

  alert('Workspace created!');
};
</script>

<template>
  <div>
    <button @click="handleCreate">Create Workspace</button>
    
    <div v-for="workspace in workspaces" :key="workspace.id">
      <h3>{{ workspace.name }}</h3>
      <p>Members: {{ workspace.members.length }}</p>
    </div>
  </div>
</template>
```

### CDN

```javascript
async function createWorkspace() {
  try {
    const workspace = await blockroll.workspace.create({
      name: 'Marketing Team',
      description: 'Marketing materials',
    });

    await blockroll.workspace.addMember({
      workspaceId: workspace.id,
      memberWallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      role: 'editor',
    });

    alert('Workspace created and member added!');
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
```

---

## 🔔 Real-Time Notifications

### React

```tsx
import { useNotifications } from '@blockroll/react-sdk';
import { useEffect } from 'react';

function NotificationBell() {
  const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

  useEffect(() => {
    // Subscribe to real-time WebSocket notifications
    const unsubscribe = subscribe((notification) => {
      // State automatically updates! ✨
      console.log('New notification:', notification);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification('BlockRoll', { body: notification.message });
      }
    });

    return () => unsubscribe();
  }, [subscribe]);

  return (
    <div className="notification-bell">
      <button>
        🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      <div className="dropdown">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={notif.read ? 'read' : 'unread'}
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

### Vue

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useNotifications } from '@blockroll/vue-sdk';

const { notifications, unreadCount, markAsRead, subscribe } = useNotifications();

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = subscribe((notification) => {
    console.log('New notification:', notification);
    
    if (Notification.permission === 'granted') {
      new Notification('BlockRoll', { body: notification.message });
    }
  });
});

onUnmounted(() => {
  unsubscribe?.();
});
</script>

<template>
  <div class="notification-bell">
    <button>
      🔔 <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <div class="dropdown">
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="['notification', notif.read ? 'read' : 'unread']"
        @click="markAsRead(notif.id)"
      >
        <p>{{ notif.message }}</p>
        <small>{{ new Date(notif.createdAt).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>
```

### CDN

```html
<div id="notification-bell">
  🔔 <span id="unread-count">0</span>
</div>
<div id="notifications"></div>

<script>
  const blockroll = new BlockRoll({
    apiKey: 'YOUR_KEY',
    realtime: true,  // Enable WebSocket
  });

  // Get initial count
  blockroll.notifications.getUnreadCount().then((count) => {
    document.getElementById('unread-count').textContent = count;
  });

  // Subscribe to real-time notifications
  blockroll.notifications.subscribe((notification) => {
    // Update count
    const countEl = document.getElementById('unread-count');
    countEl.textContent = parseInt(countEl.textContent) + 1;

    // Add notification to list
    const div = document.createElement('div');
    div.className = 'notification';
    div.innerHTML = `
      <p>${notification.message}</p>
      <small>${new Date(notification.createdAt).toLocaleString()}</small>
    `;
    div.onclick = () => markAsRead(notification.id);
    
    document.getElementById('notifications').prepend(div);

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('BlockRoll', { body: notification.message });
    }
  });

  function markAsRead(notifId) {
    blockroll.notifications.markAsRead(notifId);
    // Update UI to show as read
  }
</script>
```

---

## 🚨 Emergency Access

### React

```tsx
import { useEmergencyAccess } from '@blockroll/react-sdk';

function EmergencyAccessSetup({ fileId }: { fileId: string }) {
  const { setupEmergencyAccess } = useEmergencyAccess();
  const [trustedWallets, setTrustedWallets] = useState<string[]>([]);

  const handleSetup = async () => {
    await setupEmergencyAccess({
      fileId,
      trustedContacts: trustedWallets.map((wallet) => ({
        wallet,
        inactivityPeriod: 30,  // 30 days of inactivity
      })),
      scope: 'full',  // 'full' | 'specific'
    });

    alert('Emergency access configured!');
  };

  return (
    <div>
      <h3>Emergency Access (Digital Inheritance)</h3>
      
      {trustedWallets.map((wallet, i) => (
        <div key={i}>
          <input
            value={wallet}
            onChange={(e) => {
              const newWallets = [...trustedWallets];
              newWallets[i] = e.target.value;
              setTrustedWallets(newWallets);
            }}
            placeholder="Trusted wallet (0x...)"
          />
        </div>
      ))}

      <button onClick={() => setTrustedWallets([...trustedWallets, ''])}>
        + Add Trusted Contact
      </button>

      <button onClick={handleSetup}>Save Emergency Access</button>
    </div>
  );
}
```

### Vue & CDN

Similar patterns - check [ADVANCED_EXAMPLES.md](./ADVANCED_EXAMPLES.md)

---

## 🔑 API Key Management

### React

```tsx
import { useApiKeys } from '@blockroll/react-sdk';

function ApiKeyDashboard() {
  const { createApiKey, keys, revokeKey, loading } = useApiKeys();

  const handleCreate = async () => {
    const key = await createApiKey({
      name: 'Production API Key',
      permissions: ['upload', 'download', 'share', 'delete'],
      sdkType: 'react',  // 'react' | 'vue' | 'cdn' | 'custom'
      rateLimit: 1000,   // requests per hour
    });

    alert(`API Key Created: ${key.key}\n\n⚠️ Save this! Won't be shown again.`);
  };

  return (
    <div>
      <button onClick={handleCreate}>+ Create New API Key</button>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Permissions</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td>{key.name}</td>
              <td>{key.sdkType}</td>
              <td>{key.permissions.join(', ')}</td>
              <td>{new Date(key.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => revokeKey(key.id)}>Revoke</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🎯 Complete Example: File Manager App

### React (Full App)

```tsx
import {
  BlockRollProvider,
  useBlockRoll,
  useMyFiles,
  useNotifications,
} from '@blockroll/react-sdk';

function App() {
  return (
    <BlockRollProvider
      apiKey={process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY}
      realtime={true}
    >
      <FileManager />
    </BlockRollProvider>
  );
}

function FileManager() {
  const { uploadFile } = useBlockRoll();
  const { files, refetch } = useMyFiles({ limit: 20 });
  const { unreadCount } = useNotifications();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await uploadFile({
      file: selectedFile,
      accessType: 'private',
      encryption: true,
    });

    setSelectedFile(null);
    refetch();  // Refresh file list
  };

  return (
    <div className="file-manager">
      <header>
        <h1>My Files</h1>
        <NotificationBell count={unreadCount} />
      </header>

      <div className="upload-section">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0])}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>

      <div className="file-grid">
        {files.data.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}

function FileCard({ file }) {
  const { shareFile, downloadFile, deleteFile } = useBlockRoll();

  return (
    <div className="file-card">
      <h3>{file.name}</h3>
      <p>{formatSize(file.size)}</p>
      
      <div className="actions">
        <button onClick={() => downloadFile(file.id)}>Download</button>
        <button onClick={() => {/* Open share modal */}}>Share</button>
        <button onClick={() => deleteFile(file.id)}>Delete</button>
      </div>
    </div>
  );
}
```

---

## 📊 Key Differences Summary

| Operation | React | Vue | CDN |
|-----------|-------|-----|-----|
| **Upload** | `useBlockRoll()` | `useBlockRoll()` | `blockroll.files.upload()` |
| **State Updates** | Automatic (React) | Automatic (Vue) | Manual |
| **TypeScript** | Full support | Full support | Type definitions |
| **Real-Time** | Auto re-render | Auto reactive | Manual DOM update |
| **Error Handling** | `error` state | `error` ref | Try-catch |
| **Loading States** | `loading` state | `loading` ref | Manual flag |

---

## ⚡ Performance Tips

### **1. Lazy Loading**

```tsx
// React
const FilePreview = lazy(() => import('./FilePreview'));

<Suspense fallback={<Skeleton />}>
  <FilePreview fileId={id} />
</Suspense>
```

### **2. Pagination**

```tsx
// React
const { files, hasMore, loadMore } = useMyFiles({ limit: 20 });

<InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
  {files.map(file => <FileCard key={file.id} file={file} />)}
</InfiniteScroll>
```

### **3. Debounced Search**

```tsx
// React
import { useDebouncedValue } from '@/hooks';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebouncedValue(searchTerm, 500);

const { files } = useMyFiles({
  search: debouncedSearch,
  limit: 20,
});
```

---

## 🎉 Summary

**All Three SDKs Share:**
- ✅ Same API surface
- ✅ Same operations
- ✅ Same features
- ✅ Real-time WebSocket
- ✅ Type-safe (React/Vue)
- ✅ Production-ready

**Choose based on your framework! 🚀**

---

## 📚 Documentation Index

| Document | What's Inside | Lines |
|----------|---------------|-------|
| [README.md](./README.md) | Overview & quick start | 400+ |
| [SDK_DESIGN.md](./SDK_DESIGN.md) | All basic operations | 1000+ |
| [ADVANCED_EXAMPLES.md](./ADVANCED_EXAMPLES.md) | Complex patterns | 800+ |
| [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) | Internal implementation | 600+ |
| [SDK_COMPARISON.md](./SDK_COMPARISON.md) | Compare all SDKs | 500+ |
| [COMPLETE_SDK_GUIDE.md](./COMPLETE_SDK_GUIDE.md) | Complete reference | 600+ |
| [USAGE_EXAMPLES_MASTER.md](./USAGE_EXAMPLES_MASTER.md) | All code examples | 800+ |

**Total: 4,700+ lines of documentation!** 📚

---

**🎯 Start Building with BlockRoll Kit!** 🚀

Choose your SDK and check the relevant documentation file!

