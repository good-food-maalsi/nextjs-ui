import { importSPKI, jwtVerify } from "jose";
import type { NextResponse } from "next/server";
import axios from "axios";

import { gatewayApi } from "@/lib/config/api.config";
import { SESSION_MAX_AGE } from "@/lib/constants/auth.constants";
import type { TrequestPasswordResetSchema } from "@/lib/schemas/auth.schema";
import type { MemberForm } from "@/lib/types/user.types";
import { decodeBase64Key } from "@/lib/utils/token.utils";
import { DOCKER_SERVICE_BASE_URL } from "../lib/constants/global.constants";

/** Client pour les appels same-origin (cookies sur 3000) */
const nextApi = axios.create({
  baseURL: "",
  withCredentials: true,
});

// DTOs et types de réponse (auth via gateway)
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    username: string;
    roles: string[];
  };
}

export const authService = {
  /**
   * Login via API Next.js (proxy) pour que les cookies soient sur la même origine.
   * Sans ce proxy, les cookies du gateway (8080) ne sont pas envoyés au dashboard (3000).
   */
  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await nextApi.post("/api/auth/login", dto);
    return data;
  },

  logout: async (): Promise<{ message: string }> => {
    const { data } = await nextApi.get("/api/auth/logout");
    return data;
  },

  /**
   * Inscription nouveau utilisateur (username, email, password).
   */
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await gatewayApi.post("/auth/register", dto);
    return data;
  },

  /**
   * Finalisation inscription après invitation (magic token + mot de passe).
   */
  registerWithMagicToken: async (
    magicToken: string,
    password: string
  ): Promise<AuthResponse> => {
    const { data } = await gatewayApi.post("/auth/register", {
      magicToken,
      password,
    });
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

    return await gatewayApi.post("/auth/invite", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Refresh du token d'accès (cookies same-origin envoyés automatiquement).
   */
  refresh: async (): Promise<AuthResponse> => {
    const { data } = await nextApi.post("/api/auth/refresh");
    return data;
  },

  /**
   * Vérification email avec token.
   */
  verify: async (token: string): Promise<{ message: string }> => {
    const { data } = await gatewayApi.get(`/auth/verify?token=${token}`);
    return data;
  },

  /**
   * Profil utilisateur courant.
   */
  getProfile: async (): Promise<AuthResponse["user"]> => {
    const { data } = await gatewayApi.get("/auth/profile");
    return data;
  },

  /**
   * Demande de réinitialisation du mot de passe.
   */
  requestPasswordReset: async (
    emailOrData: string | TrequestPasswordResetSchema
  ): Promise<{ message: string }> => {
    const email =
      typeof emailOrData === "string" ? emailOrData : emailOrData.email;
    const { data } = await gatewayApi.post("/auth/forgot-password", {
      email,
    });
    return data;
  },

  // Token management (utilitaire / legacy)
  verifyToken: async (token: string) => {
    try {
      const publicKey = await importSPKI(
        decodeBase64Key(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!),
        "RS256",
      );

      await jwtVerify(token, publicKey);
      return true;
    } catch {
      return false;
    }
  },

  refreshAccessToken: async (
    refreshToken: string,
    isClient: boolean = true,
  ) => {
    try {
      const baseURL = DOCKER_SERVICE_BASE_URL(isClient);

      const res = await gatewayApi.post(`${baseURL}/auth/refresh`, null, {
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
};
