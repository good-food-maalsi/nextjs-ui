"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMenu } from "@/hooks/use-menus";
import { useDishes } from "@/hooks/use-dishes";
import { MenuFormDialog } from "../_components/menu-form-dialog";
import { DeleteMenuDialog } from "../_components/delete-menu-dialog";
import { MenuAvailability, menuAvailabilityLabels } from "../_types";
import type { Menu } from "../_types";

function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
}

export default function MenuDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const menuId = params.id;

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const { data: apiMenu, isLoading, isError } = useMenu(menuId);
  const { data: apiDishes, isLoading: dishesLoading } = useDishes({
    menuId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isError || !apiMenu) {
    return (
      <div className="container mx-auto py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux menus
        </Button>
        <p className="text-destructive">Menu introuvable.</p>
      </div>
    );
  }

  const availability = (apiMenu.availability ?? true)
    ? MenuAvailability.AVAILABLE
    : MenuAvailability.UNAVAILABLE;

  const menuForDialog: Menu = {
    id: apiMenu.id,
    name: apiMenu.name,
    description: apiMenu.description ?? "-",
    category: "-",
    availability,
    dishCount: apiDishes?.length ?? 0,
    discountCount: 0,
    createdAt: formatDate(apiMenu.createdAt),
  };

  return (
    <div className="container mx-auto py-6">
      {/* En-tête avec navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux menus
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {apiMenu.name}
            </h1>
            {apiMenu.description && (
              <p className="text-muted-foreground mt-2">{apiMenu.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondaryOutline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      </div>

      {/* Informations générales */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Disponibilité
            </p>
            <div className="mt-1">
              <StatusBadge
                variant={availability === MenuAvailability.AVAILABLE ? "confirmed" : "cancelled"}
              >
                {menuAvailabilityLabels[availability]}
              </StatusBadge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Nombre de plats
            </p>
            <p className="text-base mt-1">{apiDishes?.length ?? 0} plat(s)</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Date de création
            </p>
            <p className="text-base mt-1">{formatDate(apiMenu.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Dernière modification
            </p>
            <p className="text-base mt-1">{formatDate(apiMenu.updatedAt)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plats du menu */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Plats du menu</CardTitle>
        </CardHeader>
        <CardContent>
          {dishesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : apiDishes && apiDishes.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-primary-200">
                  <TableRow>
                    <TableHead>Nom du plat</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix de base</TableHead>
                    <TableHead>Disponibilité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiDishes.map((dish) => (
                    <TableRow key={dish.id}>
                      <TableCell className="font-medium">{dish.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">
                        {dish.description}
                      </TableCell>
                      <TableCell>
                        {dish.basePrice.toFixed(2).replace(".", ",")} €
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          variant={dish.availability ? "confirmed" : "cancelled"}
                        >
                          {dish.availability ? "Disponible" : "Indisponible"}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun plat dans ce menu
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MenuFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        menuId={menuId}
      />

      <DeleteMenuDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        menu={menuForDialog}
        onDeleted={() => router.push("/dashboard/plats/menus")}
      />
    </div>
  );
}
