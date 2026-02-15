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
import { useDeleteDish } from "@/hooks/use-dishes";
import type { Dish } from "../_types";

interface DeleteDishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: Dish | null;
}

export function DeleteDishDialog({
  open,
  onOpenChange,
  dish,
}: DeleteDishDialogProps) {
  const deleteMutation = useDeleteDish();

  const handleDelete = async () => {
    if (!dish) return;

    try {
      await deleteMutation.mutateAsync(dish.id);
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
            Êtes-vous sûr de vouloir supprimer le plat{" "}
            <span className="font-semibold">{dish?.nom}</span> ? Cette action
            est irréversible.
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
