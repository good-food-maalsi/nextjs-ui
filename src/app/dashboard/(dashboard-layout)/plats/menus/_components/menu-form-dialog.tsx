"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { menuFormSchema, type MenuFormInput } from "@/lib/schemas/menu.schema";
import { useCreateMenu, useUpdateMenu, useMenu } from "@/hooks/use-menus";

interface MenuFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** En mode édition, charge le menu et préremplit le formulaire */
  menuId?: string | null;
}

export function MenuFormDialog({
  open,
  onOpenChange,
  menuId = null,
}: MenuFormDialogProps) {
  const createMutation = useCreateMenu();
  const updateMutation = useUpdateMenu();
  const { data: menu, isLoading: menuLoading } = useMenu(menuId ?? "");

  const isEdit = !!menuId;

  const form = useForm<MenuFormInput>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      name: "",
      description: "",
      availability: true,
    },
  });

  useEffect(() => {
    if (open && !isEdit) {
      form.reset({ name: "", description: "", availability: true });
    }
  }, [open, isEdit, form]);

  useEffect(() => {
    if (open && isEdit && menu) {
      form.reset({
        name: menu.name,
        description: menu.description ?? "",
        availability: menu.availability ?? true,
      });
    }
  }, [open, isEdit, menu, form]);

  const onSubmit = async (data: MenuFormInput) => {
    try {
      if (isEdit) {
        if (!menuId) return;
        await updateMutation.mutateAsync({
          id: menuId,
          data: {
            name: data.name,
            ...(data.description !== undefined && { description: data.description }),
            availability: data.availability,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description ?? "",
          availability: data.availability,
        });
      }
      onOpenChange(false);
    } catch {
      // Error handled by mutation hook (toast)
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Modifier le menu" : "Créer un menu"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations du menu"
              : "Remplissez les informations du nouveau menu"}
          </DialogDescription>
        </DialogHeader>

        {isEdit && (menuLoading || !menu) ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {menuLoading ? "Chargement..." : "Menu introuvable"}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du menu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description du menu" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availability"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Disponible</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending
                    ? "En cours..."
                    : isEdit
                      ? "Enregistrer"
                      : "Créer"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
