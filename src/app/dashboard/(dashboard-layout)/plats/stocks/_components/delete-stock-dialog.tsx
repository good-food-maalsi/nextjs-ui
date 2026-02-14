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
import { useDeleteStock } from "@/hooks/use-stocks";
import type { StockFranchise } from "@/lib/types/stock-franchise.types";

interface DeleteStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stock: StockFranchise | null;
}

export function DeleteStockDialog({
  open,
  onOpenChange,
  stock,
}: DeleteStockDialogProps) {
  const deleteMutation = useDeleteStock();

  const handleDelete = async () => {
    if (!stock) return;

    try {
      await deleteMutation.mutateAsync(stock.id);
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
            Êtes-vous sûr de vouloir supprimer le stock de{" "}
            <span className="font-semibold">{stock?.ingredient.name}</span> ?
            Cette action est irréversible.
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
