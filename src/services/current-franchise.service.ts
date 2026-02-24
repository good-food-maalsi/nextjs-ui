import "server-only";

import type { Session } from "@/lib/types/session.types";
import { createAuthenticatedFranchiseClient } from "@/lib/config/ts-rest-client";
import { serverSession } from "@/lib/session/server-session";

/**
 * Service dédié à la récupération des infos de la franchise de l'utilisateur connecté.
 * Utilise la session (franchise_id) et la route GET /franchises/:id via le client ts-rest.
 * Côté serveur, le token doit être passé explicitement : les requêtes Node n'envoient pas les cookies.
 */
export const currentFranchiseService = {
  /**
   * Récupère les informations de la franchise de l'utilisateur connecté.
   * @param session - Session serveur (avec franchise_id si utilisateur rattaché à une franchise)
   * @returns La franchise ou null si pas de franchise_id (ex: admin) ou franchise introuvable
   */
  async getCurrentUserFranchise(session: Session) {
    const franchiseId = session?.franchise_id;
    if (!franchiseId) {
      return null;
    }

    const accessToken = await serverSession.getAccessToken();
    if (!accessToken) {
      return null;
    }

    try {
      const client = createAuthenticatedFranchiseClient(accessToken);
      const response = await client.franchises.getById({
        params: { id: franchiseId },
        extraHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) return response.body;
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "[currentFranchiseService] getById status non-200:",
          response.status,
        );
      }
      return null;
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[currentFranchiseService] Erreur lors de l'appel franchise API:",
          err,
        );
      }
      return null;
    }
  },
};
