import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // Wait until loading completes before deciding
  if (loading) return <p>Loading...</p>;

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
}
