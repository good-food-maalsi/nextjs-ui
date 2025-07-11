import { PasswordRegisterForm } from "@/components/form/password-registration-form";
import { AuthHeader } from "@/components/auth-header";
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
      <AuthHeader />
      <PasswordRegisterForm
        formTitle="Créer un compte"
        magicToken={magicToken}
        successMessage="Compte créé avec succès"
      >
        Vous avez été invité à rejoindre <b>Lena</b>. Veuillez créer votre mot
        de passe pour finaliser votre inscription.
      </PasswordRegisterForm>
    </div>
  );
}
