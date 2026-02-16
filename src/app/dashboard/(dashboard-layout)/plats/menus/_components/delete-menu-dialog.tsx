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
import { useDeleteMenu } from "@/hooks/use-menus";
import type { Menu } from "../_types";

interface DeleteMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menu: Menu | null;
  /** Optionnel : appelé après suppression réussie (ex. pour naviguer) */
  onDeleted?: () => void;
}

export function DeleteMenuDialog({
  open,
  onOpenChange,
  menu,
  onDeleted,
}: DeleteMenuDialogProps) {
  const deleteMutation = useDeleteMenu();

  const handleDelete = async () => {
    if (!menu) return;
    try {
      await deleteMutation.mutateAsync(menu.id);
      onOpenChange(false);
      onDeleted?.();
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
            Êtes-vous sûr de vouloir supprimer le menu{" "}
            <span className="font-semibold">{menu?.name}</span> ? Cette action
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
