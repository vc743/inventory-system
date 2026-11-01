import { cn } from "cn";

interface LogoProps {
  className?: string;
  /** "inverse" para fondos oscuros (fotos, paneles marinos). */
  variant?: "default" | "inverse";
}

/**
 * Símbolo de Stokio: dos cajas abajo y una amarilla arriba.
 * Los rectángulos usan currentColor, así el color se controla con clases
 * de texto y el mismo símbolo sirve sobre fondos claros u oscuros.
 */
export const LogoSymbol = ({ className, variant = "default" }: LogoProps) => (
  <svg
    viewBox="0 0 64 64"
    aria-hidden="true"
    className={cn(
      "size-6 shrink-0",
      variant === "inverse" ? "text-white" : "text-primary",
      className,
    )}
  >
    <rect x="4" y="36" width="24" height="24" rx="4" fill="currentColor" />
    <rect x="36" y="36" width="24" height="24" rx="4" fill="currentColor" />
    <rect x="20" y="6" width="24" height="24" rx="4" className="fill-brand" />
  </svg>
);

/** Símbolo + nombre. El nombre es texto real, no parte del SVG. */
export const Logo = ({ className, variant = "default" }: LogoProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-2.5 font-brand text-xl font-bold tracking-tight",
      variant === "inverse" ? "text-white" : "text-primary",
      className,
    )}
  >
    <LogoSymbol variant={variant} />
    Stokio
  </span>
);
