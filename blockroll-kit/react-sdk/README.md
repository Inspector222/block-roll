# @blockroll/react-sdk

**BlockRoll SDK for React - Secure data exchange with React hooks**

---

## 📦 Installation

```bash
npm install @blockroll/react-sdk
```

---

## ⚡ Quick Start

```tsx
import { BlockRollProvider, useBlockRoll } from '@blockroll/react-sdk';

// 1. Wrap your app
function App() {
  return (
    <BlockRollProvider apiKey={process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY}>
      <YourApp />
    </BlockRollProvider>
  );
}

// 2. Use in components
function UploadButton() {
  const { uploadFile, loading } = useBlockRoll();

  const handleUpload = async (file: File) => {
    const result = await uploadFile({
      file,
      accessType: 'private',
      encryption: true,
    });

    console.log('Uploaded:', result.fileId);
  };

  return (
    <button onClick={() => handleUpload(file)} disabled={loading}>
      {loading ? 'Uploading...' : 'Upload'}
    </button>
  );
}
```

---

## 🎯 Available Hooks

### `useBlockRoll()`
Main hook for file operations.

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

