import { useQuery } from "@tanstack/react-query";
import * as catalogSearchService from "@/services/catalog-search.service";

const searchKeys = {
  all: ["catalog", "search"] as const,
  query: (q: string, franchiseId?: string) =>
    [...searchKeys.all, q.trim().toLowerCase(), franchiseId ?? ""] as const,
};

/** GET /catalog/search?q= — activé uniquement quand q est non vide (après trim). Optionnel : franchiseId pour limiter à une franchise. */
export function useCatalogSearch(q: string, franchiseId?: string) {
  const trimmed = typeof q === "string" ? q.trim() : "";
  return useQuery({
    queryKey: searchKeys.query(trimmed, franchiseId),
    queryFn: () => catalogSearchService.search(trimmed, franchiseId),
    enabled: trimmed.length > 0,
    staleTime: 60 * 1000,
  });
}
