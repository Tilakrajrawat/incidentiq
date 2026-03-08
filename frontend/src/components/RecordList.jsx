import IncidentCard from "./IncidentCard.jsx";

export default function RecordList({ records, onDelete }) {
    if (!records.length) {
      return <p>No incidents yet. Create one to get started.</p>;
    }
  
    return (
      <div className="record-list">
        {records.map((r) => (
            <div key={r._id}>
              <IncidentCard incident={r} />
              <button className="btn danger" onClick={() => onDelete(r._id)} disabled={r.status !== "open"}>
                Delete
              </button>
            </div>
        ))}
      </div>
    );
  }
  
