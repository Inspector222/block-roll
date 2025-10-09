<script setup lang="ts">
import { ref } from 'vue';
import { useBlockRoll, useMyFiles, useNotifications } from '@blockroll/vue-sdk';

const { uploadFile, shareFile, downloadFile, loading, error } = useBlockRoll();
const { files, refetch } = useMyFiles({ limit: 10 });
const { notifications, unreadCount, markAsRead } = useNotifications();

const selectedFile = ref<File | null>(null);
const shareWallet = ref('');

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] || null;
};

const handleUpload = async () => {
  if (!selectedFile.value) return;

  try {
    const result = await uploadFile({
      file: selectedFile.value,
      accessType: 'private',
      encryption: true,
    });

    alert(`File uploaded! ID: ${result.fileId}`);
    selectedFile.value = null;
    refetch();
  } catch (err: any) {
    alert(`Upload failed: ${err.message}`);
  }
};

const handleShare = async (fileId: string) => {
  if (!shareWallet.value) {
    alert('Please enter a wallet address');
    return;
  }

  try {
    await shareFile({
      fileId,
      recipientWallet: shareWallet.value,
      accessLevel: 'view',
    });

    alert('File shared successfully!');
    shareWallet.value = '';
  } catch (err: any) {
    alert(`Share failed: ${err.message}`);
  }
};

const handleDownload = async (fileId: string, fileName: string) => {
  try {
    const blob = await downloadFile(fileId);
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err: any) {
    alert(`Download failed: ${err.message}`);
  }
};
</script>

<template>
  <div class="app">
    <h1>🎲 BlockRoll Vue SDK Demo</h1>

    <div v-if="error" class="error">
      Error: {{ error }}
    </div>

    <!-- Upload Section -->
    <div class="section">
      <h2>📤 Upload File</h2>
      <input type="file" @change="handleFileChange" />
      <button @click="handleUpload" :disabled="loading || !selectedFile">
        {{ loading ? 'Uploading...' : 'Upload' }}
      </button>
    </div>

    <!-- Files List -->
    <div class="section">
      <h2>📁 My Files ({{ files.total }})</h2>
      <button @click="refetch">Refresh Files</button>
      
      <div v-for="file in files.data" :key="file.id" class="file-card">
        <h3>{{ file.name }}</h3>
        <p>Size: {{ Math.round(file.size / 1024) }} KB | Type: {{ file.type }}</p>
        <p>Status: {{ file.status }}</p>
        
        <div>
          <button @click="handleDownload(file.id, file.name)">
            Download
          </button>
          
          <input
            v-model="shareWallet"
            type="text"
            placeholder="Wallet (0x...)"
          />
          
          <button @click="handleShare(file.id)">
            Share
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications -->
    <div class="section">
      <h2>🔔 Notifications ({{ unreadCount }})</h2>
      
      <div
        v-for="notif in notifications"
        :key="notif.id"
        :class="['notification', { read: notif.read }]"
        @click="markAsRead(notif.id)"
      >
        <p :style="{ fontWeight: notif.read ? 'normal' : 'bold' }">
          {{ notif.message }}
        </p>
        <small>{{ new Date(notif.createdAt).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.file-card {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.notification {
  padding: 0.75rem;
  background: #e3f2fd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.notification.read {
  background: #f9f9f9;
}

.error {
  padding: 1rem;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  background: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

button:hover {
  background: #33a06f;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
}
</style>

