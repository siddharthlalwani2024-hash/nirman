import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (user === null) {
    return <div className="min-h-screen flex items-center justify-center bg-ivory text-ink/60 font-sans">Loading…</div>;
  }
  if (user === false) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
