"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Tag, Eye } from "lucide-react";
import Link from "next/link";

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
import { Badge } from "@/components/ui/badge";

import type { Discount, DiscountType, DiscountStatus } from "../_types";
import { discountTypeLabels, discountStatusLabels } from "../_types";

// Enum pour les clés des colonnes
export enum DiscountColumnKey {
  SELECT = "select",
  NAME = "name",
  TYPE = "type",
  VALUE = "discountValue",
  DATE_START = "dateStart",
  DATE_END = "dateEnd",
  STATUS = "status",
  MENU_COUNT = "menuCount",
  ACTIONS = "actions",
}

// Labels français pour les colonnes
export const discountColumnLabels: Record<string, string> = {
  [DiscountColumnKey.NAME]: "Nom de la réduction",
  [DiscountColumnKey.TYPE]: "Type",
  [DiscountColumnKey.VALUE]: "Valeur",
  [DiscountColumnKey.DATE_START]: "Date de début",
  [DiscountColumnKey.DATE_END]: "Date de fin",
  [DiscountColumnKey.STATUS]: "Statut",
  [DiscountColumnKey.MENU_COUNT]: "Menus",
};

// Fonction pour déterminer la variante du badge de statut
const getStatusVariant = (status: DiscountStatus): "success" | "warning" | "default" => {
  switch (status) {
    case "active":
      return "success";
    case "scheduled":
      return "warning";
    case "expired":
      return "default";
    default:
      return "default";
  }
};

export const columns: ColumnDef<Discount>[] = [
  {
    id: DiscountColumnKey.SELECT,
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
    accessorKey: DiscountColumnKey.NAME,
    header: discountColumnLabels[DiscountColumnKey.NAME],
    cell: ({ row }) => {
      const discount = row.original;
      return (
        <div>
          <Link
            href={`/dashboard/reductions/${discount.id}`}
            className="font-medium flex items-center gap-2 text-secondary underline hover:text-secondary/80"
          >
            <Tag className="h-4 w-4" />
            {row.getValue(DiscountColumnKey.NAME)}
          </Link>
          <div className="text-sm text-muted-foreground max-w-[300px] truncate mt-1">
            {discount.description}
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.TYPE,
    header: discountColumnLabels[DiscountColumnKey.TYPE],
    cell: ({ row }) => {
      const type = row.getValue(DiscountColumnKey.TYPE) as DiscountType;
      return <Badge variant="outline">{discountTypeLabels[type]}</Badge>;
    },
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.VALUE,
    header: discountColumnLabels[DiscountColumnKey.VALUE],
    cell: ({ row }) => {
      const value = row.getValue(DiscountColumnKey.VALUE) as number;
      const type = row.original.type;

      if (type === "percentage") {
        return <div className="font-medium text-secondary">{value}%</div>;
      } else if (type === "fixed_amount") {
        return <div className="font-medium text-secondary">{value} €</div>;
      } else {
        return <div className="text-muted-foreground">-</div>;
      }
    },
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.DATE_START,
    header: discountColumnLabels[DiscountColumnKey.DATE_START],
    cell: ({ row }) => <div>{row.getValue(DiscountColumnKey.DATE_START)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.DATE_END,
    header: discountColumnLabels[DiscountColumnKey.DATE_END],
    cell: ({ row }) => <div>{row.getValue(DiscountColumnKey.DATE_END)}</div>,
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.STATUS,
    header: discountColumnLabels[DiscountColumnKey.STATUS],
    cell: ({ row }) => {
      const status = row.getValue(DiscountColumnKey.STATUS) as DiscountStatus;
      return (
        <StatusBadge variant={getStatusVariant(status)}>
          {discountStatusLabels[status]}
        </StatusBadge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: DiscountColumnKey.MENU_COUNT,
    header: discountColumnLabels[DiscountColumnKey.MENU_COUNT],
    cell: ({ row }) => {
      const count = row.getValue(DiscountColumnKey.MENU_COUNT) as number;
      return (
        <div className="text-center">
          {count > 0 ? `${count} menu(s)` : "-"}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: DiscountColumnKey.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => {
      const discount = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/reductions/${discount.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Voir la réduction</span>
            </Button>
          </Link>
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
                onClick={() => navigator.clipboard.writeText(discount.id)}
              >
                Copier l'ID de la réduction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Modifier la réduction</DropdownMenuItem>
              <DropdownMenuItem>Dupliquer la réduction</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Supprimer la réduction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
