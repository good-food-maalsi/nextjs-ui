import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useLoginGateway } from "@/hooks/use-auth-gateway";
import { loginSchema, type TLoginSchema } from "@/lib/schemas/auth.schema";

const DASHBOARD_ROLES = ["ADMIN", "FRANCHISE_OWNER", "STAFF"];

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginGateway();

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: TLoginSchema) => {
    loginMutation.mutate(
      { email: data.email, password: data.password },
      {
        onSuccess: (response) => {
          form.reset();
          toast.success("Connexion réussie");
          const roles = response?.user?.roles ?? [];
          const hasDashboardRole = roles.some((r) => DASHBOARD_ROLES.includes(r));
          const redirect = searchParams.get("redirect");
          const destination = hasDashboardRole
            ? (redirect ?? "/dashboard")
            : "/";
          router.push(destination);
        },
        onError: () => {
          toast.error("Informations de connexion incorrectes");
        },
      }
    );
  };

  return {
    form,
    isPending: loginMutation.isPending,
    onSubmit,
  };
};
