import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { discountService } from "@/services/discount.service";
import type {
  Discount,
  UpdateDiscountInput,
} from "@good-food/contracts/catalog";

// Query keys
export const discountKeys = {
  all: ["discounts"] as const,
  lists: () => [...discountKeys.all, "list"] as const,
  details: () => [...discountKeys.all, "detail"] as const,
  detail: (id: string) => [...discountKeys.details(), id] as const,
};

// Query hooks
export function useDiscounts() {
  return useQuery({
    queryKey: discountKeys.lists(),
    queryFn: () => discountService.findAll(),
    staleTime: 60 * 1000,
  });
}

export function useDiscount(id: string) {
  return useQuery({
    queryKey: discountKeys.detail(id),
    queryFn: () => discountService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: discountService.create,
    onSuccess: () => {
      toast.success("Réduction créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la réduction");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
    },
  });
}

export function useUpdateDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDiscountInput }) =>
      discountService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: discountKeys.detail(id) });

      const previousDiscount = queryClient.getQueryData<Discount>(
        discountKeys.detail(id),
      );

      queryClient.setQueryData<Discount>(discountKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old,
      );

      queryClient.setQueriesData<Discount[]>(
        { queryKey: discountKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((d) => (d.id === id ? { ...d, ...data } : d));
        },
      );

      return { previousDiscount };
    },
    onSuccess: () => {
      toast.success("Réduction modifiée avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousDiscount) {
        queryClient.setQueryData(
          discountKeys.detail(id),
          context.previousDiscount,
        );
      }
      toast.error("Erreur lors de la modification de la réduction");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: discountKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
    },
  });
}

export function useDeleteDiscount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: discountService.delete,
    onSuccess: () => {
      toast.success("Réduction supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la réduction");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: discountKeys.lists() });
    },
  });
}
