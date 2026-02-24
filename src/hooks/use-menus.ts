import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { menuService } from "@/services/menu.service";
import type { Menu, UpdateMenuInput } from "@good-food/contracts/catalog";

export interface MenuQueryParams {
  categoryId?: string;
  franchiseId?: string;
}

// Query keys (params sérialisés pour que le changement de catégorie déclenche bien un refetch)
export const menuKeys = {
  all: ["menus"] as const,
  lists: () => [...menuKeys.all, "list"] as const,
  list: (params: MenuQueryParams) =>
    [
      ...menuKeys.lists(),
      params.categoryId ?? null,
      params.franchiseId ?? null,
    ] as const,
  details: () => [...menuKeys.all, "detail"] as const,
  detail: (id: string) => [...menuKeys.details(), id] as const,
};

// Query hooks
export function useMenus(params: MenuQueryParams = {}) {
  return useQuery({
    queryKey: menuKeys.list(params),
    queryFn: () => menuService.findAll(params),
    staleTime: 60 * 1000,
  });
}

export function useMenu(id: string) {
  return useQuery({
    queryKey: menuKeys.detail(id),
    queryFn: () => menuService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.create,
    onSuccess: () => {
      toast.success("Menu créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du menu");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuInput }) =>
      menuService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: menuKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: menuKeys.lists() });

      const previousMenu = queryClient.getQueryData<Menu>(menuKeys.detail(id));
      const previousLists = queryClient.getQueriesData<Menu[]>({
        queryKey: menuKeys.lists(),
      });

      queryClient.setQueryData<Menu>(menuKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old,
      );

      queryClient.setQueriesData<Menu[]>(
        { queryKey: menuKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((menu) =>
            menu.id === id ? { ...menu, ...data } : menu,
          );
        },
      );

      return { previousMenu, previousLists };
    },
    onSuccess: () => {
      toast.success("Menu modifié avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousMenu) {
        queryClient.setQueryData(menuKeys.detail(id), context.previousMenu);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la modification du menu");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: menuService.delete,
    onSuccess: () => {
      toast.success("Menu supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du menu");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.lists() });
    },
  });
}
