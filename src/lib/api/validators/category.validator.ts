import { z } from "zod";

// Schema de création de catégorie
export const createCategorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  description: z.string().max(255).optional(),
});

// Schema de mise à jour de catégorie (tous les champs optionnels)
export const updateCategorySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  description: z.string().max(255).optional().nullable(),
});

// Schema pour les paramètres de requête (pagination, filtres)
export const categoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
});

// Schema pour l'ID de catégorie (validation des params d'URL)
export const categoryIdSchema = z.object({
  id: z.uuid("Invalid category ID format"),
});

// Types TypeScript inférés
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryQueryParams = z.infer<typeof categoryQuerySchema>;
export type CategoryIdParams = z.infer<typeof categoryIdSchema>;
