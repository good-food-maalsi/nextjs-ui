import "server-only";

import type { Session } from "@/lib/types/session.types";
import { franchiseHandler } from "@/lib/api/handlers/franchise.handler";

/**
 * Service dédié à la récupération des infos de la franchise de l'utilisateur connecté.
 * Utilise la session (franchise_id) et la route GET /franchises/:id (handler).
 */
export const currentFranchiseService = {
  /**
   * Récupère les informations de la franchise de l'utilisateur connecté.
   * @param session - Session serveur (avec franchise_id si utilisateur rattaché à une franchise)
   * @returns La franchise ou null si pas de franchise_id (ex: admin) ou franchise introuvable
   */
  async getCurrentUserFranchise(session: Session) {
    const franchiseId = session?.franchise_id;
    if (!franchiseId) return null;

    try {
      return await franchiseHandler.getFranchiseById(franchiseId);
    } catch {
      return null;
    }
  },
};
