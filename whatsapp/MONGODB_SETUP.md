# 🗄️ MongoDB Session Storage Setup

BlockRoll WhatsApp Bot uses **MongoDB** to store WhatsApp sessions, making them persistent and cloud-ready!

---

## 🎯 Why MongoDB Session Storage?

### **Benefits:**

✅ **Persistent Sessions** - Survive server restarts  
✅ **Cloud-Ready** - Works with MongoDB Atlas  
✅ **Multi-Device** - Share sessions across servers  
✅ **Backup** - Automatic session backups every 5 minutes  
✅ **Reliable** - No local file corruption issues  
✅ **Scalable** - Ready for production deployment  

---

## 📦 Installation

The necessary packages are already in `package.json`:

```bash
cd whatsapp
npm install
```

**Packages installed:**
- `mongoose` - MongoDB ODM
- `wwebjs-mongo` - WhatsApp Web.js MongoDB store

---

## ⚙️ Configuration

### **Option 1: Local MongoDB**

1. **Install MongoDB locally** (if not already installed):
   - Windows: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Mac: `brew install mongodb-community`
   - Linux: `sudo apt install mongodb`

2. **Start MongoDB**:
   ```bash
   # Windows
   mongod

   # Mac/Linux
   sudo systemctl start mongodb
   ```

3. **Configure `.env`**:
   ```env
   MONGODB_URI=mongodb://localhost:27017/blockroll-whatsapp
   SESSION_CLIENT_ID=blockroll-bot
   BACKUP_SYNC_INTERVAL=300000
   ```

### **Option 2: MongoDB Atlas (Cloud - Recommended)**

1. **Create free MongoDB Atlas account**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a cluster**:
   - Choose **Free Tier** (M0)
   - Select your preferred region
   - Create cluster

3. **Get connection string**:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

4. **Configure `.env`**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blockroll-whatsapp
   SESSION_CLIENT_ID=blockroll-bot
   BACKUP_SYNC_INTERVAL=300000
   ```

   Replace:
   - `username` - Your MongoDB username
   - `password` - Your MongoDB password
   - `cluster` - Your cluster name

5. **Whitelist IP** (in Atlas):
   - Go to "Network Access"
   - Add IP Address: `0.0.0.0/0` (allow all) or your server IP

---

## 🚀 How It Works

### **Architecture:**

```
WhatsApp Web.js
       ↓
  RemoteAuth
       ↓
  MongoDB Store
       ↓
MongoDB Database
       ↓
Session Collection
```

### **Session Flow:**

1. **First Time (QR Scan):**
   ```
   User starts bot
       ↓
   QR code displayed
       ↓
   User scans with WhatsApp
       ↓
   Client authenticated
       ↓
   Client ready
       ↓
   [⏳ Saving session to MongoDB... ~1 minute]
       ↓
   remote_session_saved event fired
       ↓
   ✅ Session saved! Bot fully operational
   ```

2. **Subsequent Starts:**
   ```
   User starts bot
       ↓
   MongoDB connection established
       ↓
   Load session from MongoDB
       ↓
   ✅ Client ready immediately (no QR scan!)
       ↓
   remote_session_saved (backup sync)
   ```

---

## 🔧 Environment Variables

### **Required:**

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/blockroll-whatsapp

# Session Configuration
SESSION_CLIENT_ID=blockroll-bot
BACKUP_SYNC_INTERVAL=300000
```

### **Variable Details:**

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/blockroll-whatsapp` | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `SESSION_CLIENT_ID` | Unique client identifier | `blockroll-bot` | `my-bot-1` |
| `BACKUP_SYNC_INTERVAL` | Backup interval (ms) | `300000` (5 min) | `600000` (10 min) |

---

## 📊 Database Structure

### **Database:** `blockroll-whatsapp`

### **Collection:** `whatsapp_sessions`

**Document Example:**
```json
{
  "_id": "blockroll-bot",
  "session": "... encrypted session data ...",
  "updatedAt": "2025-10-09T12:00:00.000Z"
}
```

---

## 🎯 Events

### **New Events Available:**

```typescript
// Session saved to MongoDB (takes ~1 minute after 'ready')
client.on('remote_session_saved', () => {
  console.log('✅ Session saved to MongoDB!');
});

// Loading screen progress
client.on('loading_screen', (percent, message) => {
  console.log(`Loading: ${percent}% - ${message}`);
});
```

---

## ⏱️ Timeline

### **First QR Scan:**

```
0:00 - Bot starts
0:05 - MongoDB connected
0:10 - QR code displayed
0:15 - User scans QR
0:20 - 'authenticated' event
0:25 - 'ready' event (can receive messages)
1:25 - 'remote_session_saved' event ✅
```

**Important:** 
- Bot is **ready** after ~25 seconds
- Session is **saved** after ~1 minute 25 seconds
- Can receive messages immediately after 'ready'
- Session persistence guaranteed after 'remote_session_saved'

---

## 🔍 Troubleshooting

### **Issue: Connection timeout**

**Error:**
```
MongooseError: Server selection timed out after 5000 ms
```

**Solutions:**
1. Check MongoDB is running: `mongod --version`
2. Check connection string in `.env`
3. For Atlas: Whitelist your IP address
4. Check firewall settings

### **Issue: Authentication failed**

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**
1. Check username/password in connection string
2. Ensure user has read/write permissions
3. Check database name is correct

### **Issue: Session not saving**

**Symptom:** No `remote_session_saved` event after 1-2 minutes

**Solutions:**
1. Check MongoDB connection is stable
2. Check `BACKUP_SYNC_INTERVAL` is set
3. Check logs for MongoDB errors
4. Ensure sufficient disk space

### **Issue: Can't connect to MongoDB Atlas**

**Solutions:**
1. Whitelist IP: `0.0.0.0/0` in Network Access
2. Use `mongodb+srv://` protocol (not `mongodb://`)
3. Ensure username/password are URL-encoded
4. Check cluster is not paused

---

## 📝 Example Code

### **Check Session Status:**

```typescript
import { WhatsAppBot } from './src/app/WhatsAppBot';

const bot = new WhatsAppBot();

await bot.initialize();

// Check if initialized
console.log('Initialized:', bot.getWhatsAppService().getIsInitialized());

// Check if session saved to MongoDB
console.log('Session Saved:', bot.getWhatsAppService().getIsSessionSaved());
```

### **Handle Events:**

```typescript
const whatsappService = bot.getWhatsAppService();
const client = whatsappService.getClient();

client.on('ready', () => {
  console.log('✅ Bot is ready to receive messages');
});

client.on('remote_session_saved', () => {
  console.log('💾 Session saved to MongoDB');
  console.log('🎉 Bot is now fully operational!');
});
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   ```bash
   # Add to .gitignore
   .env
   ```

2. **Use environment variables in production**
   ```bash
   export MONGODB_URI="mongodb+srv://..."
   ```

3. **Rotate MongoDB passwords regularly**

4. **Use MongoDB Atlas for production** (has built-in security)

5. **Enable MongoDB authentication**

6. **Use SSL/TLS for MongoDB connections**

---

## 🎨 Benefits Over LocalAuth

| Feature | LocalAuth | RemoteAuth + MongoDB |
|---------|-----------|---------------------|
| **Persistence** | ❌ Local files only | ✅ Database |
| **Multi-Server** | ❌ No | ✅ Yes |
| **Cloud-Ready** | ❌ No | ✅ Yes |
| **Backup** | ❌ Manual | ✅ Automatic (5 min) |
| **Corruption Recovery** | ❌ Difficult | ✅ Easy |
| **Scalability** | ❌ Limited | ✅ Excellent |
| **Production-Ready** | ⚠️ Basic | ✅ Enterprise |

---

## 📚 Resources

- **wwebjs-mongo**: [npmjs.com/package/wwebjs-mongo](https://www.npmjs.com/package/wwebjs-mongo)
- **MongoDB Atlas**: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com/)
- **WhatsApp Web.js**: [wwebjs.dev](https://wwebjs.dev/)

---

## ✅ Quick Start Checklist

- [ ] Install dependencies: `npm install`
- [ ] Set up MongoDB (local or Atlas)
- [ ] Configure `.env` with `MONGODB_URI`
- [ ] Start MongoDB (if local)
- [ ] Run bot: `npm run dev`
- [ ] Scan QR code
- [ ] Wait for `remote_session_saved` event
- [ ] ✅ Ready to use!

---

**🎉 Your WhatsApp bot sessions are now stored in MongoDB!**

No more rescanning QR codes after server restarts! 🚀

