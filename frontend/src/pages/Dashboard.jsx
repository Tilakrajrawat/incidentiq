import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth.jsx";
import api from "../lib/api";
import StatusBadge from "../components/StatusBadge.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ open: 0, critical: 0, recentCreated: [], recentResolved: [] });

  useEffect(() => {
    const loadMetrics = async () => {
      const [openRes, criticalRes, createdRes, resolvedRes] = await Promise.all([
        api.get("/api/incidents", { params: { status: "open", page: 1, limit: 1 } }),
        api.get("/api/incidents", { params: { severity: "critical", page: 1, limit: 1 } }),
        api.get("/api/incidents", { params: { page: 1, limit: 5 } }),
        api.get("/api/incidents", { params: { status: "resolved", page: 1, limit: 5 } })
      ]);

      setMetrics({
        open: openRes.data.total || 0,
        critical: criticalRes.data.total || 0,
        recentCreated: createdRes.data.incidents || [],
        recentResolved: resolvedRes.data.incidents || []
      });
    };

    loadMetrics();
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.name}</strong>.</p>

      <div className="stats-grid">
        <div className="card"><h3>Open Incidents</h3><p className="metric">{metrics.open}</p></div>
        <div className="card"><h3>Critical Incidents</h3><p className="metric">{metrics.critical}</p></div>
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3>Recently Created</h3>
          {metrics.recentCreated.map((incident) => (
            <p key={incident._id} className="compact-item">{incident.title} <StatusBadge status={incident.status} /></p>
          ))}
        </div>
        <div className="card">
          <h3>Recently Resolved</h3>
          {metrics.recentResolved.map((incident) => (
            <p key={incident._id} className="compact-item">{incident.title} <StatusBadge status={incident.status} /></p>
          ))}
        </div>
      </div>
    </div>
  );
}
