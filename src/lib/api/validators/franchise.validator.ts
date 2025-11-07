import { z } from "zod";

// Schema de création de franchise
export const createFranchiseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  street: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  state: z.string().min(1).max(50),
  zip: z.string().min(1).max(10),
  owner_id: z.uuid(),
  email: z.email().max(100),
  phone: z.string().min(1).max(20),
});

// Schema de mise à jour de franchise (tous les champs optionnels)
export const updateFranchiseSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  street: z.string().min(1).max(255).optional(),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(50).optional(),
  zip: z.string().min(1).max(10).optional(),
  owner_id: z.uuid().optional(),
  email: z.email().max(100).optional(),
  phone: z.string().min(1).max(20).optional(),
});

// Schema pour les paramètres de requête (pagination, filtres)
export const franchiseQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
});

// Schema pour l'ID de franchise (validation des params d'URL)
export const franchiseIdSchema = z.object({
  id: z.uuid("Invalid franchise ID format"),
});

// Types TypeScript inférés
export type CreateFranchiseInput = z.infer<typeof createFranchiseSchema>;
export type UpdateFranchiseInput = z.infer<typeof updateFranchiseSchema>;
export type FranchiseQueryParams = z.infer<typeof franchiseQuerySchema>;
export type FranchiseIdParams = z.infer<typeof franchiseIdSchema>;
