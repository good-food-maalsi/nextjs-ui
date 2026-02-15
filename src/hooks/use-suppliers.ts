import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supplierService } from "@/services/supplier.service";
import type {
  Supplier,
  UpdateSupplierInput,
} from "@good-food-maalsi/contracts/franchise";

interface SuppliersResponse {
  data: Supplier[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query keys structure
export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  list: (params: { page?: number; limit?: number; search?: string }) =>
    [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all, "detail"] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};

// Query hooks
interface UseSuppliersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useSuppliers(params: UseSuppliersParams = {}) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierService.findAll(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useSupplier(id: string) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierService.findById(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierService.create,
    onMutate: async (newSupplier) => {
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      const previousSuppliers = queryClient.getQueriesData({
        queryKey: supplierKeys.lists(),
      });

      queryClient.setQueriesData<SuppliersResponse>(
        { queryKey: supplierKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: [
              {
                id: `temp-${Date.now()}`,
                ...newSupplier,
                logo_url: newSupplier.logo_url || null,
                latitude: newSupplier.latitude || null,
                longitude: newSupplier.longitude || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
              ...old.data,
            ],
            total: old.total + 1,
          };
        },
      );

      return { previousSuppliers };
    },
    onSuccess: () => {
      toast.success("Fournisseur créé avec succès");
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSuppliers) {
        context.previousSuppliers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la création du fournisseur");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSupplierInput }) =>
      supplierService.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: supplierKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      const previousSupplier = queryClient.getQueryData(
        supplierKeys.detail(id),
      );
      const previousLists = queryClient.getQueriesData({
        queryKey: supplierKeys.lists(),
      });

      queryClient.setQueryData<Supplier>(supplierKeys.detail(id), (old) =>
        old ? { ...old, ...data, updated_at: new Date().toISOString() } : old,
      );

      queryClient.setQueriesData<SuppliersResponse>(
        { queryKey: supplierKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((supplier) =>
              supplier.id === id
                ? { ...supplier, ...data, updated_at: new Date().toISOString() }
                : supplier,
            ),
          };
        },
      );

      return { previousSupplier, previousLists };
    },
    onSuccess: () => {
      toast.success("Fournisseur modifié avec succès");
    },
    onError: (_error, { id }, context) => {
      if (context?.previousSupplier) {
        queryClient.setQueryData(
          supplierKeys.detail(id),
          context.previousSupplier,
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la modification du fournisseur");
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: supplierService.delete,
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: supplierKeys.lists() });

      const previousLists = queryClient.getQueriesData({
        queryKey: supplierKeys.lists(),
      });

      queryClient.setQueriesData<SuppliersResponse>(
        { queryKey: supplierKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.filter((supplier) => supplier.id !== id),
            total: old.total - 1,
          };
        },
      );

      return { previousLists };
    },
    onSuccess: () => {
      toast.success("Fournisseur supprimé avec succès");
    },
    onError: (_error, _id, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Erreur lors de la suppression du fournisseur");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
  });
}
