import { importSPKI, jwtVerify } from "jose";

import type { Session } from "@/lib/types/session.types";

export const encodeBase64Key = (key: string) =>
  Buffer.from(key).toString("base64");

export const decodeBase64Key = (key: string) =>
  Buffer.from(key, "base64").toString("utf8");

export const decrypt = async (token: string): Promise<Session | null> => {
  try {
    const publicKey = await importSPKI(
      decodeBase64Key(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!),
      "RS256"
    );
    const { payload } = await jwtVerify(token, publicKey);
    return payload as Session;
  } catch (error) {
    console.error("🔴 Erreur lors du déchiffrement du token:", error);
    return null;
  }
};
