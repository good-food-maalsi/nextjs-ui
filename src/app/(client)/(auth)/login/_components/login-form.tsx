"use client";

import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useLogin } from "../_hooks/use-login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { form, isPending, onSubmit: login } = useLogin();

  return (
    <Card className="mx-auto max-w-md p-4 w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <LockKeyhole />
          Se connecter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(login)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="email"
                    >
                      Adresse e-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-0 border-b shadow-none"
                        id="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        data-testid="eye-icon"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-3">
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
                  <Link
                    href="/request-password-reset"
                    className="hover:underline text-sm"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Pas encore de compte ?{" "}
                  <Link href="/signup" className="hover:underline font-medium">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
