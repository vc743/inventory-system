import { z } from "zod";

export const registerFormSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type RegisterForm = z.infer<typeof registerFormSchema>;
export type User = z.infer<typeof userSchema>;
