import { Icons } from "@/components/icons";

import { LoginForm } from "./_components/login-form";

export default function Login() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <Icons.logo className="size-32" />
      <LoginForm />
      <p className="text-sm text-muted-foreground">Version 0.0.1</p>
    </div>
  );
}
