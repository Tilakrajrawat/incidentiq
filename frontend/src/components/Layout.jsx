import Navbar from "./Navbar.jsx";
import RealTimeAlert from "./RealTimeAlert.jsx";

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <RealTimeAlert />
      <main className="app-main">{children}</main>
    </div>
  );
}
