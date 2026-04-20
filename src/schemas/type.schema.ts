import { z } from "zod";

export const typeSchema = z.object({
  type: z.string().min(3).max(20),
});

export type TypeInput = z.infer<typeof typeSchema>;
