import { importSPKI, jwtVerify } from "jose";
import type { NextResponse } from "next/server";

import api from "@/lib/config/api.config";
import { SESSION_MAX_AGE } from "@/lib/constants/auth.constants";
import type { TrequestPasswordResetSchema } from "@/lib/schemas/auth.schema";
import type { MemberForm } from "@/lib/types/user.types";
import { decodeBase64Key } from "@/lib/utils/token.utils";

import { DOCKER_SERVICE_BASE_URL } from "../lib/constants/global.constants";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  logout: async () => {
    await api.get("/auth/logout");
  },

  register: async (magicToken: string, password: string) => {
    const { data } = await api.post("/auth/register", { magicToken, password });
    return data;
  },

  invite: async (data: MemberForm) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("role", data.role);
    formData.append("status", "En cours ...");
    if (data.profilePicture?.[0]) {
      formData.append("file", data.profilePicture[0]);
    }

    return await api.post("/auth/invite", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Token management
  verifyToken: async (token: string) => {
    try {
      const publicKey = await importSPKI(
        decodeBase64Key(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!),
        "RS256"
      );

      await jwtVerify(token, publicKey);
      return true;
    } catch {
      return false;
    }
  },

  refreshAccessToken: async (
    refreshToken: string,
    isClient: boolean = true
  ) => {
    try {
      const baseURL = DOCKER_SERVICE_BASE_URL(isClient);

      const res = await api.post(`${baseURL}/auth/refresh`, null, {
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (res.status !== 200) return null;

      const setCookie = res.headers["set-cookie"] as string | undefined;

      const cookieValue = Array.isArray(setCookie)
        ? setCookie.find((c) => c.startsWith("accessToken="))
        : setCookie;

      return authService.extractAccessToken(cookieValue);
    } catch {
      return null;
    }
  },

  setAccessTokenCookie: (response: NextResponse, token: string) => {
    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: SESSION_MAX_AGE,
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN || "",
    });
  },

  extractAccessToken: (cookies?: string): string | null => {
    return (
      cookies
        ?.split(";")
        .find((cookie) => cookie.startsWith("accessToken"))
        ?.split("=")[1]
        .split(";")[0] || null
    );
  },

  clearCookies: (response: NextResponse) => {
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
  },

  requestPasswordReset: async (data: TrequestPasswordResetSchema) => {
    const body = {
      email: data.email,
    };

    return await api.post("/auth/forgot-password", body);
  },
};
