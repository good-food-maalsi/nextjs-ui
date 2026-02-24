"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProfileGateway } from "./use-auth-gateway";

export function useRequireAuth(requiredRole?: string) {
  const { data: profile, isLoading, isError } = useProfileGateway();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isError) {
      if (!profile) {
        // Not authenticated
        const redirectUrl = encodeURIComponent(window.location.pathname);
        router.push(`/login?redirect=${redirectUrl}`);
      } else if (requiredRole && profile.role !== requiredRole) {
        // Wrong role
        toast.error("Accès refusé : compte client requis");
        router.push("/");
      }
    }
  }, [profile, isLoading, isError, requiredRole, router]);

  return {
    profile,
    isLoading,
    isAuthenticated:
      !!profile && (!requiredRole || profile.role === requiredRole),
  };
}
