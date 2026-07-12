import { Navigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthProvider";

export default function AdminRoute({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}