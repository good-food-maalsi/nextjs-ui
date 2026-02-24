import React from "react";

import { Icons } from "@/components/icons";

import RequestPasswordResetForm from "./_components/request-password-reset-form";

const RequestResetPassword = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-5 px-6">
      <Icons.logo className="size-32" />
      <RequestPasswordResetForm />
    </div>
  );
};

export default RequestResetPassword;
