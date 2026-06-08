import { z } from "zod";

export const createUserSchema = z.object({
  dni: z.number().int().positive(),
  name: z.string().min(2).max(50),
  email: z.email().max(100),
  password: z.string().min(6).max(100),
  telefono: z.string().min(7).max(15),
  id_role: z.number().int().positive(),
});

export const updateUserSchema = createUserSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const updateProfileSchema = z.strictObject({
  name: z.string().min(2).max(50).optional(),
  telefono: z.string().min(7).max(15).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
