import { AuthHeader } from "@/components/auth-header";

import { LoginForm } from "./_components/login-form";

export default function Login() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <AuthHeader />
      <LoginForm />
      <p className="text-sm text-muted-foreground">Version 0.0.1</p>
    </div>
  );
}
