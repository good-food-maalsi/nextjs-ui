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
  stockFranchiseFormSchema,
  type StockFranchiseFormInput,
} from "@/lib/schemas/stock-franchise.schema";
import { useCreateStock, useUpdateStock } from "@/hooks/use-stocks";
import { useIngredients } from "@/hooks/use-ingredients";
import { useFranchiseId } from "@/hooks/use-franchise";
import type { StockFranchise } from "@/lib/types/stock-franchise.types";

interface StockFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock?: StockFranchise;
}

export function StockFormDialog({
  open,
  onOpenChange,
  stock,
}: StockFormDialogProps) {
  const isEditMode = !!stock;
  const franchiseId = useFranchiseId();

  const createMutation = useCreateStock();
  const updateMutation = useUpdateStock();

  const { data: ingredientsData } = useIngredients({ limit: 100 });

  const form = useForm<StockFranchiseFormInput>({
    resolver: zodResolver(stockFranchiseFormSchema),
    defaultValues: {
      ingredient_id: "",
      quantity: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (stock) {
        form.reset({
          ingredient_id: stock.ingredient_id,
          quantity: stock.quantity,
        });
      } else {
        form.reset({
          ingredient_id: "",
          quantity: 0,
        });
      }
    }
  }, [open, stock, form]);

  const onSubmit = async (data: StockFranchiseFormInput) => {
    if (!franchiseId) {
      alert("Veuillez vous connecter");
      return;
    }

    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: stock.id,
          data: { quantity: data.quantity },
        });
      } else {
        await createMutation.mutateAsync({
          franchise_id: franchiseId,
          ingredient_id: data.ingredient_id,
          quantity: data.quantity,
        });
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
            {isEditMode ? "Modifier le stock" : "Ajouter un stock"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Modifiez la quantité en stock"
              : "Ajoutez un nouvel ingrédient au stock de votre franchise"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isEditMode && (
              <FormField
                control={form.control}
                name="ingredient_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ingrédient *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un ingrédient" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ingredientsData?.data.map((ingredient) => (
                          <SelectItem key={ingredient.id} value={ingredient.id}>
                            {ingredient.name} - {ingredient.supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {isEditMode && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">
                  Ingrédient : {stock.ingredient.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Fournisseur : {stock.ingredient.supplier.name}
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Quantité *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="1"
                      placeholder="0"
                      value={value}
                      onChange={(e) => {
                        const val = e.target.value;
                        onChange(val === "" ? 0 : parseInt(val, 10));
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
