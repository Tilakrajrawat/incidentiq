import { useEffect, useRef, useState } from "react";
import SeverityBadge from "./SeverityBadge.jsx";
import { subscribe, unsubscribe, subscribeConnection, unsubscribeConnection } from "../lib/websocket";

const eventMeta = {
  incident_created: "New incident created",
  incident_escalated: "Incident escalated",
  incident_updated: "Incident updated",
  incident_resolved: "Incident resolved"
};

export default function RealTimeAlert() {
  const [alerts, setAlerts] = useState([]);
  const lastConnectionState = useRef(null);

  useEffect(() => {
    const handlers = Object.keys(eventMeta).map((event) => {
      const handler = (incident) => {
        setAlerts((prev) => [...prev, { id: crypto.randomUUID(), event, incident, kind: "incident" }]);
      };
      subscribe(event, handler);
      return { event, handler };
    });

    const onConnectionChange = (connected) => {
      if (lastConnectionState.current === null) {
        lastConnectionState.current = connected;
        return;
      }

      if (lastConnectionState.current !== connected) {
        setAlerts((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            kind: "system",
            message: connected ? "Realtime connection restored." : "Realtime disconnected. Reconnecting...",
            tone: connected ? "success" : "warning"
          }
        ]);
        lastConnectionState.current = connected;
      }
    };

    subscribeConnection(onConnectionChange);

    return () => {
      handlers.forEach(({ event, handler }) => unsubscribe(event, handler));
      unsubscribeConnection(onConnectionChange);
    };
  }, []);

  useEffect(() => {
    if (!alerts.length) return;
    const timer = setTimeout(() => setAlerts((prev) => prev.slice(1)), 4000);
    return () => clearTimeout(timer);
  }, [alerts]);

  return (
    <div className="toast-stack">
      {alerts.map((alert) => (
        <div key={alert.id} className={`card toast ${alert.kind === "system" ? `toast-${alert.tone}` : ""}`}>
          {alert.kind === "system" ? (
            <strong>{alert.message}</strong>
          ) : (
            <>
              <strong>{eventMeta[alert.event]}</strong>
              <div className="toast-row">
                <span>{alert.incident?.title}</span>
                <SeverityBadge severity={alert.incident?.severity || "LOW"} />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
