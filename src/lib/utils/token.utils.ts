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
        const base64Key = process.env.JWT_PUBLIC_KEY_BASE64;
        if (!base64Key) {
            console.error("🔴 JWT_PUBLIC_KEY_BASE64 env var is not set!");
            return null;
        }

        let pem: string;
        try {
            const decoded = decodeBase64Key(base64Key);
            // Normalize PEM: K8s secret injection can corrupt whitespace/line endings.
            // Strip headers, remove all whitespace, then reconstruct with proper 64-char lines.
            const body = decoded
                .replace(/-----BEGIN PUBLIC KEY-----/g, "")
                .replace(/-----END PUBLIC KEY-----/g, "")
                .replace(/\s+/g, "");
            const lines = body.match(/.{1,64}/g) ?? [];
            pem = `-----BEGIN PUBLIC KEY-----\n${lines.join("\n")}\n-----END PUBLIC KEY-----`;
        } catch (e) {
            console.error(
                "🔴 Failed to base64-decode JWT_PUBLIC_KEY_BASE64:",
                e,
            );
            return null;
        }

        const publicKey = await importSPKI(pem, "RS256");
        const { payload } = await jwtVerify(token, publicKey);
        return payload as JwtPayloadRaw;
    } catch (error) {
        console.error(
            "🔴 JWT verification failed:",
            error instanceof Error ? error.message : error,
        );
        return null;
    }
};
