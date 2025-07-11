import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { userService } from "../services/user.service";
import { sessionStore } from "@/lib/session/session-store";

export function useUpdateUserPicture() {
  return useMutation({
    mutationFn: userService.updateUserPicture,
    onSuccess: (data) => {
      sessionStore.update({ picture: data.picture || null });
      toast.success("Photo de profil mise à jour !");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });
}
