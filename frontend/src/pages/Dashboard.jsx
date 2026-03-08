import { useAuth } from "../lib/auth.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p>Welcome, <strong>{user?.name}</strong>.</p>
      <p>Your role: <strong>{user?.role || "reporter"}</strong>.</p>
      <p>
        IncidentIQ now supports incident severity and status tracking with API compatibility for
        <code> /api/incidents</code>. You can create, update, and retrieve incidents with severity levels (low, medium, high) and status (open, in progress, resolved). This allows for better incident management and prioritization.
      </p>
    </div>
  );
}
