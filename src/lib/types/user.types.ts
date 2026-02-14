import type { z } from "zod";

import type {
  editPasswordFormSchema,
  memberFormSchema,
  userFormSchema,
  userSchema,
} from "../schemas/user.schema";

export type User = z.infer<typeof userSchema>;

export type EditedUser = Pick<User, "username" | "role">;

/** Rôles alignés sur auth-service (Prisma) */
export enum Role {
  ADMIN = "Administrateur",
  FRANCHISE_OWNER = "Propriétaire de franchise",
  STAFF = "Personnel",
  CUSTOMER = "Client",
}

export type UserForm = z.infer<typeof userFormSchema>;
export type MemberForm = z.infer<typeof memberFormSchema>;
export type EditPasswordForm = z.infer<typeof editPasswordFormSchema>;
