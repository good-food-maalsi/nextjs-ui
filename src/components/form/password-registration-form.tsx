"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormMutation } from "@/hooks/use-password-register";

interface RegisterFormProps {
  formTitle: string;
  children: React.ReactNode;
  magicToken: string;
  successMessage: string;
}

export const PasswordRegisterForm = ({
  formTitle,
  children,
  magicToken,
  successMessage,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const {
    form,
    isPending,
    onSubmit: setPassword,
  } = useFormMutation(magicToken, successMessage);

  return (
    <Card className="mx-auto max-w-md p-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <UserPlus />
          {formTitle}
        </CardTitle>
        <CardDescription className="font-light">{children}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-7">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(setPassword)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="password"
                    >
                      Mot de passe
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-none border-0 border-b pr-10 shadow-none"
                          id="password"
                          type={showPassword ? "text" : "password"}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="eye-icon"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="passwordConfirmation"
                    >
                      Confirmer le mot de passe
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-none border-0 border-b pr-10 shadow-none"
                          id="passwordConfirmation"
                          type={showPasswordConfirmation ? "text" : "password"}
                        />
                      </FormControl>
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        data-testid="eye-icon"
                      >
                        {showPasswordConfirmation ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  type="submit"
                  className="px-6"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      En cours...
                    </div>
                  ) : (
                    "Valider"
                  )}
                </Button>
                <Link href="/login" className="hover:underline">
                  Déjà un compte ?
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
