import { z } from "zod";

export const dishFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().min(1, "La description est requise"),
  basePrice: z.number({ message: "Le prix doit être un nombre" }).min(0, "Le prix doit être positif"),
  menuId: z.string().optional(),
  availability: z.boolean(),
  imageUrl: z.string().optional(),
});

export type DishFormInput = z.infer<typeof dishFormSchema>;

