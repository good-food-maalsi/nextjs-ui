import { useQuery } from "@tanstack/react-query";
import { franchiseService } from "@/services/franchise.service";

export const franchiseKeys = {
  all: ["franchises"] as const,
  lists: () => [...franchiseKeys.all, "list"] as const,
  list: (params: { page?: number; limit?: number; search?: string; city?: string; state?: string }) =>
    [...franchiseKeys.lists(), params] as const,
  details: () => [...franchiseKeys.all, "detail"] as const,
  detail: (id: string) => [...franchiseKeys.details(), id] as const,
};

export function useFranchises(params: {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  state?: string;
} = {}) {
  return useQuery({
    queryKey: franchiseKeys.list(params),
    queryFn: () => franchiseService.findAll(params),
    staleTime: 60 * 1000,
  });
}

export function useFranchise(id: string) {
  return useQuery({
    queryKey: franchiseKeys.detail(id),
    queryFn: () => franchiseService.findById(id),
    enabled: !!id,
  });
}
