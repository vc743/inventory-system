import { Button } from "@/application/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/application/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/application/components/ui/field";
import { Input } from "@/application/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="">Registro</CardTitle>
          <CardDescription>
            Empieza a gestionar tu inventario en minutos
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <FieldGroup>
              {/* Nombre */}
              <Field>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input id="name" placeholder="Jane Doe" required />
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </Field>

              {/* Password */}
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Field>

              {/* Confirm Password */}
              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  Confirmar contraseña
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    placeholder="Repite tu contraseña"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </Field>

              <Field>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  // disabled={isLoading}
                >
                  {/* {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creando...
                </span>
              ) : ( */}
                  Crear cuenta
                  {/* )} */}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </Card>
    // </section>
  );
};

export default RegisterForm;
