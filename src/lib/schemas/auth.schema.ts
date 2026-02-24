import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("L'email n'est pas valide").min(1, "Le champs est requis"),
  password: z.string().min(1, "Le mot de passe n'est pas requis"),
});

export const registerSchema = z
  .object({
    username: z.string().min(1, "Le pseudo est requis"),
    email: z.string().email("L'email n'est pas valide").min(1, "Le champ est requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    passwordConfirmation: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const passwordRegisterSchema = z
  .object({
    password: z
      .string()
      .min(12, "Le mot de passe doit contenir au moins 12 caractères")
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule"
      )
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule"
      )
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      ),
    passwordConfirmation: z.string().min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

export const requestPasswordResetSchema = z.object({
  email: z.string().email("L'adresse e-mail n'est pas valide"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TpasswordRegisterSchema = z.infer<typeof passwordRegisterSchema>;
export type TrequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
