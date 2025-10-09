# 🏗️ BlockRoll Kit - Technical Architecture & Implementation Guide

**Internal SDK Architecture for Contributors & Advanced Developers**

---

## 🎯 SDK Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Developer's App                       │
│  (React/Vue/Vanilla JS)                                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 BlockRoll SDK Layer                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ React Hooks │  │Vue Composables│  │  CDN API   │    │
│  └─────────────┘  └──────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                  Core SDK (Shared)                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Client   │  Auth    │  WebSocket  │ Cache  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              BlockRoll Backend API                       │
│  REST API + WebSocket + Smart Contracts                 │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Package Structure

### **1. Monorepo Layout**

```
@blockroll/
├── core/                    # Shared core logic
│   ├── src/
│   │   ├── client.ts        # HTTP client
│   │   ├── auth.ts          # API key authentication
│   │   ├── websocket.ts     # WebSocket manager
│   │   ├── files.ts         # File operations
│   │   ├── workspace.ts     # Workspace operations
│   │   ├── notifications.ts # Notifications
│   │   ├── types.ts         # TypeScript types
│   │   └── index.ts
│   └── package.json
│
├── react-sdk/               # React-specific wrapper
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── useBlockRoll.ts
│   │   │   ├── useMyFiles.ts
│   │   │   ├── useWorkspace.ts
│   │   │   └── useNotifications.ts
│   │   ├── provider.tsx     # Context provider
│   │   └── index.ts
│   └── package.json
│
├── vue-sdk/                 # Vue-specific wrapper
│   ├── src/
│   │   ├── composables/
│   │   │   ├── useBlockRoll.ts
│   │   │   ├── useMyFiles.ts
│   │   │   └── useWorkspace.ts
│   │   ├── plugin.ts        # Vue plugin
│   │   └── index.ts
│   └── package.json
│
└── cdn/                     # CDN bundle
    ├── src/
    │   ├── blockroll.ts     # Main CDN class
    │   └── index.ts
    ├── rollup.config.js     # Bundler config
    └── package.json
```

---

## 🔑 Core SDK Implementation

### **1. API Client (`core/src/client.ts`)**

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

export class BlockRollClient {
  private client: AxiosInstance;
  private apiKey: string;
  private baseURL: string;

  constructor(config: BlockRollConfig) {
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://api.blockroll.io/v1';

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      timeout: 30000,
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp for request signing
        config.headers['x-timestamp'] = Date.now().toString();
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError) => {
        // Handle errors gracefully
        if (error.response?.status === 401) {
          throw new BlockRollError('Invalid API key', 'UNAUTHORIZED');
        }
        if (error.response?.status === 429) {
          throw new BlockRollError('Rate limit exceeded', 'RATE_LIMIT');
        }
        throw new BlockRollError(
          error.message || 'Request failed',
          'NETWORK_ERROR'
        );
      }
    );
  }

  async get<T>(url: string, params?: any): Promise<T> {
    return this.client.get(url, { params });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.client.post(url, data);
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.client.put(url, data);
  }

  async delete<T>(url: string): Promise<T> {
    return this.client.delete(url);
  }

  async upload<T>(url: string, file: File, onProgress?: (percent: number) => void): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
  }
}
```

### **2. File Operations (`core/src/files.ts`)**

```typescript
export class FileOperations {
  constructor(private client: BlockRollClient) {}

  async upload(options: UploadOptions): Promise<UploadResult> {
    const result = await this.client.upload<UploadResult>(
      '/file/upload',
      options.file,
      options.onProgress
    );

    // Update metadata if provided
    if (options.expiryDate || options.tags) {
      await this.client.post(`/file/${result.fileId}/metadata`, {
        expiryDate: options.expiryDate,
        tags: options.tags,
      });
    }

    return result;
  }

  async list(options: ListOptions = {}): Promise<FileList> {
    return this.client.get<FileList>('/file/my-files', {
      page: options.page || 1,
      limit: options.limit || 20,
      status: options.status,
      tags: options.tags?.join(','),
    });
  }

  async getById(fileId: string): Promise<File> {
    return this.client.get<File>(`/file/${fileId}`);
  }

  async download(fileId: string): Promise<Blob> {
    const response = await fetch(
      `${this.client.baseURL}/file/${fileId}/download`,
      {
        headers: { 'x-api-key': this.client.apiKey },
      }
    );

    if (!response.ok) {
      throw new BlockRollError('Download failed', 'DOWNLOAD_ERROR');
    }

    return response.blob();
  }

  async share(options: ShareOptions): Promise<ShareResult> {
    return this.client.post<ShareResult>(`/file/${options.fileId}/share`, {
      recipientWallet: options.recipientWallet,
      accessLevel: options.accessLevel,
      expiryDate: options.expiryDate,
    });
  }

  async revokeAccess(fileId: string, wallet: string): Promise<void> {
    return this.client.post(`/file/${fileId}/revoke`, { wallet });
  }

  async delete(fileId: string): Promise<void> {
    return this.client.delete(`/file/${fileId}`);
  }
}
```

### **3. WebSocket Manager (`core/src/websocket.ts`)**

```typescript
import { io, Socket } from 'socket.io-client';

export class WebSocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();

  constructor(private apiKey: string, private baseURL: string) {}

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.baseURL, {
      auth: { apiKey: this.apiKey },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('⚠️ WebSocket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    // Notification events
    this.socket.on('notification:new', (notification) => {
      this.emit('notification', notification);
    });

    this.socket.on('file:shared', (data) => {
      this.emit('file:shared', data);
    });

    this.socket.on('file:uploaded', (data) => {
      this.emit('file:uploaded', data);
    });

    // Security events
    this.socket.on('security:alert', (alert) => {
      this.emit('security:alert', alert);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any): void {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}
```

### **4. Notification System (`core/src/notifications.ts`)**

```typescript
export class NotificationManager {
  constructor(
    private client: BlockRollClient,
    private websocket: WebSocketManager
  ) {}

  async list(options: NotificationListOptions = {}): Promise<NotificationList> {
    return this.client.get<NotificationList>('/notifications', {
      page: options.page || 1,
      limit: options.limit || 20,
      unreadOnly: options.unreadOnly,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    return this.client.post(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<void> {
    return this.client.post('/notifications/read-all');
  }

  subscribe(callback: (notification: Notification) => void): () => void {
    return this.websocket.on('notification', callback);
  }

  async getUnreadCount(): Promise<number> {
    const result = await this.client.get<{ count: number }>(
      '/notifications/unread-count'
    );
    return result.count;
  }
}
```

---

## ⚛️ React SDK Implementation

### **1. Context Provider (`react-sdk/src/provider.tsx`)**

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BlockRollCore } from '@blockroll/core';

interface BlockRollContextValue {
  blockroll: BlockRollCore;
  connected: boolean;
}

const BlockRollContext = createContext<BlockRollContextValue | null>(null);

export function BlockRollProvider({
  apiKey,
  children,
  baseURL,
  realtime = true,
}: BlockRollProviderProps) {
  const [blockroll] = useState(() => new BlockRollCore({ apiKey, baseURL }));
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect WebSocket if enabled
    if (realtime) {
      blockroll.websocket.connect();
      setConnected(true);
    }

    // Cleanup on unmount
    return () => {
      if (realtime) {
        blockroll.websocket.disconnect();
      }
    };
  }, [blockroll, realtime]);

  return (
    <BlockRollContext.Provider value={{ blockroll, connected }}>
      {children}
    </BlockRollContext.Provider>
  );
}

export function useBlockRollContext() {
  const context = useContext(BlockRollContext);
  if (!context) {
    throw new Error('useBlockRollContext must be used within BlockRollProvider');
  }
  return context;
}
```

### **2. Main Hook (`react-sdk/src/hooks/useBlockRoll.ts`)**

```typescript
import { useState, useCallback } from 'react';
import { useBlockRollContext } from '../provider';

export function useBlockRoll() {
  const { blockroll } = useBlockRollContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (options: UploadOptions) => {
      setLoading(true);
      setError(null);

      try {
        const result = await blockroll.files.upload(options);
        return result;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const shareFile = useCallback(
    async (options: ShareOptions) => {
      setLoading(true);
      setError(null);

      try {
        const result = await blockroll.files.share(options);
        return result;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  const downloadFile = useCallback(
    async (fileId: string) => {
      setLoading(true);
      setError(null);

      try {
        const blob = await blockroll.files.download(fileId);
        return blob;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [blockroll]
  );

  return {
    uploadFile,
    shareFile,
    downloadFile,
    loading,
    error,
  };
}
```

### **3. Files Hook (`react-sdk/src/hooks/useMyFiles.ts`)**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useBlockRollContext } from '../provider';

export function useMyFiles(options: ListOptions = {}) {
  const { blockroll } = useBlockRollContext();
  const [files, setFiles] = useState<FileList>({ data: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await blockroll.files.list(options);
      setFiles(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [blockroll, options]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Listen for real-time updates
  useEffect(() => {
    const unsubscribe = blockroll.websocket.on('file:uploaded', (file) => {
      setFiles((prev) => ({
        data: [file, ...prev.data],
        total: prev.total + 1,
      }));
    });

    return () => unsubscribe();
  }, [blockroll]);

  return {
    files,
    loading,
    error,
    refetch: fetchFiles,
  };
}
```

### **4. Notifications Hook (`react-sdk/src/hooks/useNotifications.ts`)**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useBlockRollContext } from '../provider';

export function useNotifications() {
  const { blockroll } = useBlockRollContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      const result = await blockroll.notifications.list({ limit: 50 });
      setNotifications(result.data);
    };

    const loadUnreadCount = async () => {
      const count = await blockroll.notifications.getUnreadCount();
      setUnreadCount(count);
    };

    loadNotifications();
    loadUnreadCount();
  }, [blockroll]);

  // Real-time subscription
  const subscribe = useCallback(
    (callback: (notification: Notification) => void) => {
      return blockroll.notifications.subscribe((notification) => {
        // Update local state
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);

        // Call user's callback
        callback(notification);
      });
    },
    [blockroll]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await blockroll.notifications.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    },
    [blockroll]
  );

  return {
    notifications,
    unreadCount,
    markAsRead,
    subscribe,
  };
}
```

---

## 🎨 Vue SDK Implementation

### **1. Plugin (`vue-sdk/src/plugin.ts`)**

```typescript
import { App, inject, InjectionKey } from 'vue';
import { BlockRollCore } from '@blockroll/core';

export const BlockRollKey: InjectionKey<BlockRollCore> = Symbol('BlockRoll');

export const BlockRollPlugin = {
  install(app: App, options: { apiKey: string; baseURL?: string }) {
    const blockroll = new BlockRollCore({
      apiKey: options.apiKey,
      baseURL: options.baseURL,
    });

    // Connect WebSocket
    blockroll.websocket.connect();

    // Provide globally
    app.provide(BlockRollKey, blockroll);

    // Add to global properties (Options API support)
    app.config.globalProperties.$blockroll = blockroll;

    // Cleanup on unmount
    app.config.globalProperties.$blockrollCleanup = () => {
      blockroll.websocket.disconnect();
    };
  },
};

export function useBlockRollCore(): BlockRollCore {
  const blockroll = inject(BlockRollKey);
  if (!blockroll) {
    throw new Error('BlockRoll plugin not installed');
  }
  return blockroll;
}
```

### **2. Composable (`vue-sdk/src/composables/useBlockRoll.ts`)**

```typescript
import { ref } from 'vue';
import { useBlockRollCore } from '../plugin';

export function useBlockRoll() {
  const blockroll = useBlockRollCore();
  const loading = ref(false);
  const error = ref<string | null>(null);

  const uploadFile = async (options: UploadOptions) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.files.upload(options);
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const shareFile = async (options: ShareOptions) => {
    loading.value = true;
    error.value = null;

    try {
      const result = await blockroll.files.share(options);
      return result;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const downloadFile = async (fileId: string) => {
    loading.value = true;
    error.value = null;

    try {
      const blob = await blockroll.files.download(fileId);
      return blob;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    uploadFile,
    shareFile,
    downloadFile,
    loading,
    error,
  };
}
```

---

## 🌐 CDN Bundle Implementation

### **1. Main Class (`cdn/src/blockroll.ts`)**

```typescript
import { BlockRollCore } from '@blockroll/core';

class BlockRoll {
  private core: BlockRollCore;

  constructor(config: { apiKey: string; baseURL?: string; realtime?: boolean }) {
    this.core = new BlockRollCore({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
    });

    if (config.realtime !== false) {
      this.core.websocket.connect();
    }
  }

  // Files API
  files = {
    upload: (options: any) => this.core.files.upload(options),
    list: (options?: any) => this.core.files.list(options),
    get: (fileId: string) => this.core.files.getById(fileId),
    download: (fileId: string) => this.core.files.download(fileId),
    share: (options: any) => this.core.files.share(options),
    revoke: (fileId: string, wallet: string) =>
      this.core.files.revokeAccess(fileId, wallet),
    delete: (fileId: string) => this.core.files.delete(fileId),
  };

  // Workspace API
  workspace = {
    create: (options: any) => this.core.workspace.create(options),
    list: () => this.core.workspace.list(),
    addMember: (options: any) => this.core.workspace.addMember(options),
    removeMember: (workspaceId: string, wallet: string) =>
      this.core.workspace.removeMember(workspaceId, wallet),
  };

  // Notifications API
  notifications = {
    list: (options?: any) => this.core.notifications.list(options),
    markAsRead: (id: string) => this.core.notifications.markAsRead(id),
    subscribe: (callback: Function) => this.core.notifications.subscribe(callback),
    getUnreadCount: () => this.core.notifications.getUnreadCount(),
  };

  // Disconnect WebSocket
  disconnect() {
    this.core.websocket.disconnect();
  }
}

// Expose globally
(window as any).BlockRoll = BlockRoll;

export default BlockRoll;
```

### **2. Rollup Config (`cdn/rollup.config.js`)**

```javascript
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/blockroll.min.js',
    format: 'iife',
    name: 'BlockRoll',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    terser(),
  ],
};
```

---

## 🧪 Testing Strategy

### **Unit Tests (Jest)**

```typescript
// __tests__/files.test.ts
import { BlockRollCore } from '../src';

describe('File Operations', () => {
  let blockroll: BlockRollCore;

  beforeEach(() => {
    blockroll = new BlockRollCore({
      apiKey: 'test_api_key',
      baseURL: 'http://localhost:3000/api/v1',
    });
  });

  it('should upload file successfully', async () => {
    const file = new File(['content'], 'test.txt');
    const result = await blockroll.files.upload({
      file,
      accessType: 'private',
      encryption: true,
    });

    expect(result).toHaveProperty('fileId');
    expect(result).toHaveProperty('ipfsHash');
  });

  it('should handle upload errors', async () => {
    const file = new File([], 'empty.txt');
    
    await expect(
      blockroll.files.upload({ file, accessType: 'private' })
    ).rejects.toThrow();
  });
});
```

---

## 📚 Documentation Generation

### **TypeDoc Configuration**

```json
{
  "entryPoints": ["src/index.ts"],
  "out": "docs",
  "theme": "default",
  "includeVersion": true,
  "excludePrivate": true,
  "readme": "README.md"
}
```

---

## 🚀 Publishing to NPM

### **Package.json (Core)**

```json
{
  "name": "@blockroll/core",
  "version": "1.0.0",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c",
    "test": "jest",
    "prepublishOnly": "npm run build && npm test"
  }
}
```

---

**🎯 SDK Implementation Complete!**

This architecture provides:
- ✅ Type-safe API
- ✅ Real-time WebSocket
- ✅ Framework-specific wrappers
- ✅ CDN bundle
- ✅ Comprehensive testing
- ✅ Auto-generated docs

