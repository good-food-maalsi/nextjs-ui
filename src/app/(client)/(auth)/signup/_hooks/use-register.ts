import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  registerSchema,
  type TRegisterSchema,
} from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";

export const useRegister = () => {
  const router = useRouter();

  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TRegisterSchema) =>
      authService.register({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    onSuccess: () => {
      form.reset();
      toast.success("Compte créé avec succès");
      router.push("/home");
    },
    onError: (err: {
      response?: { status?: number; data?: { error?: string } };
      message?: string;
    }) => {
      const status = err?.response?.status;
      const message =
        err?.response?.data?.error ??
        err?.message ??
        (status === 503
          ? "Service temporairement indisponible. Réessayez dans quelques instants."
          : "Inscription impossible");
      toast.error(message);
    },
  });

  const onSubmit = (data: TRegisterSchema) => mutate(data);

  return {
    form,
    isPending,
    onSubmit,
  };
};
