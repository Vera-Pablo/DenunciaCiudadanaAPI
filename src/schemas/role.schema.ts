import { z } from "zod";

export const roleSchema = z.object({
  type_role: z.string().min(3).max(30),
});

export type RoleInput = z.infer<typeof roleSchema>;
