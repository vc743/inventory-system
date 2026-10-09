import { useAuthStore } from "@/application/stores/auth.store";
import { Navigate, Outlet } from "react-router";

export const PublicRoute = () => {
  const token = useAuthStore((state) => state.token);

  if (token) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
