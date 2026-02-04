"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IngredientDisplay } from "@/lib/types/ingredient.types";

export type { IngredientDisplay };

export enum IngredientColumnKey {
  SELECT = "select",
  NOM = "nom",
  DESCRIPTION = "description",
  FOURNISSEUR = "fournisseur",
  PRIX_UNITAIRE = "prix_unitaire",
  ACTIONS = "actions",
}

export const ingredientColumnLabels: Record<string, string> = {
  [IngredientColumnKey.NOM]: "Nom",
  [IngredientColumnKey.DESCRIPTION]: "Description",
  [IngredientColumnKey.FOURNISSEUR]: "Fournisseur",
  [IngredientColumnKey.PRIX_UNITAIRE]: "Prix unitaire",
};

interface ColumnsProps {
  onEdit: (ingredient: IngredientDisplay) => void;
  onDelete: (ingredient: IngredientDisplay) => void;
}

export const createIngredientsColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<IngredientDisplay>[] => [
  {
    id: IngredientColumnKey.SELECT,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: IngredientColumnKey.NOM,
    header: ingredientColumnLabels[IngredientColumnKey.NOM],
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue(IngredientColumnKey.NOM)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: IngredientColumnKey.DESCRIPTION,
    header: ingredientColumnLabels[IngredientColumnKey.DESCRIPTION],
    cell: ({ row }) => (
      <div className="max-w-md truncate">
        {row.getValue(IngredientColumnKey.DESCRIPTION) || "-"}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: IngredientColumnKey.FOURNISSEUR,
    header: ingredientColumnLabels[IngredientColumnKey.FOURNISSEUR],
    cell: ({ row }) => (
      <div>{row.getValue(IngredientColumnKey.FOURNISSEUR)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: IngredientColumnKey.PRIX_UNITAIRE,
    header: ingredientColumnLabels[IngredientColumnKey.PRIX_UNITAIRE],
    cell: ({ row }) => {
      const price = row.getValue(IngredientColumnKey.PRIX_UNITAIRE) as number;
      return <div>{price.toFixed(2)} €</div>;
    },
    enableSorting: false,
  },
  {
    id: IngredientColumnKey.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => {
      const ingredient = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(ingredient.id)}
            >
              Copier l&apos;ID de l&apos;ingrédient
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(ingredient)}>
              Modifier l&apos;ingrédient
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(ingredient)}
            >
              Supprimer l&apos;ingrédient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
