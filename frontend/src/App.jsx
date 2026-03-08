import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Records from "./pages/Records.jsx";
import IncidentDetail from "./pages/IncidentDetail.jsx";
import Analytics from "./pages/Analytics.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

const withLayout = (Component, allowedRoles) => (
  <ProtectedRoute allowedRoles={allowedRoles}>
    <Layout>
      <Component />
    </Layout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={withLayout(Dashboard)} />
      <Route path="/incidents" element={withLayout(Records)} />
      <Route path="/incidents/:id" element={withLayout(IncidentDetail)} />
      <Route path="/analytics" element={withLayout(Analytics, ["admin"])} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
