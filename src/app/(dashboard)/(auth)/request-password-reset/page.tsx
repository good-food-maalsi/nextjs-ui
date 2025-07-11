import React from "react";
import { AuthHeader } from "@/components/auth-header";
import RequestPasswordResetForm from "./_components/request-password-reset-form";

const RequestResetPassword = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <AuthHeader />
      <RequestPasswordResetForm />
    </div>
  );
};

export default RequestResetPassword;
