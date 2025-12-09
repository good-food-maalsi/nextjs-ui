import { z } from "zod";

// Schema pour ajouter/mettre à jour du stock
export const upsertStockSchema = z.object({
  ingredient_id: z.uuid("Invalid ingredient ID format"),
  quantity: z.number().int().min(0, "Quantity must be zero or positive"),
});

// Schema pour mettre à jour la quantité en stock
export const updateStockQuantitySchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be zero or positive"),
});

// Schema pour les IDs
export const stockIdsSchema = z.object({
  franchiseId: z.uuid("Invalid franchise ID format"),
  ingredientId: z.uuid("Invalid ingredient ID format"),
});

// Types TypeScript inférés
export type UpsertStockInput = z.infer<typeof upsertStockSchema>;
export type UpdateStockQuantityInput = z.infer<typeof updateStockQuantitySchema>;
export type StockIdsParams = z.infer<typeof stockIdsSchema>;
