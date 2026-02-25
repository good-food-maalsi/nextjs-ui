"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useRegister } from "../_hooks/use-register";
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

export const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const { form, isPending, onSubmit } = useRegister();

  return (
    <Card className="mx-auto max-w-md w-full p-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <UserPlus />
          Créer un compte
        </CardTitle>
        <CardDescription className="font-light">
          Rejoignez <b>Lena</b> en quelques clics. Renseignez vos informations
          pour vous inscrire.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="username"
                    >
                      Pseudo
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-0 border-b shadow-none"
                        id="username"
                        placeholder="votre_pseudo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        type="email"
                        placeholder="vous@exemple.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="phoneNumber"
                    >
                      Numéro de téléphone
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-none border-0 border-b shadow-none"
                        id="phoneNumber"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
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
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        aria-label={showPassword ? "Masquer" : "Afficher"}
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
                          placeholder="••••••••"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        aria-label={
                          showPasswordConfirmation ? "Masquer" : "Afficher"
                        }
                      >
                        {showPasswordConfirmation ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 pt-2">
                <Button
                  variant="secondary"
                  type="submit"
                  className="px-6"
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      Inscription en cours...
                    </div>
                  ) : (
                    "S'inscrire"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Déjà un compte ?{" "}
                  <Link href="/login" className="hover:underline font-medium">
                    Se connecter
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
