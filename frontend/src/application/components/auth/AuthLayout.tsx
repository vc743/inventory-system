import { Box, PackageCheck, TrendingDown, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/application/components/ui/badge";

const STATS = [
  { value: "500+", label: "Tiendas activas" },
  { value: "50k", label: "Productos" },
  { value: "99.9%", label: "Disponibilidad" },
];

const STOCK_ROWS = [
  {
    icon: PackageCheck,
    label: "Entradas hoy",
    value: "1,204",
    delta: "+18%",
    variant: "success" as const,
  },
  {
    icon: TrendingDown,
    label: "Salidas hoy",
    value: "842",
    delta: "-4%",
    variant: "info" as const,
  },
  {
    icon: TriangleAlert,
    label: "Stock crítico",
    value: "6 SKUs",
    delta: "Revisar",
    variant: "warning" as const,
  },
];

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-auth-in space-y-6">
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Box className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">StockFlow</span>
          </div>
          {children}
        </div>
      </div>

      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-primary p-12 lg:flex">
        <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-brand/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(oklch(1_0_0/0.06)_1px,transparent_1px)] bg-size-[28px_28px]" />

        <div className="relative flex w-full max-w-md flex-col items-center gap-10">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-foreground/10 ring-1 ring-primary-foreground/15">
              <Box className="h-7 w-7 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-primary-foreground">
              Gestiona tu inventario de forma inteligente
            </h2>
            <p className="text-sm text-primary-foreground/60">
              Controla entradas, salidas y recibe alertas cuando tus
              productos estén por agotarse.
            </p>
          </div>

          {/* Product preview card */}
          <div className="w-full rounded-2xl bg-card p-5 text-card-foreground shadow-card ring-1 ring-foreground/6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                  <Box className="h-4 w-4 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-tight">
                    Resumen de inventario
                  </p>
                  <p className="text-xs text-muted-foreground">Hoy, 09:41</p>
                </div>
              </div>
              <Badge variant="success">
                <span className="size-1.5 rounded-full bg-success-foreground" />
                En vivo
              </Badge>
            </div>

            <div className="space-y-1">
              {STOCK_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-lg px-1.5 py-2 transition-colors hover:bg-muted/60"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
                      <row.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-foreground/80">
                      {row.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{row.value}</span>
                    <Badge variant={row.variant}>{row.delta}</Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Capacidad de almacén
                </span>
                <span className="font-medium">72%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-brand" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-semibold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-primary-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
