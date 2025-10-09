# 🚀 BlockRoll Kit - Advanced Usage & Real-World Examples

Complete guide with production-ready code examples for all three SDKs.

---

## 🎯 Real-World Use Cases

### Use Case 1: **Document Management SaaS**

Build a secure document management system.

### Use Case 2: **Healthcare Records Platform**

HIPAA-compliant medical records sharing.

### Use Case 3: **Legal Contract Platform**

Blockchain-verified legal document exchange.

### Use Case 4: **Personal Cloud Storage**

Dropbox alternative with true ownership.

### Use Case 5: **Team Collaboration Tool**

Secure file sharing for remote teams.

---

## 🔥 Advanced Examples

### **1. Drag & Drop Upload with Progress (React)**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';
import { useState, useCallback } from 'react';

export default function DragDropUpload() {
  const { uploadFile } = useBlockRoll();
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    
    for (const file of files) {
      try {
        const result = await uploadFile({
          file,
          accessType: 'private',
          encryption: true,
          onProgress: (percent) => setProgress(percent),
        });

        console.log('Uploaded:', result);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }, [uploadFile]);

  return (
    <div
      className={`dropzone ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p>Drag & Drop files here</p>
      {progress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}>{progress}%</div>
        </div>
      )}
    </div>
  );
}
```

### **2. Bulk File Operations (React)**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';

export default function BulkOperations() {
  const { uploadFile, shareFile } = useBlockRoll();

  // Upload multiple files in parallel
  const handleBulkUpload = async (files: File[]) => {
    const promises = files.map((file) =>
      uploadFile({
        file,
        accessType: 'private',
        encryption: true,
        tags: ['bulk-upload', new Date().toISOString()],
      })
    );

    try {
      const results = await Promise.all(promises);
      console.log(`${results.length} files uploaded successfully`);
      return results;
    } catch (error) {
      console.error('Bulk upload failed:', error);
      throw error;
    }
  };

  // Share multiple files with same user
  const handleBulkShare = async (
    fileIds: string[],
    recipientWallet: string
  ) => {
    const promises = fileIds.map((fileId) =>
      shareFile({
        fileId,
        recipientWallet,
        accessLevel: 'view',
      })
    );

    const results = await Promise.allSettled(promises);
    
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    console.log(`Shared: ${succeeded} succeeded, ${failed} failed`);
  };

  return (
    <div>
      {/* UI components */}
    </div>
  );
}
```

### **3. File Preview with Lazy Loading (Vue)**

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBlockRoll } from '@blockroll/vue-sdk';

const { downloadFile } = useBlockRoll();
const previewCache = new Map<string, string>();

const loadPreview = async (fileId: string, mimeType: string) => {
  // Check cache first
  if (previewCache.has(fileId)) {
    return previewCache.get(fileId);
  }

  // Download and create object URL
  const blob = await downloadFile(fileId);
  const url = URL.createObjectURL(blob);
  
  // Cache it
  previewCache.set(fileId, url);
  
  return url;
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType === 'application/pdf') return '📄';
  return '📎';
};
</script>

<template>
  <div class="file-grid">
    <div v-for="file in files" :key="file.id" class="file-card">
      <!-- Lazy load preview -->
      <img
        v-if="file.type.startsWith('image/')"
        :src="previewCache.get(file.id) || ''"
        @click="loadPreview(file.id, file.type)"
        loading="lazy"
        :alt="file.name"
      />
      
      <div v-else class="file-icon">
        {{ getFileIcon(file.type) }}
      </div>
      
      <h4>{{ file.name }}</h4>
      <p>{{ formatSize(file.size) }}</p>
    </div>
  </div>
</template>
```

### **4. Real-Time Collaboration Dashboard (React)**

```tsx
import { useBlockRoll, useNotifications, useWorkspace } from '@blockroll/react-sdk';
import { useEffect, useState } from 'react';

export default function CollaborationDashboard() {
  const { files } = useBlockRoll();
  const { subscribe } = useNotifications();
  const { workspaces } = useWorkspace();
  const [activity, setActivity] = useState<Activity[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribe((notification) => {
      // Add to activity feed
      setActivity((prev) => [
        {
          id: notification.id,
          message: notification.message,
          timestamp: new Date(),
          type: notification.type,
        },
        ...prev.slice(0, 49), // Keep last 50 activities
      ]);

      // Show toast notification
      showToast(notification.message);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>Workspaces</h3>
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div>

      <div className="main-content">
        <h2>Recent Files</h2>
        <FileGrid files={files} />
      </div>

      <div className="activity-feed">
        <h3>Live Activity</h3>
        {activity.map((item) => (
          <ActivityItem key={item.id} activity={item} />
        ))}
      </div>
    </div>
  );
}
```

### **5. Encrypted File Sharing Flow (CDN)**

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
</head>
<body>
  <div id="app">
    <h2>Secure File Sharing</h2>
    
    <!-- Step 1: Upload -->
    <div id="step-upload">
      <input type="file" id="fileInput" />
      <button onclick="uploadFile()">Upload & Encrypt</button>
    </div>

    <!-- Step 2: Share -->
    <div id="step-share" style="display: none;">
      <p>File uploaded successfully!</p>
      <input id="recipientWallet" placeholder="Recipient wallet (0x...)" />
      <select id="accessLevel">
        <option value="view">View Only</option>
        <option value="edit">Can Edit</option>
        <option value="download">Can Download</option>
      </select>
      <button onclick="shareFile()">Share File</button>
    </div>

    <!-- Step 3: Success -->
    <div id="step-success" style="display: none;">
      <p>✅ File shared successfully!</p>
      <p>The recipient has been notified in real-time.</p>
      <button onclick="reset()">Share Another File</button>
    </div>
  </div>

  <script>
    const blockroll = new BlockRoll({
      apiKey: 'YOUR_API_KEY',
      realtime: true,
    });

    let currentFileId = null;

    async function uploadFile() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];

      if (!file) {
        alert('Please select a file');
        return;
      }

      try {
        const result = await blockroll.files.upload({
          file: file,
          accessType: 'restricted', // Only share with specific wallets
          encryption: true, // AES-256-GCM encryption
          onProgress: (percent) => {
            console.log(`Upload progress: ${percent}%`);
          },
        });

        currentFileId = result.fileId;

        // Move to share step
        document.getElementById('step-upload').style.display = 'none';
        document.getElementById('step-share').style.display = 'block';
      } catch (error) {
        alert('Upload failed: ' + error.message);
      }
    }

    async function shareFile() {
      const recipientWallet = document.getElementById('recipientWallet').value;
      const accessLevel = document.getElementById('accessLevel').value;

      if (!recipientWallet.match(/^0x[a-fA-F0-9]{40}$/)) {
        alert('Invalid wallet address');
        return;
      }

      try {
        await blockroll.files.share({
          fileId: currentFileId,
          recipientWallet: recipientWallet,
          accessLevel: accessLevel,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });

        // Move to success step
        document.getElementById('step-share').style.display = 'none';
        document.getElementById('step-success').style.display = 'block';
      } catch (error) {
        alert('Share failed: ' + error.message);
      }
    }

    function reset() {
      currentFileId = null;
      document.getElementById('step-success').style.display = 'none';
      document.getElementById('step-upload').style.display = 'block';
      document.getElementById('fileInput').value = '';
      document.getElementById('recipientWallet').value = '';
    }
  </script>
</body>
</html>
```

### **6. Search & Filter Files (React)**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';
import { useState, useMemo } from 'react';

export default function FileSearch() {
  const { files } = useBlockRoll();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');

  const filteredFiles = useMemo(() => {
    let result = files;

    // Search by name
    if (searchTerm) {
      result = result.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((file) => file.type.startsWith(filterType));
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'size') return b.size - a.size;
      return 0;
    });

    return result;
  }, [files, searchTerm, filterType, sortBy]);

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="application">Documents</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="size">Sort by Size</option>
        </select>
      </div>

      <p>{filteredFiles.length} files found</p>

      <div className="file-list">
        {filteredFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  );
}
```

### **7. Workspace Activity Log (Vue)**

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useWorkspace, useNotifications } from '@blockroll/vue-sdk';

const props = defineProps<{ workspaceId: string }>();

const { getWorkspace } = useWorkspace();
const { subscribe } = useNotifications();

const workspace = ref(null);
const activityLog = ref<Activity[]>([]);

onMounted(async () => {
  // Load workspace
  workspace.value = await getWorkspace(props.workspaceId);

  // Subscribe to workspace activity
  subscribe((notification) => {
    // Filter workspace-specific notifications
    if (notification.workspaceId === props.workspaceId) {
      activityLog.value.unshift({
        id: notification.id,
        user: notification.user,
        action: notification.message,
        timestamp: new Date(),
      });
    }
  });
});
</script>

<template>
  <div class="workspace-activity">
    <h3>{{ workspace?.name }} - Activity Log</h3>
    
    <div v-for="activity in activityLog" :key="activity.id" class="activity-item">
      <div class="avatar">{{ activity.user.substring(0, 6) }}</div>
      <div class="details">
        <p>{{ activity.action }}</p>
        <small>{{ activity.timestamp.toLocaleString() }}</small>
      </div>
    </div>

    <p v-if="activityLog.length === 0">No recent activity</p>
  </div>
</template>
```

### **8. File Versioning System (React)**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';
import { useState } from 'react';

export default function FileVersions({ fileId }: { fileId: string }) {
  const { uploadFile, getFile, downloadFile } = useBlockRoll();
  const [versions, setVersions] = useState<Version[]>([]);

  const handleUploadNewVersion = async (file: File) => {
    // Upload new version
    const result = await uploadFile({
      file,
      accessType: 'private',
      encryption: true,
      metadata: {
        previousVersion: fileId,
        versionNumber: versions.length + 1,
      },
    });

    // Add to versions
    setVersions((prev) => [
      {
        id: result.fileId,
        versionNumber: prev.length + 1,
        uploadedAt: new Date(),
        size: file.size,
      },
      ...prev,
    ]);
  };

  const handleRestoreVersion = async (versionId: string) => {
    const blob = await downloadFile(versionId);
    const file = new File([blob], 'restored-file');
    
    await handleUploadNewVersion(file);
    
    alert('Version restored as new version');
  };

  return (
    <div className="file-versions">
      <h3>File Versions</h3>
      
      <input type="file" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUploadNewVersion(file);
      }} />

      <div className="versions-list">
        {versions.map((version) => (
          <div key={version.id} className="version-item">
            <p>Version {version.versionNumber}</p>
            <p>Uploaded: {version.uploadedAt.toLocaleString()}</p>
            <p>Size: {formatSize(version.size)}</p>
            <button onClick={() => handleRestoreVersion(version.id)}>
              Restore This Version
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **9. Permission Management UI (React)**

```tsx
import { useBlockRoll } from '@blockroll/react-sdk';
import { useState } from 'react';

export default function FilePermissions({ fileId }: { fileId: string }) {
  const { shareFile, revokeAccess, getFile } = useBlockRoll();
  const [sharedWith, setSharedWith] = useState<SharedUser[]>([]);

  const handleAddUser = async () => {
    const wallet = prompt('Enter wallet address:');
    if (!wallet) return;

    const accessLevel = confirm('Grant edit access?') ? 'edit' : 'view';

    await shareFile({
      fileId,
      recipientWallet: wallet,
      accessLevel,
    });

    // Update UI
    setSharedWith((prev) => [
      ...prev,
      { wallet, accessLevel, sharedAt: new Date() },
    ]);
  };

  const handleRemoveUser = async (wallet: string) => {
    if (!confirm(`Remove access for ${wallet}?`)) return;

    await revokeAccess({ fileId, wallet });

    setSharedWith((prev) => prev.filter((u) => u.wallet !== wallet));
  };

  const handleChangePermission = async (wallet: string, newLevel: string) => {
    // Revoke old access
    await revokeAccess({ fileId, wallet });

    // Grant new access
    await shareFile({
      fileId,
      recipientWallet: wallet,
      accessLevel: newLevel as 'view' | 'edit' | 'download',
    });

    // Update UI
    setSharedWith((prev) =>
      prev.map((u) =>
        u.wallet === wallet ? { ...u, accessLevel: newLevel } : u
      )
    );
  };

  return (
    <div className="permissions-panel">
      <h3>File Permissions</h3>
      
      <button onClick={handleAddUser}>+ Add User</button>

      <table>
        <thead>
          <tr>
            <th>Wallet</th>
            <th>Access Level</th>
            <th>Shared At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sharedWith.map((user) => (
            <tr key={user.wallet}>
              <td>{user.wallet}</td>
              <td>
                <select
                  value={user.accessLevel}
                  onChange={(e) => handleChangePermission(user.wallet, e.target.value)}
                >
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                  <option value="download">Download</option>
                </select>
              </td>
              <td>{user.sharedAt.toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleRemoveUser(user.wallet)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### **10. Analytics Dashboard (CDN)**

```html
<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<canvas id="uploadChart"></canvas>
<canvas id="storageChart"></canvas>

<script>
  const blockroll = new BlockRoll({ apiKey: 'YOUR_API_KEY' });

  async function loadAnalytics() {
    // Get all files
    const files = await blockroll.files.list({ limit: 1000 });

    // Upload trend (by month)
    const uploadsByMonth = {};
    files.data.forEach((file) => {
      const month = new Date(file.createdAt).toLocaleDateString('en', { month: 'short' });
      uploadsByMonth[month] = (uploadsByMonth[month] || 0) + 1;
    });

    // Chart 1: Uploads over time
    new Chart(document.getElementById('uploadChart'), {
      type: 'line',
      data: {
        labels: Object.keys(uploadsByMonth),
        datasets: [{
          label: 'Files Uploaded',
          data: Object.values(uploadsByMonth),
          borderColor: 'rgb(75, 192, 192)',
        }],
      },
    });

    // Storage usage by file type
    const storageByType = {};
    files.data.forEach((file) => {
      const type = file.type.split('/')[0]; // image, video, etc.
      storageByType[type] = (storageByType[type] || 0) + file.size;
    });

    // Chart 2: Storage by type
    new Chart(document.getElementById('storageChart'), {
      type: 'pie',
      data: {
        labels: Object.keys(storageByType),
        datasets: [{
          data: Object.values(storageByType),
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
          ],
        }],
      },
    });
  }

  loadAnalytics();
</script>
```

---

## 🔐 Security Best Practices

### **1. API Key Storage**

```tsx
// ❌ DON'T: Hardcode API keys
const blockroll = new BlockRoll({ apiKey: 'pk_live_abc123...' });

// ✅ DO: Use environment variables
const blockroll = new BlockRoll({
  apiKey: process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY,
});
```

### **2. Client-Side vs Server-Side**

```tsx
// Client-side (React)
// ✅ Good for: Upload, download, list files
const { uploadFile } = useBlockRoll();

// Server-side (Next.js API routes)
// ✅ Better for: Sensitive operations, bulk operations
export async function POST(request: Request) {
  const blockroll = new BlockRoll({ apiKey: process.env.BLOCKROLL_SECRET_KEY });
  // Use server-side API key with more permissions
}
```

### **3. Input Validation**

```tsx
const handleShare = async (wallet: string) => {
  // Validate wallet format
  if (!wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error('Invalid wallet address');
  }

  // Validate not sharing with self
  if (wallet === currentUserWallet) {
    throw new Error('Cannot share with yourself');
  }

  await shareFile({ fileId, recipientWallet: wallet, accessLevel: 'view' });
};
```

---

## 🚀 Performance Optimization

### **1. Lazy Loading**

```tsx
// Lazy load file previews
const FilePreview = lazy(() => import('./FilePreview'));

<Suspense fallback={<Skeleton />}>
  <FilePreview fileId={fileId} />
</Suspense>
```

### **2. Pagination**

```tsx
const { files, loadMore, hasMore } = useMyFiles({
  limit: 20,
  // Infinite scroll
});

<InfiniteScroll
  loadMore={loadMore}
  hasMore={hasMore}
>
  {files.map(file => <FileCard key={file.id} file={file} />)}
</InfiniteScroll>
```

### **3. Caching**

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

---

## 📱 Mobile-Responsive Examples

### **React Native (Expo)**

```tsx
import { BlockRollProvider, useBlockRoll } from '@blockroll/react-native-sdk';
import * as DocumentPicker from 'expo-document-picker';

export default function MobileUpload() {
  const { uploadFile } = useBlockRoll();

  const handlePickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync();
    
    if (result.type === 'success') {
      await uploadFile({
        file: result,
        accessType: 'private',
        encryption: true,
      });
    }
  };

  return (
    <Button title="Pick & Upload File" onPress={handlePickFile} />
  );
}
```

---

**🎉 Ready to build amazing apps with BlockRoll Kit!**

