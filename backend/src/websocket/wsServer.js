import { WebSocketServer } from "ws";

let wss;

export const initWebSocketServer = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    socket.on("close", () => {
      // connection closed gracefully
    });
  });

  return wss;
};

export const broadcast = (event, data) => {
  const supportedEvents = new Set([
    "incident_created",
    "incident_updated",
    "incident_escalated",
    "incident_resolved"
  ]);

  if (!wss || !supportedEvents.has(event)) return;

  const payload = JSON.stringify({ event, data });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
};
