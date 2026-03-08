import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../lib/auth.jsx";
import api from "../lib/api";
import { getApiErrorMessage } from "../lib/errors";
import StatusBadge from "../components/StatusBadge.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import SimpleBarChart from "../components/SimpleBarChart.jsx";
import SimpleTrendChart from "../components/SimpleTrendChart.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({ open: 0, critical: 0, recentCreated: [], recentResolved: [] });
  const [summary, setSummary] = useState({ bySeverity: [], byStatus: [] });
  const [trend, setTrend] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      setError("");
      setLoading(true);
      try {
        const [openRes, criticalRes, createdRes, resolvedRes] = await Promise.all([
          api.get("/api/incidents", { params: { status: "open", page: 1, limit: 1 } }),
          api.get("/api/incidents", { params: { severity: "critical", page: 1, limit: 1 } }),
          api.get("/api/incidents", { params: { page: 1, limit: 10 } }),
          api.get("/api/incidents", { params: { status: "resolved", page: 1, limit: 10 } })
        ]);

        setMetrics({
          open: openRes.data.total || 0,
          critical: criticalRes.data.total || 0,
          recentCreated: createdRes.data.incidents || [],
          recentResolved: resolvedRes.data.incidents || []
        });
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Failed to load dashboard metrics."));
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") return;

    const loadCharts = async () => {
      try {
        const [summaryRes, trendRes] = await Promise.all([
          api.get("/api/analytics/summary"),
          api.get("/api/analytics/trends")
        ]);

        setSummary(summaryRes.data || { bySeverity: [], byStatus: [] });
        setTrend(trendRes.data || []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Failed to load analytics widgets."));
      }
    };

    loadCharts();
  }, [user?.role]);

  const recentActivity = useMemo(() => {
    const createdEvents = metrics.recentCreated.map((incident) => ({
      id: `created-${incident._id}`,
      type: "Incident created",
      title: incident.title,
      at: incident.createdAt
    }));

    const resolvedEvents = metrics.recentResolved.map((incident) => ({
      id: `resolved-${incident._id}`,
      type: "Incident resolved",
      title: incident.title,
      at: incident.resolvedAt || incident.updatedAt
    }));

    const escalatedEvents = metrics.recentCreated
      .filter((incident) => incident.escalated)
      .map((incident) => ({
        id: `escalated-${incident._id}`,
        type: "Incident escalated",
        title: incident.title,
        at: incident.updatedAt
      }));

    return [...createdEvents, ...resolvedEvents, ...escalatedEvents]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 10);
  }, [metrics]);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.name}</strong>.</p>
      <ErrorBanner message={error} />
      {loading && <p className="muted">Loading dashboard data...</p>}

      <div className="stats-grid">
        <div className="card"><h3>Open Incidents</h3><p className="metric">{metrics.open}</p></div>
        <div className="card"><h3>Critical Incidents</h3><p className="metric">{metrics.critical}</p></div>
      </div>

      {user?.role === "admin" && (
        <div className="stats-grid">
          <SimpleBarChart
            title="Incidents by Severity"
            data={summary.bySeverity.map((item) => ({ label: item._id, count: item.count }))}
          />
          <SimpleBarChart
            title="Incidents by Status"
            data={summary.byStatus.map((item) => ({ label: item._id, count: item.count }))}
          />
          <SimpleTrendChart data={trend} />
        </div>
      )}

      <div className="stats-grid">
        <div className="card">
          <h3>Recently Created</h3>
          {metrics.recentCreated.slice(0, 5).map((incident) => (
            <p key={incident._id} className="compact-item">{incident.title} <StatusBadge status={incident.status} /></p>
          ))}
        </div>
        <div className="card">
          <h3>Recently Resolved</h3>
          {metrics.recentResolved.slice(0, 5).map((incident) => (
            <p key={incident._id} className="compact-item">{incident.title} <StatusBadge status={incident.status} /></p>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 && <p className="muted">No activity yet.</p>}
        {recentActivity.map((activity) => (
          <p key={activity.id} className="compact-item">
            <span>{activity.type}: {activity.title}</span>
            <small className="record-meta">{new Date(activity.at).toLocaleString()}</small>
          </p>
        ))}
      </div>
    </div>
  );
}
