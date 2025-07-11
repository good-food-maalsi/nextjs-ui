"use client";

import { PropsWithChildren } from "react";
import { useAuthInterceptors } from "@/hooks/use-authInterceptor";

const AuthInterceptorsProvider = ({ children }: PropsWithChildren) => {
  useAuthInterceptors();

  return <>{children}</>;
};

export default AuthInterceptorsProvider;
