"use client";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { queryClient } from "@/lib/config/query/queryClient";
import { memberFormSchema } from "@/lib/schemas/user.schema";
import { MemberForm } from "@/lib/types/user.types";
import { useState } from "react";

export default function FormMembers() {
  const [selectedRole, setSelectedRole] = useState<
    "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "READER" | undefined
  >(undefined);

  const form = useForm<MemberForm>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: {
      profilePicture: [],
      username: "",
      email: "",
      role: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MemberForm) =>
      authService.invite({ ...data, status: "En cours ..." }),
    onSuccess: () => {
      form.reset({
        profilePicture: [],
        username: "",
        email: "",
        role: selectedRole,
      });
      toast.success("Membre invité avec succès");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.refetchQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de l'invitation du membre");
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => mutate(data))}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="profilePicture"
          render={({ field }) => (
            <FormItem className="flex items-start gap-6">
              <FileUpload
                value={field.value}
                onChange={(files) => field.onChange(files)}
                size="icon"
                accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                maxFiles={1}
              />
              <div className="flex flex-col gap-1">
                <FormLabel
                  className="text-base font-medium"
                  htmlFor="profilePicture"
                >
                  Photo de profil (optionnel)
                </FormLabel>
                <FormDescription className="text-sm leading-normal">
                  Cliquez pour importer ou glissez-déposez dans le cercle en
                  pointillés.
                  <br />
                  Taille maximale du fichier: 100ko.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium" htmlFor="username">
                  Nom d'utilisateur*
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="username"
                    type="text"
                    placeholder="Prénom Nom"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium" htmlFor="role">
                  Rôle*
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedRole(
                      value as
                        | "SUPER_ADMIN"
                        | "ADMIN"
                        | "EDITOR"
                        | "READER"
                        | undefined
                    );
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="EDITOR">Éditeur</SelectItem>
                    <SelectItem value="READER">Lecteur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium" htmlFor="email">
                  Email*
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="exemple@exemple.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              En cours...
            </div>
          ) : (
            "Inviter"
          )}
        </Button>
      </form>
    </Form>
  );
}
