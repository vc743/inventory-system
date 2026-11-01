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
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/application/components/ui/sidebar";
import { LogoSymbol } from "@/application/components/brand/Logo";
import { NAV_ITEMS } from "@/application/config/navigation";

const Sidebar = () => {
  const { pathname } = useLocation();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarPrimitive collapsible="icon">
      {/* Misma altura que la Topbar para que el borde inferior sea continuo. */}
      <SidebarHeader className="h-14 flex-row items-center gap-2.5 border-b border-sidebar-border px-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
        <Link to="/dashboard" aria-label="Ir al inicio" className="shrink-0">
          <LogoSymbol className="size-7" />
        </Link>
        <span className="truncate font-brand text-xl font-bold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
          Stokio
        </span>
        <SidebarTrigger className="ml-auto group-data-[collapsible=icon]:hidden" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="pt-3">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
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
                    className="data-active:bg-brand data-active:text-brand-foreground data-active:hover:bg-brand data-active:hover:text-brand-foreground"
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

      <SidebarRail />
    </SidebarPrimitive>
  );
};

export default Sidebar;
