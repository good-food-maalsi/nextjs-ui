import { z } from "zod";

export const menuFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  availability: z.boolean(),
});

export type MenuFormInput = z.infer<typeof menuFormSchema>;
