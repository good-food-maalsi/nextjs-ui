/**
 * [DOMAIN SPECIFIC] Micro-service Orders/Inventory
 *
 * Utilitaires de gestion des permissions multi-tenant basées sur franchise_id.
 *
 * ⚠️ IMPORTANT : Ce fichier contient de la logique métier spécifique au domaine Orders/Inventory.
 * Il ne sera PAS extrait dans le package partagé @good-food/auth-utils.
 *
 * Chaque micro-service doit implémenter ses propres règles d'autorisation selon son domaine :
 * - Orders/Inventory : isolation par franchise_id (ce fichier)
 * - Users/Auth : pas de notion de franchise sur les users
 * - Analytics : agrégation cross-franchise pour les admins
 * - Payments : logique d'accès différente selon les transactions
 *
 * Le package partagé ne contient QUE l'authentification JWT (validation token).
 * L'autorisation (qui peut accéder à quoi) est toujours spécifique au domaine.
 */

import type { JWTPayload } from "@/lib/types/auth.types";
import { ForbiddenError } from "../errors/api-error";

/**
 * Vérifie si l'utilisateur est un admin (pas de franchise_id dans le token).
 *
 * Note : Ce helper simple POURRAIT être dans le package partagé car réutilisable,
 * mais on le garde ici pour le moment. À décider lors de l'extraction.
 *
 * @param user - Payload JWT de l'utilisateur connecté
 * @returns true si l'utilisateur est admin (pas de franchise_id), false sinon
 */
export function isAdmin(user: JWTPayload): boolean {
  return user.franchise_id === undefined || user.franchise_id === null;
}

/**
 * [DOMAIN SPECIFIC] Résout le franchise_id à utiliser pour une requête.
 *
 * Règles métier spécifiques au domaine Orders/Inventory :
 * - Admin : utilise le franchise_id fourni en paramètre (required)
 * - Utilisateur normal : utilise le franchise_id de son token (ignore le paramètre fourni)
 *
 * Cette logique implémente le multi-tenancy strict pour ce micro-service.
 * D'autres micro-services auront des règles différentes.
 *
 * @param user - Payload JWT de l'utilisateur connecté
 * @param requestedFranchiseId - franchise_id demandé dans query/body (optionnel)
 * @returns Le franchise_id à utiliser pour la requête
 * @throws ForbiddenError si admin sans franchise_id fourni
 */
export function resolveFranchiseId(
  user: JWTPayload,
  requestedFranchiseId?: string
): string {
  // Admin : doit fournir un franchise_id
  if (isAdmin(user)) {
    if (!requestedFranchiseId) {
      throw new ForbiddenError(
        "Admin users must specify a franchise_id parameter"
      );
    }
    return requestedFranchiseId;
  }

  // Utilisateur normal : utilise son franchise_id du token
  // Ignore le requestedFranchiseId pour éviter les accès cross-franchise
  return user.franchise_id!;
}

/**
 * [DOMAIN SPECIFIC] Vérifie l'accès à une ressource d'une franchise donnée.
 *
 * Règles métier spécifiques au domaine Orders/Inventory :
 * - Admin : peut accéder à n'importe quelle franchise
 * - Utilisateur normal : peut uniquement accéder à sa propre franchise
 *
 * Protection contre les broken access control attacks.
 * Cette validation doit être appelée APRÈS avoir récupéré la ressource.
 *
 * @param user - Payload JWT de l'utilisateur connecté
 * @param resourceFranchiseId - franchise_id de la ressource accédée
 * @throws ForbiddenError si l'utilisateur n'a pas accès
 */
export function validateFranchiseAccess(
  user: JWTPayload,
  resourceFranchiseId: string
): void {
  // Admin : accès total
  if (isAdmin(user)) {
    return;
  }

  // Utilisateur normal : vérifier qu'il accède à sa propre franchise
  if (user.franchise_id !== resourceFranchiseId) {
    throw new ForbiddenError(
      "You do not have permission to access this franchise's data"
    );
  }
}
