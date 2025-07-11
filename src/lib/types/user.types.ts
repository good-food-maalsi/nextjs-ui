import { z } from "zod";
import {
  editPasswordFormSchema,
  memberFormSchema,
  userFormSchema,
  userSchema,
} from "../schemas/user.schema";

export type User = z.infer<typeof userSchema>;

export type EditedUser = Pick<User, "username" | "role">;

export enum Role {
  SUPER_ADMIN = "Super-administrateur",
  ADMIN = "Administrateur",
  EDITOR = "Éditeur",
  READER = "Lecteur",
}

export type UserForm = z.infer<typeof userFormSchema>;
export type MemberForm = z.infer<typeof memberFormSchema>;
export type EditPasswordForm = z.infer<typeof editPasswordFormSchema>;
