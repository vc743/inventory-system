import { useEffect } from "react";
import { toast } from "sonner";

export const useNetworkStatus = () => {
  useEffect(() => {
    const handleOnline = () => {
      toast.success("Conexión restablecida", {
        id: "network-status",
        duration: 3000,
      });
    };
    const handleOffline = () => {
      toast.error("Sin conexión a internet", {
        id: "network-status",
        duration: Infinity,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
};
