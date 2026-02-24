import { useQuery } from "@tanstack/react-query";
import * as catalogContentService from "@/services/catalog-content.service";

export interface CatalogContentParams {
  franchiseId?: string;
  categoryId?: string;
}

const contentKeys = {
  all: ["catalog", "content"] as const,
  list: (params: CatalogContentParams) =>
    [...contentKeys.all, params.franchiseId ?? "", params.categoryId ?? ""] as const,
};

/**
 * GET /catalog/content — menus + plats en un seul appel (filtre catégorie + franchise).
 * À utiliser avec enabled: !!franchiseId sur la page restaurant pour ne pas appeler sans franchise.
 */
export function useCatalogContent(
  params: CatalogContentParams,
  options?: { enabled?: boolean }
) {
  const enabled = options?.enabled ?? true;
  return useQuery({
    queryKey: contentKeys.list(params),
    queryFn: () => catalogContentService.getContent(params),
    enabled: enabled && !!params.franchiseId,
    staleTime: 60 * 1000,
  });
}
