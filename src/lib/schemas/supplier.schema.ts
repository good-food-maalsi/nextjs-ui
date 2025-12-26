import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(255, "Le nom ne peut pas dépasser 255 caractères"),
  email: z
    .string()
    .email("Adresse email invalide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  phone: z
    .string()
    .min(10, "Le téléphone doit contenir au moins 10 caractères")
    .max(100, "Le téléphone ne peut pas dépasser 100 caractères")
    .regex(
      /^[\d\s\-+()]+$/,
      "Le téléphone ne peut contenir que des chiffres, espaces et symboles (+ - ( ))"
    ),
  logo_url: z
    .string()
    .url("URL invalide")
    .max(500, "L'URL ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  latitude: z
    .number()
    .min(-90, "La latitude doit être entre -90 et 90")
    .max(90, "La latitude doit être entre -90 et 90")
    .nullable()
    .optional(),
  longitude: z
    .number()
    .min(-180, "La longitude doit être entre -180 et 180")
    .max(180, "La longitude doit être entre -180 et 180")
    .nullable()
    .optional(),
});

export type SupplierFormInput = z.infer<typeof supplierFormSchema>;
