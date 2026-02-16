"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { dishFormSchema, type DishFormInput } from "@/lib/schemas/dish.schema";
import { useCreateDish, useUpdateDish, useDish } from "@/hooks/use-dishes";
import { useMenus } from "@/hooks/use-menus";
import { useFranchiseId } from "@/hooks/use-franchise";

interface DishFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** En mode édition, charge le plat et préremplit le formulaire */
  dishId?: string | null;
}

export function DishFormDialog({
  open,
  onOpenChange,
  dishId = null,
}: DishFormDialogProps) {
  const router = useRouter();
  const franchiseId = useFranchiseId();
  const createMutation = useCreateDish();
  const updateMutation = useUpdateDish();
  const { data: dish, isLoading: dishLoading } = useDish(dishId ?? "");
  const { data: menus } = useMenus();

  const isEdit = !!dishId;

  const form = useForm<DishFormInput>({
    resolver: zodResolver(dishFormSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: 0,
      menuId: undefined,
      availability: true,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (open && !isEdit) {
      form.reset({
        name: "",
        description: "",
        basePrice: 0,
        menuId: undefined,
        availability: true,
        imageUrl: "",
      });
    }
  }, [open, isEdit, form]);

  useEffect(() => {
    if (open && isEdit && dish) {
      form.reset({
        name: dish.name,
        description: dish.description ?? "",
        basePrice: dish.basePrice,
        menuId: dish.menuId ?? undefined,
        availability: dish.availability ?? true,
        imageUrl: dish.imageUrl ?? "",
      });
    }
  }, [open, isEdit, dish, form]);

  const onSubmit = async (data: DishFormInput) => {
    if (isEdit) {
      if (!dishId) return;
      try {
        await updateMutation.mutateAsync({
          id: dishId,
          data: {
            name: data.name,
            description: data.description,
            basePrice: data.basePrice,
            availability: data.availability,
            ...(data.menuId ? { menuId: data.menuId } : {}),
            ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
          },
        });
        onOpenChange(false);
      } catch {
        // Error handled by mutation hook (toast)
      }
      return;
    }

    if (!franchiseId) {
      alert("Veuillez vous connecter");
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        franchiseId,
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        menuId: data.menuId ?? "",
        availability: data.availability,
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
      });
      onOpenChange(false);
      router.push(`/dashboard/plats/${created.id}`);
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
            {isEdit ? "Modifier le plat" : "Créer un plat"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Modifiez les informations du plat"
              : "Remplissez les informations du nouveau plat"}
          </DialogDescription>
        </DialogHeader>
        {(isEdit && dishLoading) || (isEdit && !dish) ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {dishLoading ? "Chargement..." : "Plat introuvable"}
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
                    <Input {...field} placeholder="Nom du plat" />
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
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Description du plat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="basePrice"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Prix de base (€ TTC) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={value}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? 0 : parseFloat(val));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="menuId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Menu</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(val === "__none__" ? undefined : val)}
                    value={field.value ?? "__none__"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Aucun menu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">Aucun menu</SelectItem>
                      {menus?.map((menu) => (
                        <SelectItem key={menu.id} value={menu.id}>
                          {menu.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l&apos;image</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
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
