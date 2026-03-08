const listeners = new Map();
const connectionListeners = new Set();
let socket;
let reconnectTimer;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return apiUrl.replace(/^http/, "ws");
};

const notifyConnectionStatus = (connected) => {
  connectionListeners.forEach((listener) => listener(connected));
};

const connect = () => {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  clearTimeout(reconnectTimer);
  socket = new WebSocket(getSocketUrl());

  socket.onopen = () => notifyConnectionStatus(true);

  socket.onmessage = (message) => {
    try {
      const payload = JSON.parse(message.data);
      const callbacks = listeners.get(payload.event) || [];
      callbacks.forEach((callback) => callback(payload.data));
    } catch {
      // ignore malformed events
    }
  };

  socket.onclose = () => {
    notifyConnectionStatus(false);
    reconnectTimer = setTimeout(connect, 3000);
  };

  socket.onerror = () => {
    notifyConnectionStatus(false);
  };
};

export const subscribe = (event, callback) => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    connect();
  }

  const callbacks = listeners.get(event) || [];
  listeners.set(event, [...callbacks, callback]);
};

export const unsubscribe = (event, callback) => {
  const callbacks = listeners.get(event) || [];
  if (!callback) {
    listeners.delete(event);
    return;
  }

  listeners.set(
    event,
    callbacks.filter((entry) => entry !== callback)
  );
};

export const subscribeConnection = (callback) => {
  connectionListeners.add(callback);
  callback(Boolean(socket && socket.readyState === WebSocket.OPEN));
  connect();
};

export const unsubscribeConnection = (callback) => {
  connectionListeners.delete(callback);
};

export const disconnect = () => {
  clearTimeout(reconnectTimer);
  if (socket) socket.close();
};
