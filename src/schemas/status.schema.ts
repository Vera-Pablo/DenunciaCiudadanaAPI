import { z } from "zod";

export const statusSchema = z.object({
  type_status: z.string().min(3).max(20),
});

export type StatusInput = z.infer<typeof statusSchema>;
