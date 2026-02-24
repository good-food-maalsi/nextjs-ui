"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye } from "lucide-react";
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

import type { Menu, MenuAvailability } from "../_types";
import { menuAvailabilityLabels } from "../_types";

// Enum pour les clés des colonnes
export enum MenuColumnKey {
  SELECT = "select",
  NAME = "name",
  DESCRIPTION = "description",
  CATEGORY = "category",
  DISH_COUNT = "dishCount",
  DISCOUNT_COUNT = "discountCount",
  AVAILABILITY = "availability",
  CREATED_AT = "createdAt",
  ACTIONS = "actions",
}

// Labels français pour les colonnes
export const menuColumnLabels: Record<string, string> = {
  [MenuColumnKey.NAME]: "Nom du menu",
  [MenuColumnKey.DESCRIPTION]: "Description",
  [MenuColumnKey.CATEGORY]: "Catégorie",
  [MenuColumnKey.DISH_COUNT]: "Plats",
  [MenuColumnKey.DISCOUNT_COUNT]: "Réductions",
  [MenuColumnKey.AVAILABILITY]: "Disponibilité",
  [MenuColumnKey.CREATED_AT]: "Date de création",
};

interface ColumnsProps {
  onEdit: (menu: Menu) => void;
  onDelete: (menu: Menu) => void;
}

export const createColumns = ({
  onEdit,
  onDelete,
}: ColumnsProps): ColumnDef<Menu>[] => [
  {
    id: MenuColumnKey.SELECT,
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
    accessorKey: MenuColumnKey.NAME,
    header: menuColumnLabels[MenuColumnKey.NAME],
    cell: ({ row }) => {
      const menu = row.original;
      return (
        <Link
          href={`/dashboard/plats/menus/${menu.id}`}
          className="font-medium text-secondary underline hover:text-secondary/80"
        >
          {row.getValue(MenuColumnKey.NAME)}
        </Link>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: MenuColumnKey.DESCRIPTION,
    header: menuColumnLabels[MenuColumnKey.DESCRIPTION],
    cell: ({ row }) => {
      const description = row.getValue(MenuColumnKey.DESCRIPTION) as string;
      return (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {description}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: MenuColumnKey.AVAILABILITY,
    header: menuColumnLabels[MenuColumnKey.AVAILABILITY],
    cell: ({ row }) => {
      const availability = row.getValue(
        MenuColumnKey.AVAILABILITY,
      ) as MenuAvailability;
      const isAvailable = availability === "available";
      return (
        <StatusBadge variant={isAvailable ? "confirmed" : "cancelled"}>
          {menuAvailabilityLabels[availability]}
        </StatusBadge>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: MenuColumnKey.CREATED_AT,
    header: menuColumnLabels[MenuColumnKey.CREATED_AT],
    cell: ({ row }) => <div>{row.getValue(MenuColumnKey.CREATED_AT)}</div>,
    enableSorting: false,
  },
  {
    id: MenuColumnKey.ACTIONS,
    enableHiding: false,
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/plats/menus/${menu.id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
              <span className="sr-only">Voir le menu</span>
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
                onClick={() => navigator.clipboard.writeText(menu.id)}
              >
                Copier l'ID du menu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(menu)}>
                Modifier le menu
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(menu)}
              >
                Supprimer le menu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
