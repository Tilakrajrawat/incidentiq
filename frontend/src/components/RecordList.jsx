import { useAuth } from "../lib/auth.jsx";
import IncidentCard from "./IncidentCard.jsx";

export default function RecordList({ records, onDelete }) {
  const { user } = useAuth();

  if (!records.length) {
    return <p>No incidents found for the current filters.</p>;
  }

  return (
    <div className="record-list">
      {records.map((incident) => (
        <div key={incident._id} className="record-list-item">
          <IncidentCard incident={incident} />
          {user?.role === "admin" && (
            <button className="btn danger" onClick={() => onDelete(incident._id)} disabled={incident.status !== "open"}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
