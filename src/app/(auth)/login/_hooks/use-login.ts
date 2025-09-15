import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TLoginSchema } from "@/lib/schemas/auth.schema";
import { loginSchema } from "@/lib/schemas/auth.schema";
import { authService } from "@/services/auth.service";

export const useLogin = () => {
  const router = useRouter();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: TLoginSchema) =>
      authService.login(data.email, data.password),
    onSuccess: () => {
      form.reset();
      toast.success("Connexion réussie");
      router.push("/");
    },
    onError: () => {
      toast.error("Informations de connexion incorrectes");
    },
  });

  const onSubmit = (data: TLoginSchema) => mutate(data);

  return {
    form,
    isPending,
    onSubmit,
  };
};
