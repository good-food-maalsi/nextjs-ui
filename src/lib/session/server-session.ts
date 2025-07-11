import "server-only";

import { cookies } from "next/headers";
import { Session } from "@/lib/types/session.types";
import { decrypt } from "@/lib/utils/token.utils";

export const serverSession = {
  async getServerSession(): Promise<Session> {
    const token = await getCookie("accessToken");
    if (!token) return {};

    const payload = await decrypt(token);
    return {
      sub: payload?.sub,
      role: payload?.role,
      username: payload?.username,
      picture: payload?.picture,
      email: payload?.email,
    };
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
