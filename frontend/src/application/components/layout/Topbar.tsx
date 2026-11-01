import { useState } from "react";
import { Link } from "react-router";
import { Bell, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/application/components/ui/avatar";
import { Button } from "@/application/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/application/components/ui/dropdown-menu";
import { Kbd } from "@/application/components/ui/kbd";
import { SidebarTrigger } from "@/application/components/ui/sidebar";
import CommandMenu from "@/application/components/layout/CommandMenu";
import { useAuthStore } from "@/application/stores/auth.store";

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(navigator.userAgent);

const Topbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [searchOpen, setSearchOpen] = useState(false);

  const initials = user?.fullName
    ?.split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />

      {/* Parece un input, pero es un botón: abre el buscador. */}
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
      >
        <Search className="size-4" />
        <span>Buscar...</span>
        <Kbd className="ml-auto hidden sm:inline-flex">
          {isMac ? "⌘" : "Ctrl"} K
        </Kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          render={<Link to="/alerts" aria-label="Alertas" />}
        >
          <Bell />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Menú de usuario"
            className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar>
              <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="truncate font-medium text-foreground">
                  {user?.fullName}
                </span>
                <span className="truncate text-xs font-normal">
                  {user?.email}
                </span>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={logout}>
                <LogOut />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CommandMenu open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};

export default Topbar;
