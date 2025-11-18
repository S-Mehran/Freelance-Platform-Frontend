import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function RoleBasedRoute({ allowedRole, children }) {
  const { user, loading } = useAuth();

  // Wait for context to initialize
  if (loading) return <p>Loading...</p>;

  // Debug: log user/role — remove or guard behind env flag if noisy in production
  // eslint-disable-next-line no-console
  console.log("RoleBasedRoute: allowedRole=", allowedRole, "user=", user, "loading=", loading);

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/" replace />;

  return children;
}
