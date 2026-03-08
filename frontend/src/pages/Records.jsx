import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { getApiErrorMessage } from "../lib/errors";
import RecordForm from "../components/RecordForm.jsx";
import RecordList from "../components/RecordList.jsx";
import ErrorBanner from "../components/ErrorBanner.jsx";
import { useAuth } from "../lib/auth.jsx";

const defaultFilters = {
  severity: "",
  status: "",
  assignedTo: "",
  q: ""
};

export default function Records() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [responders, setResponders] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState("");

  const params = useMemo(() => ({ page, limit: 10, ...filters }), [page, filters]);

  const loadRecords = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/incidents", { params });
      setRecords(res.data.incidents || []);
      setPages(res.data.pages || 1);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Failed to load incidents."));
    } finally {
      setLoading(false);
    }
  };

  const loadResponders = async () => {
    if (!["admin", "responder"].includes(user?.role)) return;
    try {
      const res = await api.get("/api/auth/responders");
      setResponders(res.data.responders || []);
    } catch (requestError) {
      setResponders([]);
      setError(getApiErrorMessage(requestError, "Failed to load responders."));
    }
  };

  const createRecord = async (data) => {
    try {
      await api.post("/api/incidents", data);
      setPage(1);
      await loadRecords();
    } catch (requestError) {
      throw new Error(getApiErrorMessage(requestError, "Could not create incident."));
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/api/incidents/${id}`);
      await loadRecords();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not delete incident."));
    }
  };

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  useEffect(() => {
    loadResponders();
  }, [user?.role]);

  useEffect(() => {
    loadRecords();
  }, [params]);

  return (
    <div className="page">
      <h1>Incident Queue</h1>
      <p className="muted">Search and filter incidents by severity, status, assignment, and text.</p>
      <ErrorBanner message={error} />

      {user?.role !== "responder" && <RecordForm onCreate={createRecord} />}

      <div className="card filters-grid">
        <input className="input" placeholder="Search title/content" value={filters.q} onChange={(e) => onFilterChange("q", e.target.value)} />
        <select className="input" value={filters.severity} onChange={(e) => onFilterChange("severity", e.target.value)}>
          <option value="">All severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className="input" value={filters.status} onChange={(e) => onFilterChange("status", e.target.value)}>
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <select className="input" value={filters.assignedTo} onChange={(e) => onFilterChange("assignedTo", e.target.value)}>
          <option value="">All assignees</option>
          <option value="unassigned">Unassigned</option>
          {responders.map((responder) => (
            <option key={responder._id} value={responder._id}>{responder.name}</option>
          ))}
        </select>
      </div>

      {loading ? <p>Loading...</p> : <RecordList records={records} onDelete={deleteRecord} />}

      <div className="pagination-row">
        <button className="btn" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Previous</button>
        <span className="muted">Page {page} of {pages}</span>
        <button className="btn" disabled={page >= pages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
      </div>
    </div>
  );
}
