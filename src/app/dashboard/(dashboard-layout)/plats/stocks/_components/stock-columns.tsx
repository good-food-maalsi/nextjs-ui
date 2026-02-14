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
import type { StockFranchiseDisplay } from "@/lib/types/stock-franchise.types";

export type { StockFranchiseDisplay };

export enum StockColumnKey {
  SELECT = "select",
  INGREDIENT_NOM = "ingredient_nom",
  SUPPLIER_NOM = "supplier_nom",
  QUANTITE = "quantite",
  PRIX_UNITAIRE = "prix_unitaire",
  ACTIONS = "actions",
}

export const stockColumnLabels: Record<string, string> = {
  [StockColumnKey.INGREDIENT_NOM]: "Ingrédient",
  [StockColumnKey.SUPPLIER_NOM]: "Fournisseur",
  [StockColumnKey.QUANTITE]: "Quantité",
  [StockColumnKey.PRIX_UNITAIRE]: "Prix unitaire",
};

interface ColumnsProps {
  onEdit: (stock: StockFranchiseDisplay) => void;
  onDelete: (stock: StockFranchiseDisplay) => void;
}

export const createStockColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<StockFranchiseDisplay>[] => [
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
    accessorKey: StockColumnKey.INGREDIENT_NOM,
    header: stockColumnLabels[StockColumnKey.INGREDIENT_NOM],
    cell: ({ row }) => (
      <div className="font-medium">
        {row.getValue(StockColumnKey.INGREDIENT_NOM)}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.SUPPLIER_NOM,
    header: stockColumnLabels[StockColumnKey.SUPPLIER_NOM],
    cell: ({ row }) => <div>{row.getValue(StockColumnKey.SUPPLIER_NOM)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.QUANTITE,
    header: stockColumnLabels[StockColumnKey.QUANTITE],
    cell: ({ row }) => {
      const quantity = row.getValue(StockColumnKey.QUANTITE) as number;
      const isLowStock = quantity < 10;
      return (
        <div
          className={
            isLowStock ? "font-semibold text-destructive" : "font-medium"
          }
        >
          {quantity}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: StockColumnKey.PRIX_UNITAIRE,
    header: stockColumnLabels[StockColumnKey.PRIX_UNITAIRE],
    cell: ({ row }) => {
      const raw = row.getValue(StockColumnKey.PRIX_UNITAIRE);
      const price = parseFloat(String(raw ?? null));
      return <div>{isNaN(price) ? "-" : `${price.toFixed(2)} €`}</div>;
    },
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
              Copier l&apos;ID du stock
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(stock)}>
              Modifier la quantité
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(stock)}
            >
              Supprimer le stock
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
