import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/api";
import SeverityBadge from "../components/SeverityBadge.jsx";

export default function IncidentDetail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/api/incidents/${id}`);
      setIncident(res.data || null);
    };

    load();
  }, [id]);

  if (!incident) return <p>Incident not found.</p>;

  return (
    <div className="page">
      <h1>{incident.title}</h1>
      <p><SeverityBadge severity={incident.severity} /></p>
      <p>Status: {String(incident.status).toUpperCase()}</p>
      <p>{incident.content}</p>
    </div>
  );
}
