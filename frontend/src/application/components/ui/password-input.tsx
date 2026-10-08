import * as React from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "cn"
import { Input } from "@/application/components/ui/input"

function PasswordInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pr-8", className)}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        className="absolute right-0 top-0 flex h-8 w-8 cursor-pointer items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
      >
        {visible ? (
          <EyeOff className="size-3.5" />
        ) : (
          <Eye className="size-3.5" />
        )}
      </button>
    </div>
  )
}

export { PasswordInput }
