import { useEffect, useState } from "react";
import SeverityBadge from "./SeverityBadge.jsx";
import { subscribe, unsubscribe } from "../lib/websocket";

const eventMeta = {
  incident_created: "New incident created",
  incident_escalated: "Incident escalated",
  incident_updated: "Incident updated",
  incident_resolved: "Incident resolved"
};

export default function RealTimeAlert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const handlers = Object.keys(eventMeta).map((event) => {
      const handler = (incident) => {
        setAlerts((prev) => [...prev, { id: crypto.randomUUID(), event, incident }]);
      };
      subscribe(event, handler);
      return { event, handler };
    });

    return () => {
      handlers.forEach(({ event, handler }) => unsubscribe(event, handler));
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
        <div key={alert.id} className="card toast">
          <strong>{eventMeta[alert.event]}</strong>
          <div className="toast-row">
            <span>{alert.incident?.title}</span>
            <SeverityBadge severity={alert.incident?.severity || "LOW"} />
          </div>
        </div>
      ))}
    </div>
  );
}
