import { z } from "zod";

export const registerFormSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido"),
  email: z.email("email invalido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const loginFormSchema = z.object({
  email: z.email("email invalido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const userSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;
export type LoginForm = z.infer<typeof loginFormSchema>;
export type User = z.infer<typeof userSchema>;
