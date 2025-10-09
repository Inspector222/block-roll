# 🚀 BlockRoll WhatsApp Bot - Quick Start

## ⚡ Get Running in 5 Minutes

### 1. Install Dependencies

```bash
cd whatsapp
npm install
```

### 2. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 3. Set Up MongoDB

**Option A - Use MongoDB Atlas (Recommended):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account & cluster
3. Get connection string

**Option B - Local MongoDB:**
```bash
# Install and start MongoDB locally
mongod
```

### 4. Configure Environment

```bash
# Create .env file
cp env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=AIzaSy...your_key_here
MONGODB_URI=mongodb://localhost:27017/blockroll-whatsapp
# Or Atlas: mongodb+srv://user:pass@cluster.mongodb.net/blockroll-whatsapp
```

📚 **Full MongoDB setup:** See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### 5. Start the Bot

```bash
npm run dev
```

### 6. Scan QR Code & Wait for Session Save

1. QR code appears in terminal
2. Open WhatsApp on your phone
3. Settings → Linked Devices → Link a Device
4. Scan the QR code
5. Wait for "Session saved to MongoDB" message
6. ✅ Done!

**Note:** Session is saved to MongoDB (~1 minute). Next time, no QR scan needed!

---

## 💬 Try These Commands

```
!help           - Get help menu
!ask <question> - Ask AI anything
!upload         - How to upload files
!security       - Security features
!features       - All features
!start          - Getting started guide
```

---

## 🤖 Example Usage

### Ask AI Anything

```
You: !ask How do I share a file?

Bot: 🤖 BlockRoll AI Support

To share a file securely:
1. Go to 'My Vault' or 'Shared Files'
2. Find the file you want to share
3. Click 'Share'
...
```

### Quick Commands

```
You: !security

Bot: 🔒 BlockRoll Security

95/100 Bank-Level Score 🏆
...
```

---

## 🎯 Tips

1. **Natural Language** - Just ask normally!
   - "How do I upload files?"
   - "Is this secure?"
   - "What is emergency access?"

2. **Quick Commands** - Use ! commands for instant answers
   - !upload, !share, !features, etc.

3. **Reset Conversation** - If confused: `!reset`

4. **Browse Topics** - See all categories: `!topics`

---

## 🔧 Configuration (Optional)

### Custom Model

```env
GEMINI_MODEL=gemini-1.5-pro  # More powerful
```

### Multiple API Keys

```env
GEMINI_API_KEYS=key1,key2,key3  # Automatic rotation
```

### Logging

```env
WHATSAPP_LOG_LEVEL=debug  # More detailed logs
```

---

## 🚨 Troubleshooting

### QR Code Not Appearing

```bash
rm -rf sessions/
npm run dev
```

### Bot Not Responding

1. Check `.env` file has `GEMINI_API_KEY`
2. Check API key is valid
3. Check internet connection
4. Check logs: `logs/combined.log`

### "Client is not ready"

- Wait 30 seconds after scanning QR
- Ensure WhatsApp mobile is connected to internet
- Try deleting `sessions/` and scan again

---

## ✅ Quick Test

After bot starts, send it a message:

```
!help
```

You should get the help menu instantly!

---

**That's it! Your BlockRoll AI support bot is ready! 🎉**

For full documentation, see [README.md](./README.md)

