import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import SeverityBadge from "../components/SeverityBadge.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import SlaBadge from "../components/SlaBadge.jsx";
import { useAuth } from "../lib/auth.jsx";

const statusOptions = ["open", "acknowledged", "in_progress", "resolved", "closed"];

export default function IncidentDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [incident, setIncident] = useState(null);
  const [responders, setResponders] = useState([]);
  const [status, setStatus] = useState("open");
  const [assignedTo, setAssignedTo] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);

  const canAssign = useMemo(() => ["admin", "responder"].includes(user?.role), [user?.role]);
  const canUpdateStatus = useMemo(() => ["admin", "responder"].includes(user?.role), [user?.role]);

  const loadIncident = async () => {
    const res = await api.get(`/api/incidents/${id}`);
    setIncident(res.data || null);
    setStatus(res.data?.status || "open");
    setAssignedTo(res.data?.assignedTo?._id || "");
  };

  const loadAttachments = async () => {
    const res = await api.get(`/api/incidents/${id}/attachments`);
    setAttachments(res.data.attachments || []);
  };

  const loadResponders = async () => {
    if (!canAssign) return;
    try {
      const res = await api.get("/api/auth/responders");
      setResponders(res.data.responders || []);
    } catch {
      setResponders([]);
    }
  };

  const saveUpdates = async () => {
    const payload = {};
    if (canUpdateStatus && status !== incident.status) payload.status = status;
    if (canAssign) payload.assignedTo = assignedTo || null;
    if (!Object.keys(payload).length) return;

    const res = await api.put(`/api/incidents/${id}`, payload);
    setIncident(res.data);
  };

  const uploadAttachment = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const contentBase64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await api.post(`/api/incidents/${id}/attachments`, { fileName: file.name, contentBase64 });
      await loadAttachments();
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const downloadAttachment = async (fileName) => {
    const encoded = encodeURIComponent(fileName);
    const response = await api.get(`/api/incidents/${id}/attachments/${encoded}`, { responseType: "blob" });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadIncident();
    loadAttachments();
  }, [id]);

  useEffect(() => {
    loadResponders();
  }, [canAssign]);

  if (!incident) return <p>Incident not found.</p>;

  return (
    <div className="page">
      <h1>{incident.title}</h1>
      <div className="badge-row">
        <SeverityBadge severity={incident.severity} />
        <StatusBadge status={incident.status} />
        <SlaBadge incident={incident} showRemaining />
      </div>
      <p className="record-content">{incident.content || "No description provided."}</p>

      {(canAssign || canUpdateStatus) && (
        <div className="card detail-grid">
          {canUpdateStatus && (
            <label>
              Status
              <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          )}
          {canAssign && (
            <label>
              Assigned responder
              <select className="input" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                <option value="">Unassigned</option>
                {responders.map((responder) => (
                  <option key={responder._id} value={responder._id}>{responder.name} ({responder.role})</option>
                ))}
              </select>
            </label>
          )}
          <button className="btn primary" onClick={saveUpdates}>Save Changes</button>
        </div>
      )}

      <div className="card">
        <h3>Attachments</h3>
        <label className="btn">
          {uploading ? "Uploading..." : "Upload attachment"}
          <input type="file" className="hidden-input" onChange={uploadAttachment} disabled={uploading} />
        </label>
        <div className="attachments-list">
          {attachments.map((file) => (
            <button key={file.fileName} className="attachment-link" onClick={() => downloadAttachment(file.fileName)}>
              {file.fileName} ({Math.round(file.size / 1024)} KB)
            </button>
          ))}
          {!attachments.length && <p className="muted">No attachments yet.</p>}
        </div>
      </div>

      <div className="card">
        <h3>Incident Lifecycle</h3>
        <ul className="timeline">
          <li><strong>Created:</strong> {new Date(incident.createdAt).toLocaleString()}</li>
          <li><strong>Acknowledged:</strong> {incident.acknowledgedAt ? new Date(incident.acknowledgedAt).toLocaleString() : "Not yet"}</li>
          <li><strong>Resolved:</strong> {incident.resolvedAt ? new Date(incident.resolvedAt).toLocaleString() : "Not yet"}</li>
          <li><strong>Last Updated:</strong> {new Date(incident.updatedAt).toLocaleString()}</li>
        </ul>
      </div>
    </div>
  );
}
