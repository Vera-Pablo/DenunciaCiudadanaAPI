import { z } from "zod";

export const createReportSchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
  street: z.string().trim().min(1, "La calle es obligatoria").max(100),
  street_number: z.number().int().optional(),
  img_url: z.url().max(250).optional().nullable(),
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

export const updateReportStatusSchema = z.object({
  id_status: z.number().int().positive(),
  resolution_text: z
    .string()
    .trim()
    .optional()
    .refine((val) => !val || val.length >= 5, {
      message: "El texto de resolución debe tener al menos 5 caracteres",
    }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportStatusInput = z.infer<typeof updateReportStatusSchema>;
