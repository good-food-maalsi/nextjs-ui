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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ingredientFormSchema,
  type IngredientFormInput,
} from "@/lib/schemas/ingredient.schema";
import {
  useCreateIngredient,
  useUpdateIngredient,
} from "@/hooks/use-ingredients";
import { useSuppliers } from "@/hooks/use-suppliers";
import type { Ingredient } from "@/lib/types/ingredient.types";

interface IngredientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient?: Ingredient;
}

export function IngredientFormDialog({
  open,
  onOpenChange,
  ingredient,
}: IngredientFormDialogProps) {
  const isEditMode = !!ingredient;

  const createMutation = useCreateIngredient();
  const updateMutation = useUpdateIngredient();

  const { data: suppliersData } = useSuppliers({ limit: 100 });

  const form = useForm<IngredientFormInput>({
    resolver: zodResolver(ingredientFormSchema),
    defaultValues: {
      name: "",
      description: "",
      supplier_id: "",
      unit_price: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (ingredient) {
        form.reset({
          name: ingredient.name,
          description: ingredient.description || "",
          supplier_id: ingredient.supplier_id,
          unit_price: ingredient.unit_price,
        });
      } else {
        form.reset({
          name: "",
          description: "",
          supplier_id: "",
          unit_price: 0,
        });
      }
    }
  }, [open, ingredient, form]);

  const onSubmit = async (data: IngredientFormInput) => {
    try {
      const payload = {
        ...data,
        description: data.description === "" ? undefined : data.description,
      };

      if (isEditMode) {
        await updateMutation.mutateAsync({ id: ingredient.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      onOpenChange(false);
      form.reset();
    } catch {
      // Error handled by mutation hooks (toast)
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? "Modifier l'ingrédient"
              : "Ajouter un ingrédient"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifiez les informations de l'ingrédient"
              : "Remplissez les informations du nouvel ingrédient"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'ingrédient" />
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
                    <Input {...field} placeholder="Description (optionnelle)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplier_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fournisseur *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un fournisseur" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliersData?.data.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.name}
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
              name="unit_price"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Prix unitaire (€) *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
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
                {isPending ? "En cours..." : isEditMode ? "Modifier" : "Créer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
