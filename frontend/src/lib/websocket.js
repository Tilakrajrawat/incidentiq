const listeners = new Map();
let socket;
let reconnectTimer;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return apiUrl.replace(/^http/, "ws");
};

const connect = () => {
  socket = new WebSocket(getSocketUrl());

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
    reconnectTimer = setTimeout(connect, 3000);
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

export const disconnect = () => {
  clearTimeout(reconnectTimer);
  if (socket) socket.close();
};
