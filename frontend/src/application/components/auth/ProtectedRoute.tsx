import { useAuthStore } from "@/application/stores/auth.store";
import { Navigate, Outlet } from "react-router";

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) return <Navigate to="/login" replace />;

  return <Outlet />;
};
