# 🚀 BlockRoll - Complete Getting Started Guide

**From zero to production in under 30 minutes!**

---

## 🎯 What You'll Launch

```
1. ✅ Backend API (http://localhost:5000)
2. ✅ MongoDB database
3. ✅ WhatsApp AI Bot (with QR scan)
4. ✅ SDK Demo (React/Vue/CDN)

Result: Full BlockRoll platform running locally! 🎉
```

---

## 📋 Prerequisites

✅ Node.js 18+  
✅ MongoDB (local or Atlas)  
✅ Google Gemini API Key  
✅ Git  

---

## 🚀 Step 1: Start Backend (5 minutes)

```bash
# Navigate to server
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

**Edit `.env`:**
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/blockroll

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_here_also_min_32_chars

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key_here_exactly_32chars

# CORS
CORS_ORIGIN=http://localhost:3000

# BlockDAG
BLOCKDAG_RPC_URL=https://rpc.primordial.bdagscan.com
```

**Start server:**
```bash
npm run dev
```

✅ Backend running on http://localhost:5000

---

## 🤖 Step 2: Start WhatsApp Bot (5 minutes)

```bash
# Navigate to whatsapp folder
cd whatsapp

# Install dependencies
npm install

# Configure environment
cp env.example .env
```

**Edit `.env`:**
```env
# Gemini API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB (for sessions)
MONGODB_URI=mongodb://localhost:27017/blockroll-whatsapp
```

**Start bot:**
```bash
npm run dev
```

**Scan QR Code:**
1. QR appears in terminal
2. Open WhatsApp mobile
3. Settings → Linked Devices → Link a Device
4. Scan QR code
5. Wait for "Session saved to MongoDB"

✅ WhatsApp bot running!

**Test it:**
Send message to bot: `!help`

---

## 🎨 Step 3: Build SDKs (10 minutes)

```bash
cd blockroll-kit

# Build core (required first!)
cd core
npm install
npm run build

# Build React SDK
cd ../react-sdk
npm install
npm run build

# Build Vue SDK
cd ../vue-sdk
npm install
npm run build

# Build CDN
cd ../cdn
npm install
npm run build
```

✅ All SDKs built!

---

## 🎯 Step 4: Test with Demo App (10 minutes)

### **Option A: React Demo**

```bash
cd blockroll-kit/demos/react-demo
npm install
cp .env.example .env
```

**Edit `.env`:**
```env
NEXT_PUBLIC_BLOCKROLL_API_KEY=get_from_dashboard
NEXT_PUBLIC_BLOCKROLL_API_URL=http://localhost:5000/api/v1
```

**Get API Key:**
1. Open http://localhost:5000 (backend)
2. Connect wallet (MetaMask)
3. Go to "SDK & Integration"
4. Click "Create API Key"
5. Choose permissions: upload, download, share
6. Copy the key
7. Paste in `.env`

**Start demo:**
```bash
npm run dev
```

Open http://localhost:3000

✅ **React demo running!**

**Try it:**
1. Upload a file
2. See it in list (real-time!)
3. Share with a wallet
4. See notification appear

---

### **Option B: Vue Demo**

```bash
cd blockroll-kit/demos/vue-demo
npm install
cp .env.example .env
# Add API key
npm run dev
```

Open http://localhost:5173

---

### **Option C: CDN Demo**

```bash
cd blockroll-kit/demos/cdn-demo
# Edit index.html line 82 with your API key
# Open index.html in browser
```

---

## ✅ Verification Checklist

### **Backend:**
- [ ] Server running on http://localhost:5000
- [ ] MongoDB connected
- [ ] Can visit /health endpoint
- [ ] Can connect wallet
- [ ] Can create API key

### **WhatsApp Bot:**
- [ ] QR code scanned
- [ ] Session saved to MongoDB
- [ ] Bot responds to messages
- [ ] `!help` command works
- [ ] AI responses work

### **SDKs:**
- [ ] Core SDK built (dist/ folder exists)
- [ ] React SDK built
- [ ] Vue SDK built
- [ ] CDN built (blockroll.min.js exists)

### **Demo App:**
- [ ] Demo runs without errors
- [ ] Can upload file
- [ ] File appears in list
- [ ] Can download file
- [ ] Can share file
- [ ] Notifications work
- [ ] Real-time updates work

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**

```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Get connection string from atlas.mongodb.com
```

### **Backend Port Already in Use**

```bash
# Change port in server/.env
PORT=5001
```

### **WhatsApp QR Not Showing**

```bash
# Delete sessions and restart
rm -rf whatsapp/sessions
cd whatsapp
npm run dev
```

### **SDK Build Errors**

```bash
# Install dependencies in correct order
cd blockroll-kit/core
npm install
npm run build

# Then build others
```

### **Demo Not Finding SDK**

```bash
# Ensure SDKs are built first
cd blockroll-kit/core && npm run build
cd ../react-sdk && npm run build
# Then run demo
```

---

## 📊 What's Running

After completing all steps:

```
Terminal 1: Backend API (http://localhost:5000)
Terminal 2: WhatsApp Bot (connected)
Terminal 3: Demo App (http://localhost:3000 or :5173)

MongoDB: Running (local or Atlas)
Smart Contracts: Ready to deploy
SDKs: Built and ready to use
```

---

## 🎓 Next Steps

### **For Development:**

1. ✅ **Integrate Frontend** - Connect existing frontend to backend
2. ✅ **Deploy Smart Contracts** - Deploy to BlockDAG
3. ✅ **Test E2E** - Complete end-to-end testing
4. ✅ **Add Features** - Build on top of SDKs

### **For Production:**

1. ✅ **Deploy Backend** - AWS/GCP/Azure
2. ✅ **MongoDB Atlas** - Production database
3. ✅ **Publish SDKs** - NPM registry
4. ✅ **Upload CDN** - Cloudflare/Fastly
5. ✅ **Domain Setup** - api.blockroll.io
6. ✅ **SSL Certificates** - HTTPS
7. ✅ **Deploy Contracts** - BlockDAG mainnet

---

## 💡 Pro Tips

### **Tip 1: Use MongoDB Atlas (Free Tier)**

No local MongoDB needed!
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blockroll
```

### **Tip 2: Use Separate API Keys**

```
Development API Key: For testing
Production API Key: For live apps
Admin API Key: For backend operations
```

### **Tip 3: Enable Debug Logs**

```env
# Backend
LOG_LEVEL=debug

# WhatsApp
WHATSAPP_LOG_LEVEL=debug
```

### **Tip 4: Test Real-Time**

Open demo in 2 browser tabs:
1. Upload file in tab 1
2. Tab 2 auto-updates (no refresh!)

---

## 🎉 Success!

**You now have:**

✅ Backend API running  
✅ WhatsApp bot active  
✅ SDKs built  
✅ Demo app working  
✅ Real-time notifications  
✅ Complete ecosystem!  

**Time to build something amazing! 🚀**

---

## 📞 Need Help?

- 📚 **Docs:** Check README files in each folder
- 🐛 **Issues:** Check troubleshooting sections
- 💬 **WhatsApp Bot:** Ask it questions!
- 📧 **Support:** Your setup is self-documented!

---

**🎯 BlockRoll: Ready to Roll!** 🎲✨

