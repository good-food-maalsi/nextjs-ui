import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { stockFranchiseService } from "@/services/stock-franchise.service";
import type {
  StockWithIngredient,
  UpdateStockFranchiseInput,
} from "@good-food-maalsi/contracts/franchise";

interface StockFranchiseResponse {
  data: StockWithIngredient[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query keys structure
export const stockKeys = {
  all: ["stocks"] as const,
  lists: () => [...stockKeys.all, "list"] as const,
  list: (params: {
    page?: number;
    limit?: number;
    search?: string;
    franchise_id: string;
  }) => [...stockKeys.lists(), params] as const,
  details: () => [...stockKeys.all, "detail"] as const,
  detail: (id: string) => [...stockKeys.details(), id] as const,
};

// Query hooks
interface UseStocksParams {
  page?: number;
  limit?: number;
  search?: string;
  franchise_id: string;
}

export function useStocks(params: UseStocksParams) {
  return useQuery({
    queryKey: stockKeys.list(params),
    queryFn: () => stockFranchiseService.findAll(params),
    staleTime: 60 * 1000, // 1 minute
    enabled: !!params.franchise_id,
  });
}

export function useStock(id: string) {
  return useQuery({
    queryKey: stockKeys.detail(id),
    queryFn: () => stockFranchiseService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockFranchiseService.create,
    onMutate: async (newStock) => {
      await queryClient.cancelQueries({ queryKey: stockKeys.lists() });

      const previousStocks = queryClient.getQueriesData({
        queryKey: stockKeys.lists(),
      });

      queryClient.setQueriesData<StockFranchiseResponse>(
        { queryKey: stockKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [
              {
                id: `temp-${Date.now()}`,
                franchise_id: newStock.franchise_id ?? "",
                ingredient_id: newStock.ingredient_id,
                quantity: newStock.quantity,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                ingredient: {
                  id: newStock.ingredient_id,
                  name: "Loading...",
                  unit_price: 0,
                },
              },
              ...old.data,
            ],
            total: old.total + 1,
          };
        },
      );

      return { previousStocks };
    },
    onSuccess: () => {
      toast.success("Stock créé avec succès");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousStocks) {
        context.previousStocks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la création du stock");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateStockFranchiseInput;
    }) => stockFranchiseService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: stockKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: stockKeys.lists() });

      const previousStock = queryClient.getQueryData(stockKeys.detail(id));
      const previousLists = queryClient.getQueriesData({
        queryKey: stockKeys.lists(),
      });

      queryClient.setQueryData<StockWithIngredient>(
        stockKeys.detail(id),
        (old) =>
          old ? { ...old, ...data, updated_at: new Date().toISOString() } : old,
      );

      queryClient.setQueriesData<StockFranchiseResponse>(
        { queryKey: stockKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((stock) =>
              stock.id === id
                ? { ...stock, ...data, updated_at: new Date().toISOString() }
                : stock,
            ),
          };
        },
      );

      return { previousStock, previousLists };
    },
    onSuccess: () => {
      toast.success("Stock modifié avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousStock) {
        queryClient.setQueryData(stockKeys.detail(id), context.previousStock);
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la modification du stock");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: stockKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}

export function useDeleteStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockFranchiseService.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: stockKeys.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: stockKeys.lists(),
      });

      queryClient.setQueriesData<StockFranchiseResponse>(
        { queryKey: stockKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((stock) => stock.id !== id),
            total: old.total - 1,
          };
        },
      );

      return { previousLists };
    },
    onSuccess: () => {
      toast.success("Stock supprimé avec succès");
    },
    onError: (_error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la suppression du stock");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: stockKeys.lists() });
    },
  });
}
