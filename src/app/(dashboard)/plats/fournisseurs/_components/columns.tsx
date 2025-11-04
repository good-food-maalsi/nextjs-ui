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

export interface Fournisseur {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export const columns: ColumnDef<Fournisseur>[] = [
  {
    id: "select",
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
    accessorKey: "nom",
    header: "Fournisseur",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nom")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "adresse",
    header: "Adresse",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("adresse")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "telephone",
    header: "Téléphone",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("telephone")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{row.getValue("email")}</div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const fournisseur = row.original;

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
              onClick={() => navigator.clipboard.writeText(fournisseur.id)}
            >
              Copier l'ID du fournisseur
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir le fournisseur</DropdownMenuItem>
            <DropdownMenuItem>Modifier le fournisseur</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Supprimer le fournisseur
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
