import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  siteName?: string;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  siteName,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      )}
    >
      <div className={cn("bg-white p-6 rounded-lg shadow-lg")}>
        <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
        <br />
        <p>Êtes-vous sûr de vouloir supprimer "{siteName}" ?</p>
        <br />
        <div className={cn("flex justify-end mt-4 space-x-2")}>
          <Button onClick={onClose} variant="secondaryOutline">
            Annuler
          </Button>
          <Button
            onClick={onDelete}
            className="bg-orange-400 text-white hover:bg-orange-500"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
