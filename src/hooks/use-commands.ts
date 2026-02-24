import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { commandService } from "@/services/command.service";
import type {
  CreateCommandInput,
  UpdateCommandInput,
  CommandQueryParams,
  Command,
  CommandWithItems,
} from "@good-food/contracts/franchise";

// Query keys
export const commandKeys = {
  all: ["commands"] as const,
  lists: () => [...commandKeys.all, "list"] as const,
  list: (params: CommandQueryParams) =>
    [...commandKeys.lists(), params] as const,
  detail: (id: string) => [...commandKeys.all, "detail", id] as const,
};

export function useCommands(params: CommandQueryParams = {}) {
  return useQuery({
    queryKey: commandKeys.list(params),
    queryFn: () => commandService.findAll(params),
    staleTime: 30 * 1000,
  });
}

export function useCommand(id: string) {
  return useQuery<CommandWithItems>({
    queryKey: commandKeys.detail(id),
    queryFn: () => commandService.findById(id),
    enabled: !!id,
  });
}

export function useCreateCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCommandInput) => commandService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commandKeys.lists() });
      toast.success("Commande créée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la création de la commande");
    },
  });
}

export function useUpdateCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCommandInput }) =>
      commandService.update(id, dto),
    onSuccess: (data: Command, variables) => {
      queryClient.invalidateQueries({ queryKey: commandKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: commandKeys.detail(variables.id),
      });
      toast.success("Commande mise à jour avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour de la commande");
    },
  });
}

export function useDeleteCommand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => commandService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commandKeys.lists() });
      toast.success("Commande supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de la commande");
    },
  });
}
