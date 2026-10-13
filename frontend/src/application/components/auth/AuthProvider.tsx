import { useAuthStore } from "@/application/stores/auth.store";
import { getProfile } from "@/infrastructure/api/auth/auth";
import { useQuery } from "@tanstack/react-query";
import { useEffect, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const token = useAuthStore((state) => state.token);
  const setAuth = useAuthStore((state) => state.setAuth);
  const logout = useAuthStore((state) => state.logout);

  const { data, isError, isPending } = useQuery({
    queryKey: ["auth-profile"],
    queryFn: getProfile,
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setAuth(data, token!);
    }

    if (isError) logout();
  }, [data, isError]);

  if (!!token && isPending) {
    return <h2 className="text-3xl font-bold">Cargando...</h2>;
  }

  return children;
};

export default AuthProvider;
