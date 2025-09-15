import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type {
  TpasswordRegisterSchema} from "@/lib/schemas/auth.schema";
import {
  passwordRegisterSchema
} from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";

export const useFormMutation = (magicToken: string, successMessage: string) => {
  const router = useRouter();

  const form = useForm<TpasswordRegisterSchema>({
    resolver: zodResolver(passwordRegisterSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TpasswordRegisterSchema) =>
      authService.register(magicToken, data.password),
    onSuccess: () => {
      form.reset();
      toast.success(successMessage);
      router.push("/login");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la création du compte");
    },
  });

  const onSubmit = (data: TpasswordRegisterSchema) => mutate(data);

  return {
    form,
    isPending,
    onSubmit,
  };
};
