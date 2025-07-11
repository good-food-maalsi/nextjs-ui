"use client";

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
import { userService } from "@/services/user.service";
import { sessionStore } from "@/lib/session/session-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { baseUserFormSchema } from "@/lib/schemas/user.schema";
import { UserForm } from "@/lib/types/user.types";

interface EditEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValue: string;
  userId: string;
}

export function EditEmailDialog({
  open,
  onOpenChange,
  initialValue,
  userId,
}: EditEmailDialogProps) {
  const form = useForm<Pick<UserForm, "email">>({
    resolver: zodResolver(baseUserFormSchema.pick({ email: true })),
    defaultValues: { email: initialValue },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { email: string }) =>
      await userService.updateEmail(userId, data.email),
    onSuccess: (updatedUser) => {
      sessionStore.update({ email: updatedUser.email });
      toast.success("Email modifié avec succès");
      onOpenChange(false);
    },
    onError: () => {
      toast.error(
        "Une erreur s'est produite lors de la modification de l'email"
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">
            Changer l'adresse email
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutate(data))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouvelle adresse email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
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
