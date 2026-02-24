/**
 * Payload JWT normalisé utilisé pour l'autorisation (permissions, franchise, etc.).
 *
 * Champs standards : sub, email, role, franchise_id.
 * franchise_id est absent pour les admins.
 */
export interface JWTPayload {
  sub: string;
  email: string;
  role?: string;
  franchise_id?: string;
  iat?: number;
  exp?: number;
}
