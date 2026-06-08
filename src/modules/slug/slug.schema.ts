 import { z } from "zod";

export const insertSlugSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Debe tener al menos 3 caracteres")
    .max(120, "Máximo 120 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Solo letras, números y guiones"
    ),
});

export type InsertSlugDto =
  z.infer<typeof insertSlugSchema>;