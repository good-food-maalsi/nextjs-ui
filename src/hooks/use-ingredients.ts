import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ingredientService } from "@/services/ingredient.service";
import type {
  IngredientWithCategories,
  UpdateIngredientInput,
} from "@good-food-maalsi/contracts/franchise";

interface IngredientsResponse {
  data: IngredientWithCategories[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query keys structure
export const ingredientKeys = {
  all: ["ingredients"] as const,
  lists: () => [...ingredientKeys.all, "list"] as const,
  list: (params: { page?: number; limit?: number; search?: string }) =>
    [...ingredientKeys.lists(), params] as const,
  details: () => [...ingredientKeys.all, "detail"] as const,
  detail: (id: string) => [...ingredientKeys.details(), id] as const,
};

// Query hooks
interface UseIngredientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useIngredients(params: UseIngredientsParams = {}) {
  return useQuery({
    queryKey: ingredientKeys.list(params),
    queryFn: () => ingredientService.findAll(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useIngredient(id: string) {
  return useQuery({
    queryKey: ingredientKeys.detail(id),
    queryFn: () => ingredientService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientService.create,
    onMutate: async (newIngredient) => {
      await queryClient.cancelQueries({ queryKey: ingredientKeys.lists() });

      const previousIngredients = queryClient.getQueriesData({
        queryKey: ingredientKeys.lists(),
      });

      queryClient.setQueriesData<IngredientsResponse>(
        { queryKey: ingredientKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [
              {
                id: `temp-${Date.now()}`,
                ...newIngredient,
                description: newIngredient.description || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                categories: (newIngredient.categories ?? []).map((c) =>
                  "id" in c
                    ? { id: c.id ?? "", name: "" }
                    : { id: "", name: c.name ?? "" },
                ),
              },
              ...old.data,
            ],
            total: old.total + 1,
          };
        },
      );

      return { previousIngredients };
    },
    onSuccess: () => {
      toast.success("Ingrédient créé avec succès");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousIngredients) {
        context.previousIngredients.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la création de l'ingrédient");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
}

export function useUpdateIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIngredientInput }) =>
      ingredientService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ingredientKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: ingredientKeys.lists() });

      const previousIngredient = queryClient.getQueryData(
        ingredientKeys.detail(id),
      );
      const previousLists = queryClient.getQueriesData({
        queryKey: ingredientKeys.lists(),
      });

      queryClient.setQueryData<IngredientWithCategories>(
        ingredientKeys.detail(id),
        (old) =>
          old ? { ...old, ...data, updated_at: new Date().toISOString() } : old,
      );

      queryClient.setQueriesData<IngredientsResponse>(
        { queryKey: ingredientKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((ingredient) =>
              ingredient.id === id
                ? {
                    ...ingredient,
                    ...data,
                    updated_at: new Date().toISOString(),
                  }
                : ingredient,
            ),
          };
        },
      );

      return { previousIngredient, previousLists };
    },
    onSuccess: () => {
      toast.success("Ingrédient modifié avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousIngredient) {
        queryClient.setQueryData(
          ingredientKeys.detail(id),
          context.previousIngredient,
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la modification de l'ingrédient");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
}

export function useDeleteIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ingredientService.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ingredientKeys.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: ingredientKeys.lists(),
      });

      queryClient.setQueriesData<IngredientsResponse>(
        { queryKey: ingredientKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((ingredient) => ingredient.id !== id),
            total: old.total - 1,
          };
        },
      );

      return { previousLists };
    },
    onSuccess: () => {
      toast.success("Ingrédient supprimé avec succès");
    },
    onError: (_error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la suppression de l'ingrédient");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.lists() });
    },
  });
}
