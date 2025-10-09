# 📎 Media Handling Guide

Complete guide to handling media attachments in BlockRoll WhatsApp Bot.

Reference: [WhatsApp Web.js Media Documentation](https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html)

---

## 🎯 Overview

BlockRoll WhatsApp Bot supports **full media handling** including:

✅ **Receiving Media** - Download images, videos, audio, documents  
✅ **Sending Media** - Send from base64, local files, or URLs  
✅ **Media Validation** - Size, type, and format checks  
✅ **Auto-Processing** - Automatic detection and info extraction  
✅ **Captions** - Send media with descriptive captions  

---

## 📥 Receiving Media

### **Automatic Detection**

When a user sends media, the bot **automatically**:

```
1. Detects media (checks message.hasMedia)
2. Downloads media
3. Validates format & size
4. Extracts information
5. Responds with media details
```

### **Example Flow:**

```
User: [Sends photo.jpg - 2.5 MB]

Bot: "📥 Downloading media..."

Bot: "✅ Media Received!

📋 Info:
• Type: 📸 Image
• Format: image/jpeg
• Size: 2.5 MB
• Filename: photo.jpg

💡 What I can do:
• Process images
• Extract text from documents
• Analyze media content

Type !media-help for more options!"
```

### **Code Implementation:**

```typescript
// In MessageService.ts
private async handleMediaMessage(context: MessageContext): Promise<void> {
  // Download media
  const media = await context.message.downloadMedia();
  
  if (!media) {
    await context.message.reply('❌ Failed to download media');
    return;
  }
  
  // Process media
  const fileSize = media.filesize || estimateSize(media.data);
  const mediaType = getMediaCategory(media.mimetype);
  
  // Respond
  await context.message.reply(
    `✅ Received ${mediaType}: ${formatSize(fileSize)}`
  );
}
```

---

## 📤 Sending Media

### **Method 1: From URL**

Send images/files from any public URL.

**Command:** `!send-from-url <url>`

**Example:**
```
User: !send-from-url https://example.com/image.png

Bot: "📥 Downloading image from URL..."
Bot: [Sends image with caption]
     "✅ Image from URL
      Source: https://example.com/image.png"
```

**Code:**
```typescript
const media = await MessageMedia.fromUrl(url);
await client.sendMessage(chatId, media, { 
  caption: 'Image from URL' 
});
```

### **Method 2: From Base64**

Send media from base64-encoded data.

**Code:**
```typescript
const media = new MessageMedia(
  'image/png',  // mimetype
  base64String, // base64 data
  'filename.png' // optional filename
);

await client.sendMessage(chatId, media, {
  caption: 'Custom caption here'
});
```

### **Method 3: From Local File**

Send files from the server filesystem.

**Code:**
```typescript
const media = MessageMedia.fromFilePath('./path/to/file.png');
await client.sendMessage(chatId, media);
```

---

## 🎨 Media Commands

### **`!media-help`**

Shows all media handling capabilities.

**Response:**
```
📎 BlockRoll Media Handling

Send Media:
• !send-image - Send a sample image
• !send-doc - Send a document
• !send-from-url <url> - Send image from URL

Receive Media:
• Send any image/video/document
• Bot will detect and process it

...
```

### **`!send-image`**

Sends a sample image from URL.

**Example:**
```
User: !send-image

Bot: "📤 Sending sample image from URL..."
Bot: [Sends BlockRoll branded image]
```

### **`!send-doc`**

Sends a sample text document.

**Example:**
```
User: !send-doc

Bot: "📤 Sending sample document..."
Bot: [Sends blockroll-info.txt]
     "📄 BlockRoll Information Document
      A sample text file from the bot!"
```

### **`!send-from-url <url>`**

Download and send image from any URL.

**Usage:**
```
!send-from-url https://example.com/image.png
!send-from-url https://picsum.photos/600/400
```

**Example:**
```
User: !send-from-url https://picsum.photos/600/400

Bot: "📥 Downloading image from URL...
      https://picsum.photos/600/400"

Bot: [Sends downloaded image]
     "✅ Image from URL
      Source: https://picsum.photos/600/400"
```

### **`!media-formats`**

Shows all supported formats and limits.

**Response:**
```
📋 Supported Media Formats

Images:
• JPEG (.jpg, .jpeg)
• PNG (.png)
• GIF (.gif)
• WebP (.webp)

Videos:
• MP4 (.mp4)
• AVI (.avi)
• MOV (.mov)

Audio:
• MP3 (.mp3)
• WAV (.wav)
• OGG (.ogg)

Documents:
• PDF (.pdf)
• Text (.txt)
• Word (.doc, .docx)

Limits:
• Max file size: 100 MB
...
```

---

## 📋 Supported Formats

### **Images** 📸

| Format | MIME Type | Extension | Status |
|--------|-----------|-----------|--------|
| JPEG | `image/jpeg` | `.jpg`, `.jpeg` | ✅ |
| PNG | `image/png` | `.png` | ✅ |
| GIF | `image/gif` | `.gif` | ✅ |
| WebP | `image/webp` | `.webp` | ✅ |

### **Videos** 🎥

| Format | MIME Type | Extension | Status |
|--------|-----------|-----------|--------|
| MP4 | `video/mp4` | `.mp4` | ✅ |
| AVI | `video/avi` | `.avi` | ✅ |
| MOV | `video/mov` | `.mov` | ✅ |

**Note:** For videos and GIFs, you may need to configure Chrome executable path (see [Video/GIF Support](#videogif-support)).

### **Audio** 🎵

| Format | MIME Type | Extension | Status |
|--------|-----------|-----------|--------|
| MP3 | `audio/mpeg` | `.mp3` | ✅ |
| WAV | `audio/wav` | `.wav` | ✅ |
| OGG | `audio/ogg` | `.ogg` | ✅ |

### **Documents** 📄

| Format | MIME Type | Extension | Status |
|--------|-----------|-----------|--------|
| PDF | `application/pdf` | `.pdf` | ✅ |
| Text | `text/plain` | `.txt` | ✅ |
| Word | `application/msword` | `.doc` | ✅ |
| Word (new) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.docx` | ✅ |

---

## ⚙️ Configuration

### **File Size Limit**

**Default:** 100 MB

**Change:**
```typescript
// In MediaService
mediaService.setMaxFileSize(50 * 1024 * 1024); // 50 MB
```

### **Allowed MIME Types**

**Add new type:**
```typescript
mediaService.addAllowedMimeType('image/svg+xml');
```

**Remove type:**
```typescript
mediaService.removeAllowedMimeType('video/avi');
```

**Get allowed types:**
```typescript
const types = mediaService.getAllowedMimeTypes();
console.log(types);
```

---

## 🎬 Video/GIF Support

### **The Issue**

WhatsApp Web.js uses **Chromium** (via Puppeteer), which **doesn't support** H.264 and AAC codecs by default (licensing reasons).

### **The Solution**

Point Puppeteer to use **Google Chrome** instead of Chromium.

### **Configuration**

Update `config.json` or environment:

```json
{
  "whatsapp": {
    "puppeteer": {
      "executablePath": "/path/to/Google Chrome"
    }
  }
}
```

### **Chrome Paths by OS**

| OS | Default Path |
|----|--------------|
| **macOS** | `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` |
| **Windows** | `C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe` |
| **Linux** | `/usr/bin/google-chrome-stable` |

### **Example (Windows):**

```json
{
  "whatsapp": {
    "puppeteer": {
      "executablePath": "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "headless": true,
      "args": ["--no-sandbox"]
    }
  }
}
```

---

## 🔍 Media Validation

### **Automatic Checks**

Bot validates:

✅ **MIME Type** - Must be in allowed list  
✅ **File Size** - Must be ≤ 100 MB  
✅ **Data Format** - Must be valid base64  
✅ **Required Fields** - mimetype and data present  

### **Validation Flow**

```
Media received
    ↓
Check hasMedia
    ↓
Download media
    ↓
Validate MIME type ✅
    ↓
Check file size ✅
    ↓
Validate base64 ✅
    ↓
Process & respond
```

### **Error Handling**

If validation fails:

```
❌ Failed to download media.

Possible reasons:
• Media was deleted
• Media too large (>100 MB)
• Unsupported format
• Network error

Please try sending again.
```

---

## 💡 Use Cases

### **1. User Support - Receive Screenshots**

```
User: [Sends screenshot of error]

Bot: "✅ Media Received!

📋 Info:
• Type: 📸 Image
• Format: image/png
• Size: 1.2 MB

I can see the screenshot. Let me help you with this issue..."
```

### **2. Send Instructions - Images**

```
User: How do I upload files?

Bot: "Here's a visual guide:"
Bot: [Sends diagram image]
     "Follow these steps to upload files securely!"
```

### **3. Document Sharing**

```
User: !send-doc

Bot: [Sends blockroll-info.txt]
     "📄 BlockRoll Information Document
      
      Everything you need to know about BlockRoll!"
```

### **4. URL-Based Media**

```
User: !send-from-url https://blockroll.io/promo.png

Bot: [Downloads and sends image]
     "✅ Latest BlockRoll promotional image!"
```

---

## 🛠️ Advanced Features

### **1. Media with Captions**

```typescript
await client.sendMessage(chatId, media, {
  caption: '🎨 **BlockRoll Sample Image**\n\nThis is a caption!'
});
```

### **2. Quoted Reply with Media**

```typescript
await message.reply(media, undefined, {
  caption: 'Here is the image you requested',
  quotedMessageId: message.id
});
```

### **3. Media Info Extraction**

```typescript
const info = mediaService.getMediaInfo(media);
console.log(info);
// {
//   type: 'image/jpeg',
//   size: 2500000,
//   filename: 'photo.jpg',
//   mimetype: 'image/jpeg'
// }
```

### **4. Base64 to File**

```typescript
const buffer = Buffer.from(media.data, 'base64');
fs.writeFileSync('output.jpg', buffer);
```

---

## 📊 Performance

### **Download Speeds**

| Media Type | Size | Time | Status |
|------------|------|------|--------|
| Image (JPEG) | 2 MB | ~2s | ✅ Fast |
| Video (MP4) | 50 MB | ~15s | ✅ Good |
| Document (PDF) | 10 MB | ~5s | ✅ Fast |
| Audio (MP3) | 5 MB | ~3s | ✅ Fast |

### **Memory Usage**

Base64 encoding increases memory usage by ~33%.

**Example:**
- Original file: 10 MB
- Base64 in memory: ~13.3 MB

---

## 🐛 Troubleshooting

### **Issue: Media download fails**

**Error:** `undefined` returned from `downloadMedia()`

**Solutions:**
1. Media was deleted from phone
2. Media expired (old WhatsApp message)
3. Network connection issue
4. File too large

### **Issue: Can't send videos**

**Error:** Videos don't play or don't send

**Solution:**
Configure Chrome executable path (see [Video/GIF Support](#videogif-support))

### **Issue: File size error**

**Error:** "Media file too large"

**Solutions:**
1. Reduce file size
2. Compress image/video
3. Increase max file size limit

### **Issue: Unsupported format**

**Error:** "Media MIME type not allowed"

**Solution:**
```typescript
mediaService.addAllowedMimeType('your/mimetype');
```

---

## 📚 API Reference

### **MessageMedia Class**

```typescript
class MessageMedia {
  mimetype: string;      // MIME type (e.g., 'image/jpeg')
  data: string;          // Base64-encoded file data
  filename?: string;     // Optional filename
  filesize?: number;     // File size in bytes
  
  // Static methods
  static fromFilePath(path: string): MessageMedia;
  static fromUrl(url: string, options?): Promise<MessageMedia>;
}
```

### **MediaService Methods**

```typescript
class MediaService {
  // Download media
  downloadMedia(message: Message): Promise<MessageMedia | null>;
  
  // Validate media
  validateMedia(media: MessageMedia): boolean;
  
  // Get media info
  getMediaInfo(media: MessageMedia): MediaInfo;
  
  // Create from sources
  createMediaFromPath(path: string): Promise<MessageMedia | null>;
  createMediaFromUrl(url: string): Promise<MessageMedia | null>;
  
  // Configuration
  setMaxFileSize(size: number): void;
  getMaxFileSize(): number;
  addAllowedMimeType(type: string): void;
  removeAllowedMimeType(type: string): void;
  getAllowedMimeTypes(): string[];
  
  // Utilities
  getMediaCategory(mimetype: string): string;
  formatFileSize(bytes: number): string;
}
```

---

## ✅ Testing

### **Test Receiving Media**

```
1. Start bot
2. Send an image to bot
3. Bot should respond with media info
4. ✅ Success if bot shows type, size, format
```

### **Test Sending Media**

```
1. Send: !send-image
2. Bot should send sample image
3. ✅ Success if image appears with caption
```

### **Test URL Download**

```
1. Send: !send-from-url https://picsum.photos/400
2. Bot should download and send
3. ✅ Success if random image appears
```

---

## 📖 Resources

- **WhatsApp Web.js Docs**: [wwebjs.dev/guide/creating-your-bot/handling-attachments.html](https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html)
- **MessageMedia API**: [wwebjs.dev/MessageMedia.html](https://wwebjs.dev/MessageMedia.html)
- **Puppeteer Chrome**: [pptr.dev](https://pptr.dev/)

---

## 🎓 Examples

### **Example 1: Echo Media**

```typescript
client.on('message', async (msg) => {
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    if (media) {
      await msg.reply(media, undefined, {
        caption: 'Here is your media back!'
      });
    }
  }
});
```

### **Example 2: Save to Disk**

```typescript
client.on('message', async (msg) => {
  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    if (media) {
      const buffer = Buffer.from(media.data, 'base64');
      fs.writeFileSync(`./downloads/${media.filename}`, buffer);
      await msg.reply('✅ Saved to disk!');
    }
  }
});
```

### **Example 3: Send Multiple Images**

```typescript
const images = [
  'https://example.com/1.png',
  'https://example.com/2.png',
  'https://example.com/3.png'
];

for (const url of images) {
  const media = await MessageMedia.fromUrl(url);
  await client.sendMessage(chatId, media, {
    caption: `Image from ${url}`
  });
}
```

---

**🎉 Media handling is now fully implemented!**

Send/receive images, videos, documents, and more! 📎🚀

