import {
  ArrowLeftRight,
  FileBarChart,
  LayoutDashboard,
  Package,
  Tags,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

// Una sola fuente para el sidebar y el buscador (⌘K).
export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Productos", path: "/products", icon: Package },
  { label: "Categorías", path: "/categories", icon: Tags },
  { label: "Movimientos", path: "/movements", icon: ArrowLeftRight },
  { label: "Alertas", path: "/alerts", icon: TriangleAlert },
  { label: "Reportes", path: "/reports", icon: FileBarChart },
];
