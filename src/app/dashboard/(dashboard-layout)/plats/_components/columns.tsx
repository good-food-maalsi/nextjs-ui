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
import { StatusBadge } from "@/components/ui/status-badge";

import type { Dish, DishAvailability } from "../_types";
import { dishAvailabilityLabels } from "../_types";

interface ColumnsProps {
  onEdit: (dish: Dish) => void;
  onDelete: (dish: Dish) => void;
}

// Enum pour les clés des colonnes
export enum DishColumnKey {
  SELECT = "select",
  NOM = "nom",
  PRIX_BASE = "prixBase",
  DISPONIBILITE = "disponibilite",
  MENUS_ASSOCIES = "menusAssocies",
  DATE_CREATION = "dateCreation",
  ACTIONS = "actions",
}

// Labels français pour les colonnes
export const dishColumnLabels: Record<string, string> = {
  [DishColumnKey.NOM]: "Nom du plat",
  [DishColumnKey.PRIX_BASE]: "Prix de base (TTC)",
  [DishColumnKey.DISPONIBILITE]: "Disponibilité",
  [DishColumnKey.MENUS_ASSOCIES]: "Menu associé(s)",
  [DishColumnKey.DATE_CREATION]: "Date de création",
};

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Dish>[] => [
  {
    id: DishColumnKey.SELECT,
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
    accessorKey: DishColumnKey.NOM,
    header: dishColumnLabels[DishColumnKey.NOM],
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue(DishColumnKey.NOM)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: DishColumnKey.PRIX_BASE,
    header: dishColumnLabels[DishColumnKey.PRIX_BASE],
    cell: ({ row }) => <div>{row.getValue(DishColumnKey.PRIX_BASE)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: DishColumnKey.DISPONIBILITE,
    header: dishColumnLabels[DishColumnKey.DISPONIBILITE],
    cell: ({ row }) => {
      const availability = row.getValue(
        DishColumnKey.DISPONIBILITE
      ) as DishAvailability;
      const isAvailable = availability === "available";
      return (
        <StatusBadge variant={isAvailable ? "confirmed" : "cancelled"}>
          {dishAvailabilityLabels[availability]}
        </StatusBadge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: DishColumnKey.MENUS_ASSOCIES,
    header: dishColumnLabels[DishColumnKey.MENUS_ASSOCIES],
    cell: ({ row }) => (
      <div>{row.getValue(DishColumnKey.MENUS_ASSOCIES)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: DishColumnKey.DATE_CREATION,
    header: dishColumnLabels[DishColumnKey.DATE_CREATION],
    cell: ({ row }) => (
      <div>{row.getValue(DishColumnKey.DATE_CREATION)}</div>
    ),
    enableSorting: false,
  },
  {
    id: DishColumnKey.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => {
      const dish = row.original;

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
              onClick={() => navigator.clipboard.writeText(dish.id)}
            >
              Copier l'ID du plat
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(dish)}>
              Modifier le plat
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(dish)}
            >
              Supprimer le plat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
