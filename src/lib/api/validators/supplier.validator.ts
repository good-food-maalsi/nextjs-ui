import { z } from "zod";

// Schema de création de fournisseur
export const createSupplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  logo_url: z.string().url("Invalid URL format").max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  phone: z.string().min(1).max(100),
  email: z.email().max(100),
});

// Schema de mise à jour de fournisseur (tous les champs optionnels)
export const updateSupplierSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  logo_url: z.string().url("Invalid URL format").max(500).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  phone: z.string().min(1).max(100).optional(),
  email: z.email().max(100).optional(),
});

// Schema pour les paramètres de requête (pagination, filtres)
export const supplierQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
});

// Schema pour l'ID de fournisseur (validation des params d'URL)
export const supplierIdSchema = z.object({
  id: z.uuid("Invalid supplier ID format"),
});

// Types TypeScript inférés
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type SupplierQueryParams = z.infer<typeof supplierQuerySchema>;
export type SupplierIdParams = z.infer<typeof supplierIdSchema>;
