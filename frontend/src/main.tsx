import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import Router from "@/application/router/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "sonner";
import AuthProvider from "./application/components/auth/AuthProvider";
import { TooltipProvider } from "@/application/components/ui/tooltip";
import { NetworkStatus } from "@/application/components/networkStatus/NetworkStatus";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </TooltipProvider>
      {/* Un solo Toaster en la raíz: si hubiera dos, cada toast saldría duplicado. */}
      <Toaster
        position="bottom-right"
        duration={3000}
        richColors
        toastOptions={{ style: { fontFamily: "inherit" } }}
      />
      <NetworkStatus />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
);
