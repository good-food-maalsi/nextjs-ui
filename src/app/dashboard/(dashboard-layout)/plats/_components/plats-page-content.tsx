"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDishes } from "@/hooks/use-dishes";

import { createColumns } from "./columns";
import { DeleteDishDialog } from "./delete-dish-dialog";
import { DishesDataTable } from "./dishes-data-table";
import { DishFormDialog } from "./dish-form-dialog";
import type { Dish } from "../_types";
import { DishAvailability } from "../_types";

function formatDate(date: string | Date | undefined): string {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("fr-FR");
}

export function PlatsPageContent() {
  const [activeTab, setActiveTab] = React.useState<string>("tous");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editDishId, setEditDishId] = React.useState<string | null>(null);
  const [deleteDish, setDeleteDish] = React.useState<Dish | null>(null);

  const { data: apiDishes, isLoading, isError } = useDishes();

  const handleEdit = React.useCallback((dish: Dish) => {
    setEditDishId(dish.id);
  }, []);

  const handleDelete = React.useCallback((dish: Dish) => {
    setDeleteDish(dish);
  }, []);

  const dishes: Dish[] = React.useMemo(() => {
    if (!apiDishes) return [];
    return apiDishes.map((d) => ({
      id: d.id,
      nom: d.name,
      prixBase: `${d.basePrice.toFixed(2).replace(".", ",")} €`,
      disponibilite: d.availability
        ? DishAvailability.AVAILABLE
        : DishAvailability.UNAVAILABLE,
      menusAssocies: d.menuId ?? "-",
      dateCreation: formatDate(d.createdAt),
    }));
  }, [apiDishes]);

  const filteredDishes = React.useMemo(() => {
    switch (activeTab) {
      case "disponibles":
        return dishes.filter(
          (d) => d.disponibilite === DishAvailability.AVAILABLE,
        );
      case "indisponibles":
        return dishes.filter(
          (d) => d.disponibilite === DishAvailability.UNAVAILABLE,
        );
      default:
        return dishes;
    }
  }, [activeTab, dishes]);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plats</h1>
        </div>

        <PageHeaderActions>
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button
            variant="secondaryOutline"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            Créer un plat
          </Button>
        </PageHeaderActions>

        <DishFormDialog open={createOpen} onOpenChange={setCreateOpen} />

        <DishFormDialog
          open={!!editDishId}
          onOpenChange={(open) => !open && setEditDishId(null)}
          dishId={editDishId}
        />

        <DeleteDishDialog
          open={!!deleteDish}
          onOpenChange={(open) => !open && setDeleteDish(null)}
          dish={deleteDish}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="disponibles">Disponibles</TabsTrigger>
          <TabsTrigger value="indisponibles">Indisponibles</TabsTrigger>
        </TabsList>

        <TabsContent value="tous">
          <DishesDataTable
            columns={createColumns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="disponibles">
          <DishesDataTable
            columns={createColumns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="indisponibles">
          <DishesDataTable
            columns={createColumns}
            data={filteredDishes}
            isLoading={isLoading}
            isError={isError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
