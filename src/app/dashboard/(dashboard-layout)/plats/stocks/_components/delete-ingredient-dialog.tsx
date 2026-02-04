"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteIngredient } from "@/hooks/use-ingredients";
import type { Ingredient } from "@/lib/types/ingredient.types";

interface DeleteIngredientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ingredient: Ingredient | null;
}

export function DeleteIngredientDialog({
  open,
  onOpenChange,
  ingredient,
}: DeleteIngredientDialogProps) {
  const deleteMutation = useDeleteIngredient();

  const handleDelete = async () => {
    if (!ingredient) return;

    try {
      await deleteMutation.mutateAsync(ingredient.id);
      onOpenChange(false);
    } catch {
      // Error handled by mutation hook (toast)
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer l&apos;ingrédient{" "}
            <span className="font-semibold">{ingredient?.name}</span> ? Cette
            action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
