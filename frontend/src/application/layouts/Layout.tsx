import type { CSSProperties } from "react";
import { Outlet } from "react-router";
import Sidebar from "@/application/components/layout/Sidebar";
import Topbar from "@/application/components/layout/Topbar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/application/components/ui/sidebar";

// shadcn guarda el estado del sidebar en esta cookie, pero en una SPA nadie
// la lee al cargar. La leemos aquí: por defecto arranca colapsado (solo íconos).
const sidebarStartsOpen = document.cookie.includes("sidebar_state=true");

const Layout = () => {
  return (
    <SidebarProvider
      defaultOpen={sidebarStartsOpen}
      style={{ "--sidebar-width-icon": "3.5rem" } as CSSProperties}
    >
      <Sidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
