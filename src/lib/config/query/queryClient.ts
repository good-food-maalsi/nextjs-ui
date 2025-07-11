import { isServer, QueryClient } from "@tanstack/react-query";
import { queryConfig } from "@/lib/config/query/query.config";

let browserQueryClient: QueryClient | undefined = undefined;

export const queryClient = (() => {
  if (isServer) {
    return new QueryClient(queryConfig); // Nouvelle instance côté serveur (SSR)
  }

  if (!browserQueryClient) {
    browserQueryClient = new QueryClient(queryConfig); // Singleton côté client
  }

  return browserQueryClient;
})();
