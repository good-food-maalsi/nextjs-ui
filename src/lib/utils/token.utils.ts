import { importSPKI, jwtVerify } from "jose";

import type { Session } from "@/lib/types/session.types";

/** Payload JWT tel que signé par auth-service (role = tableau UserRoles) */
export interface JwtPayloadRaw {
    sub?: string;
    role?: Array<{ role?: { role?: string } }>;
    franchiseId?: string;
    username?: string;
    email?: string;
    picture?: string | null;
}

export const encodeBase64Key = (key: string) =>
    Buffer.from(key).toString("base64");

export const decodeBase64Key = (key: string) =>
    Buffer.from(key, "base64").toString("utf8");

function extractFirstRole(payload: JwtPayloadRaw): string | undefined {
    if (!payload.role || !Array.isArray(payload.role)) return undefined;
    const first = payload.role[0];
    return first?.role?.role;
}

/** Extrait toutes les valeurs de rôle du payload (auth-service) */
export function extractRoles(payload: JwtPayloadRaw): string[] {
    if (!payload.role || !Array.isArray(payload.role)) return [];
    return payload.role.map((r) => r.role?.role).filter(Boolean) as string[];
}

/** Convertit le payload JWT brut (auth-service) en Session côté client */
export function payloadToSession(payload: JwtPayloadRaw | null): Session {
    if (!payload) return {};
    return {
        sub: payload.sub,
        username: payload.username,
        email: payload.email,
        picture: payload.picture ?? undefined,
        role: extractFirstRole(payload),
        franchise_id: payload.franchiseId,
    };
}

export const decrypt = async (token: string): Promise<JwtPayloadRaw | null> => {
    try {
        const publicKey = await importSPKI(
            decodeBase64Key(process.env.JWT_PUBLIC_KEY_BASE64!),
            "RS256",
        );
        const { payload } = await jwtVerify(token, publicKey);
        return payload as JwtPayloadRaw;
    } catch (error) {
        console.error("🔴 Erreur lors du déchiffrement du token:", error);
        return null;
    }
};
