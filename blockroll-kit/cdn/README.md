# BlockRoll CDN Bundle

**Vanilla JavaScript SDK - No build step required!**

---

## 🌐 Installation

Just add the script tag to your HTML:

```html
<script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
```

---

## ⚡ Quick Start

```html
<!DOCTYPE html>
<html>
<head>
  <title>BlockRoll Demo</title>
  <script src="https://cdn.blockroll.io/sdk/v1/blockroll.min.js"></script>
</head>
<body>
  <input type="file" id="fileInput" />
  <button onclick="upload()">Upload</button>
  <p id="status"></p>

  <script>
    // Initialize BlockRoll
    const blockroll = new BlockRoll({
      apiKey: 'YOUR_API_KEY',
      realtime: true,  // Enable WebSocket
    });

    // Upload file
    async function upload() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      
      if (!file) {
        alert('Please select a file');
        return;
      }

      try {
        document.getElementById('status').textContent = 'Uploading...';
        
        const result = await blockroll.files.upload({
          file,
          accessType: 'private',
          encryption: true,
        });

        document.getElementById('status').textContent = 
          `Uploaded! File ID: ${result.fileId}`;
      } catch (error) {
        document.getElementById('status').textContent = 
          `Error: ${error.message}`;
      }
    }
  </script>
</body>
</html>
```

---

## 🎯 API Reference

### Files
```javascript
blockroll.files.upload(options)
blockroll.files.list(options)
blockroll.files.download(fileId)
blockroll.files.share(options)
blockroll.files.revoke(fileId, wallet)
blockroll.files.delete(fileId)
```

### Workspace
```javascript
blockroll.workspace.create(options)
blockroll.workspace.addMember(options)
blockroll.workspace.list()
```

### Notifications
```javascript
blockroll.notifications.list(options)
blockroll.notifications.subscribe(callback)
blockroll.notifications.markAsRead(id)
```

---

## 📚 Full Documentation

See [parent README](../README.md) for complete examples.

---

## 📄 License

MIT License

