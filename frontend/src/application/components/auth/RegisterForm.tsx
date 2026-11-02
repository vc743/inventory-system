import { Button } from "@/application/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  registerFormSchema,
  type RegisterFormType,
} from "@/infrastructure/schemas/auth/auth";
import { register } from "@/infrastructure/api/auth/auth";
import { useAuthStore } from "@/application/stores/auth.store";

const RegisterForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: ({ user, token }) => {
      setAuth(user, token);
      toast.success(`Cuenta creada. Bienvenido, ${user.fullName}`);
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: RegisterFormType) => {
    mutation.mutate(data);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="text-sm text-muted-foreground">
          Empieza a gestionar tu inventario en minutos
        </p>
      </div>

      <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          {/* Nombre */}
          <Controller
            name="fullName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-fullName">
                  Nombre Completo
                </FieldLabel>
                <Input
                  {...field}
                  id="register-form-fullName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ingrese su nombre completo"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          ></Controller>

          {/* Email */}
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="register-form-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="register-form-email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ingrese su correo electronico"
                  autoComplete="off"
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
                <FieldLabel htmlFor="register-form-password">
                  Contraseña
                </FieldLabel>
                <PasswordInput
                  {...field}
                  id="register-form-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Ingrese su contraseña"
                  autoComplete="new-password"
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
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Crear cuenta
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <p className="text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          to="/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
