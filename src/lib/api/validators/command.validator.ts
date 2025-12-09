import { z } from "zod";
import { CommandStatus } from "@/generated/prisma/client";

// Schema pour un item de commande
const commandItemSchema = z.object({
  ingredient_id: z.uuid("Invalid ingredient ID format"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Schema de création de commande
export const createCommandSchema = z.object({
  franchise_id: z.uuid("Invalid franchise ID format"),
  status: z
    .enum([
      CommandStatus.draft,
      CommandStatus.confirmed,
      CommandStatus.in_progress,
      CommandStatus.delivered,
      CommandStatus.canceled,
    ])
    .default(CommandStatus.draft)
    .optional(),
  user_id: z.uuid("Invalid user ID format"),
  items: z
    .array(commandItemSchema)
    .min(1, "At least one item must be provided")
    .optional()
    .default([]),
});

// Schema de mise à jour de commande (tous les champs optionnels)
export const updateCommandSchema = z.object({
  status: z
    .enum([
      CommandStatus.draft,
      CommandStatus.confirmed,
      CommandStatus.in_progress,
      CommandStatus.delivered,
      CommandStatus.canceled,
    ])
    .optional(),
  user_id: z.uuid("Invalid user ID format").optional(),
});

// Schema pour les paramètres de requête (pagination, filtres)
export const commandQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(10).optional(),
  franchise_id: z.uuid().optional(),
  status: z
    .enum([
      CommandStatus.draft,
      CommandStatus.confirmed,
      CommandStatus.in_progress,
      CommandStatus.delivered,
      CommandStatus.canceled,
    ])
    .optional(),
  user_id: z.uuid().optional(),
});

// Schema pour l'ID de commande (validation des params d'URL)
export const commandIdSchema = z.object({
  id: z.uuid("Invalid command ID format"),
});

// Schema pour ajouter un ingrédient à une commande
export const addIngredientToCommandSchema = z.object({
  ingredient_id: z.uuid("Invalid ingredient ID format"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Schema pour mettre à jour la quantité d'un ingrédient
export const updateCommandIngredientSchema = z.object({
  quantity: z.number().int().positive("Quantity must be a positive integer"),
});

// Types TypeScript inférés
export type CommandItem = z.infer<typeof commandItemSchema>;
export type CreateCommandInput = z.infer<typeof createCommandSchema>;
export type UpdateCommandInput = z.infer<typeof updateCommandSchema>;
export type CommandQueryParams = z.infer<typeof commandQuerySchema>;
export type CommandIdParams = z.infer<typeof commandIdSchema>;
export type AddIngredientToCommandInput = z.infer<
  typeof addIngredientToCommandSchema
>;
export type UpdateCommandIngredientInput = z.infer<
  typeof updateCommandIngredientSchema
>;
