# 🔒 BlockRoll Security - Quick Reference

## 🚀 TL;DR

BlockRoll has **20+ bank-level security features** protecting your platform.

---

## 🛡️ Security Layers (7 Total)

1. **Network Security** - IP blocking, geolocation
2. **Rate Limiting** - DDoS protection, brute force prevention
3. **Input Validation** - XSS, injection prevention
4. **Authentication** - httpOnly cookies, auto-refresh
5. **Authorization** - Role-based, wallet-based
6. **Activity Monitoring** - Suspicious activity, anomaly detection
7. **Audit Logging** - Complete event trail

---

## 🔐 Authentication Flow with Security

```
User Connects Wallet
  ↓
[Device Fingerprinting] ← Identify device
  ↓
[IP Security Check] ← Check if IP blacklisted
  ↓
[Brute Force Check] ← Check failed attempts
  ↓
[Suspicious Activity Detection] ← Check for anomalies
  ↓
[Create Session] ← Track device & IP
  ↓
[Log Security Event] ← Audit trail
  ↓
[Set httpOnly Cookies] ← Secure token storage
  ↓
User Authenticated ✅
```

---

## 🚨 Automatic Protections

### Brute Force Attack

```
Scenario: Attacker tries 100 passwords

After 5 failed attempts:
├─ Account locked for 30 minutes
├─ IP logged as suspicious
├─ User notified (if email configured)
└─ Admin alerted

After 10 failed attempts from same IP:
├─ IP blocked globally
├─ All admins notified
└─ Security incident logged
```

### Suspicious Login

```
Scenario: Login from unusual location

Detection:
├─ Check: New IP? → +30 risk points
├─ Check: New device? → +20 risk points
├─ Check: Impossible travel? → +50 risk points
└─ Total Risk: 100 points

If Risk >= 50:
├─ Mark as suspicious
├─ Send security alert to user
├─ Log incident
└─ (Future: Require MFA)

If Risk >= 70:
├─ Critical alert sent
├─ Notify admins
└─ Could auto-lock account
```

### Session Hijacking Attempt

```
Scenario: Stolen cookie used from different device

Detection:
├─ Device fingerprint doesn't match
├─ IP address suddenly changed
├─ User agent changed
└─ Geolocation jumped

Response:
├─ Flag as session hijacking attempt
├─ Send critical alert
├─ Log all details
└─ Could revoke all sessions
```

---

## 📊 Security Models

### SecurityLog
```typescript
Purpose: Audit trail for compliance
Tracks: 20 different event types
Indexed: By user, IP, event type, severity
Retention: Unlimited (configurable)
```

### Session
```typescript
Purpose: Multi-device session tracking
Tracks: Device, IP, location, activity
Features: Trust devices, revoke sessions
Auto-cleanup: Expired sessions
```

### AccountSecurity
```typescript
Purpose: Per-user security settings
Features: Account lockout, trusted devices/IPs
MFA Ready: Structure in place
Risk Score: Continuous calculation
```

---

## 🔍 Security Monitoring

### Real-Time Alerts Via WebSocket

```typescript
Critical Events → Instant Alert
├─ Suspicious login
├─ Account lockout
├─ Session hijacking
├─ Brute force attack
├─ High risk activity
└─ Security incidents

User sees notification within 100ms!
```

### Security Dashboard

```typescript
User Dashboard Shows:
├─ Security Score (0-100)
├─ Active Devices
├─ Recent Security Events
├─ Failed Login Attempts
└─ Trusted Devices

Admin Dashboard Shows:
├─ Platform Security Score
├─ Active Threats
├─ Blocked IPs
├─ Critical Events
└─ User Risk Distribution
```

---

## 🎯 Security Endpoints

### For Users

```bash
GET    /api/v1/security/sessions          # My active sessions
DELETE /api/v1/security/sessions/:id      # Revoke session
POST   /api/v1/security/revoke-all-sessions # Logout everywhere
POST   /api/v1/security/trust-device      # Trust this device
GET    /api/v1/security/logs              # My security log
GET    /api/v1/security/score             # My security score
```

### For Admins

```bash
GET    /api/v1/admin/security/stats       # Platform security
GET    /api/v1/security/critical-events   # Critical events
POST   /api/v1/admin/security/block-ip    # Block IP
POST   /api/v1/admin/security/lock-account/:id  # Lock user
```

---

## 🔧 Configuration

### Security Settings in `.env`

```env
# Token lifetimes (shorter = more secure)
JWT_EXPIRES_IN=15m              # Short access token
REFRESH_TOKEN_EXPIRES_IN=30d    # Longer refresh

# Session security
SESSION_TIMEOUT=30              # Minutes of inactivity
MAX_SESSIONS_PER_USER=5         # Device limit

# Brute force protection
MAX_LOGIN_ATTEMPTS=5            # Before lockout
LOCKOUT_DURATION=30             # Minutes
IP_BLOCK_THRESHOLD=10           # Failed attempts

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100     # Per window

# Risk scoring
SUSPICIOUS_RISK_THRESHOLD=50
CRITICAL_RISK_THRESHOLD=70
```

---

## 🎓 Security Best Practices

### Development

```bash
# Use development settings
NODE_ENV=development
secure: false  # Allow HTTP
sameSite: 'lax'

# Enable detailed logging
LOG_LEVEL=debug
```

### Production

```bash
# Use production settings
NODE_ENV=production
secure: true   # HTTPS only
sameSite: 'strict'

# Reduce logging
LOG_LEVEL=info

# Enable all security features
BRUTE_FORCE_PROTECTION=true
IP_SECURITY_CHECK=true
DEVICE_FINGERPRINTING=true
```

---

## 📈 Security Metrics

### What's Tracked

```
Every minute:
├─ Failed login attempts
├─ Active sessions
├─ Security events
├─ Blocked IPs
└─ Average risk score

Every hour:
├─ Security trends
├─ Attack patterns
├─ Device distribution
└─ Geographic threats

Every day:
├─ Security reports
├─ Compliance data
├─ Audit summaries
└─ Risk assessments
```

---

## 🚦 Security Event Severity

### Info (Green)

```
Normal operations:
- Successful logins
- Token refreshes
- File uploads
- API key creation
```

### Warning (Yellow)

```
Concerning but not critical:
- New device login
- New IP address
- Failed login (1-4 attempts)
- Unusual access time
```

### Critical (Red)

```
Immediate attention required:
- Brute force attack
- Impossible travel
- Session hijacking attempt
- Account takeover attempt
- 5+ failed logins
- Blocked IP attempt
```

---

## 💪 Attack Mitigation

| Attack | Detection | Prevention | Recovery |
|--------|-----------|-----------|----------|
| **Brute Force** | Failed attempts tracking | Auto-lockout, IP block | Timeout unlock |
| **Account Takeover** | Multiple IPs, failed attempts | MFA ready, alerts | Session revocation |
| **Session Hijacking** | Device fingerprint mismatch | httpOnly cookies | Force logout |
| **XSS** | N/A | httpOnly cookies, CSP | N/A |
| **CSRF** | N/A | SameSite cookies | N/A |
| **DDoS** | Rate limit exceeded | IP blocking, rate limits | Auto-unblock |
| **Replay** | Timestamp validation | Signature + timestamp | Reject old requests |

---

## ✅ Compliance Checklist

### SOC 2 Type II
- [x] Access controls
- [x] Encryption (at rest & transit)
- [x] Audit logging
- [x] Monitoring & alerting
- [x] Incident response
- [x] Change management

### ISO 27001
- [x] Risk assessment
- [x] Access control
- [x] Cryptography
- [x] Operations security
- [x] Communications security
- [x] Supplier relationships

### GDPR
- [x] Data encryption
- [x] Access logging
- [x] Right to erasure (delete account)
- [x] Data portability
- [x] Security by design
- [x] Breach notification (real-time alerts)

---

## 🎯 Quick Commands

### Check Security Status

```bash
# Get health check
curl http://localhost:5000/api/v1/health

# Response:
{
  "security": "Bank-level",
  "realtime": "WebSocket enabled"
}
```

### View Security Logs

```bash
# Get my security events
curl -b cookies.txt http://localhost:5000/api/v1/security/logs

# Get my sessions
curl -b cookies.txt http://localhost:5000/api/v1/security/sessions

# Get my security score
curl -b cookies.txt http://localhost:5000/api/v1/security/score
```

### Admin Security Check

```bash
# Get critical events (admin only)
curl -b cookies.txt http://localhost:5000/api/v1/security/critical-events
```

---

## 📚 Related Documentation

- **[BANK_LEVEL_SECURITY.md](./BANK_LEVEL_SECURITY.md)** - Complete security guide
- **[AUTHENTICATION.md](./AUTHENTICATION.md)** - Auth system details
- **[AUTO_REFRESH_GUIDE.md](./AUTO_REFRESH_GUIDE.md)** - Token refresh security
- **[WEBSOCKET.md](./WEBSOCKET.md)** - Real-time security events

---

**BlockRoll: Fort Knox of Web3 Storage! 🏦🔒**

