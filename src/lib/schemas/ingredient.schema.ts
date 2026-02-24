import { z } from "zod";

export const ingredientFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  supplier_id: z
    .string()
    .uuid("Vous devez sélectionner un fournisseur"),
  unit_price: z
    .number()
    .min(0, "Le prix unitaire ne peut pas être négatif")
    .max(999999.99, "Le prix unitaire ne peut pas dépasser 999 999,99"),
});

export type IngredientFormInput = z.infer<typeof ingredientFormSchema>;
