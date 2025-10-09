# @blockroll/vue-sdk

**BlockRoll SDK for Vue.js - Secure data exchange with Vue composables**

---

## 📦 Installation

```bash
npm install @blockroll/vue-sdk
```

---

## ⚡ Quick Start

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

```vue
<!-- Component.vue -->
<script setup lang="ts">
import { useBlockRoll } from '@blockroll/vue-sdk';

const { uploadFile, loading, error } = useBlockRoll();

const handleUpload = async (file: File) => {
  const result = await uploadFile({
    file,
    accessType: 'private',
    encryption: true,
  });

  console.log('Uploaded:', result.fileId);
};
</script>

<template>
  <button @click="handleUpload(file)" :disabled="loading">
    {{ loading ? 'Uploading...' : 'Upload' }}
  </button>
  <p v-if="error">{{ error }}</p>
</template>
```

---

## 🎯 Available Composables

### `useBlockRoll()`
Main composable for file operations.

### `useMyFiles(options)`
Fetch and manage user's files with real-time updates.

### `useNotifications(options)`
Manage notifications with real-time WebSocket.

### `useWorkspace()`
Manage team workspaces.

---

## 📚 Full Documentation

See [parent README](../README.md) for complete API documentation.

---

## 📄 License

MIT License

