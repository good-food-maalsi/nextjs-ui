import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dishService } from "@/services/dish.service";
import type {
  Dish,
  UpdateDishInput,
  CreateDishIngredientInput,
  UpdateDishIngredientInput,
} from "@good-food/contracts/catalog";

// Query keys
export const dishKeys = {
  all: ["dishes"] as const,
  lists: () => [...dishKeys.all, "list"] as const,
  list: (params: { menuId?: string }) => [...dishKeys.lists(), params] as const,
  details: () => [...dishKeys.all, "detail"] as const,
  detail: (id: string) => [...dishKeys.details(), id] as const,
  ingredients: (dishId: string) => [...dishKeys.detail(dishId), "ingredients"] as const,
};

// Query hooks
export function useDishes(params: { menuId?: string } = {}) {
  return useQuery({
    queryKey: dishKeys.list(params),
    queryFn: () => dishService.findAll(params),
    staleTime: 60 * 1000,
  });
}

export function useDish(id: string) {
  return useQuery({
    queryKey: dishKeys.detail(id),
    queryFn: () => dishService.findById(id),
    enabled: !!id,
  });
}

export function useDishIngredients(dishId: string) {
  return useQuery({
    queryKey: dishKeys.ingredients(dishId),
    queryFn: () => dishService.getIngredients(dishId),
    enabled: !!dishId,
  });
}

// Mutation hooks
export function useCreateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishService.create,
    onSuccess: () => {
      toast.success("Plat créé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création du plat");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.all });
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDishInput }) =>
      dishService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: dishKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: dishKeys.lists() });

      const previousDish = queryClient.getQueryData<Dish>(dishKeys.detail(id));
      const previousLists = queryClient.getQueriesData<Dish[]>({ queryKey: dishKeys.lists() });

      queryClient.setQueryData<Dish>(dishKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old
      );

      queryClient.setQueriesData<Dish[]>({ queryKey: dishKeys.lists() }, (old) => {
        if (!old) return old;
        return old.map((dish) => (dish.id === id ? { ...dish, ...data } : dish));
      });

      return { previousDish, previousLists };
    },
    onSuccess: () => {
      toast.success("Plat modifié avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousDish) {
        queryClient.setQueryData(dishKeys.detail(id), context.previousDish);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la modification du plat");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: dishKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishService.delete,
    onSuccess: () => {
      toast.success("Plat supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression du plat");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dishKeys.lists() });
    },
  });
}

export function useAddDishIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dishId, data }: { dishId: string; data: CreateDishIngredientInput }) =>
      dishService.addIngredient(dishId, data),
    onSuccess: (_data, { dishId }) => {
      toast.success("Ingrédient ajouté au plat");
      queryClient.invalidateQueries({ queryKey: dishKeys.ingredients(dishId) });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout de l'ingrédient");
    },
  });
}

export function useUpdateDishIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dishId,
      ingredientId,
      data,
    }: {
      dishId: string;
      ingredientId: string;
      data: UpdateDishIngredientInput;
    }) => dishService.updateIngredient(dishId, ingredientId, data),
    onSuccess: (_data, { dishId }) => {
      toast.success("Ingrédient mis à jour");
      queryClient.invalidateQueries({ queryKey: dishKeys.ingredients(dishId) });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de l'ingrédient");
    },
  });
}

export function useRemoveDishIngredient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dishId, ingredientId }: { dishId: string; ingredientId: string }) =>
      dishService.removeIngredient(dishId, ingredientId),
    onSuccess: (_data, { dishId }) => {
      toast.success("Ingrédient retiré du plat");
      queryClient.invalidateQueries({ queryKey: dishKeys.ingredients(dishId) });
    },
    onError: () => {
      toast.error("Erreur lors du retrait de l'ingrédient");
    },
  });
}
