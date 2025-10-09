# 🎯 BlockRoll SDK Demo Applications

**Working examples for all three SDKs**

---

## 📦 Available Demos

### 1. **React Demo** (Next.js)
→ `react-demo/`

```bash
cd react-demo
npm install
cp .env.example .env  # Add your API key
npm run dev
```

Open: http://localhost:3000

---

### 2. **Vue Demo** (Vite)
→ `vue-demo/`

```bash
cd vue-demo
npm install
cp .env.example .env  # Add your API key
npm run dev
```

Open: http://localhost:5173

---

### 3. **CDN Demo** (Vanilla JS)
→ `cdn-demo/index.html`

**Option A - Live Server:**
```bash
cd cdn-demo
# Open with Live Server or http-server
npx http-server -p 8080
```

**Option B - Direct:**
Just open `cdn-demo/index.html` in your browser!

---

## ⚙️ Configuration

### **Get API Key:**

1. Start BlockRoll backend: `cd server && npm run dev`
2. Connect wallet at http://localhost:5000
3. Go to SDK & Integration
4. Create API key
5. Copy the key

### **Configure Demos:**

**React:**
```env
# react-demo/.env
NEXT_PUBLIC_BLOCKROLL_API_KEY=your_api_key_here
NEXT_PUBLIC_BLOCKROLL_API_URL=http://localhost:5000/api/v1
```

**Vue:**
```env
# vue-demo/.env
VITE_BLOCKROLL_API_KEY=your_api_key_here
VITE_BLOCKROLL_API_URL=http://localhost:5000/api/v1
```

**CDN:**
```javascript
// cdn-demo/index.html (line 82)
const blockroll = new BlockRoll({
  apiKey: 'YOUR_API_KEY_HERE',  // Replace this
  baseURL: 'http://localhost:5000/api/v1',
});
```

---

## ✨ Features Demonstrated

All demos show:

✅ **File Upload** - With progress tracking  
✅ **File List** - Display all files  
✅ **File Download** - Download to browser  
✅ **File Sharing** - Share by wallet address  
✅ **File Delete** - Remove files  
✅ **Real-Time Notifications** - WebSocket updates  
✅ **Notification Bell** - Unread count  
✅ **Error Handling** - User-friendly errors  

---

## 🚀 Quick Start Guide

### **1. Start Backend:**
```bash
cd ../server
npm run dev
# Backend runs on http://localhost:5000
```

### **2. Get API Key:**
Visit http://localhost:5000 and create API key

### **3. Choose Demo:**

**React:**
```bash
cd demos/react-demo
npm install
cp .env.example .env  # Add API key
npm run dev
```

**Vue:**
```bash
cd demos/vue-demo
npm install
cp .env.example .env  # Add API key
npm run dev
```

**CDN:**
```bash
cd demos/cdn-demo
# Edit index.html line 82 with your API key
# Open index.html in browser
```

---

## 🎯 Testing Checklist

### **Upload Test:**
- [ ] Select a file
- [ ] Click upload
- [ ] See progress (0-100%)
- [ ] File appears in list

### **Download Test:**
- [ ] Click download on a file
- [ ] File downloads to computer

### **Share Test:**
- [ ] Enter wallet address
- [ ] Click share
- [ ] See success message

### **Real-Time Test:**
- [ ] Open demo in two tabs
- [ ] Upload file in tab 1
- [ ] Tab 2 auto-updates (no refresh!)

### **Notification Test:**
- [ ] Perform any action
- [ ] See notification appear
- [ ] Unread count updates
- [ ] Click to mark as read

---

## 📚 Documentation

See parent [README.md](../README.md) for complete SDK documentation.

---

**🎉 Happy testing!** 🚀

