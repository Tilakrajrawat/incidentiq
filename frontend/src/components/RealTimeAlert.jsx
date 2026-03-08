import { useEffect, useState } from "react";
import SeverityBadge from "./SeverityBadge.jsx";
import { subscribe, unsubscribe } from "../lib/websocket";

export default function RealTimeAlert() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const onIncidentCreated = (incident) => {
      setAlerts((prev) => [...prev, { id: crypto.randomUUID(), type: "New Incident", incident }]);
    };

    const onIncidentEscalated = (incident) => {
      setAlerts((prev) => [...prev, { id: crypto.randomUUID(), type: "Escalated Incident", incident }]);
    };

    subscribe("incident_created", onIncidentCreated);
    subscribe("incident_escalated", onIncidentEscalated);

    return () => {
      unsubscribe("incident_created", onIncidentCreated);
      unsubscribe("incident_escalated", onIncidentEscalated);
    };
  }, []);

  useEffect(() => {
    if (!alerts.length) return;
    const timer = setTimeout(() => {
      setAlerts((prev) => prev.slice(1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [alerts]);

  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 1000, display: "grid", gap: "0.5rem" }}>
      {alerts.map((alert) => (
        <div key={alert.id} className="card" style={{ minWidth: 280 }}>
          <strong>{alert.type}</strong>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
            <span>{alert.incident?.title}</span>
            <SeverityBadge severity={alert.incident?.severity || "LOW"} />
          </div>
        </div>
      ))}
    </div>
  );
}
