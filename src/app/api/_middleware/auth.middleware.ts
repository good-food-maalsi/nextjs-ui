import type { NextRequest } from "next/server";
import { jwtVerify, importSPKI } from "jose";
import { UnauthorizedError } from "@/lib/api/errors/api-error";
import { decodeBase64Key } from "@/lib/utils/token.utils";

export interface JWTPayload {
  sub: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token d'accès et retourne le payload
 */
export async function authMiddleware(
  request: NextRequest
): Promise<JWTPayload> {
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
