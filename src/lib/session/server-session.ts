import "server-only";

import { cookies } from "next/headers";

import type { Session } from "@/lib/types/session.types";
import { decrypt, payloadToSession } from "@/lib/utils/token.utils";

export const serverSession = {
  async getServerSession(): Promise<Session> {
    const token = await getCookie("accessToken");
    if (!token) return {};

    const payload = await decrypt(token);
    return payloadToSession(payload);
  },

  async getAccessToken(): Promise<string | undefined> {
    const token = await getCookie("accessToken");
    return token;
  },

  async getRefreshToken(): Promise<string | undefined> {
    const token = await getCookie("refreshToken");
    return token;
  },
};

const getCookie = async (name: string): Promise<string | undefined> => {
  const cookie = (await cookies()).get(name)?.value;
  return cookie;
};
