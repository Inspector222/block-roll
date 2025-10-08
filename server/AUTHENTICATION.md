# BlockRoll Authentication Guide

## 🔐 httpOnly Cookie-Based Authentication with Auto-Refresh

BlockRoll uses **httpOnly cookies** with **automatic token refresh** for bank-level security. Tokens are never exposed to JavaScript and automatically refresh when expired - providing a seamless, secure user experience.

## 🎯 Why httpOnly Cookies?

### Security Benefits

✅ **XSS Protection** - Cookies are inaccessible to JavaScript  
✅ **Automatic Sending** - Browser automatically includes cookies in requests  
✅ **CSRF Protection** - SameSite attribute prevents cross-site attacks  
✅ **Secure Flag** - Cookies only sent over HTTPS in production  

### vs. localStorage/sessionStorage

❌ LocalStorage - Vulnerable to XSS attacks  
❌ SessionStorage - Vulnerable to XSS attacks  
✅ **httpOnly Cookies** - Not accessible by JavaScript at all  

## 🔑 Authentication Flow

### 1. Connect Wallet

```bash
POST /api/v1/auth/connect-wallet
Content-Type: application/json

{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": {
      "_id": "...",
      "walletAddress": "0x742d35...",
      "role": "user"
    },
    "isNewUser": false
  }
}
```

**Cookies Set (automatically):**
```
Set-Cookie: accessToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Path=/
Set-Cookie: refreshToken=eyJhbGc...; HttpOnly; Secure; SameSite=Strict; Path=/
```

### 2. Subsequent Requests

The browser **automatically** includes cookies:

```bash
GET /api/v1/auth/me
# No Authorization header needed!
# Browser automatically sends cookies
```

### 3. Refresh Token

```bash
POST /api/v1/auth/refresh
# No body needed - refreshToken read from cookie
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully"
}
```

**New cookies automatically set**

### 4. Logout

```bash
POST /api/v1/auth/logout
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Cookies cleared automatically**

## 🌐 Frontend Integration

### React/Next.js Example

```typescript
// Connect wallet
const connectWallet = async (walletAddress: string) => {
  const response = await fetch('http://localhost:5000/api/v1/auth/connect-wallet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ⭐ IMPORTANT: Include cookies
    body: JSON.stringify({ walletAddress }),
  });

  const data = await response.json();
  return data;
};

// All subsequent requests
const getMyFiles = async () => {
  const response = await fetch('http://localhost:5000/api/v1/file/my-files', {
    method: 'GET',
    credentials: 'include', // ⭐ Always include this
  });

  const data = await response.json();
  return data;
};

// Logout
const logout = async () => {
  const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  const data = await response.json();
  return data;
};
```

### Axios Example

```typescript
import axios from 'axios';

// Configure axios to always send cookies
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // ⭐ Enable cookies
});

// Connect wallet
const connectWallet = async (walletAddress: string) => {
  const { data } = await api.post('/auth/connect-wallet', { walletAddress });
  return data;
};

// Get files
const getMyFiles = async () => {
  const { data } = await api.get('/file/my-files');
  return data;
};

// Logout
const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};
```

## 🔧 Configuration

### Cookie Settings

Configured in `src/config/index.ts`:

```typescript
cookie: {
  httpOnly: true,                                    // Cannot be accessed by JS
  secure: process.env.NODE_ENV === 'production',    // HTTPS only in production
  sameSite: 'strict',                                // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,                  // 7 days
}
```

### CORS Configuration

**IMPORTANT:** CORS must allow credentials:

```typescript
cors({
  origin: 'http://localhost:3000',  // Your frontend URL
  credentials: true,                 // ⭐ Allow cookies
})
```

### Frontend CORS

Frontend must also enable credentials:

```typescript
// Fetch API
fetch(url, {
  credentials: 'include', // ⭐ Required
});

// Axios
axios.create({
  withCredentials: true, // ⭐ Required
});
```

## 🔄 Token Lifecycle

### Access Token
- **Lifetime:** 7 days
- **Storage:** httpOnly cookie
- **Auto-refresh:** ✅ Automatic when expired

### Refresh Token
- **Lifetime:** 30 days
- **Storage:** httpOnly cookie
- **Purpose:** Generate new access tokens automatically

## 🏦 Auto-Refresh Feature (Bank-Level Security)

### How It Works

```
1. User makes API request
   ↓
2. Middleware checks access token
   ↓
3. Token is expired? → Auto-refresh triggered!
   ├─ Get refresh token from cookie
   ├─ Verify refresh token
   ├─ Generate new access token
   ├─ Set new httpOnly cookies
   ├─ Continue with original request
   └─ User doesn't notice anything! ✨
   ↓
4. Request processed normally
```

### Example Flow

```bash
# Day 1: User connects wallet
POST /auth/connect-wallet
→ Cookies set (access token expires in 7 days)

# Day 8: Access token expired, user makes request
GET /file/my-files
→ Access token expired!
→ Auto-refresh middleware kicks in
→ Uses refresh token to get new access token
→ Sets new cookies automatically
→ Original request succeeds
→ User never knows token expired! ✨

# Day 35: Refresh token also expired
GET /file/my-files
→ Access token expired!
→ Auto-refresh tries to use refresh token
→ Refresh token also expired!
→ Returns 401: "Session expired, please login again"
→ User needs to reconnect wallet
```

### Response Headers

When auto-refresh happens, the response includes:

```
X-Token-Refreshed: true
Set-Cookie: accessToken=...; HttpOnly; Secure; SameSite=Strict
Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict
```

### Frontend Detection (Optional)

```typescript
const response = await fetch('/api/v1/file/my-files', {
  credentials: 'include',
});

// Check if token was auto-refreshed
if (response.headers.get('X-Token-Refreshed') === 'true') {
  console.log('✅ Session automatically refreshed');
}
```

### Benefits

✅ **Seamless UX** - Users never interrupted  
✅ **Bank-Level Security** - Like banking apps that keep you logged in  
✅ **Zero Client Code** - No refresh logic needed in frontend  
✅ **Automatic** - Works on every request  
✅ **Transparent** - User doesn't notice token expiry  

### Security Guarantees

🔒 **Tokens never exposed to JavaScript**  
🔒 **Automatic rotation** - New tokens on every refresh  
🔒 **Refresh token single-use** - Each refresh generates new refresh token  
🔒 **30-day absolute timeout** - After 30 days, must re-authenticate  
🔒 **HTTPS-only in production** - Cookies secured in transit  

## 🛡️ Security Features

### 1. httpOnly Flag
```
Set-Cookie: accessToken=...; HttpOnly
```
- JavaScript **cannot** read this cookie
- Protects against XSS attacks

### 2. Secure Flag (Production)
```
Set-Cookie: accessToken=...; Secure
```
- Only sent over HTTPS
- Protects against man-in-the-middle attacks

### 3. SameSite Flag
```
Set-Cookie: accessToken=...; SameSite=Strict
```
- Prevents CSRF attacks
- Cookie only sent to same-site requests

### 4. Path Restriction
```
Set-Cookie: accessToken=...; Path=/
```
- Cookie available for all API routes

## 🔑 API Key Authentication (SDK/CDN)

For **SDK/CDN** integrations, use API keys in headers:

```bash
curl -X POST http://localhost:5000/api/v1/file/upload \
  -H "x-api-key: br_your_api_key_here" \
  -F "file=@document.pdf"
```

API keys **bypass** cookie authentication but have their own permission system.

## 🧪 Testing with Postman/Thunder Client

1. **Enable Cookie Jar** in settings
2. **Connect wallet** - cookies automatically saved
3. **Make requests** - cookies automatically included
4. **Logout** - cookies automatically cleared

## 📝 Example Flow

```
1. User connects wallet
   ↓
2. Server validates wallet
   ↓
3. Server generates JWT tokens
   ↓
4. Server sets httpOnly cookies
   ↓
5. Browser stores cookies (automatic)
   ↓
6. User makes API request
   ↓
7. Browser sends cookies (automatic)
   ↓
8. Server verifies token from cookie
   ↓
9. Request processed
```

## ⚠️ Important Notes

### Development vs Production

**Development:**
- `secure: false` - works with HTTP
- `sameSite: 'lax'` - allows cross-origin during dev

**Production:**
- `secure: true` - requires HTTPS
- `sameSite: 'strict'` - maximum security

### Cookie Domain

For production, you may need to set the domain:

```typescript
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  domain: '.blockroll.io', // Allow subdomain access
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

### CORS Origin

Must match your frontend URL exactly:

```env
# Development
CORS_ORIGIN=http://localhost:3000

# Production
CORS_ORIGIN=https://app.blockroll.io
```

## 🔍 Debugging

### Check if cookies are set

```javascript
// In browser console
document.cookie; // Will NOT show httpOnly cookies (as expected)
```

### View cookies in DevTools

Chrome/Edge: DevTools → Application → Cookies  
Firefox: DevTools → Storage → Cookies

### Server-side debugging

```typescript
// In middleware
console.log('Cookies:', req.cookies);
console.log('Access Token:', req.cookies?.accessToken);
```

## 🎯 Migration from Authorization Header

If you were using Authorization headers before:

**Before:**
```typescript
fetch(url, {
  headers: {
    'Authorization': `Bearer ${token}`,
  },
});
```

**After:**
```typescript
fetch(url, {
  credentials: 'include', // Just add this!
});
```

Much simpler and more secure! 🎉

---

**Built with security in mind for BlockRoll** 🔒

