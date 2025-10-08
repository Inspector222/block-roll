# 🔌 BlockRoll WebSocket Real-Time System

Complete guide for implementing real-time features in BlockRoll using Socket.IO.

## 🎯 Why WebSocket?

### Features Requiring Real-Time Updates:

✅ **Notifications** - Instant delivery (no polling!)  
✅ **Dashboard Stats** - Live updates  
✅ **AI Guardian** - Real-time security alerts  
✅ **File Sharing** - Instant notifications  
✅ **Admin Dashboard** - Live platform monitoring  
✅ **Activity Feed** - Real-time activity stream  

---

## 🏗️ Architecture

```
┌──────────────┐                 ┌──────────────┐
│   Frontend   │ ◄─────────────► │    Server    │
│  (Socket.IO  │   WebSocket     │  (Socket.IO) │
│   Client)    │   Connection    │              │
└──────────────┘                 └──────────────┘
        │                                │
        │   Events Flow:                 │
        │                                │
        ├─► authenticate                 │
        ├─► subscribe:notifications      │
        ├─► subscribe:files              │
        ├─► subscribe:guardian           │
        │                                │
        │   ◄─ notification:new          │
        │   ◄─ file:uploaded             │
        │   ◄─ security:alert            │
        │   ◄─ stats:update              │
        │   ◄─ activity:new              │
        └────────────────────────────────┘
```

---

## 📡 Server Configuration

### Connection URL

```
ws://localhost:5000/socket.io    (Development)
wss://api.blockroll.io/socket.io  (Production)
```

### Authentication

WebSocket connections require authentication via:
1. **httpOnly cookie** (automatic)
2. **auth token** in handshake

---

## 🔐 Authentication

### Method 1: Using httpOnly Cookie (Recommended)

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  withCredentials: true,  // ⭐ Sends httpOnly cookies
  transports: ['websocket', 'polling'],
});
```

### Method 2: Using Token in Handshake

```typescript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_access_token_here',
  },
  transports: ['websocket', 'polling'],
});
```

---

## 📨 Server → Client Events

### 1. Notifications

| Event | Data | Description |
|-------|------|-------------|
| `notification:new` | `NotificationData` | New notification received |
| `notification:read` | `{ id, timestamp }` | Notification marked as read |
| `notification:unread_count` | `{ count, timestamp }` | Unread count updated |

**Example:**
```typescript
socket.on('notification:new', (data) => {
  console.log('New notification:', data);
  // { id, type, title, message, priority, timestamp }
  showToast(data.title, data.message);
  updateNotificationBadge();
});

socket.on('notification:unread_count', (data) => {
  setUnreadCount(data.count);
});
```

### 2. Files

| Event | Data | Description |
|-------|------|-------------|
| `file:uploaded` | `FileEventData` | File uploaded successfully |
| `file:shared` | `FileEventData` | File shared with someone |
| `file:received` | `FileEventData` | File shared with you |
| `file:access_revoked` | `FileEventData` | Access to file revoked |
| `file:expiring_soon` | `FileEventData` | File expiring soon |
| `file:expired` | `FileEventData` | File has expired |

**Example:**
```typescript
socket.on('file:received', (data) => {
  console.log('New file shared with you:', data);
  // { fileId, fileName, owner, action, timestamp }
  showNotification(`${data.fileName} shared with you!`);
  refreshFileList();
});

socket.on('file:uploaded', (data) => {
  // Update dashboard stats
  updateFileCount(prev => prev + 1);
});
```

### 3. AI Guardian / Security

| Event | Data | Description |
|-------|------|-------------|
| `security:alert` | `SecurityAlertData` | Security alert detected |
| `security:incident` | `SecurityAlertData` | Security incident |
| `security:risk_level_changed` | `{ level, timestamp }` | Risk level changed |
| `security:threat_blocked` | `{ threat, timestamp }` | Threat blocked |

**Example:**
```typescript
socket.on('security:alert', (data) => {
  console.log('🚨 Security Alert:', data);
  // { id, severity, type, message, timestamp }
  
  if (data.severity === 'high' || data.severity === 'critical') {
    showUrgentAlert(data.message);
  }
  
  updateSecurityDashboard(data);
});

socket.on('security:risk_level_changed', (data) => {
  setRiskLevel(data.level);
});
```

### 4. Dashboard / Stats

| Event | Data | Description |
|-------|------|-------------|
| `stats:update` | `StatsUpdateData` | Dashboard stats updated |
| `activity:new` | `ActivityData` | New activity |
| `storage:update` | `{ used, total, percentage }` | Storage updated |

**Example:**
```typescript
socket.on('stats:update', (data) => {
  console.log('Stats updated:', data);
  setStats({
    totalFiles: data.totalFiles,
    totalShared: data.totalShared,
    securityScore: data.securityScore,
  });
});

socket.on('activity:new', (data) => {
  // Add to activity feed
  setActivities(prev => [data, ...prev].slice(0, 10));
});
```

### 5. Workspace

| Event | Data | Description |
|-------|------|-------------|
| `workspace:invite` | `WorkspaceEventData` | Invited to workspace |
| `workspace:member_added` | `WorkspaceEventData` | Member added |
| `workspace:member_removed` | `WorkspaceEventData` | Member removed |
| `workspace:file_added` | `WorkspaceEventData` | File added to workspace |

**Example:**
```typescript
socket.on('workspace:invite', (data) => {
  showNotification(`Invited to ${data.workspaceName}`);
});

socket.on('workspace:file_added', (data) => {
  refreshWorkspaceFiles(data.workspaceId);
});
```

### 6. Admin Events

| Event | Data | Description |
|-------|------|-------------|
| `admin:user_joined` | `AdminEventData` | New user joined |
| `admin:file_uploaded` | `AdminEventData` | File uploaded |
| `admin:security_alert` | `AdminEventData` | Security alert |
| `admin:platform_stats` | `AdminEventData` | Platform stats update |

**Example:**
```typescript
// Admin only
socket.on('admin:user_joined', (data) => {
  updateUserCount(prev => prev + 1);
  addToActivityFeed(data);
});

socket.on('admin:platform_stats', (data) => {
  updateAdminDashboard(data.data);
});
```

---

## 📤 Client → Server Events

### Subscriptions

```typescript
// Subscribe to specific channels
socket.emit('subscribe:notifications');
socket.emit('subscribe:files');
socket.emit('subscribe:guardian');
socket.emit('subscribe:workspace', workspaceId);

// Unsubscribe
socket.emit('unsubscribe:workspace', workspaceId);
```

### Ping/Pong (Connection Health)

```typescript
socket.emit('ping');
socket.on('pong', (data) => {
  console.log('Connection alive:', data.timestamp);
});
```

---

## 🚀 Frontend Integration

### React/Next.js Example

#### 1. Create Socket Hook

```typescript
// hooks/useSocket.ts
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io('http://localhost:5000', {
      withCredentials: true,  // ⭐ Send httpOnly cookies
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    });

    socketInstance.on('connected', (data) => {
      console.log('Welcome message:', data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected };
};
```

#### 2. Use in Components

```typescript
// components/NotificationListener.tsx
import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { toast } from '@/hooks/use-toast';

export const NotificationListener = () => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Subscribe to notifications
    socket.emit('subscribe:notifications');

    // Listen for new notifications
    socket.on('notification:new', (data) => {
      console.log('📢 New notification:', data);
      
      toast({
        title: data.title,
        description: data.message,
        variant: data.priority === 'urgent' ? 'destructive' : 'default',
      });
    });

    // Listen for unread count updates
    socket.on('notification:unread_count', (data) => {
      setUnreadCount(data.count);
    });

    return () => {
      socket.off('notification:new');
      socket.off('notification:unread_count');
    };
  }, [socket]);

  return null;  // This is a listener component
};
```

#### 3. Dashboard with Real-Time Stats

```typescript
// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function Dashboard() {
  const { socket } = useSocket();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalShared: 0,
    securityScore: 0,
  });

  useEffect(() => {
    if (!socket) return;

    // Listen for stats updates
    socket.on('stats:update', (data) => {
      setStats(prev => ({ ...prev, ...data }));
    });

    // Listen for new activity
    socket.on('activity:new', (data) => {
      setActivities(prev => [data, ...prev].slice(0, 10));
    });

    return () => {
      socket.off('stats:update');
      socket.off('activity:new');
    };
  }, [socket]);

  return (
    <div>
      <h1>Total Files: {stats.totalFiles}</h1>
      {/* Stats update in real-time! */}
    </div>
  );
}
```

#### 4. AI Guardian with Real-Time Alerts

```typescript
// app/dashboard/guardian/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function AIGuardian() {
  const { socket } = useSocket();
  const [alerts, setAlerts] = useState([]);
  const [riskLevel, setRiskLevel] = useState('low');

  useEffect(() => {
    if (!socket) return;

    socket.emit('subscribe:guardian');

    socket.on('security:alert', (data) => {
      console.log('🛡️ Security Alert:', data);
      setAlerts(prev => [data, ...prev]);
      
      // Show urgent notification
      if (data.severity === 'critical') {
        showUrgentAlert(data.message);
      }
    });

    socket.on('security:risk_level_changed', (data) => {
      setRiskLevel(data.level);
    });

    return () => {
      socket.off('security:alert');
      socket.off('security:risk_level_changed');
    };
  }, [socket]);

  return (
    <div>
      <h2>Risk Level: {riskLevel}</h2>
      {/* Updates in real-time! */}
    </div>
  );
}
```

#### 5. Admin Dashboard with Live Monitoring

```typescript
// app/admin/page.tsx (Admin only)
'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';

export default function AdminDashboard() {
  const { socket } = useSocket();
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new users (admin only)
    socket.on('admin:user_joined', (data) => {
      console.log('👤 New user joined:', data);
      setRecentActivity(prev => [data, ...prev]);
    });

    // Listen for file uploads
    socket.on('admin:file_uploaded', (data) => {
      setRecentActivity(prev => [data, ...prev]);
    });

    // Listen for security alerts
    socket.on('admin:security_alert', (data) => {
      console.log('🚨 Admin Security Alert:', data);
      showAdminAlert(data);
    });

    // Listen for platform stats
    socket.on('admin:platform_stats', (data) => {
      updatePlatformStats(data.data);
    });

    return () => {
      socket.off('admin:user_joined');
      socket.off('admin:file_uploaded');
      socket.off('admin:security_alert');
      socket.off('admin:platform_stats');
    };
  }, [socket]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Live platform monitoring! */}
    </div>
  );
}
```

---

## 📦 Frontend Installation

```bash
npm install socket.io-client
```

---

## 🎨 Complete React Hook

```typescript
// hooks/useBlockRollSocket.ts
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from './use-toast';

interface UseSocketReturn {
  socket: Socket | null;
  connected: boolean;
  subscribe: (channel: string, workspaceId?: string) => void;
  unsubscribe: (channel: string, workspaceId?: string) => void;
}

export const useBlockRollSocket = (): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to BlockRoll real-time server');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
      setConnected(false);
    });

    socketInstance.on('connected', (data) => {
      console.log('Welcome:', data.message);
    });

    // Error handling
    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time server',
        variant: 'destructive',
      });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribe = useCallback((channel: string, workspaceId?: string) => {
    if (!socket) return;
    
    if (workspaceId) {
      socket.emit(`subscribe:${channel}`, workspaceId);
    } else {
      socket.emit(`subscribe:${channel}`);
    }
  }, [socket]);

  const unsubscribe = useCallback((channel: string, workspaceId?: string) => {
    if (!socket) return;
    
    if (workspaceId) {
      socket.emit(`unsubscribe:${channel}`, workspaceId);
    } else {
      socket.emit(`unsubscribe:${channel}`);
    }
  }, [socket]);

  return { socket, connected, subscribe, unsubscribe };
};
```

---

## 🎯 Usage Examples

### Example 1: Real-Time Notifications

```typescript
'use client';

import { useEffect } from 'react';
import { useBlockRollSocket } from '@/hooks/useBlockRollSocket';

export function NotificationBell() {
  const { socket, subscribe } = useBlockRollSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!socket) return;

    subscribe('notifications');

    socket.on('notification:new', (data) => {
      // Show toast
      toast({
        title: data.title,
        description: data.message,
      });
    });

    socket.on('notification:unread_count', (data) => {
      setUnreadCount(data.count);
    });

    return () => {
      socket.off('notification:new');
      socket.off('notification:unread_count');
    };
  }, [socket, subscribe]);

  return (
    <div className="relative">
      <Bell />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
}
```

### Example 2: Live Dashboard

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useBlockRollSocket } from '@/hooks/useBlockRollSocket';

export default function LiveDashboard() {
  const { socket } = useBlockRollSocket();
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalShared: 0,
    activeAutomations: 0,
    securityScore: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Real-time stats updates
    socket.on('stats:update', (data) => {
      setStats(prev => ({ ...prev, ...data }));
    });

    // Real-time activity feed
    socket.on('activity:new', (data) => {
      setActivities(prev => [data, ...prev].slice(0, 5));
    });

    // File uploads
    socket.on('file:uploaded', (data) => {
      setStats(prev => ({ ...prev, totalFiles: prev.totalFiles + 1 }));
    });

    return () => {
      socket.off('stats:update');
      socket.off('activity:new');
      socket.off('file:uploaded');
    };
  }, [socket]);

  return (
    <div>
      <h1>Total Files: {stats.totalFiles}</h1>
      <h2>Recent Activity</h2>
      {activities.map((activity, i) => (
        <div key={i}>{activity.action} - {activity.file}</div>
      ))}
    </div>
  );
}
```

### Example 3: AI Guardian with Live Alerts

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useBlockRollSocket } from '@/hooks/useBlockRollSocket';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AIGuardian() {
  const { socket, subscribe } = useBlockRollSocket();
  const [riskLevel, setRiskLevel] = useState('low');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!socket) return;

    subscribe('guardian');

    socket.on('security:alert', (data) => {
      setAlerts(prev => [data, ...prev]);
      
      // Auto-dismiss low priority after 5 seconds
      if (data.severity === 'low') {
        setTimeout(() => {
          setAlerts(prev => prev.filter(a => a.id !== data.id));
        }, 5000);
      }
    });

    socket.on('security:risk_level_changed', (data) => {
      setRiskLevel(data.level);
    });

    return () => {
      socket.off('security:alert');
      socket.off('security:risk_level_changed');
    };
  }, [socket, subscribe]);

  return (
    <div>
      <div className={`risk-indicator ${riskLevel}`}>
        Risk: {riskLevel}
      </div>
      {alerts.map(alert => (
        <Alert key={alert.id} variant={alert.severity === 'high' ? 'destructive' : 'default'}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
```

---

## 🔧 Advanced Features

### Reconnection Handling

```typescript
const socket = io('http://localhost:5000', {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconnected after ${attemptNumber} attempts`);
  // Resubscribe to channels
  socket.emit('subscribe:notifications');
  socket.emit('subscribe:files');
});
```

### Connection Status Indicator

```typescript
export function ConnectionStatus() {
  const { connected } = useBlockRollSocket();

  return (
    <div className={`status-indicator ${connected ? 'online' : 'offline'}`}>
      {connected ? '🟢 Live' : '🔴 Offline'}
    </div>
  );
}
```

---

## 📊 Performance & Scaling

### Connection Limits

- **Per User:** Multiple tabs = 1 connection per tab
- **Server:** Can handle 10,000+ concurrent connections
- **Redis Adapter:** For horizontal scaling (multi-server)

### Bandwidth Usage

```
Average events per user/minute: 1-5
Average payload size: 500 bytes
Bandwidth: ~2.5 KB/min per user
```

Very lightweight! ✨

---

## 🔍 Debugging

### Client-Side

```typescript
// Enable Socket.IO debug logs
localStorage.debug = 'socket.io-client:*';

// Check connection
console.log('Connected:', socket.connected);
console.log('Socket ID:', socket.id);
```

### Server-Side

```typescript
// In SocketManager
logger.info('Connected clients:', this.getOnlineUsersCount());
logger.info('User online:', this.isUserOnline(userId));
```

---

## 🛡️ Security

✅ **Authentication Required** - All connections must be authenticated  
✅ **User-Specific Rooms** - Users only receive their own events  
✅ **Admin-Only Events** - Admin events only sent to admin role  
✅ **httpOnly Cookie Auth** - Secure authentication  
✅ **CORS Configured** - Only allowed origins  

---

## 📋 Event Summary

### Critical Real-Time Events:
1. ✅ **Notifications** - Instant delivery
2. ✅ **File Sharing** - Immediate alerts
3. ✅ **Security Alerts** - Real-time threats
4. ✅ **Dashboard Stats** - Live updates
5. ✅ **Activity Feed** - Real-time stream
6. ✅ **Admin Monitoring** - Live platform oversight

### REST API Still Used For:
- File uploads (large payloads)
- File downloads
- Initial data loading
- Historical data queries
- CRUD operations

---

**Real-time magic for BlockRoll! ⚡**

