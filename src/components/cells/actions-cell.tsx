import { Check, MoreHorizontal, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ActionsCellProps {
  disabled: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function ActionsCell({
  disabled,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: ActionsCellProps) {
  return (
    <div>
      {isEditing ? (
        <>
          <div className={cn("flex flex-col sm:flex-row gap-2")}>
            <Button onClick={onSave} className="p-3 text-sm">
              <Check className="size-4" />
            </Button>
            <Button
              onClick={onCancel}
              className="bg-red-600 p-3 text-sm text-white hover:bg-red-700"
            >
              <X className="size-4" />
            </Button>
          </div>
        </>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={disabled}
              variant="ghost"
              className="flex size-8 p-0"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto">
            <DropdownMenuItem onClick={onEdit}>Modifier</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
