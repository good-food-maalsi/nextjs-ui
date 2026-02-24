import { Role } from "@/lib/types/user.types";

/** Libellés pour les rôles auth-service (Prisma) */
const ROLE_LABELS: Record<string, string> = {
  ADMIN: Role.ADMIN,
  FRANCHISE_OWNER: Role.FRANCHISE_OWNER,
  STAFF: Role.STAFF,
  CUSTOMER: Role.CUSTOMER,
};

export const renderRoleName = (role: string | undefined): string => {
  if (!role) return "";
  return ROLE_LABELS[role] ?? role;
};
