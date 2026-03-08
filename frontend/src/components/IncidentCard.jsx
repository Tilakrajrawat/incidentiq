import { useNavigate } from "react-router-dom";
import SeverityBadge from "./SeverityBadge.jsx";
import StatusBadge from "./StatusBadge.jsx";
import SlaBadge from "./SlaBadge.jsx";

export default function IncidentCard({ incident }) {
  const navigate = useNavigate();

  return (
    <div
      className="card incident-card"
      onClick={() => navigate(`/incidents/${incident._id}`)}
    >
      <div className="record-header">
        <h3>{incident.title}</h3>
        <div className="badge-row">
          <SeverityBadge severity={incident.severity || "LOW"} />
          <StatusBadge status={incident.status || "open"} />
        </div>
      </div>

      <p className="record-content">
        {incident.content || "No description provided."}
      </p>

      <p className="record-content">
        <strong>Assigned:</strong> {incident.assignedTo?.name || "Unassigned"}
      </p>

      <SlaBadge incident={incident} />

      <small className="record-meta">
        Created: {new Date(incident.createdAt).toLocaleString()}
      </small>
    </div>
  );
}