import { PasswordRegisterForm } from "@/components/form/password-registration-form";
import { RegisterHeader } from "./_components/register-header";
import { redirect } from "next/navigation";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ magicToken: string | undefined }>;
}) {
  const { magicToken } = await searchParams;

  if (!magicToken) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <RegisterHeader />
      <PasswordRegisterForm
        formTitle="Réinitialiser mon mot de passe"
        magicToken={magicToken}
        successMessage="Mot de passe mis à jour"
      >
        Vous avez demandé à réinitialiser votre mot de passe. Veuillez en créer
        un nouveau avant de vous reconnecter.
      </PasswordRegisterForm>
    </div>
  );
}
