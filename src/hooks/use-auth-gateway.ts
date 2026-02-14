import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  authService,
  type LoginDto,
  type RegisterDto,
} from "@/services/auth.service";

/**
 * Hook pour le login via auth-service
 */
export function useLoginGateway() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: LoginDto) => authService.login(dto),
    onSuccess: () => {
      // Invalider les queries pour refetch avec le nouvel état auth
      queryClient.invalidateQueries();
    },
  });
}

/**
 * Hook pour le register via auth-service
 */
export function useRegisterGateway() {
  return useMutation({
    mutationFn: (dto: RegisterDto) => authService.register(dto),
  });
}

/**
 * Hook pour le logout via auth-service
 */
export function useLogoutGateway() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear(); // Clear toutes les queries cachées
    },
  });
}

/**
 * Hook pour refresh token
 */
export function useRefreshTokenGateway() {
  return useMutation({
    mutationFn: () => authService.refresh(),
  });
}

/**
 * Hook pour récupérer le profil utilisateur
 */
export function useProfileGateway() {
  return useQuery({
    queryKey: ["profile-gateway"],
    queryFn: () => authService.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
