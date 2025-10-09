# ⚡ BlockRoll SDK - Quick Reference Card

**Copy-paste examples for common operations**

---

## 🔑 Setup

### React
```tsx
import { BlockRollProvider } from '@blockroll/react-sdk';
<BlockRollProvider apiKey="YOUR_KEY">{children}</BlockRollProvider>
```

### Vue
```ts
import { BlockRollPlugin } from '@blockroll/vue-sdk';
app.use(BlockRollPlugin, { apiKey: 'YOUR_KEY' });
```

### CDN
```html
<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
<script>const blockroll = new BlockRoll({ apiKey: 'YOUR_KEY' });</script>
```

---

## 📤 Upload File

### React
```tsx
const { uploadFile } = useBlockRoll();
await uploadFile({ file, accessType: 'private', encryption: true });
```

### Vue
```ts
const { uploadFile } = useBlockRoll();
await uploadFile({ file, accessType: 'private', encryption: true });
```

### CDN
```js
await blockroll.files.upload({ file, accessType: 'private', encryption: true });
```

---

## 📥 Download File

### React
```tsx
const { downloadFile } = useBlockRoll();
const blob = await downloadFile(fileId);
```

### Vue
```ts
const { downloadFile } = useBlockRoll();
const blob = await downloadFile(fileId);
```

### CDN
```js
const blob = await blockroll.files.download(fileId);
```

---

## 🔗 Share File

### React
```tsx
const { shareFile } = useBlockRoll();
await shareFile({ fileId, recipientWallet, accessLevel: 'view' });
```

### Vue
```ts
const { shareFile } = useBlockRoll();
await shareFile({ fileId, recipientWallet, accessLevel: 'view' });
```

### CDN
```js
await blockroll.files.share({ fileId, recipientWallet, accessLevel: 'view' });
```

---

## 📋 List Files

### React
```tsx
const { files, loading } = useMyFiles({ page: 1, limit: 20 });
```

### Vue
```ts
const { files, loading } = useMyFiles({ page: 1, limit: 20 });
```

### CDN
```js
const files = await blockroll.files.list({ page: 1, limit: 20 });
```

---

## 🔔 Real-Time Notifications

### React
```tsx
const { subscribe } = useNotifications();
useEffect(() => {
  const unsubscribe = subscribe((notif) => console.log(notif));
  return () => unsubscribe();
}, []);
```

### Vue
```ts
const { subscribe } = useNotifications();
onMounted(() => {
  const unsubscribe = subscribe((notif) => console.log(notif));
  onUnmounted(() => unsubscribe());
});
```

### CDN
```js
blockroll.notifications.subscribe((notif) => console.log(notif));
```

---

## 👥 Create Workspace

### React
```tsx
const { createWorkspace, addMember } = useWorkspace();
const ws = await createWorkspace({ name: 'Team' });
await addMember({ workspaceId: ws.id, memberWallet, role: 'editor' });
```

### Vue
```ts
const { createWorkspace, addMember } = useWorkspace();
const ws = await createWorkspace({ name: 'Team' });
await addMember({ workspaceId: ws.id, memberWallet, role: 'editor' });
```

### CDN
```js
const ws = await blockroll.workspace.create({ name: 'Team' });
await blockroll.workspace.addMember({ workspaceId: ws.id, memberWallet, role: 'editor' });
```

---

## 🚫 Revoke Access

### React
```tsx
const { revokeAccess } = useBlockRoll();
await revokeAccess({ fileId, wallet });
```

### Vue
```ts
const { revokeAccess } = useBlockRoll();
await revokeAccess({ fileId, wallet });
```

### CDN
```js
await blockroll.files.revoke(fileId, wallet);
```

---

## 🗑️ Delete File

### React
```tsx
const { deleteFile } = useBlockRoll();
await deleteFile(fileId);
```

### Vue
```ts
const { deleteFile } = useBlockRoll();
await deleteFile(fileId);
```

### CDN
```js
await blockroll.files.delete(fileId);
```

---

## 🎯 Common Patterns

### **Upload with Progress**

```tsx
await uploadFile({
  file,
  accessType: 'private',
  onProgress: (percent) => console.log(`${percent}%`),
});
```

### **Share with Expiry**

```tsx
await shareFile({
  fileId,
  recipientWallet,
  accessLevel: 'view',
  expiryDate: new Date('2025-12-31'),
});
```

### **Filtered File List**

```tsx
const { files } = useMyFiles({
  page: 1,
  limit: 20,
  status: 'active',
  tags: ['work', 'important'],
});
```

---

## 🔥 Cheat Sheet

| Operation | Method | Parameters |
|-----------|--------|------------|
| Upload | `uploadFile()` | `{ file, accessType, encryption }` |
| Download | `downloadFile()` | `fileId` |
| Share | `shareFile()` | `{ fileId, recipientWallet, accessLevel }` |
| List | `listFiles()` | `{ page, limit, status }` |
| Revoke | `revokeAccess()` | `{ fileId, wallet }` |
| Delete | `deleteFile()` | `fileId` |
| Create WS | `createWorkspace()` | `{ name, description }` |
| Add Member | `addMember()` | `{ workspaceId, memberWallet, role }` |
| Subscribe | `subscribe()` | `(notification) => {}` |

---

## 🎓 Learning Order

```
1. Setup SDK (5 min)
   └─ Install & configure

2. Upload File (10 min)
   └─ Basic file upload

3. List Files (5 min)
   └─ Display user files

4. Share File (10 min)
   └─ Share with wallet

5. Real-Time (15 min)
   └─ WebSocket notifications

6. Workspaces (20 min)
   └─ Team collaboration

Total: ~65 minutes to learn all features!
```

---

## 📱 Responsive Mobile

### React Native

```tsx
import * as DocumentPicker from 'expo-document-picker';

const { uploadFile } = useBlockRoll();

const pick = async () => {
  const result = await DocumentPicker.getDocumentAsync();
  if (result.type === 'success') {
    await uploadFile({ file: result, accessType: 'private' });
  }
};
```

---

## 🎉 Summary

**Everything you need in one page!**

✅ Setup examples  
✅ All operations  
✅ Common patterns  
✅ Cheat sheet  
✅ Learning order  

**For complete examples, see other documentation files!** 📚

---

**Print this for quick reference! 📄**

