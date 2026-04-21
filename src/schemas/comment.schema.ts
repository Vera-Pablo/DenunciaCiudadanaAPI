import { z } from "zod";

export const createCommentSchema = z.object({
  text: z.string().min(1),
  id_user: z.number().int().positive(),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
