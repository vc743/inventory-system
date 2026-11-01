import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/application/components/ui/command";
import { NAV_ITEMS } from "@/application/config/navigation";
import { useAuthStore } from "@/application/stores/auth.store";

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CommandMenu = ({ open, onOpenChange }: CommandMenuProps) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // ⌘K en Mac, Ctrl+K en Windows/Linux. Alterna: el mismo atajo lo cierra.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const run = (action: () => void) => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Buscar"
      description="Busca una página o una acción"
    >
      {/* CommandDialog es solo el modal; el estado de búsqueda vive en <Command>. */}
      <Command>
        <CommandInput placeholder="Buscar páginas y acciones..." />
        <CommandList>
          <CommandEmpty>Sin resultados.</CommandEmpty>
          <CommandGroup heading="Ir a">
            {NAV_ITEMS.map((item) => (
              <CommandItem
                key={item.path}
                value={item.label}
                onSelect={() => run(() => navigate(item.path))}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Cuenta">
            <CommandItem value="Cerrar sesión" onSelect={() => run(logout)}>
              <LogOut />
              Cerrar sesión
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
};

export default CommandMenu;
