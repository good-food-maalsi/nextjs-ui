import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import type {
  CreateOrderInput,
  UpdateOrderItemsInput,
} from "@good-food-maalsi/contracts/commands";

// Query keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

// Query hooks
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: () => orderService.findAll(),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderInput) => orderService.create(data),
    onSuccess: () => {
      toast.success("Commande créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la commande");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useUpdateOrderItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderItemsInput }) =>
      orderService.updateItems(id, data),
    onSuccess: (_data, { id }) => {
      toast.success("Panier mis à jour");
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour du panier");
    },
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      orderService.updateStatus(id, { status: "confirmed" }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => orderService.delete(id),
    onSuccess: () => {
      toast.success("Commande supprimée");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la commande");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}
