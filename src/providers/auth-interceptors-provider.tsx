"use client";

import { useEffect } from "react";
import type { PropsWithChildren } from "react";

import { useAuthInterceptors } from "@/hooks/use-authInterceptor";
import { authService } from "@/services/auth.service";

/** Intervalle de refresh proactif (4 min, avant expiration à 5 min) */
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

const AuthInterceptorsProvider = ({ children }: PropsWithChildren) => {
  useAuthInterceptors();

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await authService.refresh();
      } catch {
        // Silencieux : l'utilisateur peut être déconnecté
      }
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
};

export default AuthInterceptorsProvider;
