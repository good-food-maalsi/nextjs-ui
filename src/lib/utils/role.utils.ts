import { Role } from "@/lib/types/user.types";

export const renderRoleName = (role: string | undefined) => {
  if (!role) return "";
  switch (role) {
    case "SUPER_ADMIN":
      return Role.SUPER_ADMIN;
    case "ADMIN":
      return Role.ADMIN;
    case "EDITOR":
      return Role.EDITOR;
    default:
      return Role.READER;
  }
};
