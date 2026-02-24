import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { catalogCategoryService } from "@/services/catalog-category.service";
import type {
  CatalogCategory,
  UpdateCatalogCategoryInput,
} from "@good-food/contracts/catalog";

// Query keys
export const catalogCategoryKeys = {
  all: ["catalogCategories"] as const,
  lists: () => [...catalogCategoryKeys.all, "list"] as const,
  details: () => [...catalogCategoryKeys.all, "detail"] as const,
  detail: (id: string) => [...catalogCategoryKeys.details(), id] as const,
};

// Query hooks
export function useCatalogCategories() {
  return useQuery({
    queryKey: catalogCategoryKeys.lists(),
    queryFn: () => catalogCategoryService.findAll(),
    staleTime: 60 * 1000,
  });
}

export function useCatalogCategory(id: string) {
  return useQuery({
    queryKey: catalogCategoryKeys.detail(id),
    queryFn: () => catalogCategoryService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateCatalogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: catalogCategoryService.create,
    onSuccess: () => {
      toast.success("Catégorie créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la catégorie");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: catalogCategoryKeys.lists() });
    },
  });
}

export function useUpdateCatalogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCatalogCategoryInput;
    }) => catalogCategoryService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: catalogCategoryKeys.detail(id),
      });

      const previousCategory = queryClient.getQueryData<CatalogCategory>(
        catalogCategoryKeys.detail(id),
      );

      queryClient.setQueryData<CatalogCategory>(
        catalogCategoryKeys.detail(id),
        (old) => (old ? { ...old, ...data } : old),
      );

      queryClient.setQueriesData<CatalogCategory[]>(
        { queryKey: catalogCategoryKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((cat) => (cat.id === id ? { ...cat, ...data } : cat));
        },
      );

      return { previousCategory };
    },
    onSuccess: () => {
      toast.success("Catégorie modifiée avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousCategory) {
        queryClient.setQueryData(
          catalogCategoryKeys.detail(id),
          context.previousCategory,
        );
      }
      toast.error("Erreur lors de la modification de la catégorie");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: catalogCategoryKeys.detail(id),
      });
      queryClient.invalidateQueries({ queryKey: catalogCategoryKeys.lists() });
    },
  });
}

export function useDeleteCatalogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: catalogCategoryService.delete,
    onSuccess: () => {
      toast.success("Catégorie supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la catégorie");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: catalogCategoryKeys.lists() });
    },
  });
}
