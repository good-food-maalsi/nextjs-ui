import { Suspense } from "react";

import { Icons } from "@/components/icons";

import { LoginForm } from "./_components/login-form";

function LoginFormFallback() {
  return (
    <div className="mx-auto h-[360px] w-full max-w-md animate-pulse rounded-lg border bg-muted/30 p-4" />
  );
}

export default function Login() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <Icons.logo className="size-32" />
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
      <p className="text-sm text-muted-foreground">Version 0.0.1</p>
    </div>
  );
}
