import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  TrequestPasswordResetSchema} from "@/lib/schemas/auth.schema";
import {
  requestPasswordResetSchema
} from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";

export const useRequestPasswordReset = () => {
  const form = useForm<TrequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TrequestPasswordResetSchema) =>
      authService.requestPasswordReset(data.email),
    onSuccess: () => {
      form.reset();
      toast.success(
        "Vérifiez vos mails pour réinitialiser votre mot de passe."
      );
    },
    onError: () => {
      toast.error(
        "Une erreur est survenue, veuillez réessayer ultérieurement."
      );
    },
  });

  const onSubmit = (data: TrequestPasswordResetSchema) => mutate(data);

  return {
    form,
    isPending,
    onSubmit,
  };
};
