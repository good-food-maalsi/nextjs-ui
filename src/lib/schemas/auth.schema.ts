import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined
        ? "Le champs est requis"
        : "L'email n'est pas valide",
  }),
  password: z.string({
    error: "Le mot de passe n'est pas requis",
  }),
});

export const passwordRegisterSchema = z
  .object({
    password: z
      .string({
        error: "Le mot de passe est requis",
      })
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
    passwordConfirmation: z.string({
      error: "La confirmation du mot de passe est requise",
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas",
    path: ["passwordConfirmation"],
  });

export const requestPasswordResetSchema = z.object({
  email: z.email("L'adresse e-mail n'est pas valide"),
});

export type TLoginSchema = z.infer<typeof loginSchema>;
export type TpasswordRegisterSchema = z.infer<typeof passwordRegisterSchema>;
export type TrequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
