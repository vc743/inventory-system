import type { ReactNode } from "react";
import { Button } from "@/application/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/application/components/ui/tooltip";

interface ActionButtonProps {
  label: string;
  ariaLabel: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

// Botón de ícono para las acciones de una fila. Lleva tooltip porque el
// ícono solo no siempre basta para saber qué hace.
const ActionButton = ({
  label,
  ariaLabel,
  onClick,
  className,
  children,
}: ActionButtonProps) => (
  <Tooltip>
    <TooltipTrigger
      render={
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={ariaLabel}
          onClick={onClick}
          className={className}
        />
      }
    >
      {children}
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
);

export default ActionButton;
