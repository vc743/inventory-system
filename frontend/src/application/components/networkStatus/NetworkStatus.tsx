import { useNetworkStatus } from "@/application/hooks/useNetworkStatus"

export const NetworkStatus = () => {
  useNetworkStatus();
  return null;
}
