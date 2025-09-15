"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { baseUserFormSchema } from "@/lib/schemas/user.schema";
import { sessionStore } from "@/lib/session/session-store";
import type { UserForm } from "@/lib/types/user.types";
import { userService } from "@/services/user.service";

interface EditUsernameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
  userId: string;
}

export function EditUsernameDialog({
  open,
  onOpenChange,
  initialValue,
  userId,
}: EditUsernameDialogProps) {
  const form = useForm<Pick<UserForm, "username">>({
    resolver: zodResolver(baseUserFormSchema.pick({ username: true })),
    defaultValues: { username: initialValue },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { username: string }) =>
      await userService.updateUsername(userId, data.username),
    onSuccess: (updatedUser) => {
      sessionStore.update({ username: updatedUser.username });
      toast.success("Nom d'utilisateur modifié avec succès");
      onOpenChange(false);
    },
    onError: () => {
      toast.error(
        "Une erreur s'est produite lors de la modification du nom d'utilisateur"
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">
            Changer le nom d'utilisateur
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" />
                    En cours...
                  </div>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
