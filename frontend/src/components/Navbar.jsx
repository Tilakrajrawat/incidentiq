import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth.jsx";
import WebSocketIndicator from "./WebSocketIndicator.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <span className="nav-title">IncidentIQ</span>
        {user && (
          <>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/incidents" className="nav-link">Incidents</Link>
            {user.role === "admin" && (
              <Link to="/analytics" className="nav-link">Analytics</Link>
            )}
          </>
        )}
      </div>
      <div className="nav-right">
        {user && (
          <>
            <WebSocketIndicator />
            <span className="pill">{user.role}</span>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
