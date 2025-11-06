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

import type { Stock } from "../_types";

// Enum pour les clés des colonnes
export enum StockColumnKey {
  SELECT = "select",
  INGREDIENT = "ingredient",
  STOCK = "stock",
  CATEGORIES = "categories",
  FOURNISSEUR = "fournisseur",
  MIS_A_JOUR_LE = "misAJourLe",
  ACTIONS = "actions",
}

// Labels français pour les colonnes
export const stockColumnLabels: Record<string, string> = {
  [StockColumnKey.INGREDIENT]: "Ingrédient",
  [StockColumnKey.STOCK]: "Stock",
  [StockColumnKey.CATEGORIES]: "Catégorie(s)",
  [StockColumnKey.FOURNISSEUR]: "Fournisseur",
  [StockColumnKey.MIS_A_JOUR_LE]: "Mis à jour le",
};

export const columns: ColumnDef<Stock>[] = [
  {
    id: StockColumnKey.SELECT,
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
    accessorKey: StockColumnKey.INGREDIENT,
    header: stockColumnLabels[StockColumnKey.INGREDIENT],
    cell: ({ row }) => (
      <div>{row.getValue(StockColumnKey.INGREDIENT)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.STOCK,
    header: stockColumnLabels[StockColumnKey.STOCK],
    cell: ({ row }) => {
      const stock = row.getValue(StockColumnKey.STOCK) as number;
      const isOutOfStock = stock === 0;
      return (
        <div className={isOutOfStock ? "text-destructive" : ""}>
          {stock} en stock
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.CATEGORIES,
    header: stockColumnLabels[StockColumnKey.CATEGORIES],
    cell: ({ row }) => (
      <div>{row.getValue(StockColumnKey.CATEGORIES)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.FOURNISSEUR,
    header: stockColumnLabels[StockColumnKey.FOURNISSEUR],
    cell: ({ row }) => (
      <div>{row.getValue(StockColumnKey.FOURNISSEUR)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.MIS_A_JOUR_LE,
    header: stockColumnLabels[StockColumnKey.MIS_A_JOUR_LE],
    cell: ({ row }) => (
      <div>{row.getValue(StockColumnKey.MIS_A_JOUR_LE)}</div>
    ),
    enableSorting: false,
  },
  {
    id: StockColumnKey.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => {
      const stock = row.original;

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
              onClick={() => navigator.clipboard.writeText(stock.id)}
            >
              Copier l'ID du stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir le stock</DropdownMenuItem>
            <DropdownMenuItem>Modifier le stock</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Supprimer le stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
