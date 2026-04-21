import { z } from "zod";

export const createReportSchema = z.object({
  description: z.string().min(10),
  strike: z.string().min(3).max(50),
  strike_num: z.number().int().optional(),
  img_url: z.url().max(250),
  id_type: z.number().int().positive(),
});

export const reportQuerySchema = z.object({
  id_type: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v) : undefined)),
  id_status: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v) : undefined)),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
