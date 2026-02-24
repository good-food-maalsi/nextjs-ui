import { z } from "zod";

export const stockFranchiseFormSchema = z.object({
  ingredient_id: z
    .string()
    .uuid("Vous devez sélectionner un ingrédient"),
  quantity: z
    .number()
    .int("La quantité doit être un nombre entier")
    .min(0, "La quantité ne peut pas être négative"),
});

export const updateStockFranchiseFormSchema = z.object({
  quantity: z
    .number()
    .int("La quantité doit être un nombre entier")
    .min(0, "La quantité ne peut pas être négative"),
});

export type StockFranchiseFormInput = z.infer<typeof stockFranchiseFormSchema>;
export type UpdateStockFranchiseFormInput = z.infer<typeof updateStockFranchiseFormSchema>;
