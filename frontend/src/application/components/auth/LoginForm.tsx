import { Button } from "@/application/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/application/components/ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/application/components/ui/field";
import { Input } from "@/application/components/ui/input";
import { PasswordInput } from "@/application/components/ui/password-input";
import { LockKeyhole, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  loginFormSchema,
  type LoginForm,
} from "@/infrastructure/schemas/auth/auth";
import { login } from "@/infrastructure/api/auth/auth";
import { useAuthStore } from "@/application/stores/auth.store";

const LoginForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      toast.success(`Bienvenido, ${user.fullName}`);
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
          <LockKeyhole className="h-5 w-5 text-accent-foreground" />
        </div>
        <CardTitle className="text-xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder al sistema
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-email">
                    Correo electrónico
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="email@ejemplo.com"
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-form-password">
                    Contraseña
                  </FieldLabel>
                  <PasswordInput
                    {...field}
                    id="login-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            ></Controller>

            <Field>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={isPending}
              >
                {isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Iniciar sesión
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>

      <p className="px-(--card-spacing) text-center text-sm text-muted-foreground">
        ¿No tienes una cuenta?{" "}
        <Link
          to="/register"
          className="font-medium text-brand hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </Card>
  );
};

export default LoginForm;
