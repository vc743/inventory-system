import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Router from "@/application/router/router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#ffffff"
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff"
            }
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff"
            }
          }
        }}
      />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
