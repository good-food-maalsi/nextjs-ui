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

// Enum pour les clés des colonnes
export enum FournisseurColumnKey {
  SELECT = "select",
  NOM = "nom",
  ADRESSE = "adresse",
  TELEPHONE = "telephone",
  EMAIL = "email",
  ACTIONS = "actions",
}

// Labels français pour les colonnes
export const fournisseurColumnLabels: Record<string, string> = {
  [FournisseurColumnKey.NOM]: "Fournisseur",
  [FournisseurColumnKey.ADRESSE]: "Adresse",
  [FournisseurColumnKey.TELEPHONE]: "Téléphone",
  [FournisseurColumnKey.EMAIL]: "Email",
};

export interface Fournisseur {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export const columns: ColumnDef<Fournisseur>[] = [
  {
    id: FournisseurColumnKey.SELECT,
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
    accessorKey: FournisseurColumnKey.NOM,
    header: fournisseurColumnLabels[FournisseurColumnKey.NOM],
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue(FournisseurColumnKey.NOM)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: FournisseurColumnKey.ADRESSE,
    header: fournisseurColumnLabels[FournisseurColumnKey.ADRESSE],
    cell: ({ row }) => (
      <div>{row.getValue(FournisseurColumnKey.ADRESSE)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: FournisseurColumnKey.TELEPHONE,
    header: fournisseurColumnLabels[FournisseurColumnKey.TELEPHONE],
    cell: ({ row }) => (
      <div>{row.getValue(FournisseurColumnKey.TELEPHONE)}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: FournisseurColumnKey.EMAIL,
    header: fournisseurColumnLabels[FournisseurColumnKey.EMAIL],
    cell: ({ row }) => (
      <div>{row.getValue(FournisseurColumnKey.EMAIL)}</div>
    ),
    enableSorting: false,
  },
  {
    id: FournisseurColumnKey.ACTIONS,
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
