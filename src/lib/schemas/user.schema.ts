import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  picture: z.string().nullable(),
  role: z.enum(["ADMIN", "FRANCHISE_OWNER", "STAFF", "CUSTOMER"]),
  createdAt: z.string(),
  status: z.string(),
});

export const usersSchema = z.array(userSchema);

// Base schema for field picking
export const baseUserFormSchema = z.object({
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  email: z.string().email("Adresse email invalide"),
  profilePicture: z.array(z.instanceof(File)).optional(),
  pictureUrl: z.string().optional(),
  currentPassword: z
    .string()
    .min(1, "Le mot de passe actuel est requis pour changer le mot de passe"),
  newPassword: z
    .string()
    .min(1, "Le nouveau mot de passe est requis pour changer le mot de passe"),
});

// Full user schema with refinements
export const userFormSchema = baseUserFormSchema.refine(
  (data) => {
    if (data.currentPassword === data.newPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["newPassword"],
  }
);

export const memberFormSchema = z.object({
  profilePicture: z.array(z.any()).optional(),
  username: z.string().min(1, "Le nom d'utilisateur est requis"),
  email: z.string().email("L'adresse e-mail n'est pas valide"),
  role: z.enum(["ADMIN", "FRANCHISE_OWNER", "STAFF", "CUSTOMER"], {
    message: "Le rôle est requis",
  }),
  password: z.string().optional(),
  status: z.string().optional(),
});

export const editPasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    newPassword: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: z
      .string()
      .min(8, "Veuillez confirmer le nouveau mot de passe"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Le nouveau mot de passe doit être différent de l'ancien",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
