import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { queryClient } from "@/lib/config/query/queryClient";
import { roleErrorMessages } from "@/lib/dictionary/member.dictionary";
import type { User } from "@/lib/types/user.types";
import { userService } from "@/services/user.service";

export function useMemberMutations() {
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: User["role"] }) =>
      userService.updateRole(id, role),

    onMutate: async ({ id, role }) => {
      await queryClient.cancelQueries({ queryKey: ["members"] });
      const previousMembers = queryClient.getQueryData<User[]>(["members"]);

      queryClient.setQueryData<User[]>(["members"], (old) => {
        if (!old) return old;
        return old.map((member) => {
          if (member.id !== id) return member;
          return {
            ...member,
            role,
          };
        });
      });

      return { previousMembers };
    },
    onError: (error, __, context) => {
      if (context?.previousMembers) {
        queryClient.setQueryData(["members"], context.previousMembers);
      }
      let toastMessage = roleErrorMessages.default;
      if (error instanceof AxiosError) {
        toastMessage =
          roleErrorMessages[error.response?.data.message.message] ||
          roleErrorMessages.default;
      }
      toast.error(toastMessage);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("Rôle du membre mis à jour avec succès");
    },
  });

  return {
    updateRoleMutation,
  };
}
