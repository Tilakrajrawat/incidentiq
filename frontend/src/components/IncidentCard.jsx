import { useNavigate } from "react-router-dom";
import SeverityBadge from "./SeverityBadge.jsx";

export default function IncidentCard({ incident }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate(`/incidents/${incident._id}`)}>
      <div className="record-header">
        <h3>{incident.title}</h3>
        <SeverityBadge severity={incident.severity || "LOW"} />
      </div>
      <p className="record-content">Status: {String(incident.status || "open").toUpperCase()}</p>
      <p className="record-content">Assigned: {incident.assignedTo?.name || "Unassigned"}</p>
      <small className="record-meta">Created: {new Date(incident.createdAt).toLocaleString()}</small>
    </div>
  );
}
