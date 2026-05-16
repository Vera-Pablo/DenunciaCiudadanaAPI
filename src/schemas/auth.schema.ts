import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  dni: z.number().int().positive(),
  name: z.string().min(2).max(50),
  email: z.email().max(100),
  password: z.string().min(6).max(100),
  telefono: z.string().min(7).max(15),
});

export const forgotPasswordSchema = z.object({
  email: z.email({message: "Email inválido"}).max(100),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "El token es requerido"),
  newPassword: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(100),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;