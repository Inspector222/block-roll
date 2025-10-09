/**
 * BlockRoll WebSocket Manager
 * Handles real-time connections and events
 */

import { io, Socket } from 'socket.io-client';
import { WebSocketEventName, WebSocketEvents } from './types';

export class WebSocketManager {
  private socket: Socket | null = null;
  private listeners = new Map<string, Set<Function>>();
  private apiKey: string;
  private baseURL: string;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    // Convert HTTP URL to WebSocket URL
    this.baseURL = baseURL.replace(/^http/, 'ws').replace(/\/v1$/, '');
  }

  /**
   * Connect to WebSocket server
   */
  connect(): void {
    if (this.socket?.connected) {
      console.log('[BlockRoll WS] Already connected');
      return;
    }

    console.log('[BlockRoll WS] Connecting to', this.baseURL);

    this.socket = io(this.baseURL, {
      auth: {
        apiKey: this.apiKey,
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupSocketListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('[BlockRoll WS] Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.reconnectAttempts = 0;
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected && this.socket?.connected === true;
  }

  /**
   * Subscribe to an event
   */
  on<E extends WebSocketEventName>(
    event: E,
    callback: WebSocketEvents[E]
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.delete(callback);
        if (eventListeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  /**
   * Emit event to all listeners
   */
  private emit(event: string, data: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[BlockRoll WS] Error in ${event} listener:`, error);
        }
      });
    }
  }

  /**
   * Setup socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      console.log('[BlockRoll WS] ✅ Connected');
      this.emit('connect', null);
    });

    this.socket.on('disconnect', (reason) => {
      this.connected = false;
      console.log('[BlockRoll WS] ⚠️ Disconnected:', reason);
      this.emit('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++;
      console.error('[BlockRoll WS] ❌ Connection error:', error.message);
      this.emit('error', error);

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('[BlockRoll WS] Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('[BlockRoll WS] 🔄 Reconnected after', attemptNumber, 'attempts');
      this.emit('reconnect', attemptNumber);
    });

    // Notification events
    this.socket.on('notification:new', (notification) => {
      console.log('[BlockRoll WS] 📬 New notification:', notification.type);
      this.emit('notification:new', notification);
    });

    // File events
    this.socket.on('file:uploaded', (file) => {
      console.log('[BlockRoll WS] 📤 File uploaded:', file.id);
      this.emit('file:uploaded', file);
    });

    this.socket.on('file:shared', (data) => {
      console.log('[BlockRoll WS] 🔗 File shared:', data.fileId);
      this.emit('file:shared', data);
    });

    this.socket.on('file:revoked', (data) => {
      console.log('[BlockRoll WS] 🚫 Access revoked:', data.fileId);
      this.emit('file:revoked', data);
    });

    // Workspace events
    this.socket.on('workspace:member_added', (data) => {
      console.log('[BlockRoll WS] 👥 Member added to workspace:', data.workspaceId);
      this.emit('workspace:member_added', data);
    });

    // Security events
    this.socket.on('security:alert', (alert) => {
      console.log('[BlockRoll WS] 🚨 Security alert:', alert.severity);
      this.emit('security:alert', alert);
    });
  }

  /**
   * Send custom event (if needed for future features)
   */
  emit(event: string, data: any): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }
}

