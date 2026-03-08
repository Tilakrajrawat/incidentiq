import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { getApiErrorMessage } from "../lib/errors";
import ErrorBanner from "../components/ErrorBanner.jsx";

function BarChart({ title, data, xKey, yKey }) {
  const max = Math.max(...data.map((item) => item[yKey]), 1);

  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="bar-chart">
        {data.map((item) => (
          <div key={item[xKey]} className="bar-item">
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${(item[yKey] / max) * 100}%` }} />
            </div>
            <div className="bar-meta">
              <span>{item[xKey]}</span>
              <strong>{item[yKey]}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [summary, setSummary] = useState({ bySeverity: [], byStatus: [] });
  const [trend, setTrend] = useState([]);
  const [resolutionTime, setResolutionTime] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const [summaryRes, trendsRes, resolutionRes] = await Promise.all([
          api.get("/api/analytics/summary"),
          api.get("/api/analytics/trends"),
          api.get("/api/analytics/resolution-time")
        ]);

        setSummary(summaryRes.data);
        setTrend(trendsRes.data || []);
        setResolutionTime(resolutionRes.data || []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Failed to load analytics data."));
      }
    };

    load();
  }, []);

  const trendPoints = useMemo(() => {
    const max = Math.max(...trend.map((item) => item.count), 1);
    return trend.map((item, index) => {
      const x = (index / Math.max(trend.length - 1, 1)) * 100;
      const y = 100 - (item.count / max) * 100;
      return `${x},${y}`;
    }).join(" ");
  }, [trend]);

  return (
    <div className="page">
      <h1>Analytics</h1>
      <ErrorBanner message={error} />
      <div className="analytics-grid">
        <BarChart
          title="Incidents by Severity"
          data={summary.bySeverity.map((item) => ({ label: item._id, count: item.count }))}
          xKey="label"
          yKey="count"
        />
        <BarChart
          title="Incidents by Status"
          data={summary.byStatus.map((item) => ({ label: item._id, count: item.count }))}
          xKey="label"
          yKey="count"
        />
        <div className="card">
          <h3>7-Day Incident Trend</h3>
          <svg viewBox="0 0 100 100" className="line-chart" preserveAspectRatio="none">
            <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={trendPoints} />
          </svg>
          <div className="trend-labels">
            {trend.map((item) => <span key={item.date}>{item.date.slice(5)}</span>)}
          </div>
        </div>
        <BarChart
          title="Average Resolution Time (Minutes)"
          data={resolutionTime.map((item) => ({ label: item._id, count: Math.round(item.averageResolutionMinutes || 0) }))}
          xKey="label"
          yKey="count"
        />
      </div>
    </div>
  );
}
