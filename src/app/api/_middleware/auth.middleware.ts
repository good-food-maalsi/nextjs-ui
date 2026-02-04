import type { NextRequest } from "next/server";
import { jwtVerify, importSPKI } from "jose";
import { UnauthorizedError } from "@/lib/api/errors/api-error";
import { decodeBase64Key } from "@/lib/utils/token.utils";

/**
 * [SHARED PACKAGE] @good-food/auth-utils
 *
 * Interface représentant le payload d'un JWT.
 * Ce type sera extrait dans un package npm partagé entre tous les micro-services.
 *
 * Champs standards :
 * - sub, email, role, iat, exp : présents dans tous les micro-services
 * - franchise_id : spécifique au contexte métier, peut être absent (admins) ou non utilisé par certains micro-services
 */
export interface JWTPayload {
  sub: string;
  email: string;
  role?: string;
  franchise_id?: string; // ID de la franchise (absent pour les admins)
  iat?: number;
  exp?: number;
}

/**
 * [SHARED PACKAGE] @good-food/auth-utils
 *
 * Middleware d'authentification JWT.
 * Responsabilité : Valider le JWT et extraire le payload.
 *
 * Ce middleware sera extrait dans un package npm partagé entre tous les micro-services.
 * Il ne contient AUCUNE logique métier d'autorisation - seulement l'authentification.
 *
 * Les règles d'accès aux ressources (authorization) sont gérées dans chaque micro-service
 * selon son domaine métier spécifique.
 */
export async function authMiddleware(
  request: NextRequest
): Promise<JWTPayload> {
  // Skip authentication if DISABLE_AUTH is set to "true"
  if (process.env.DISABLE_AUTH === "true") {
    return {
      sub: "test-user",
      email: "test@example.com",
      role: "admin",
      franchise_id: undefined, // Admin = pas de franchise_id
    };
  }

  // Récupérer le token depuis le cookie
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    throw new UnauthorizedError("No access token provided");
  }

  try {
    // Importer la clé publique RSA
    const publicKey = await importSPKI(
      decodeBase64Key(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!),
      "RS256"
    );

    // Vérifier et décoder le token
    const { payload } = await jwtVerify(token, publicKey);

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string | undefined,
      franchise_id: payload.franchise_id as string | undefined,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("expired")) {
        throw new UnauthorizedError("Token expired");
      }
    }
    throw new UnauthorizedError("Invalid token");
  }
}

/**
 * Middleware optionnel d'authentification
 * Retourne le payload si le token est valide, sinon null
 */
export async function optionalAuthMiddleware(
  request: NextRequest
): Promise<JWTPayload | null> {
  try {
    return await authMiddleware(request);
  } catch {
    return null;
  }
}
