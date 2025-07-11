"use client";
import React from "react";
import Link from "next/link";
import { useRequestPasswordReset } from "../_hooks/use-request-password-reset";
import { KeyRound, Loader2 } from "lucide-react";
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

const RequestPasswordResetForm = () => {
  const { form, isPending, onSubmit } = useRequestPasswordReset();
  return (
    <Card className="mx-auto max-w-lg p-4 text-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <KeyRound />
          Mot de passe oublié
        </CardTitle>
        <CardDescription className="font-light">
          Renseignez l'email lié à votre compte pour recevoir un lien pour
          réinitialiser votre mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel
                      className="text-xs font-semibold"
                      htmlFor="password"
                    >
                      Email
                    </FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          className="rounded-none border-0 border-b border-secondary pr-10 shadow-none"
                          value={field.value || ""}
                          onChange={field.onChange}
                          type="email"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Button type="submit" className="px-6" disabled={isPending}>
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" />
                      En cours...
                    </div>
                  ) : (
                    "Confirmer"
                  )}
                </Button>
                <Link href="/login" className="hover:underline">
                  Connexion
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestPasswordResetForm;
