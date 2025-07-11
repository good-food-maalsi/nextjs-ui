import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClient } from "@/lib/config/query/queryClient";
import { userService } from "@/services/user.service";
import { AxiosError } from "axios";
import { deleteErrorMessages } from "@/lib/dictionary/member.dictionary";

export const useDeleteMember = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.refetchQueries({ queryKey: ["members"] });
      toast.success("Membre supprimé avec succès");
    },
    onError: (error) => {
      let toastMessage = deleteErrorMessages.default;
      if (error instanceof AxiosError) {
        toastMessage =
          deleteErrorMessages[error.response?.data.message.message] ||
          deleteErrorMessages.default;
      }
      toast.error(toastMessage);
    },
  });
};

export const useDeleteManyMembers = () => {
  return useMutation({
    mutationFn: ({ ids }: { ids: string[] }) => userService.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.refetchQueries({ queryKey: ["members"] });
      toast.success("Membres supprimés avec succès");
    },
    onError: (error) => {
      let toastMessage = deleteErrorMessages.default;
      if (error instanceof AxiosError) {
        toastMessage =
          deleteErrorMessages[error.response?.data.message.message] ||
          deleteErrorMessages.default;
      }
      toast.error(toastMessage);
    },
  });
};

export const useDeleteYourself = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => userService.deleteYourself(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Membre supprimé avec succès");
    },
    onError: (error) => {
      let toastMessage = deleteErrorMessages.default;
      if (error instanceof AxiosError) {
        toastMessage =
          deleteErrorMessages[error.response?.data.message.message] ||
          deleteErrorMessages.default;
      }
      toast.error(toastMessage);
    },
  });
};
