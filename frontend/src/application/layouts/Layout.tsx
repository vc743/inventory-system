import { Outlet } from "react-router";
import Sidebar from "@/application/components/layout/Sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/application/components/ui/sidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className="flex items-center border-b border-border px-4 py-3 md:hidden">
          <SidebarTrigger />
        </div>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
