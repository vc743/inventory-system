import {
  Box,
  LayoutDashboard,
  Package,
  Tags,
  ArrowLeftRight,
  TriangleAlert,
  FileBarChart,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar as SidebarPrimitive,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/application/components/ui/sidebar";
import { useAuthStore } from "@/application/stores/auth.store";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Productos", path: "/products", icon: Package },
  { label: "Categorías", path: "/categories", icon: Tags },
  { label: "Movimientos", path: "/movements", icon: ArrowLeftRight },
  { label: "Alertas", path: "/alerts", icon: TriangleAlert },
  { label: "Reportes", path: "/reports", icon: FileBarChart },
];

const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  const initials = user?.fullName
    ?.split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <SidebarPrimitive collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
            <Box className="h-4.5 w-4.5 text-sidebar-primary-foreground" />
          </div>
          <span className="font-heading truncate text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            StockFlow
          </span>
          <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    render={
                      <Link
                        to={item.path}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                    isActive={pathname === item.path}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            {initials}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.fullName}
            </p>
            <p className="truncate text-xs text-sidebar-foreground/60">
              {user?.email}
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            aria-label="Cerrar sesión"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarPrimitive>
  );
};

export default Sidebar;
